'use strict';
const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const http = require('node:http');
const supertest = require('supertest');

const { loadConfig } = require('../src/config');
const { createDb } = require('../src/db');
const { createApp } = require('../src/app');
const { createLogger } = require('../src/lib/log');
const { createOutbox } = require('../src/mail/outbox');
const { isCorrect } = require('../src/lib/scoring');

const ADMIN = 'ea.admin@gta.gov.qa';
const STAFF = 'ahmed.test@gta.gov.qa';

let app;
let server;
/** All requests go to one listening server, closed in after() - no stray ephemeral servers on failures. */
const request = () => supertest(server);
let db;
let config;
let log;

const { helpers, PASSWORD } = require('./authHelpers');
const { latestCode, signUp, passwordLogin, login } = helpers(() => request(), () => db);
const latestOtp = (email, template = 'signup_otp') => latestCode(email, template);

const bearer = (token) => ({ Authorization: `Bearer ${token}` });

/** Correct responses for the seeded round-1 placeholder questions. */
async function round1Answers({ wrong = [] } = {}) {
  const qs = await db.all("SELECT id, type, answer_key FROM questions WHERE round_id = 'round-1' AND active = 1 ORDER BY id", {});
  return qs.map((q) => {
    const k = JSON.parse(q.answer_key);
    const right = () => (q.type === 'match' ? k.pairs : q.type === 'order' || q.type === 'categorize' ? k.items : k.answer);
    const wrongOf = () => {
      if (q.type === 'mcq') return (k.answer + 1) % 4;
      if (q.type === 'truefalse') return !k.answer;
      if (q.type === 'order') return [...k.items].reverse();
      return [];
    };
    const response = wrong.includes(q.id) ? wrongOf() : right();
    return { questionId: q.id, response, correct: true, points: 99, timeMs: 1200 };
  });
}

before(async () => {
  config = loadConfig({
    NODE_ENV: 'test',
    SQLITE_PATH: ':memory:',
    JWT_SECRET: crypto.randomBytes(32).toString('hex'),
    ADMIN_EMAILS: ADMIN,
    STATIC_DIR: '',
    RATE_LIMIT_AUTH: '1000',
    LOG_LEVEL: 'silent',
  });
  log = createLogger('silent');
  db = await createDb(config);
  await db.migrate();
  app = createApp({ config, db, log });
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
  await db.close();
});

describe('scoring', () => {
  test('all question types', () => {
    assert.equal(isCorrect('mcq', { answer: 2 }, 2), true);
    assert.equal(isCorrect('mcq', { answer: 2 }, '2'), false);
    assert.equal(isCorrect('truefalse', { answer: false }, false), true);
    assert.equal(isCorrect('truefalse', { answer: false }, 0), false);
    assert.equal(isCorrect('order', { items: ['a', 'b', 'c'] }, ['a', 'b', 'c']), true);
    assert.equal(isCorrect('order', { items: ['a', 'b', 'c'] }, ['b', 'a', 'c']), false);
    const pairs = [{ l: 'x', r: '1' }, { l: 'y', r: '2' }];
    assert.equal(isCorrect('match', { pairs }, [{ l: 'y', r: '2' }, { l: 'x', r: '1' }]), true);
    assert.equal(isCorrect('match', { pairs }, [{ l: 'y', r: '1' }, { l: 'x', r: '2' }]), false);
    assert.equal(isCorrect('match', { pairs }, [{ l: 'x', r: '1' }, { l: 'x', r: '1' }]), false);
    const items = [{ t: 'a', b: 'P' }, { t: 'b', b: 'S' }];
    assert.equal(isCorrect('categorize', { items }, [{ t: 'b', b: 'S' }, { t: 'a', b: 'P' }]), true);
    assert.equal(isCorrect('categorize', { items }, [{ t: 'b', b: 'P' }, { t: 'a', b: 'P' }]), false);
    assert.equal(isCorrect('categorize', { items }, 'nope'), false);
  });
});

describe('auth', () => {
  test('rejects e-mail outside allowed domains', async () => {
    const res = await request().post('/api/v1/auth/otp/request').send({ email: 'someone@gmail.com', purpose: 'signup' }).expect(400);
    assert.equal(res.body.error.code, 'invalid_domain');
    const res2 = await request().post('/api/v1/auth/otp/request').send({ email: 'x@gta.gov.qa.evil.com' }).expect(400);
    assert.equal(res2.body.error.code, 'invalid_domain');
    const res3 = await request().post('/api/v1/auth/login').send({ email: 'someone@gmail.com', password: PASSWORD }).expect(400);
    assert.equal(res3.body.error.code, 'invalid_domain');
  });

  test('rejects malformed input with validation; login codes are no longer issued', async () => {
    const res = await request().post('/api/v1/auth/otp/request').send({ email: 'not-an-email' }).expect(400);
    assert.equal(res.body.error.code, 'validation');
    const r2 = await request().post('/api/v1/auth/otp/request').send({ email: 'a.b@gta.gov.qa', purpose: 'login' }).expect(400);
    assert.equal(r2.body.error.code, 'validation');
  });

  test('sign-up: code -> set-password token -> password creates user and session', async () => {
    const before = Date.now();
    const req = await request().post('/api/v1/auth/otp/request').send({ email: ' Ahmed.Test@GTA.gov.qa ', purpose: 'signup' }).expect(202);
    assert.match(req.body.challengeId, /^[0-9a-f-]{36}$/);
    assert.equal(req.body.maskedEmail, 'ah********@gta.gov.qa');
    assert.ok(Date.parse(req.body.expiresAt) > before + 9 * 60 * 1000);

    // The code is only stored hashed
    const ch = await db.get('SELECT code_hash, salt, purpose FROM otp_challenges WHERE id = @id', { id: req.body.challengeId });
    assert.equal(ch.purpose, 'signup');
    assert.equal(Buffer.from(ch.code_hash).length, 32);
    const code = await latestOtp(STAFF);
    assert.match(code, /^\d{6}$/);
    assert.ok(!Buffer.from(ch.code_hash).toString('utf8').includes(code));

    const v = await request().post('/api/v1/auth/otp/verify').send({ challengeId: req.body.challengeId, code }).expect(200);
    assert.deepEqual(Object.keys(v.body).sort(), ['email', 'purpose', 'setupToken']);
    assert.equal(v.body.purpose, 'signup');
    assert.equal(v.body.email, STAFF);
    assert.equal(await db.get('SELECT id FROM users WHERE email = @e', { e: STAFF }), undefined, 'no user before a password is chosen');

    // Code cannot be reused
    const again = await request().post('/api/v1/auth/otp/verify').send({ challengeId: req.body.challengeId, code }).expect(401);
    assert.equal(again.body.error.code, 'otp_invalid');

    // Weak password is refused and nothing is created
    const weak = await request().post('/api/v1/auth/password').send({ setupToken: v.body.setupToken, password: 'short1' }).expect(400);
    assert.equal(weak.body.error.code, 'weak_password');
    for (const pw of ['onlyletterslong', '12345678901', 'ahmed.test-2026x', 'Password1234']) {
      const w = await request().post('/api/v1/auth/password').send({ setupToken: v.body.setupToken, password: pw }).expect(400);
      assert.equal(w.body.error.code, 'weak_password', pw);
    }

    const res = await request()
      .post('/api/v1/auth/password')
      .set('User-Agent', 'EA-Test-Agent/1.0')
      .send({ setupToken: v.body.setupToken, password: PASSWORD })
      .expect(200);
    assert.ok(res.body.token);
    assert.equal(res.body.user.email, STAFF);
    assert.equal(res.body.user.role, 'staff');
    assert.equal(res.body.user.displayName, 'Ahmed Test');
    assert.ok(res.body.user.firstLoginAt);
    assert.deepEqual(Object.keys(res.body.user).sort(), ['department', 'displayName', 'email', 'firstLoginAt', 'id', 'jobTitle', 'reviewer', 'role']);

    const u = await db.get('SELECT password_hash, password_set_at FROM users WHERE email = @e', { e: STAFF });
    assert.match(u.password_hash, /^scrypt\$16384\$8\$1\$[A-Za-z0-9+/=]+\$[A-Za-z0-9+/=]+$/);
    assert.ok(!u.password_hash.includes(PASSWORD));
    assert.ok(u.password_set_at);

    const s = await db.get('SELECT * FROM user_sessions WHERE user_id = @id', { id: res.body.user.id });
    assert.ok(s, 'session row created');
    assert.ok(Date.parse(s.login_at) >= before - 1000);
    assert.equal(s.user_agent, 'EA-Test-Agent/1.0');
    assert.ok(s.ip);
    assert.equal(s.logout_at, null);

    // The set-password token is single use
    const reuse = await request().post('/api/v1/auth/password').send({ setupToken: v.body.setupToken, password: 'Another-pass-2026' }).expect(409);
    assert.equal(reuse.body.error.code, 'account_exists');
    const audit = await db.get("SELECT entity_id FROM audit_log WHERE action = 'user.password_set'", {});
    assert.equal(audit.entity_id, req.body.challengeId);
  });

  test('sign-up again for an existing account is refused with account_exists', async () => {
    const r = await request().post('/api/v1/auth/otp/request').send({ email: STAFF, purpose: 'signup' }).expect(409);
    assert.equal(r.body.error.code, 'account_exists');
  });

  test('login with email + password; wrong password; password not set', async () => {
    const ok = await passwordLogin(' AHMED.test@gta.gov.qa ', PASSWORD, 'Login-Agent');
    assert.equal(ok.user.email, STAFF);
    const s = await db.get('SELECT user_agent FROM user_sessions WHERE user_id = @id ORDER BY login_at DESC', { id: ok.user.id });
    assert.equal(s.user_agent, 'Login-Agent');
    await request().get('/api/v1/me').set(bearer(ok.token)).expect(200);

    const bad = await request().post('/api/v1/auth/login').send({ email: STAFF, password: 'Wrong-pass-1234' }).expect(401);
    assert.deepEqual(bad.body.error, { code: 'invalid_credentials', message: 'Incorrect email or password.' });
    const unknown = await request().post('/api/v1/auth/login').send({ email: 'nobody.here@gta.gov.qa', password: 'Wrong-pass-1234' }).expect(401);
    assert.deepEqual(unknown.body.error, bad.body.error, 'unknown user and wrong password look the same');

    // A user provisioned without a password (e.g. migrated, or created by an admin) must finish sign-up
    const now = new Date();
    await db.insert('users', { email: 'no.password@gta.gov.qa', display_name: 'No Password', role: 'staff', is_active: 1, created_at: now, updated_at: now });
    const np = await request().post('/api/v1/auth/login').send({ email: 'no.password@gta.gov.qa', password: 'Whatever-123' }).expect(409);
    assert.equal(np.body.error.code, 'password_not_set');
    const fresh = await db.get('SELECT failed_logins FROM users WHERE email = @e', { e: STAFF });
    assert.equal(fresh.failed_logins, 1);
    await passwordLogin(STAFF);
    assert.equal((await db.get('SELECT failed_logins FROM users WHERE email = @e', { e: STAFF })).failed_logins, 0, 'success resets the counter');
  });

  test('five wrong passwords lock the account for 15 minutes', async () => {
    const email = 'lock.me@gta.gov.qa';
    await signUp(email);
    for (let i = 1; i <= 4; i++) {
      const r = await request().post('/api/v1/auth/login').send({ email, password: `Wrong-pass-${i}000` }).expect(401);
      assert.equal(r.body.error.code, 'invalid_credentials');
    }
    const fifth = await request().post('/api/v1/auth/login').send({ email, password: 'Wrong-pass-5000' }).expect(423);
    assert.equal(fifth.body.error.code, 'account_locked');
    const right = await request().post('/api/v1/auth/login').send({ email, password: PASSWORD }).expect(423);
    assert.equal(right.body.error.code, 'account_locked', 'even the right password is refused while locked');
    const u = await db.get('SELECT locked_until FROM users WHERE email = @e', { e: email });
    const mins = (Date.parse(u.locked_until) - Date.now()) / 60000;
    assert.ok(mins > 14 && mins <= 15, `locked for ~15 min (${mins})`);

    // Reset by code clears the lock
    const req = await request().post('/api/v1/auth/otp/request').send({ email, purpose: 'reset' }).expect(202);
    const v = await request().post('/api/v1/auth/otp/verify').send({ challengeId: req.body.challengeId, code: await latestOtp(email, 'reset_otp') }).expect(200);
    assert.equal(v.body.purpose, 'reset');
    const done = await request().post('/api/v1/auth/password').send({ setupToken: v.body.setupToken, password: 'Brand-new-pass-77' }).expect(200);
    assert.equal(done.body.user.email, email);
    await request().post('/api/v1/auth/login').send({ email, password: PASSWORD }).expect(401);
    await passwordLogin(email, 'Brand-new-pass-77');
    assert.ok(await db.get("SELECT id FROM audit_log WHERE action = 'user.password_reset' AND entity_id = @id", { id: req.body.challengeId }));
  });

  test('reset for an unknown e-mail answers the same but sends nothing', async () => {
    const email = 'ghost.user@gta.gov.qa';
    const r = await request().post('/api/v1/auth/otp/request').send({ email, purpose: 'reset' }).expect(202);
    assert.deepEqual(Object.keys(r.body).sort(), ['challengeId', 'expiresAt', 'maskedEmail']);
    assert.equal(await db.get('SELECT id FROM email_outbox WHERE to_email = @e', { e: email }), undefined);
    assert.equal(await db.get('SELECT id FROM otp_challenges WHERE user_email = @e', { e: email }), undefined);
  });

  test('change password while signed in', async () => {
    const email = 'change.me@gta.gov.qa';
    const { token } = await signUp(email);
    const wrong = await request().post('/api/v1/auth/password/change').set(bearer(token)).send({ currentPassword: 'Nope-nope-123', newPassword: 'Next-pass-2027' }).expect(401);
    assert.equal(wrong.body.error.code, 'invalid_credentials');
    const weak = await request().post('/api/v1/auth/password/change').set(bearer(token)).send({ currentPassword: PASSWORD, newPassword: 'weak' }).expect(400);
    assert.equal(weak.body.error.code, 'weak_password');
    await request().post('/api/v1/auth/password/change').set(bearer(token)).send({ currentPassword: PASSWORD, newPassword: 'Next-pass-2027' }).expect(204);
    await request().post('/api/v1/auth/login').send({ email, password: PASSWORD }).expect(401);
    await passwordLogin(email, 'Next-pass-2027');
    await request().post('/api/v1/auth/password/change').send({ currentPassword: 'x', newPassword: 'y' }).expect(401);
  });

  test('locks the challenge after 5 bad codes', async () => {
    const email = 'lockout.user@gta.gov.qa';
    const req = await request().post('/api/v1/auth/otp/request').send({ email, purpose: 'signup' }).expect(202);
    const good = await latestOtp(email);
    const bad = good === '000000' ? '111111' : '000000';
    for (let i = 1; i <= 4; i++) {
      const r = await request().post('/api/v1/auth/otp/verify').send({ challengeId: req.body.challengeId, code: bad }).expect(401);
      assert.equal(r.body.error.code, 'otp_invalid');
    }
    const fifth = await request().post('/api/v1/auth/otp/verify').send({ challengeId: req.body.challengeId, code: bad }).expect(423);
    assert.equal(fifth.body.error.code, 'otp_locked');
    // Even the right code is refused now
    const sixth = await request().post('/api/v1/auth/otp/verify').send({ challengeId: req.body.challengeId, code: good }).expect(423);
    assert.equal(sixth.body.error.code, 'otp_locked');
    const row = await db.get('SELECT attempts, locked_at FROM otp_challenges WHERE id = @id', { id: req.body.challengeId });
    assert.equal(row.attempts, 5);
    assert.ok(row.locked_at);
    const u = await db.get('SELECT id FROM users WHERE email = @email', { email });
    assert.equal(u, undefined, 'no user provisioned');
  });

  test('expired code is rejected with otp_expired', async () => {
    const email = 'expired.user@gta.gov.qa';
    const req = await request().post('/api/v1/auth/otp/request').send({ email }).expect(202);
    await db.run('UPDATE otp_challenges SET expires_at = @t WHERE id = @id', { id: req.body.challengeId, t: new Date(Date.now() - 1000) });
    const r = await request().post('/api/v1/auth/otp/verify').send({ challengeId: req.body.challengeId, code: await latestOtp(email) }).expect(410);
    assert.equal(r.body.error.code, 'otp_expired');
  });

  test('max 3 code requests per e-mail per window', async () => {
    const email = 'rate.limit@gta.gov.qa';
    for (let i = 0; i < 3; i++) await request().post('/api/v1/auth/otp/request').send({ email }).expect(202);
    const r = await request().post('/api/v1/auth/otp/request').send({ email }).expect(429);
    assert.equal(r.body.error.code, 'rate_limited');
  });

  test('unauthenticated calls get 401 unauthorized', async () => {
    const r = await request().get('/api/v1/me').expect(401);
    assert.equal(r.body.error.code, 'unauthorized');
    await request().get('/api/v1/me').set(bearer('garbage')).expect(401);
    const bad = await request().post('/api/v1/auth/password').send({ setupToken: 'garbage', password: PASSWORD }).expect(401);
    assert.equal(bad.body.error.code, 'unauthorized');
  });

  test('heartbeat updates last_seen_at; logout closes the session', async () => {
    const { token, user } = await login('heart.beat@gta.gov.qa');
    const s0 = await db.get('SELECT id, login_at, last_seen_at FROM user_sessions WHERE user_id = @id', { id: user.id });
    await new Promise((r) => setTimeout(r, 15));
    await request().post('/api/v1/auth/heartbeat').set(bearer(token)).expect(204);
    const s1 = await db.get('SELECT last_seen_at FROM user_sessions WHERE id = @id', { id: s0.id });
    assert.ok(s1.last_seen_at > s0.last_seen_at, 'last_seen_at advanced');

    await request().post('/api/v1/auth/logout').set(bearer(token)).expect(204);
    const s2 = await db.get('SELECT logout_at FROM user_sessions WHERE id = @id', { id: s0.id });
    assert.ok(s2.logout_at);
    const r = await request().get('/api/v1/me').set(bearer(token)).expect(401);
    assert.equal(r.body.error.code, 'unauthorized');
  });
});

describe('learner flow', () => {
  let token;
  let userId;
  let statement;

  before(async () => {
    const out = await login(STAFF);
    token = out.token;
    userId = out.user.id;
  });

  test('GET /me returns user and empty progress; PATCH sets department once', async () => {
    const me = await request().get('/api/v1/me').set(bearer(token)).expect(200);
    assert.equal(me.body.user.email, STAFF);
    const { certification, certifications, ...rest } = me.body.progress;
    assert.deepEqual(Object.keys(certifications), ['foundation', 'practitioner', 'advanced']);
    assert.equal(certifications.foundation.attemptsUsed, certification.attemptsUsed);
    assert.equal(certifications.practitioner.prerequisiteMet, false);
    assert.deepEqual(rest, { modulesCompleted: [], kbViewed: 0, attempts: [], signoff: null });
    assert.equal(certification.eligible, false);
    assert.equal(certification.attemptsUsed, 0);
    assert.equal(certification.maxAttempts, 3);
    assert.equal(certification.certificate, null);
    assert.deepEqual(certification.track.ea, { done: 0, total: 6, pct: 0 });

    const p = await request()
      .patch('/api/v1/me')
      .set(bearer(token))
      .send({ displayName: 'Ahmed Al-Test', department: 'Information Technology', jobTitle: 'Systems Analyst' })
      .expect(200);
    assert.equal(p.body.user.department, 'Information Technology');
    assert.equal(p.body.user.displayName, 'Ahmed Al-Test');

    const again = await request().patch('/api/v1/me').set(bearer(token)).send({ department: 'Legal Affairs' }).expect(403);
    assert.equal(again.body.error.code, 'forbidden');
    const bad = await request().patch('/api/v1/me').set(bearer(token)).send({ department: 'Nope' }).expect(400);
    assert.equal(bad.body.error.code, 'validation');
  });

  test('events are validated and stored', async () => {
    await request().post('/api/v1/events').set(bearer(token)).send({ type: 'module_view', ref: 'ea-basics', meta: { lang: 'en' } }).expect(204);
    await request().post('/api/v1/events').set(bearer(token)).send({ type: 'kb_view', ref: 'kb-glossary' }).expect(204);
    const bad = await request().post('/api/v1/events').set(bearer(token)).send({ type: 'hack', ref: 'x' }).expect(400);
    assert.equal(bad.body.error.code, 'validation');
    const row = await db.get("SELECT session_id, meta FROM events WHERE user_id = @userId AND type = 'module_view'", { userId });
    assert.ok(row.session_id);
    assert.deepEqual(JSON.parse(row.meta), { lang: 'en' });
  });

  test('attempts are re-scored server-side', async () => {
    const answers = await round1Answers({ wrong: ['r1-q03', 'r1-q04'] }); // 2 + 2 of 8 points wrong
    const t = Date.now();
    const res = await request()
      .post('/api/v1/quiz/attempts')
      .set(bearer(token))
      .send({ roundId: 'round-1', startedAt: new Date(t - 60000).toISOString(), completedAt: new Date(t).toISOString(), answers })
      .expect(201);
    assert.deepEqual({ score: res.body.score, maxScore: res.body.maxScore, passed: res.body.passed }, { score: 4, maxScore: 8, passed: false });
    const stored = await db.all('SELECT question_id, correct, points, client_correct, time_ms FROM quiz_answers WHERE attempt_id = @id ORDER BY question_id', { id: res.body.attemptId });
    assert.equal(stored.length, 5);
    const q3 = stored.find((a) => a.question_id === 'r1-q03');
    assert.equal(q3.correct, 0);
    assert.equal(q3.points, 0);
    assert.equal(q3.client_correct, 1, 'client claim kept for diagnostics only');
    assert.equal(stored.find((a) => a.question_id === 'r1-q01').points, 1);
  });

  test('attempt validation: unknown question id, missing answers, bad round', async () => {
    const t = new Date().toISOString();
    const answers = await round1Answers();
    let r = await request().post('/api/v1/quiz/attempts').set(bearer(token))
      .send({ roundId: 'round-1', startedAt: t, completedAt: t, answers: [...answers, { questionId: 'does-not-exist', response: 1 }] })
      .expect(400);
    assert.equal(r.body.error.code, 'validation');
    assert.match(r.body.error.message, /does-not-exist/);
    r = await request().post('/api/v1/quiz/attempts').set(bearer(token))
      .send({ roundId: 'round-1', startedAt: t, completedAt: t, answers: answers.slice(0, 2) })
      .expect(400);
    assert.equal(r.body.error.code, 'validation');
    r = await request().post('/api/v1/quiz/attempts').set(bearer(token))
      .send({ roundId: 'round-x', startedAt: t, completedAt: t, answers })
      .expect(400);
    assert.equal(r.body.error.code, 'validation');
    r = await request().post('/api/v1/quiz/attempts').set(bearer(token))
      .send({ roundId: 'round-2', startedAt: t, completedAt: t, answers })
      .expect(400);
    assert.equal(r.body.error.code, 'validation', 'questions from another round are unknown for this round');
  });

  test('sign-off requires a certificate; succeeds once certified', async () => {
    const st = await request().get('/api/v1/signoff/statement').set(bearer(token)).expect(200);
    statement = st.body;
    assert.equal(statement.version, '2026.1');
    assert.equal(statement.sha256, crypto.createHash('sha256').update(statement.bodyMarkdown, 'utf8').digest('hex'));

    let r = await request().post('/api/v1/signoff').set(bearer(token)).send({ password: PASSWORD, statementVersion: statement.version, sha256: statement.sha256 }).expect(409);
    assert.equal(r.body.error.code, 'preconditions_not_met');
    assert.match(r.body.error.message, /certificate/);

    const mandatory = await db.all('SELECT id FROM content_modules WHERE mandatory = 1', {});
    for (const m of mandatory) {
      await request().post('/api/v1/events').set(bearer(token)).send({ type: 'module_complete', ref: m.id }).expect(204);
    }
    r = await request().post('/api/v1/signoff').set(bearer(token)).send({ password: PASSWORD, statementVersion: statement.version, sha256: statement.sha256 }).expect(409);
    assert.equal(r.body.error.code, 'preconditions_not_met', 'reading alone does not unlock sign-off');

    const t = new Date().toISOString();
    const pass = await request().post('/api/v1/quiz/attempts').set(bearer(token))
      .send({ roundId: 'round-1', startedAt: t, completedAt: t, answers: await round1Answers({ wrong: ['r1-q01'] }) })
      .expect(201);
    assert.deepEqual([pass.body.score, pass.body.maxScore, pass.body.passed], [7, 8, true]);

    const list = await request().get('/api/v1/quiz/attempts').set(bearer(token)).expect(200);
    assert.equal(list.body.length, 2);
    r = await request().post('/api/v1/signoff').set(bearer(token)).send({ password: PASSWORD, statementVersion: statement.version, sha256: statement.sha256 }).expect(409);
    assert.equal(r.body.error.code, 'preconditions_not_met', 'passing a practice round does not unlock sign-off');

    // Certificate (the full exam flow is covered in cert.test.js with the real content)
    const examId = crypto.randomUUID();
    const now = new Date();
    await db.insert('cert_exams', { id: examId, user_id: userId, attempt_no: 1, status: 'completed', question_set: '{}', started_at: now, completed_at: now, score: 7, max_score: 8, pct: 87.5, passed: 1, parts: '[]' });
    await db.insert('certificates', { certificate_id: 'GTA-EAF-2026-TEST01', user_id: userId, exam_id: examId, display_name: 'Ahmed Al-Test', department: 'Information Technology', score_pct: 87.5, issued_at: now }, 'certificate_id');

    r = await request().post('/api/v1/signoff').set(bearer(token)).send({ password: PASSWORD, statementVersion: 'old', sha256: statement.sha256 }).expect(409);
    assert.equal(r.body.error.code, 'statement_mismatch');

    // The old code-based endpoint is gone
    r = await request().post('/api/v1/signoff/otp').set(bearer(token)).send({ statementVersion: statement.version }).expect(410);
    assert.equal(r.body.error.code, 'gone');

    r = await request().post('/api/v1/signoff').set(bearer(token))
      .send({ password: PASSWORD, statementVersion: statement.version, sha256: 'f'.repeat(64) })
      .expect(409);
    assert.equal(r.body.error.code, 'statement_mismatch');

    r = await request().post('/api/v1/signoff').set(bearer(token)).send({ statementVersion: statement.version, sha256: statement.sha256 }).expect(400);
    assert.equal(r.body.error.code, 'validation', 'password is required');

    // Wrong password: 401, counts towards the lockout
    r = await request().post('/api/v1/signoff').set(bearer(token))
      .send({ password: 'Not-my-pass-99', statementVersion: statement.version, sha256: statement.sha256 })
      .expect(401);
    assert.equal(r.body.error.code, 'invalid_credentials');
    assert.equal((await db.get('SELECT failed_logins FROM users WHERE id = @id', { id: userId })).failed_logins, 1);

    const ok = await request().post('/api/v1/signoff').set(bearer(token))
      .send({ password: PASSWORD, statementVersion: statement.version, sha256: statement.sha256 })
      .expect(201);
    assert.match(ok.body.receiptId, /^EA-\d{8}-[0-9A-Z]{8}$/);
    assert.ok(Date.parse(ok.body.signedAt));

    const row = await db.get('SELECT * FROM signoffs WHERE receipt_id = @r', { r: ok.body.receiptId });
    assert.equal(row.user_id, userId);
    assert.equal(row.verification_method, 'password');
    assert.equal(row.otp_challenge_id, null);

    const progress = await request().get('/api/v1/me/progress').set(bearer(token)).expect(200);
    assert.deepEqual(progress.body.signoff, { statementVersion: '2026.1', signedAt: ok.body.signedAt, receiptId: ok.body.receiptId });
    assert.equal(progress.body.attempts[0].bestScore, 7);
    assert.equal(progress.body.kbViewed, 1);

    // Signing twice is refused
    r = await request().post('/api/v1/signoff').set(bearer(token)).send({ password: PASSWORD, statementVersion: statement.version, sha256: statement.sha256 }).expect(409);
    assert.equal(r.body.error.code, 'preconditions_not_met');
  });

  test('sign-off queues a receipt e-mail and writes the audit log', async () => {
    const mail = await db.get("SELECT * FROM email_outbox WHERE to_email = @e AND template = 'signoff_receipt'", { e: STAFF });
    assert.ok(mail, 'receipt queued');
    assert.equal(mail.status, 'queued');
    const p = JSON.parse(mail.payload);
    assert.match(p.receiptId, /^EA-/);
    assert.equal(p.statementVersion, '2026.1');
    assert.ok(p.signedAt);
    const audit = await db.get("SELECT * FROM audit_log WHERE action = 'signoff.create' AND entity_id = @r", { r: p.receiptId });
    assert.ok(audit);
    assert.equal(audit.actor_user_id, userId);

    // The dev transport "sends" queued mail and marks it sent (kept in the outbox)
    const outbox = createOutbox({ db, config, log });
    const sent = await outbox.processOnce();
    assert.ok(sent >= 1);
    const after = await db.get('SELECT status, sent_at, attempts FROM email_outbox WHERE id = @id', { id: mail.id });
    assert.equal(after.status, 'sent');
    assert.ok(after.sent_at);
    assert.equal(after.attempts, 1);
  });

  describe('admin', () => {
    test('dashboard is 403 for staff', async () => {
      const r = await request().get('/api/v1/admin/dashboard').set(bearer(token)).expect(403);
      assert.equal(r.body.error.code, 'forbidden');
      await request().get('/api/v1/admin/export?kind=users').set(bearer(token)).expect(403);
    });

    test('dashboard is 200 for admin with the contract shape', async () => {
      const { token: adminToken, user } = await login(ADMIN);
      assert.equal(user.role, 'admin');
      const r = await request().get('/api/v1/admin/dashboard').set(bearer(adminToken)).expect(200);
      const d = r.body;
      for (const k of ['kpis', 'loginsByDay', 'loginHeatmap', 'funnel', 'byDepartment', 'scoreDistribution', 'questionStats', 'moduleViews', 'recentSignoffs']) {
        assert.ok(k in d, `dashboard.${k}`);
      }
      for (const k of ['deptAccess', 'topUsersByAccess', 'topScorers', 'employees', 'departments']) assert.ok(Array.isArray(d[k]), `dashboard.${k}`);
      assert.deepEqual(
        Object.keys(d.kpis).sort(),
        ['activeUsers', 'avgMinutesPerUser', 'avgScorePct', 'certified', 'certifiedByLevel', 'certifiedRatePct', 'enrolled', 'examAttempts', 'logins', 'passRatePct', 'signoffRatePct'].sort(),
      );
      assert.deepEqual(Object.keys(d.funnel).sort(), ['certified', 'completedModules', 'enrolled', 'examUnlocked', 'passedAssessment', 'signedOff', 'startedLearning'].sort());
      assert.equal(d.kpis.certified, 1);
      assert.equal(d.topScorers[0].bestPct, 87.5);
      assert.equal(d.topScorers[0].certified, true);
      const me = d.employees.find((e) => e.email === STAFF);
      assert.equal(me.certificateId, 'GTA-EAF-2026-TEST01');
      assert.equal(me.signed, true);
      assert.equal(me.eaPct, 66.7, '4 of the 6 placeholder modules are mandatory and completed');
      assert.ok(d.topUsersByAccess.length >= 1 && d.deptAccess.length >= 1);
      assert.equal(d.loginHeatmap.length, 7);
      assert.ok(d.loginHeatmap.every((row) => row.length === 24));
      assert.equal(d.loginsByDay.length, 30);
      assert.deepEqual(d.scoreDistribution.map((b) => b.bucket), ['0-49', '50-59', '60-69', '70-79', '80-89', '90-100']);
      assert.equal(d.funnel.signedOff, 1);
      assert.equal(d.recentSignoffs[0].displayName, 'Ahmed Al-Test');
      assert.ok(d.kpis.logins >= 3);
      // best certification exam per person
      assert.equal(d.scoreDistribution.find((b) => b.bucket === '80-89').count, 1);
      assert.equal(d.scoreDistribution.reduce((n, b) => n + b.count, 0), 1);

      const f = await request().get('/api/v1/admin/dashboard?department=Legal%20Affairs').set(bearer(adminToken)).expect(200);
      assert.equal(f.body.kpis.enrolled, 0);
      const bad = await request().get('/api/v1/admin/dashboard?from=2026-02-30x').set(bearer(adminToken)).expect(400);
      assert.equal(bad.body.error.code, 'validation');

      const users = await request().get('/api/v1/admin/users?status=signed').set(bearer(adminToken)).expect(200);
      assert.equal(users.body.length, 1);
      assert.equal(users.body[0].user.email, STAFF);
      assert.ok(users.body[0].logins >= 1);

      const csv = await request().get('/api/v1/admin/export?kind=sessions').set(bearer(adminToken)).expect(200);
      assert.match(csv.headers['content-type'], /text\/csv/);
      assert.match(csv.text, /session_id,email,display_name/);
      const audit = await db.get("SELECT * FROM audit_log WHERE action = 'admin.export'", {});
      assert.ok(audit);
      const badKind = await request().get('/api/v1/admin/export?kind=passwords').set(bearer(adminToken)).expect(400);
      assert.equal(badKind.body.error.code, 'validation');
    });
  });
});
