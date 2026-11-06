'use strict';
/**
 * Password hashing (scrypt, Node built-in) and policy.
 * Stored format: scrypt$N$r$p$saltB64$hashB64
 */
const crypto = require('crypto');
const { err } = require('./errors');

const N = 16384;
const R = 8;
const P = 1;
const KEYLEN = 64;
const MAXMEM = 64 * 1024 * 1024;

const COMMON = new Set([
  'password1234', 'password123', 'password12', 'passw0rd123', 'qwerty123456', 'qwertyuiop1', '1234567890a', 'a1234567890',
  'abc123456789', 'welcome1234', 'welcome123', 'letmein1234', 'iloveyou123', 'admin123456', 'administrator1',
  'changeme123', 'p@ssw0rd123', 'qatar2022!', 'qatar123456', 'doha123456', 'gta123456789', 'gta2026!!', 'password2026',
  'password2025', 'summer2026!', 'winter2026!', 'football123', 'monkey123456', 'dragon123456', '1q2w3e4r5t',
  '1qaz2wsx3edc', 'zaq12wsxcde3', 'asdfghjkl123', 'trustno1234',
]);

function scryptAsync(password, salt, keylen, opts) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, keylen, opts, (e, key) => (e ? reject(e) : resolve(key)));
  });
}

async function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const key = await scryptAsync(String(password).normalize('NFKC'), salt, KEYLEN, { N, r: R, p: P, maxmem: MAXMEM });
  return `scrypt$${N}$${R}$${P}$${salt.toString('base64')}$${key.toString('base64')}`;
}

// A fixed dummy hash so unknown users cost the same time as real ones.
let DUMMY = null;
async function dummyHash() {
  if (!DUMMY) DUMMY = await hashPassword(crypto.randomBytes(12).toString('hex'));
  return DUMMY;
}

async function verifyPassword(password, stored) {
  const target = typeof stored === 'string' && stored.startsWith('scrypt$') ? stored : await dummyHash();
  const parts = target.split('$');
  if (parts.length !== 6) return false;
  const [, n, r, p, saltB64, hashB64] = parts;
  const expected = Buffer.from(hashB64, 'base64');
  let key;
  try {
    key = await scryptAsync(String(password == null ? '' : password).normalize('NFKC'), Buffer.from(saltB64, 'base64'), expected.length, {
      N: Number(n), r: Number(r), p: Number(p), maxmem: MAXMEM,
    });
  } catch (e) {
    return false;
  }
  const ok = key.length === expected.length && crypto.timingSafeEqual(key, expected);
  return ok && target === stored;
}

/** Throws weak_password (400) with a human message when the password breaks the policy. */
function checkPolicy(password, email) {
  if (typeof password !== 'string') throw err('weak_password', 'Choose a password.');
  if (password.length < 10) throw err('weak_password', 'Use at least 10 characters.');
  if (password.length > 128) throw err('weak_password', 'Use at most 128 characters.');
  if (!/\p{L}/u.test(password) || !/\p{Nd}/u.test(password)) throw err('weak_password', 'Use at least one letter and one number.');
  const local = String(email || '').split('@')[0].toLowerCase();
  const lower = password.toLowerCase();
  if (local && local.length >= 3) {
    if (lower.includes(local)) throw err('weak_password', 'Do not include your email name in the password.');
  }
  if (COMMON.has(lower)) throw err('weak_password', 'That password is too common. Choose something less predictable.');
  if (/^(.)\1+$/.test(password)) throw err('weak_password', 'Do not repeat a single character.');
}

module.exports = { hashPassword, verifyPassword, checkPolicy };
