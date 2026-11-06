'use strict';
/** Shared auth helpers: one-time sign-up with an emailed code, then email + password. */
const assert = require('node:assert/strict');

const PASSWORD = 'Tax-Archi7ecture-2026';

function helpers(getRequest, getDb) {
  async function latestCode(email, template = 'signup_otp') {
    const row = await getDb().get(
      'SELECT payload FROM email_outbox WHERE to_email = @email AND template = @template ORDER BY id DESC',
      { email, template },
    );
    assert.ok(row, `no ${template} e-mail queued for ${email}`);
    return JSON.parse(row.payload).code;
  }

  /** request code -> verify -> set password -> { token, user, expiresAt } */
  async function signUp(email, password = PASSWORD, ua = 'node-test') {
    const req = await getRequest().post('/api/v1/auth/otp/request').send({ email, purpose: 'signup' }).expect(202);
    const code = await latestCode(email.trim().toLowerCase());
    const v = await getRequest().post('/api/v1/auth/otp/verify').send({ challengeId: req.body.challengeId, code }).expect(200);
    const res = await getRequest().post('/api/v1/auth/password').set('User-Agent', ua).send({ setupToken: v.body.setupToken, password }).expect(200);
    return res.body;
  }

  async function passwordLogin(email, password = PASSWORD, ua = 'node-test') {
    const res = await getRequest().post('/api/v1/auth/login').set('User-Agent', ua).send({ email, password }).expect(200);
    return res.body;
  }

  /** Signs the user up on first use, otherwise signs in with the password. */
  async function login(email, ua = 'node-test') {
    const u = await getDb().get('SELECT password_hash FROM users WHERE email = @email', { email: email.trim().toLowerCase() });
    return u && u.password_hash ? passwordLogin(email, PASSWORD, ua) : signUp(email, PASSWORD, ua);
  }

  return { latestCode, signUp, passwordLogin, login, PASSWORD };
}

module.exports = { helpers, PASSWORD };
