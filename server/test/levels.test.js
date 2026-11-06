'use strict';
/**
 * Certification paths: foundation -> practitioner -> advanced, against the real
 * front-end content (js/data synced into an in-memory database).
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

const ADMIN = 'levels.admin@gta.gov.qa';
const STAFF = 'levels.learner@gta.gov.qa';

let server;
let db;
const request = () => supertest(server);
const bearer = (token) => ({ Authorization: `Bearer ${token}` });

const { helpers, PASSWORD } = require('./authHelpers');
const { login } = helpers(() => request(), () => db);

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
      answers.push({ questionId: id, response, timeMs: 1200 });
    }
    parts.push({ roundId: p.roundId, answers });
  }
  return parts;
}

const ids = async (track) => (await db.all('SELECT id FROM content_modules WHERE active = 1 AND track = @track ORDER BY sort_order', { track })).map((r) => r.id);
const share = (list, pct) => list.slice(0, Math.ceil((list.length * pct) / 100));

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

describe('certification paths', () => {
  let token;
  let adminToken;
  let userId;
  let kbp;
  let kba;
  const complete = async (refs) => {
    for (const ref of refs) await request().post('/api/v1/events').set(bearer(token)).send({ type: 'module_complete', ref }).expect(204);
  };
  const start = (level, status) => request().post('/api/v1/cert/exams').set(bearer(token)).send(level ? { level } : {}).expect(status);
  const submit = (exam, correct) =>
    answersFor(exam, correct).then((parts) => request().post(`/api/v1/cert/exams/${exam.examId}/submit`).set(bearer(token)).send({ parts }).expect(200));

  before(async () => {
    const out = await login(STAFF);
    token = out.token;
    userId = out.user.id;
    await request().patch('/api/v1/me').set(bearer(token)).send({ displayName: 'Level Learner', department: 'Information Technology' }).expect(200);
    adminToken = (await login(ADMIN)).token;
    kbp = await ids('kbp');
    kba = await ids('kba');
  });

  test('sync: knowledge-base articles become kb:<id> modules by level; rounds carry a level', async () => {
    assert.ok(kbp.length >= 10 && kbp.every((id) => id.startsWith('kb:')));
    assert.ok(kba.length >= 5);
    const kbf = await ids('kbf');
    assert.ok(kbf.length >= 5);
    const m = await db.get("SELECT mandatory FROM content_modules WHERE id = @id", { id: kbp[0] });
    assert.equal(Number(m.mandatory), 0);
    const rounds = await db.all('SELECT id, level, questions_per_attempt FROM quiz_rounds WHERE active = 1 ORDER BY sort_order', {});
    assert.deepEqual(rounds.filter((r) => r.level === 'foundation').map((r) => r.id), ['x-ea', 'x-togaf', 'x-kb']);
    assert.deepEqual(rounds.filter((r) => r.level === 'practitioner').map((r) => [r.id, r.questions_per_attempt]), [['x-prac-a', 10], ['x-prac-b', 10]]);
    assert.deepEqual(rounds.filter((r) => r.level === 'advanced').map((r) => [r.id, r.questions_per_attempt]), [['x-adv', 15]]);
  });

  test('unknown level is a validation error', async () => {
    const r = await start('expert', 400);
    assert.equal(r.body.error.code, 'validation');
  });

  test('practitioner is locked without the foundation certificate, even with the reading done', async () => {
    await complete(share(kbp, 100));
    const r = await start('practitioner', 403);
    assert.equal(r.body.error.code, 'exam_locked');
    assert.match(r.body.error.message, /Enterprise Architecture Foundation certificate/);
    const p = await request().get('/api/v1/me/progress').set(bearer(token)).expect(200);
    const pr = p.body.certifications.practitioner;
    assert.equal(pr.prerequisiteMet, false);
    assert.equal(pr.eligible, false);
    assert.equal(pr.requires, 'foundation');
    assert.deepEqual(Object.keys(pr.track), ['kbp']);
    assert.equal(pr.track.kbp.pct, 100);
  });

  let foundationCert;
  test('earn the foundation certificate', async () => {
    await complete([...share(await ids('ea'), 100), ...share(await ids('togaf'), 100)]);
    const ex = (await start(undefined, 201)).body; // default level = foundation
    assert.equal(ex.level, 'foundation');
    const r = await submit(ex, true);
    foundationCert = r.body.certificate;
    assert.equal(foundationCert.level, 'foundation');
    assert.match(foundationCert.certificateId, /^GTA-EAF-/);
  });

  test('practitioner locked below 80% of the practitioner articles', async () => {
    // a second learner with the foundation certificate but little KB reading
    const other = await login('levels.other@gta.gov.qa');
    const t2 = other.token;
    const ev = (ref) => request().post('/api/v1/events').set(bearer(t2)).send({ type: 'module_complete', ref }).expect(204);
    for (const ref of [...(await ids('ea')), ...(await ids('togaf'))]) await ev(ref);
    const fx = (await request().post('/api/v1/cert/exams').set(bearer(t2)).send({}).expect(201)).body;
    const parts = await answersFor(fx, true);
    await request().post(`/api/v1/cert/exams/${fx.examId}/submit`).set(bearer(t2)).send({ parts }).expect(200);
    for (const ref of share(kbp, 50)) await ev(ref);
    const r = await request().post('/api/v1/cert/exams').set(bearer(t2)).send({ level: 'practitioner' }).expect(403);
    assert.equal(r.body.error.code, 'exam_locked');
    assert.match(r.body.error.message, /Practitioner knowledge-base articles/);
    const p = await request().get('/api/v1/me/progress').set(bearer(t2)).expect(200);
    assert.equal(p.body.certifications.practitioner.prerequisiteMet, true);
    assert.equal(p.body.certifications.practitioner.eligible, false);
  });

  let prac1;
  test('practitioner exam: sampled 10 + 10, attempts counted per level', async () => {
    const p0 = await request().get('/api/v1/me/progress').set(bearer(token)).expect(200);
    assert.equal(p0.body.certifications.practitioner.eligible, true);
    prac1 = (await start('practitioner', 201)).body;
    assert.equal(prac1.level, 'practitioner');
    assert.equal(prac1.attemptNo, 1, 'practitioner attempts are separate from foundation');
    assert.equal(prac1.maxAttempts, 3);
    assert.deepEqual(prac1.parts.map((p) => [p.roundId, p.questionIds.length]), [['x-prac-a', 10], ['x-prac-b', 10]]);
    const again = (await start('practitioner', 200)).body;
    assert.equal(again.examId, prac1.examId);
    assert.equal(again.resumed, true);
    // advanced is locked (no practitioner certificate yet)
    const adv = await start('advanced', 403);
    assert.match(adv.body.error.message, /Enterprise Architecture Practitioner certificate/);

    const r = await submit(prac1, false);
    assert.equal(r.body.level, 'practitioner');
    assert.equal(r.body.passed, false);
    assert.equal(r.body.attemptsLeft, 2);
    const p = await request().get('/api/v1/me/progress').set(bearer(token)).expect(200);
    assert.equal(p.body.certifications.foundation.attemptsUsed, 1);
    assert.equal(p.body.certifications.practitioner.attemptsUsed, 1);
    assert.equal(p.body.certification.attemptsUsed, 1, 'legacy certification = foundation');
  });

  test('grants are per level', async () => {
    const r = await request().post(`/api/v1/admin/users/${userId}/cert-attempts`).set(bearer(adminToken)).send({ extra: 1, level: 'practitioner' }).expect(200);
    assert.deepEqual(r.body, { level: 'practitioner', attemptsUsed: 1, maxAttempts: 4 });
    const p = await request().get('/api/v1/me/progress').set(bearer(token)).expect(200);
    assert.equal(p.body.certifications.foundation.maxAttempts, 3);
    assert.equal(p.body.certifications.practitioner.maxAttempts, 4);
    const bad = await request().post(`/api/v1/admin/users/${userId}/cert-attempts`).set(bearer(adminToken)).send({ extra: 1, level: 'nope' }).expect(400);
    assert.equal(bad.body.error.code, 'validation');
  });

  let pracCert;
  test('passing practitioner issues a GTA-EAP certificate; verify returns level and title', async () => {
    const ex = (await start('practitioner', 201)).body;
    assert.equal(ex.attemptNo, 2);
    const r = await submit(ex, true);
    pracCert = r.body.certificate;
    assert.equal(pracCert.level, 'practitioner');
    assert.equal(pracCert.title, 'Enterprise Architecture Practitioner');
    assert.match(pracCert.certificateId, /^GTA-EAP-\d{4}-[2-9A-HJKMNP-TV-Z]{6}$/);
    const v = await request().get(`/api/v1/cert/verify/${pracCert.certificateId}`).expect(200);
    assert.deepEqual(v.body, { valid: true, ...pracCert });
    const vf = await request().get(`/api/v1/cert/verify/${foundationCert.certificateId}`).expect(200);
    assert.equal(vf.body.level, 'foundation');
    assert.equal(vf.body.title, 'Enterprise Architecture Foundation');
    const mail = await db.all("SELECT payload FROM email_outbox WHERE template = 'certificate_issued' AND to_email = @e", { e: STAFF });
    assert.ok(mail.some((m) => JSON.parse(m.payload).title === 'Enterprise Architecture Practitioner'));
    const dup = await start('practitioner', 409);
    assert.equal(dup.body.error.code, 'already_certified');
    const n = await db.get('SELECT COUNT(*) AS n FROM certificates WHERE user_id = @u', { u: userId });
    assert.equal(Number(n.n), 2, 'one certificate per level');
  });

  test('advanced: locked below 80% of advanced articles, then 15 questions and a GTA-EAA certificate', async () => {
    let r = await start('advanced', 403);
    assert.match(r.body.error.message, /Advanced knowledge-base articles/);
    await complete(share(kba, 80));
    const ex = (await start('advanced', 201)).body;
    assert.deepEqual(ex.parts.map((p) => [p.roundId, p.questionIds.length]), [['x-adv', 15]]);
    r = await submit(ex, true);
    assert.equal(r.body.certificate.level, 'advanced');
    assert.match(r.body.certificate.certificateId, /^GTA-EAA-/);
    const all = await request().get('/api/v1/cert').set(bearer(token)).expect(200);
    assert.deepEqual(Object.keys(all.body.levels), ['foundation', 'practitioner', 'advanced']);
    assert.ok(Object.values(all.body.levels).every((l) => l.certificate));
  });

  test('sign-off needs only the foundation certificate', async () => {
    const other = await login('levels.other@gta.gov.qa'); // foundation only
    const st = await request().get('/api/v1/signoff/statement').set(bearer(other.token)).expect(200);
    await request().post('/api/v1/signoff').set(bearer(other.token)).send({ password: PASSWORD, statementVersion: st.body.version, sha256: st.body.sha256 }).expect(201);
  });

  test('dashboard and export carry the per-level data', async () => {
    const d = (await request().get('/api/v1/admin/dashboard').set(bearer(adminToken)).expect(200)).body;
    assert.deepEqual(d.kpis.certifiedByLevel, { foundation: 2, practitioner: 1, advanced: 1 });
    assert.deepEqual(d.levels.map((l) => [l.level, l.certified]), [['foundation', 2], ['practitioner', 1], ['advanced', 1]]);
    assert.deepEqual(Object.keys(d.levels[0]).sort(), ['attempts', 'certified', 'level', 'title', 'unlocked']);
    assert.equal(d.levels[1].attempts, 2);
    assert.deepEqual(Object.keys(d.topScorersByLevel), ['foundation', 'practitioner', 'advanced']);
    assert.equal(d.topScorersByLevel.practitioner[0].userId, userId);
    assert.equal(d.topScorersByLevel.practitioner[0].attempts, 2);
    const e = d.employees.find((x) => x.userId === userId);
    assert.equal(e.kbpPct, 100);
    assert.equal(e.kbaPct, Math.round((1000 * share(kba, 80).length) / kba.length) / 10);
    assert.deepEqual(e.levels.practitioner, { certified: true, certificateId: pracCert.certificateId, bestPct: 100, attempts: 2, maxAttempts: 4, eligible: true });
    assert.equal(e.levels.advanced.certified, true);
    assert.equal(e.certificateId, foundationCert.certificateId, 'legacy fields = foundation');
    assert.ok(!d.moduleViews.some((m) => String(m.moduleId).startsWith('kb:')), 'KB articles are not charted as modules');

    const csv = await request().get('/api/v1/admin/export?kind=employees').set(bearer(adminToken)).expect(200);
    const head = csv.text.replace(/^﻿/, '').split('\n')[0];
    assert.match(head, /practitioner_certified,practitioner_best_pct,practitioner_attempts,advanced_certified,advanced_best_pct,advanced_attempts/);
  });
});
