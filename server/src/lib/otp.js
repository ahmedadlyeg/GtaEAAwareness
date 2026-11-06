'use strict';
const crypto = require('crypto');

/** Uniformly random 6-digit code (000000-999999) from the CSPRNG. */
function generateCode() {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
}

/** HMAC-SHA256(pepper, salt || code). The pepper never touches the database. */
function hashCode(code, salt, pepper) {
  return crypto.createHmac('sha256', pepper).update(salt).update(String(code)).digest();
}

function newSalt() {
  return crypto.randomBytes(16);
}

/** Constant-time comparison of a candidate code with the stored hash. */
function verifyCode(code, salt, expectedHash, pepper) {
  const actual = hashCode(code, Buffer.from(salt), pepper);
  const expected = Buffer.from(expectedHash);
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

function maskEmail(email) {
  const [local, domain] = String(email).split('@');
  if (!domain) return '***';
  const keep = local.length <= 2 ? 1 : 2;
  return `${local.slice(0, keep)}${'*'.repeat(Math.max(3, local.length - keep))}@${domain}`;
}

module.exports = { generateCode, hashCode, newSalt, verifyCode, maskEmail };
