'use strict';
const crypto = require('crypto');
const { err } = require('../lib/errors');
const otp = require('../lib/otp');
const { enqueue } = require('../mail/outbox');

/**
 * Create a challenge and queue the e-mail. Enforces the per-e-mail request limit
 * (default 3 per 15 minutes per purpose).
 */
async function requestChallenge(db, config, { email, purpose, userId = null, context = null, ip = null, mailExtra = {} }) {
  const now = new Date();
  const windowStart = new Date(now.getTime() - config.otpWindowMin * 60 * 1000);
  const recent = await db.get(
    `SELECT COUNT(*) AS n FROM otp_challenges
      WHERE user_email = @email AND purpose = @purpose AND created_at >= @since`,
    { email, purpose, since: windowStart },
  );
  if (Number(recent.n) >= config.otpMaxRequests) {
    throw err('rate_limited', `Too many codes requested. Try again in ${config.otpWindowMin} minutes.`);
  }
  const code = otp.generateCode();
  const salt = otp.newSalt();
  const id = crypto.randomUUID();
  const expiresAt = new Date(now.getTime() + config.otpTtlMin * 60 * 1000);
  await db.tx(async (t) => {
    await t.insert('otp_challenges', {
      id,
      user_email: email,
      user_id: userId,
      purpose,
      context,
      code_hash: otp.hashCode(code, salt, config.otpPepper),
      salt,
      expires_at: expiresAt,
      attempts: 0,
      max_attempts: config.otpMaxAttempts,
      requested_ip: ip,
      created_at: now,
    });
    await enqueue(t, {
      to: email,
      template: { signup: 'signup_otp', reset: 'reset_otp', login: 'login_otp' }[purpose] || 'signoff_otp',
      payload: { code, expiresMin: config.otpTtlMin, challengeId: id, ...mailExtra },
    });
  });
  return { challengeId: id, expiresAt: expiresAt.toISOString(), maskedEmail: otp.maskEmail(email) };
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Verify a code. The attempt counter is incremented atomically *before* the
 * comparison (so parallel guesses cannot exceed max_attempts) and outside any
 * business transaction (so failed attempts are never rolled back).
 * Returns the consumed challenge row.
 */
async function verifyChallenge(db, config, { challengeId, code, purpose, email = null }) {
  if (typeof challengeId !== 'string' || !UUID_RE.test(challengeId)) throw err('validation', 'challengeId is required');
  if (typeof code !== 'string' || !/^\d{6}$/.test(code.trim())) throw err('validation', 'code must be 6 digits');
  const id = challengeId.toLowerCase();
  const ch = await db.get(
    `SELECT id, user_email, user_id, purpose, context, code_hash, salt, expires_at, attempts, max_attempts,
            consumed_at, locked_at FROM otp_challenges WHERE id = @id`,
    { id },
  );
  if (!ch || ch.purpose !== purpose || (email && ch.user_email !== email)) {
    throw err('otp_invalid', 'Invalid or unknown code');
  }
  if (ch.consumed_at) throw err('otp_invalid', 'This code has already been used');
  if (ch.locked_at || ch.attempts >= ch.max_attempts) {
    throw err('otp_locked', 'Too many incorrect attempts. Request a new code.');
  }
  const now = new Date();
  if (new Date(ch.expires_at) <= now) throw err('otp_expired', 'The code has expired. Request a new code.');

  const claim = await db.run(
    `UPDATE otp_challenges SET attempts = attempts + 1
      WHERE id = @id AND attempts < max_attempts AND consumed_at IS NULL AND locked_at IS NULL`,
    { id },
  );
  if (!claim.changes) throw err('otp_locked', 'Too many incorrect attempts. Request a new code.');
  const attempts = ch.attempts + 1;

  if (!otp.verifyCode(code.trim(), ch.salt, ch.code_hash, config.otpPepper)) {
    if (attempts >= ch.max_attempts) {
      await db.run('UPDATE otp_challenges SET locked_at = @now WHERE id = @id', { id, now });
      throw err('otp_locked', 'Too many incorrect attempts. Request a new code.');
    }
    const left = ch.max_attempts - attempts;
    throw err('otp_invalid', `Incorrect code. ${left} attempt${left === 1 ? '' : 's'} left.`);
  }
  const used = await db.run('UPDATE otp_challenges SET consumed_at = @now WHERE id = @id AND consumed_at IS NULL', {
    id,
    now,
  });
  if (!used.changes) throw err('otp_invalid', 'This code has already been used');
  return { ...ch, attempts, consumed_at: now.toISOString() };
}

module.exports = { requestChallenge, verifyChallenge };
