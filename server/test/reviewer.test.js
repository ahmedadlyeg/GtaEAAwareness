'use strict';
/**
 * Exam reviewer account (REVIEWER_EMAILS): every exam unlocked, unlimited preview
 * sittings, never certified, excluded from reporting.
 */
const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const http = require('node:http');
const supertest = require('supertest');

const { loadConfig } = require('../src/config');
const { createDb } = require('../src/db');
const { createApp } = require('../src/app');
const { createLogger } = require('../src/lib/log');
const { sync } = require('../src/seed/syncFromFrontend');
const { createReviewer, DEFAULT_EMAIL, DEFAULT_PASSWORD } = require('../src/seed/createReviewer');
const { helpers } = require('./authHelpers');

const ADMIN = 'rev.admin@gta.gov.qa';
const STAFF = 'rev.staff@gta.gov.qa';
let server;
let db;
let config;
const request = () => supertest(server);
const bearer = (token) => ({ Authorization: `Bearer ${token}` });
const { login } = helpers(() => request(), () => db);

async function answers(exam, correct = true) {
  const parts = [];
  for (const p of exam.parts) {
    const out = [];
    for (const id of p.questionIds) {
      const q = await db.get('SELECT type, answer_key FROM questions WHERE id = @id', { id });
      const k = JSON.parse(q.answer_key);
      let response;
      if (correct) response = q.type === 'match' ? k.pairs : q.type === 'order' || q.type === 'categorize' ? k.items : k.answer;
      else response = q.type === 'truefalse' ? !k.answer : q.type === 'mcq' ? (k.answer + 1) % 2 : [];
      out.push({ questionId: id, response, timeMs: 800 });
    }
    parts.push({ roundId: p.roundId, answers: out });
  }
  return parts;
}

before(async () => {
  config = loadConfig({
    NODE_ENV: 'test', SQLITE_PATH: ':memory:', JWT_SECRET: crypto.randomBytes(32).toString('hex'),
    ADMIN_EMAILS: ADMIN, STATIC_DIR: '', RATE_LIMIT_AUTH: '1000', LOG_LEVEL: 'silent',
  });
  db = await createDb(config);
  await db.migrate();
  await sync(db);
  server = http.createServer(createApp({ config, db, log: createLogger('silent') }));
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
});
after(async () => {
  await new Promise((resolve) => server.close(resolve));
  await db.close();
});

describe('exam reviewer', () => {
  let token;
  let setup;

  test('create-reviewer sets up the account and is idempotent', async () => {
    setup = await createReviewer(db, config);
    assert.equal(setup.email, DEFAULT_EMAIL);
    assert.equal(setup.created, true);
    assert.ok(setup.reviewerListed);
    const mods = await db.get("SELECT COUNT(*) AS n FROM content_modules WHERE active = 1 AND track IN ('ea','togaf','kbf','kbp','kba')", {});
    assert.equal(setup.completionsAdded, Number(mods.n));
    const again = await createReviewer(db, config);
    assert.equal(again.created, false);
    assert.equal(again.completionsAdded, 0);
    const u = await db.get("SELECT u.display_name, u.role, u.job_title, d.name AS dept FROM users u LEFT JOIN departments d ON d.id = u.department_id WHERE u.email = @e", { e: DEFAULT_EMAIL });
    assert.deepEqual([u.display_name, u.role, u.job_title, u.dept], ['Exam Reviewer', 'ea_team', 'Exam reviewer', 'Information Technology']);
  });

  test('reviewer signs in with the password and is flagged', async () => {
    const r = await request().post('/api/v1/auth/login').send({ email: DEFAULT_EMAIL, password: DEFAULT_PASSWORD }).expect(200);
    token = r.body.token;
    assert.equal(r.body.user.reviewer, true);
    const me = await request().get('/api/v1/me').set(bearer(token)).expect(200);
    assert.equal(me.body.user.reviewer, true);
    for (const lv of ['foundation', 'practitioner', 'advanced']) {
      const c = me.body.progress.certifications[lv];
      assert.equal(c.eligible, true, lv);
      assert.equal(c.prerequisiteMet, true, lv);
      assert.equal(c.preview, true, lv);
      assert.equal(c.maxAttempts, 99, lv);
      assert.equal(c.certificate, null, lv);
      for (const t of Object.values(c.track)) assert.equal(t.done, t.total, lv);
    }
    assert.equal(me.body.progress.certification.preview, true);
  });

  test('all three levels start immediately; passing issues no certificate; unlimited sittings', async () => {
    for (const [lv, n] of [['foundation', 34], ['practitioner', 20], ['advanced', 15]]) {
      const ex = await request().post('/api/v1/cert/exams').set(bearer(token)).send({ level: lv }).expect(201);
      assert.equal(ex.body.preview, true);
      assert.equal(ex.body.parts.reduce((s, p) => s + p.questionIds.length, 0), n, lv);
      const sub = await request().post(`/api/v1/cert/exams/${ex.body.examId}/submit`).set(bearer(token)).send({ parts: await answers(ex.body, true) }).expect(200);
      assert.equal(sub.body.passed, true);
      assert.equal(sub.body.pct, 100);
      assert.equal(sub.body.certificate, null);
      assert.equal(sub.body.preview, true);
      assert.equal(sub.body.attemptsLeft, 98);
    }
    const certs = await db.get('SELECT COUNT(*) AS n FROM certificates', {});
    assert.equal(Number(certs.n), 0);
    const mails = await db.get("SELECT COUNT(*) AS n FROM email_outbox WHERE template = 'certificate_issued'", {});
    assert.equal(Number(mails.n), 0);
    // start again after passing, and beyond the normal 3 attempts
    for (let i = 0; i < 3; i++) {
      const ex = await request().post('/api/v1/cert/exams').set(bearer(token)).send({ level: 'foundation' }).expect(201);
      await request().post(`/api/v1/cert/exams/${ex.body.examId}/submit`).set(bearer(token)).send({ parts: await answers(ex.body, false) }).expect(200);
    }
    const prev = await db.get("SELECT COUNT(*) AS n FROM cert_exams WHERE is_preview = 1 AND level = 'foundation'", {});
    assert.equal(Number(prev.n), 4);
    const me = await request().get('/api/v1/me').set(bearer(token)).expect(200);
    assert.equal(me.body.progress.certifications.foundation.attemptsUsed, 4);
    assert.equal(me.body.progress.certifications.foundation.eligible, true);
  });

  test('reviewer cannot sign the acknowledgement', async () => {
    const st = await db.get('SELECT version, sha256 FROM signoff_statements WHERE active = 1', {});
    const r = await request().post('/api/v1/signoff').set(bearer(token))
      .send({ password: DEFAULT_PASSWORD, statementVersion: st.version, sha256: st.sha256.trim() }).expect(409);
    assert.equal(r.body.error.code, 'preconditions_not_met');
    assert.match(r.body.error.message, /Reviewer/);
  });

  test('dashboard, user list and exports exclude the reviewer', async () => {
    const staff = await login(STAFF);
    assert.equal(staff.user.reviewer, false);
    const admin = await login(ADMIN);
    const d = await request().get('/api/v1/admin/dashboard').set(bearer(admin.token)).expect(200);
    assert.ok(!d.body.employees.some((e) => e.email === DEFAULT_EMAIL));
    assert.equal(d.body.kpis.examAttempts || 0, 0);
    assert.equal(d.body.kpis.certified, 0);
    assert.ok(!d.body.topUsersByAccess.some((u) => u.displayName === 'Exam Reviewer'));
    assert.ok((d.body.questionStats || []).every((q) => q.attempts === 0), 'reviewer answers must not feed question statistics');
    assert.ok(d.body.employees.some((e) => e.email === STAFF));
    for (const kind of ['employees', 'users', 'attempts', 'sessions']) {
      const csv = await request().get(`/api/v1/admin/export?kind=${kind}`).set(bearer(admin.token)).expect(200);
      assert.ok(!csv.text.includes(DEFAULT_EMAIL), kind);
    }
  });

  test('normal staff are unaffected (exam still locked)', async () => {
    const staff = await login(STAFF);
    const r = await request().post('/api/v1/cert/exams').set(bearer(staff.token)).send({ level: 'foundation' }).expect(403);
    assert.equal(r.body.error.code, 'exam_locked');
    const p = await request().post('/api/v1/cert/exams').set(bearer(staff.token)).send({ level: 'advanced' }).expect(403);
    assert.equal(p.body.error.code, 'exam_locked');
    const me = await request().get('/api/v1/me').set(bearer(staff.token)).expect(200);
    assert.equal(me.body.progress.certifications.foundation.preview, undefined);
  });
});
