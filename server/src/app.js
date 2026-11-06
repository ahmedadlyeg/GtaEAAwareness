'use strict';
const fs = require('fs');
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { rateLimit } = require('express-rate-limit');
const { errorHandler, err } = require('./lib/errors');
const { requireAuth, requireRole } = require('./middleware/auth');

/**
 * Build the Express application.
 * @param {{ config, db, log, outbox? }} deps
 */
function createApp({ config, db, log, outbox }) {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', config.trustProxy);

  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'default-src': ["'self'"],
          'script-src': ["'self'"],
          'style-src': ["'self'", "'unsafe-inline'"],
          'img-src': ["'self'", 'data:'],
          'font-src': ["'self'", 'data:'],
          'connect-src': ["'self'"],
          'frame-src': ["'self'"],
          'frame-ancestors': ["'self'"],
          'upgrade-insecure-requests': config.env === 'production' ? [] : null,
        },
      },
      hsts: config.env === 'production',
      crossOriginEmbedderPolicy: false,
    }),
  );
  if (config.corsOrigins.length) {
    app.use('/api', cors({ origin: config.corsOrigins, methods: ['GET', 'POST', 'PATCH'], maxAge: 600 }));
  }

  // Request log (never bodies: they can contain OTP codes)
  app.use((req, res, next) => {
    const t0 = process.hrtime.bigint();
    res.on('finish', () => {
      if (!req.originalUrl.startsWith('/api/')) return;
      log.info('http', {
        method: req.method,
        path: req.originalUrl.split('?')[0],
        status: res.statusCode,
        ms: Math.round(Number(process.hrtime.bigint() - t0) / 1e5) / 10,
        ip: req.ip,
        user: req.user ? req.user.id : undefined,
      });
    });
    next();
  });

  const limited = (message) => (req, res) => res.status(429).json({ error: { code: 'rate_limited', message } });
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: config.rateLimitApi,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: limited('Too many requests - slow down'),
  });
  const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: config.rateLimitAuth,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: limited('Too many sign-in attempts from this address - try again later'),
  });

  const api = express.Router();
  api.use(express.json({ limit: '256kb' }));
  api.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  });

  const deps = { db, config, log, outbox, otpLimiter };
  const auth = requireAuth({ db, config });

  api.get('/health', async (req, res) => {
    await db.get('SELECT 1 AS ok', {});
    res.json({ status: 'ok', db: db.driver, mail: outbox ? outbox.transportKind : 'none', time: new Date().toISOString() });
  });
  api.use('/auth', require('./routes/auth')({ ...deps, auth }));
  const cert = require('./routes/cert');
  api.get('/cert/verify/:certificateId', cert.verifyHandler(deps)); // public
  api.use(auth);
  api.use('/', require('./routes/me')(deps));
  api.use('/quiz', require('./routes/quiz')(deps));
  api.use('/signoff', require('./routes/signoff')(deps));
  api.use('/cert', cert.certRoutes(deps));
  api.use('/admin', requireRole('admin', 'ea_team'), require('./routes/admin')(deps));
  api.use((req, res, next) => next(err('not_found', `No route ${req.method} ${req.originalUrl.split('?')[0]}`, 404)));

  app.use('/api/v1', apiLimiter, api);
  app.use('/api', (req, res) => res.status(404).json({ error: { code: 'not_found', message: 'Unknown API version' } }));

  // ---- static SPA ----------------------------------------------------------
  if (config.staticDir && fs.existsSync(config.staticDir)) {
    const root = path.resolve(config.staticDir);
    const serverDir = config.serverRoot;
    // Never expose the server folder (.env, database, sources) when it lives inside STATIC_DIR.
    if (serverDir.startsWith(root + path.sep)) {
      const rel = '/' + path.relative(root, serverDir).split(path.sep).join('/');
      app.use(rel, (req, res) => res.status(404).end());
    }
    app.use(express.static(root, { dotfiles: 'ignore', index: 'index.html', maxAge: config.env === 'production' ? '1h' : 0 }));
    const indexFile = path.join(root, 'index.html');
    app.get(/^\/(?!api\/).*/, (req, res, next) => {
      if (path.extname(req.path) || !fs.existsSync(indexFile)) return next();
      res.sendFile(indexFile);
    });
  }

  app.use(errorHandler(log));
  return app;
}

module.exports = { createApp };
