'use strict';
/**
 * Foundation certification track, against the real front-end content
 * (synced from js/data into an in-memory database).
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

const ADMIN = 'cert.admin@gta.gov.qa';
const STAFF = 'cert.learner@gta.gov.qa';

let server;
let db;
const request = () => supertest(server);
const bearer = (token) => ({ Authorization: `Bearer ${token}` });

const { helpers, PASSWORD } = require('./authHelpers');
const { login } = helpers(() => request(), () => db);

/** Answers for an issued exam; `correct` decides right/wrong for every question. */
async function answersFor(exam, correct) {
  const parts = [];
  for (const p of exam.parts) {
    const answers = [];
    for (const id of p.questionIds) {
      const q = await db.get('SELECT type, answer_key FROM questions WHERE id = @id', { id });
      const k = JSON.parse(q.answer_key);
      let response;
      if (correct) response = q.type === 'match' ? k.pairs : q.type === 'order' || q.type === 'categorize' ? k.items : k.answer;
      else if (q.type === 'mcq') response = (k.answer + 1) % 2;
      else if (q.type === 'truefalse') response = !k.answer;
      else response = [];
      answers.push({ questionId: id, response, timeMs: 1500 });
    }
    parts.push({ roundId: p.roundId, answers });
  }
  return parts;
}

async function complete(token, refs) {
  for (const ref of refs) await request().post('/api/v1/events').set(bearer(token)).send({ type: 'module_complete', ref }).expect(204);
}

before(async () => {
  const config = loadConfig({
    NODE_ENV: 'test',
    SQLITE_PATH: ':memory:',
    JWT_SECRET: crypto.randomBytes(32).toString('hex'),
    ADMIN_EMAILS: ADMIN,
    STATIC_DIR: '',
    RATE_LIMIT_AUTH: '1000',
    LOG_LEVEL: 'silent',
  });
  db = await createDb(config);
  await db.migrate();
  await sync(db);
  const app = createApp({ config, db, log: createLogger('silent') });
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
  await db.close();
});

describe('certification', () => {
  let token;
  let adminToken;
  let userId;
  let eaIds;
  let togafIds;

  before(async () => {
    const out = await login(STAFF);
    token = out.token;
    userId = out.user.id;
    await request().patch('/api/v1/me').set(bearer(token)).send({ displayName: 'Cert Learner', department: 'Information Technology' }).expect(200);
    adminToken = (await login(ADMIN)).token;
    eaIds = (await db.all("SELECT id FROM content_modules WHERE active = 1 AND track = 'ea' ORDER BY sort_order", {})).map((r) => r.id);
    togafIds = (await db.all("SELECT id FROM content_modules WHERE active = 1 AND track = 'togaf' ORDER BY sort_order", {})).map((r) => r.id);
  });

  test('content sync: 11 EA modules, 11 TOGAF topics, 3 exam parts', async () => {
    assert.equal(eaIds.length, 11);
    assert.equal(togafIds.length, 11);
    assert.ok(togafIds.every((id) => id.startsWith('togaf:t-')));
    const virt = await db.get("SELECT active FROM content_modules WHERE id = 'togaf'", {});
    assert.ok(!virt || virt.active === 0);
    const rounds = await db.all("SELECT id, questions_per_attempt FROM quiz_rounds WHERE active = 1 AND level = 'foundation' ORDER BY sort_order", {});
    assert.deepEqual(rounds.map((r) => [r.id, r.questions_per_attempt]), [['x-ea', 14], ['x-togaf', 10], ['x-kb', 10]]);
  });

  test('exam is locked until 80% of each track is complete', async () => {
    let r = await request().post('/api/v1/cert/exams').set(bearer(token)).expect(403);
    assert.equal(r.body.error.code, 'exam_locked');

    await complete(token, eaIds.slice(0, 9)); // 81.8%
    await complete(token, togafIds.slice(0, 8)); // 72.7%
    r = await request().post('/api/v1/cert/exams').set(bearer(token)).expect(403);
    assert.equal(r.body.error.code, 'exam_locked');
    assert.match(r.body.error.message, /8\/11 TOGAF topics/);

    const p = await request().get('/api/v1/me/progress').set(bearer(token)).expect(200);
    const c = p.body.certification;
    assert.equal(c.eligible, false);
    assert.deepEqual(c.track.ea, { done: 9, total: 11, pct: 81.8 });
    assert.deepEqual(c.track.togaf, { done: 8, total: 11, pct: 72.7 });
    assert.equal(c.unlockPct, 80);
    assert.equal(c.passPct, 70);
  });

  let exam1;
  test('start issues a sampled set (14/10/10); calling again resumes the same exam', async () => {
    await complete(token, [togafIds[8]]); // 9/11
    const r = await request().post('/api/v1/cert/exams').set(bearer(token)).expect(201);
    exam1 = r.body;
    assert.equal(exam1.attemptNo, 1);
    assert.equal(exam1.maxAttempts, 3);
    assert.equal(exam1.attemptsLeft, 2);
    assert.deepEqual(exam1.parts.map((p) => [p.roundId, p.questionIds.length]), [['x-ea', 14], ['x-togaf', 10], ['x-kb', 10]]);
    assert.equal(new Set(exam1.parts.flatMap((p) => p.questionIds)).size, 34);

    const again = await request().post('/api/v1/cert/exams').set(bearer(token)).expect(200);
    assert.equal(again.body.examId, exam1.examId);
    assert.equal(again.body.resumed, true);
    assert.deepEqual(again.body.parts, exam1.parts);

    const p = await request().get('/api/v1/me/progress').set(bearer(token)).expect(200);
    assert.equal(p.body.certification.inProgress.examId, exam1.examId);
    assert.equal(p.body.certification.attemptsUsed, 1);
    assert.equal(p.body.certification.eligible, true);
  });

  test('submit must answer exactly the issued questions', async () => {
    const parts = await answersFor(exam1, true);
    const issued = new Set(exam1.parts.flatMap((p) => p.questionIds));
    const other = (await db.all("SELECT id FROM questions WHERE round_id = 'x-ea' AND active = 1", {})).map((q) => q.id).find((id) => !issued.has(id));
    const swapped = JSON.parse(JSON.stringify(parts));
    swapped[0].answers[0].questionId = other;
    let r = await request().post(`/api/v1/cert/exams/${exam1.examId}/submit`).set(bearer(token)).send({ parts: swapped }).expect(400);
    assert.equal(r.body.error.code, 'validation');
    assert.match(r.body.error.message, new RegExp(other));

    r = await request().post(`/api/v1/cert/exams/${exam1.examId}/submit`).set(bearer(token)).send({ parts: parts.slice(0, 2) }).expect(400);
    assert.equal(r.body.error.code, 'validation');
    const short = JSON.parse(JSON.stringify(parts));
    short[1].answers.pop();
    r = await request().post(`/api/v1/cert/exams/${exam1.examId}/submit`).set(bearer(token)).send({ parts: short }).expect(400);
    assert.equal(r.body.error.code, 'validation');
    r = await request().post(`/api/v1/cert/exams/${crypto.randomUUID()}/submit`).set(bearer(token)).send({ parts }).expect(404);
    assert.equal(r.body.error.code, 'not_found');
  });

  test('failed attempt decrements attemptsLeft; resubmitting is refused', async () => {
    const r = await request().post(`/api/v1/cert/exams/${exam1.examId}/submit`).set(bearer(token))
      .send({ completedAt: new Date().toISOString(), parts: await answersFor(exam1, false) })
      .expect(200);
    assert.equal(r.body.passed, false);
    assert.equal(r.body.score, 0);
    assert.equal(r.body.attemptsLeft, 2);
    assert.equal(r.body.certificate, null);
    assert.deepEqual(r.body.parts.map((p) => p.roundId), ['x-ea', 'x-togaf', 'x-kb']);
    const rows = await db.all('SELECT round_id FROM quiz_attempts WHERE cert_exam_id = @id', { id: exam1.examId });
    assert.equal(rows.length, 3);

    const again = await request().post(`/api/v1/cert/exams/${exam1.examId}/submit`).set(bearer(token)).send({ parts: await answersFor(exam1, true) }).expect(409);
    assert.equal(again.body.error.code, 'exam_closed');
  });

  test('three failed sittings exhaust the attempts', async () => {
    for (const n of [2, 3]) {
      const s = await request().post('/api/v1/cert/exams').set(bearer(token)).expect(201);
      assert.equal(s.body.attemptNo, n);
      const r = await request().post(`/api/v1/cert/exams/${s.body.examId}/submit`).set(bearer(token)).send({ parts: await answersFor(s.body, false) }).expect(200);
      assert.equal(r.body.attemptsLeft, 3 - n);
    }
    const r = await request().post('/api/v1/cert/exams').set(bearer(token)).expect(403);
    assert.equal(r.body.error.code, 'attempts_exhausted');
    const p = await request().get('/api/v1/me/progress').set(bearer(token)).expect(200);
    assert.equal(p.body.certification.exams.length, 3);
    assert.equal(p.body.certification.exams[0].attemptNo, 3, 'newest first');
  });

  test('admins can grant an extra attempt (staff cannot)', async () => {
    let r = await request().post(`/api/v1/admin/users/${userId}/cert-attempts`).set(bearer(token)).send({ extra: 1 }).expect(403);
    assert.equal(r.body.error.code, 'forbidden');
    r = await request().post(`/api/v1/admin/users/${userId}/cert-attempts`).set(bearer(adminToken)).send({ extra: 9 }).expect(400);
    assert.equal(r.body.error.code, 'validation');
    r = await request().post(`/api/v1/admin/users/${userId}/cert-attempts`).set(bearer(adminToken)).send({ extra: 1, note: 'Requested by manager' }).expect(200);
    assert.deepEqual(r.body, { level: 'foundation', attemptsUsed: 3, maxAttempts: 4 });
    const a = await db.get("SELECT * FROM audit_log WHERE action = 'cert.grant_attempts'", {});
    assert.ok(a);
  });

  let cert;
  test('passing issues a certificate, e-mails it and blocks further sittings', async () => {
    const s = await request().post('/api/v1/cert/exams').set(bearer(token)).expect(201);
    assert.equal(s.body.attemptNo, 4);
    const r = await request().post(`/api/v1/cert/exams/${s.body.examId}/submit`).set(bearer(token)).send({ parts: await answersFor(s.body, true) }).expect(200);
    assert.equal(r.body.passed, true);
    assert.equal(r.body.pct, 100);
    assert.equal(r.body.score, r.body.maxScore);
    cert = r.body.certificate;
    assert.match(cert.certificateId, /^GTA-EAF-\d{4}-[2-9A-HJKMNP-TV-Z]{6}$/);
    assert.equal(cert.displayName, 'Cert Learner');
    assert.equal(cert.department, 'Information Technology');
    assert.equal(cert.scorePct, 100);

    const mail = await db.get("SELECT payload FROM email_outbox WHERE template = 'certificate_issued' AND to_email = @e", { e: STAFF });
    assert.equal(JSON.parse(mail.payload).certificateId, cert.certificateId);

    const again = await request().post('/api/v1/cert/exams').set(bearer(token)).expect(409);
    assert.equal(again.body.error.code, 'already_certified');

    const p = await request().get('/api/v1/me/progress').set(bearer(token)).expect(200);
    assert.deepEqual(p.body.certification.certificate, cert);
    assert.equal(p.body.certification.inProgress, null);
  });

  test('verification endpoint is public', async () => {
    const r = await request().get(`/api/v1/cert/verify/${cert.certificateId.toLowerCase()}`).expect(200);
    assert.deepEqual(r.body, { valid: true, ...cert });
    const bad = await request().get('/api/v1/cert/verify/GTA-EAF-2026-NOPE99').expect(404);
    assert.deepEqual(bad.body, { valid: false });
  });

  test('sign-off (confirmed with the password) succeeds once certified', async () => {
    const st = await request().get('/api/v1/signoff/statement').set(bearer(token)).expect(200);
    await request().post('/api/v1/signoff').set(bearer(token)).send({ password: PASSWORD, statementVersion: st.body.version, sha256: st.body.sha256 }).expect(201);
  });

  test('dashboard: access, top scorers and per-employee progress', async () => {
    const r = await request().get('/api/v1/admin/dashboard').set(bearer(adminToken)).expect(200);
    const d = r.body;
    assert.equal(d.kpis.certified, 1);
    assert.equal(d.kpis.examAttempts, 4);
    assert.equal(d.funnel.certified, 1);
    assert.equal(d.funnel.examUnlocked, 1);
    const it = d.deptAccess.find((x) => x.department === 'Information Technology');
    assert.deepEqual({ users: it.users, active: it.activeUsers, certified: it.certified }, { users: 1, active: 1, certified: 1 });
    assert.ok(it.logins >= 1);
    assert.deepEqual(Object.keys(it).sort(), ['activeUsers', 'certified', 'department', 'logins', 'minutes', 'users']);
    for (let i = 1; i < d.deptAccess.length; i++) assert.ok(d.deptAccess[i - 1].logins >= d.deptAccess[i].logins, 'sorted by logins');
    assert.deepEqual(Object.keys(d.topUsersByAccess[0]).sort(), ['department', 'displayName', 'lastSeenAt', 'logins', 'minutes', 'userId']);
    assert.deepEqual(d.topScorers[0], {
      userId,
      displayName: 'Cert Learner',
      department: 'Information Technology',
      bestPct: 100,
      attempts: 4,
      certified: true,
      certifiedAt: cert.issuedAt,
    });
    const e = d.employees.find((x) => x.userId === userId);
    assert.deepEqual(
      { ea: e.eaPct, togaf: e.togafPct, attempts: e.examAttempts, best: e.bestPct, certified: e.certified, id: e.certificateId, signed: e.signed },
      { ea: 81.8, togaf: 81.8, attempts: 4, best: 100, certified: true, id: cert.certificateId, signed: true },
    );
    assert.ok(e.logins >= 1 && e.lastSeenAt);
    assert.deepEqual(d.scoreDistribution.find((b) => b.bucket === '90-100').count, 1);

    const csv = await request().get('/api/v1/admin/export?kind=employees').set(bearer(adminToken)).expect(200);
    assert.match(csv.text.split('\n')[0], /^\uFEFF?user_id,email,display_name,department,ea_pct,togaf_pct,kb_read,exam_attempts,best_pct,certified,certificate_id,signed,logins,minutes,last_seen_at/);
    assert.match(csv.text, new RegExp(cert.certificateId));

    const users = await request().get('/api/v1/admin/users?status=certified').set(bearer(adminToken)).expect(200);
    assert.equal(users.body.length, 1);
  });
});
