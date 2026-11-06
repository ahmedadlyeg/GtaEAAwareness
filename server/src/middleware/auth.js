'use strict';
const jwt = require('jsonwebtoken');
const { err } = require('../lib/errors');
const { getUserById } = require('../services/users');

const ISSUER = 'gta-ea-hub';
const AUDIENCE = 'gta-ea-hub-web';

function signToken(config, { userId, sessionId, jti, role }) {
  return jwt.sign({ sid: sessionId, role }, config.jwtSecret, {
    algorithm: 'HS256',
    subject: String(userId),
    jwtid: jti,
    expiresIn: config.jwtTtl,
    issuer: ISSUER,
    audience: AUDIENCE,
  });
}

/**
 * Bearer JWT + server-side session check: a token is only valid while its
 * user_sessions row is open (logout closes it) and the user is active.
 * The role is always read fresh from the database, never trusted from the token.
 */
function requireAuth({ db, config }) {
  return async (req, res, next) => {
    try {
      const h = req.get('authorization') || '';
      const m = /^Bearer\s+(.+)$/i.exec(h);
      if (!m) throw err('unauthorized', 'Sign in required');
      let claims;
      try {
        claims = jwt.verify(m[1], config.jwtSecret, { algorithms: ['HS256'], issuer: ISSUER, audience: AUDIENCE });
      } catch (e) {
        throw err('unauthorized', e.name === 'TokenExpiredError' ? 'Session expired - sign in again' : 'Invalid token');
      }
      const session = await db.get(
        'SELECT id, user_id, token_jti, logout_at, login_at FROM user_sessions WHERE id = @id',
        { id: String(claims.sid || '') },
      );
      if (!session || session.token_jti !== claims.jti || String(session.user_id) !== claims.sub || session.logout_at) {
        throw err('unauthorized', 'Session is no longer valid - sign in again');
      }
      const user = await getUserById(db, session.user_id);
      if (!user || !Boolean(user.is_active)) throw err('unauthorized', 'Account disabled');
      req.user = user;
      req.session = session;
      next();
    } catch (e) {
      next(e);
    }
  };
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) return next(err('forbidden', 'You do not have access to this area'));
    next();
  };
}

module.exports = { requireAuth, requireRole, signToken };
