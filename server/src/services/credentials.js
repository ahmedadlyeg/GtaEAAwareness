'use strict';
/**
 * Password credentials: first-time set-up, reset, login, change and re-authentication
 * (used by sign-off). Lockout: after config.loginMaxFailures consecutive failures the
 * account is locked for config.loginLockMin minutes.
 */
const { err } = require('../lib/errors');
const { hashPassword, verifyPassword, checkPolicy } = require('../lib/password');
const { getUserById } = require('./users');

/** Hash first (scrypt is async: never call it inside a db.tx), then store with storeHash(). */
async function preparePassword(password, email) {
  checkPolicy(password, email);
  return hashPassword(password);
}
async function storeHash(db, userId, hash, now = new Date()) {
  await db.run(
    `UPDATE users SET password_hash = @hash, password_set_at = @now, failed_logins = 0, locked_until = NULL, updated_at = @now
      WHERE id = @id`,
    { id: userId, hash, now },
  );
}

function isLocked(user, now = new Date()) {
  return Boolean(user && user.locked_until && new Date(user.locked_until) > now);
}

/**
 * Verifies a password for a known user row, maintaining the failure counter.
 * Throws account_locked / invalid_credentials. Returns the fresh user row on success.
 */
async function checkUserPassword(db, config, user, password) {
  const now = new Date();
  if (isLocked(user, now)) {
    throw err('account_locked', `Too many incorrect passwords. Try again after ${new Date(user.locked_until).toISOString().slice(11, 16)} UTC or reset your password.`);
  }
  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) {
    const failures = Number(user.failed_logins || 0) + 1;
    const lock = failures >= config.loginMaxFailures ? new Date(now.getTime() + config.loginLockMin * 60 * 1000) : null;
    await db.run('UPDATE users SET failed_logins = @f, locked_until = @lock, updated_at = @now WHERE id = @id', {
      id: user.id,
      f: lock ? 0 : failures,
      lock,
      now,
    });
    if (lock) throw err('account_locked', `Too many incorrect passwords. The account is locked for ${config.loginLockMin} minutes — try again later or reset your password.`);
    throw err('invalid_credentials', 'Incorrect email or password.');
  }
  if (user.failed_logins || user.locked_until) {
    await db.run('UPDATE users SET failed_logins = 0, locked_until = NULL WHERE id = @id', { id: user.id });
  }
  return getUserById(db, user.id);
}

async function setPassword(db, userId, email, password, now = new Date()) {
  const hash = await preparePassword(password, email);
  await storeHash(db, userId, hash, now);
}

module.exports = { setPassword, preparePassword, storeHash, checkUserPassword, isLocked, verifyPassword };
