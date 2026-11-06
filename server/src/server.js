'use strict';
const { bootstrap } = require('./bootstrap');
const { createApp } = require('./app');
const { createOutbox } = require('./mail/outbox');

async function main() {
  const { config, log, db } = await bootstrap();
  const outbox = createOutbox({ db, config, log });
  outbox.start();
  const app = createApp({ config, db, log, outbox });
  const server = app.listen(config.port, () => {
    log.info('EA Awareness Hub server listening', {
      url: `http://localhost:${config.port}`,
      api: '/api/v1',
      db: db.driver,
      mail: outbox.transportKind,
      static: config.staticDir || null,
    });
    if (outbox.transportKind === 'dev') {
      log.warn('SMTP_HOST is not set - e-mails (including OTP codes) are printed to this console only');
    }
  });
  const shutdown = (sig) => {
    log.info('shutting down', { sig });
    outbox.stop();
    server.close(async () => {
      await db.close();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
