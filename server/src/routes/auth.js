'use strict';
/**
 * Authentication
 *   First-time sign-up / password reset: one-time code to the GTA e-mail -> set-password token -> password.
 *   Every other sign-in: GTA e-mail + password.
 */
const crypto = require('crypto');
const express = require('express');
const jwt = require('jsonwebtoken');
const { err } = require('../lib/errors');
const users = require('../services/users');
const { requestChallenge, verifyChallenge } = require('../services/otp');
const { preparePassword, storeHash, checkUserPassword } = require('../services/credentials');
const { audit } = require('../services/audit');
const { signToken } = require('../middleware/auth');

const SETUP_AUD = 'gta-ea-hub-setup';
const PURPOSES = ['signup', 'reset'];

module.exports = function authRoutes({ db, config, outbox, auth, otpLimiter }) {
  const r = express.Router();

  async function openSession(t, req, user, action, detail) {
    const now = new Date();
    const sessionId = crypto.randomUUID();
    const jti = crypto.randomUUID();
    await t.run(
      `UPDATE users SET last_login_at = @now, first_login_at = COALESCE(first_login_at, @now), updated_at = @now WHERE id = @id`,
      { id: user.id, now },
    );
    await t.insert('user_sessions', {
      id: sessionId,
      user_id: user.id,
      login_at: now,
      last_seen_at: now,
      ip: req.ip || null,
      user_agent: (req.get('user-agent') || '').slice(0, 512) || null,
      token_jti: jti,
    });
    await audit(t, { actorUserId: user.id, action, entity: 'session', entityId: sessionId, detail: detail || null, ip: req.ip });
    return { sessionId, jti };
  }
  function sessionResponse(user, s) {
    const token = signToken(config, { userId: user.id, sessionId: s.sessionId, jti: s.jti, role: user.role });
    const { exp } = jwt.decode(token);
    return { token, user: users.toUserDto(user, config), expiresAt: new Date(exp * 1000).toISOString() };
  }

  // 1) Request a one-time code: purpose "signup" (first time) or "reset" (forgotten password)
  r.post('/otp/request', otpLimiter, async (req, res) => {
    const { email: raw, purpose = 'signup' } = req.body || {};
    if (!PURPOSES.includes(purpose)) throw err('validation', 'purpose must be "signup" or "reset"');
    const email = users.normaliseEmail(config, raw);
    const existing = await users.getUserByEmail(db, email);
    if (purpose === 'signup' && existing && existing.password_hash) {
      throw err('account_exists', 'An account already exists for this email — sign in or reset your password.');
    }
    if (existing && !Boolean(existing.is_active)) throw err('forbidden', 'This account is disabled');
    if (purpose === 'reset' && !(existing && existing.password_hash)) {
      // No enumeration: respond exactly like a real request, but send nothing.
      const now = new Date();
      res.status(202).json({
        challengeId: crypto.randomUUID(),
        expiresAt: new Date(now.getTime() + config.otpTtlMin * 60 * 1000).toISOString(),
        maskedEmail: require('../lib/otp').maskEmail(email),
      });
      return;
    }
    const out = await requestChallenge(db, config, { email, purpose, userId: existing ? existing.id : null, ip: req.ip });
    if (outbox) outbox.kick();
    res.status(202).json(out);
  });

  // 2) Verify the code -> short-lived, single-use set-password token (no session yet)
  r.post('/otp/verify', otpLimiter, async (req, res) => {
    const { challengeId, code } = req.body || {};
    const peek = typeof challengeId === 'string' ? await db.get('SELECT purpose FROM otp_challenges WHERE id = @id', { id: challengeId.toLowerCase() }) : null;
    const purpose = peek && PURPOSES.includes(peek.purpose) ? peek.purpose : 'signup';
    let ch;
    try {
      ch = await verifyChallenge(db, config, { challengeId, code, purpose });
    } catch (e) {
      if (e.code === 'otp_locked') {
        await audit(db, { action: 'auth.otp_locked', entity: 'otp_challenge', entityId: String(challengeId).slice(0, 64), ip: req.ip });
      }
      throw e;
    }
    const setupToken = jwt.sign({ purpose: 'set_password', kind: ch.purpose, ch: ch.id }, config.jwtSecret, {
      algorithm: 'HS256',
      subject: ch.user_email,
      expiresIn: `${config.setupTokenTtlMin}m`,
      issuer: 'gta-ea-hub',
      audience: SETUP_AUD,
    });
    res.json({ setupToken, purpose: ch.purpose, email: ch.user_email });
  });

  // 3) Choose a password (sign-up or reset) -> signed in
  r.post('/password', otpLimiter, async (req, res) => {
    const { setupToken, password } = req.body || {};
    if (typeof setupToken !== 'string' || !setupToken) throw err('validation', 'setupToken is required');
    let claims;
    try {
      claims = jwt.verify(setupToken, config.jwtSecret, { algorithms: ['HS256'], issuer: 'gta-ea-hub', audience: SETUP_AUD });
    } catch (e) {
      throw err('unauthorized', e.name === 'TokenExpiredError' ? 'The set-password link has expired — request a new code.' : 'Invalid set-password token');
    }
    if (claims.purpose !== 'set_password' || !PURPOSES.includes(claims.kind)) throw err('unauthorized', 'Invalid set-password token');
    const email = claims.sub;
    const now = new Date();
    const existing = await users.getUserByEmail(db, email);
    if (claims.kind === 'reset' && !(existing && existing.password_hash)) throw err('unauthorized', 'Invalid set-password token');
    if (claims.kind === 'signup' && existing && existing.password_hash) {
      throw err('account_exists', 'An account already exists for this email — sign in or reset your password.');
    }
    const hash = await preparePassword(password, email); // policy + scrypt, outside the transaction
    const action = claims.kind === 'reset' ? 'user.password_reset' : 'user.password_set';
    const out = await db.tx(async (t) => {
      // single use: the consumed challenge id may set a password only once
      const used = await t.get('SELECT id FROM audit_log WHERE action IN (@a, @b) AND entity = @e AND entity_id = @id', {
        a: 'user.password_set', b: 'user.password_reset', e: 'otp_challenge', id: String(claims.ch),
      });
      if (used) throw err('unauthorized', 'This set-password token has already been used — request a new code.');
      const p = await users.provisionOnLogin(t, config, email, now);
      await storeHash(t, p.user.id, hash, now);
      await audit(t, { actorUserId: p.user.id, action, entity: 'otp_challenge', entityId: String(claims.ch), ip: req.ip });
      const s2 = await openSession(t, req, p.user, p.created ? 'auth.login.first' : 'auth.login', { method: claims.kind });
      return { user: await users.getUserById(t, p.user.id), s: s2 };
    });
    res.json(sessionResponse(out.user, out.s));
  });

  // 4) Everyday sign-in with GTA e-mail + password
  r.post('/login', otpLimiter, async (req, res) => {
    const { email: raw, password } = req.body || {};
    const email = users.normaliseEmail(config, raw);
    if (typeof password !== 'string' || !password) throw err('validation', 'password is required');
    const user = await users.getUserByEmail(db, email);
    if (!user) {
      await require('../lib/password').verifyPassword(password, null); // equalise timing
      throw err('invalid_credentials', 'Incorrect email or password.');
    }
    if (!user.password_hash) {
      throw err('password_not_set', 'Complete first-time sign-up with the code sent to your GTA email.');
    }
    if (!Boolean(user.is_active)) throw err('forbidden', 'This account is disabled');
    let fresh;
    try {
      fresh = await checkUserPassword(db, config, user, password);
    } catch (e) {
      await audit(db, { actorUserId: user.id, action: e.code === 'account_locked' ? 'auth.login_locked' : 'auth.login_failed', entity: 'user', entityId: String(user.id), ip: req.ip });
      throw e;
    }
    const out = await db.tx(async (t) => {
      const p = await users.provisionOnLogin(t, config, email, new Date()); // role upgrades from ADMIN_EMAILS
      const s = await openSession(t, req, p.user, 'auth.login', { method: 'password' });
      return { user: p.user, s };
    });
    res.json(sessionResponse(out.user || fresh, out.s));
  });

  // 5) Change password while signed in
  r.post('/password/change', auth, async (req, res) => {
    const { currentPassword, newPassword } = req.body || {};
    if (typeof currentPassword !== 'string' || !currentPassword) throw err('validation', 'currentPassword is required');
    await checkUserPassword(db, config, req.user, currentPassword);
    if (currentPassword === newPassword) throw err('weak_password', 'Choose a password different from the current one.');
    const hash = await preparePassword(newPassword, req.user.email);
    await storeHash(db, req.user.id, hash);
    await audit(db, { actorUserId: req.user.id, action: 'user.password_change', entity: 'user', entityId: String(req.user.id), ip: req.ip });
    res.status(204).end();
  });

  r.post('/logout', auth, async (req, res) => {
    const now = new Date();
    await db.run('UPDATE user_sessions SET logout_at = @now, last_seen_at = @now WHERE id = @id AND logout_at IS NULL', {
      id: req.session.id,
      now,
    });
    await audit(db, { actorUserId: req.user.id, action: 'auth.logout', entity: 'session', entityId: req.session.id, ip: req.ip });
    res.status(204).end();
  });

  r.post('/heartbeat', auth, async (req, res) => {
    await db.run('UPDATE user_sessions SET last_seen_at = @now WHERE id = @id AND logout_at IS NULL', {
      id: req.session.id,
      now: new Date(),
    });
    res.status(204).end();
  });

  return r;
};
