'use strict';
/**
 * Certification paths: foundation -> practitioner -> advanced (config.certLevels).
 *
 *  - Eligibility per level: the prerequisite level's certificate is held AND
 *    completed modules >= CERT_UNLOCK_PCT of every track of the level
 *    (content_modules.track; foundation = 'ea' + 'togaf', practitioner = 'kbp',
 *    advanced = 'kba'), measured from module_complete events.
 *  - Attempts: CERT_MAX_ATTEMPTS sittings per level (+ admin grants for that
 *    level). Starting a sitting consumes an attempt; an unfinished sitting is
 *    resumed, never re-issued.
 *  - The server issues the question set (random sample of
 *    quiz_rounds.questions_per_attempt per active round of the level) and only
 *    accepts answers for exactly that set. Scoring uses the server answer key.
 *  - Pass: overall score >= CERT_PASS_PCT -> certificate (one per user per level).
 */
const crypto = require('crypto');
const { err } = require('../lib/errors');
const { scoreAnswer } = require('../lib/scoring');
const { enqueue } = require('../mail/outbox');
const { audit } = require('./audit');
const { isReviewerEmail } = require('./users');

/* Exam reviewers (REVIEWER_EMAILS): every level unlocked, unlimited preview
   sittings (config.reviewerMaxAttempts), never certified, excluded from reporting. */
const reviewerMax = (config) => Number(config.reviewerMaxAttempts || 99);
async function isReviewerId(db, config, userId) {
  if (!config || !Array.isArray(config.reviewerEmails) || !config.reviewerEmails.length) return false;
  const u = await db.get('SELECT email FROM users WHERE id = @id', { id: userId });
  return Boolean(u && isReviewerEmail(config, u.email));
}

const ID_CHARS = '23456789ABCDEFGHJKMNPQRSTVWXYZ'; // no 0/O, 1/I/L, U
const round1 = (n) => Math.round(n * 10) / 10;
const json = (v, d) => {
  if (v === null || v === undefined) return d;
  if (typeof v === 'object') return v;
  try {
    return JSON.parse(v);
  } catch (_) {
    return d;
  }
};
const iso = (v) => (v === null || v === undefined ? null : v instanceof Date ? v.toISOString() : String(v));

function newCertificateId(prefix, now) {
  let s = '';
  for (let i = 0; i < 6; i++) s += ID_CHARS[crypto.randomInt(ID_CHARS.length)];
  return `${prefix}-${now.getUTCFullYear()}-${s}`;
}

function shuffle(a) {
  const out = [...a];
  for (let i = out.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const DEFAULT_LEVELS = [
  { id: 'foundation', title: 'Enterprise Architecture Foundation', prefix: 'GTA-EAF', requires: null, tracks: ['ea', 'togaf'] },
  { id: 'practitioner', title: 'Enterprise Architecture Practitioner', prefix: 'GTA-EAP', requires: 'foundation', tracks: ['kbp'] },
  { id: 'advanced', title: 'Enterprise Architecture Advanced', prefix: 'GTA-EAA', requires: 'practitioner', tracks: ['kba'] },
];
const ALL_TRACKS = ['ea', 'togaf', 'kbf', 'kbp', 'kba'];

function levelsOf(config) {
  const lv = (config.certLevels && config.certLevels.length ? config.certLevels : DEFAULT_LEVELS).map((l) => ({ ...l }));
  const f = lv.find((l) => l.id === 'foundation');
  if (f && config.certPrefix) f.prefix = config.certPrefix;
  return lv;
}

function levelOf(config, level) {
  const id = level === undefined || level === null || level === '' ? 'foundation' : String(level);
  const l = levelsOf(config).find((x) => x.id === id);
  if (!l) throw err('validation', `Unknown certification level "${id}"`);
  return l;
}

const settings = (config) => ({
  unlockPct: Number(config.certUnlockPct ?? 80),
  passPct: Number(config.certPassPct ?? 70),
  maxAttempts: Number(config.certMaxAttempts ?? 3),
  prefix: config.certPrefix || 'GTA-EAF',
});

/** Track completion for one user: { ea, togaf, kbf, kbp, kba: {done,total,pct} }. An empty track counts as 100%. */
async function trackProgress(db, userId) {
  const modules = await db.all('SELECT id, track FROM content_modules WHERE active = 1', {});
  const done = new Set(
    (await db.all("SELECT DISTINCT ref FROM events WHERE user_id = @userId AND type = 'module_complete' AND ref IS NOT NULL", { userId })).map((r) => r.ref),
  );
  return computeTracks(modules, done);
}

function computeTracks(modules, doneSet) {
  const t = {};
  for (const k of ALL_TRACKS) t[k] = { done: 0, total: 0 };
  for (const m of modules) {
    const k = t[m.track] ? m.track : 'ea';
    t[k].total++;
    if (doneSet.has(m.id)) t[k].done++;
  }
  for (const k of Object.keys(t)) t[k].pct = t[k].total ? round1((100 * t[k].done) / t[k].total) : 100;
  return t;
}

const meets = (tr, unlockPct) => !tr || tr.total === 0 || tr.done * 100 >= unlockPct * tr.total;
/** Track condition only (prerequisite certificate checked separately). Default tracks = foundation's. */
const isEligible = (tracks, unlockPct, trackIds = ['ea', 'togaf']) => trackIds.every((k) => meets(tracks[k], unlockPct));
const pickTracks = (tracks, ids) => Object.fromEntries(ids.map((k) => [k, tracks[k] || { done: 0, total: 0, pct: 100 }]));

async function allowedAttempts(db, config, userId, level = 'foundation') {
  const g = await db.get('SELECT COALESCE(SUM(extra), 0) AS n FROM cert_attempt_grants WHERE user_id = @userId AND level = @level', { userId, level });
  return settings(config).maxAttempts + (Number(g && g.n) || 0);
}

async function attemptsUsed(db, userId, level = 'foundation') {
  const r = await db.get('SELECT COUNT(*) AS n FROM cert_exams WHERE user_id = @userId AND level = @level', { userId, level });
  return Number(r && r.n) || 0;
}

function certificateDto(c, config) {
  if (!c) return null;
  const lv = (config ? levelsOf(config) : DEFAULT_LEVELS).find((l) => l.id === (c.level || 'foundation')) || DEFAULT_LEVELS[0];
  return {
    certificateId: c.certificate_id,
    level: c.level || 'foundation',
    title: lv.title,
    issuedAt: iso(c.issued_at),
    scorePct: round1(Number(c.score_pct)),
    displayName: c.display_name,
    department: c.department || null,
  };
}

async function getCertificate(db, userId, level = 'foundation') {
  return db.get('SELECT * FROM certificates WHERE user_id = @userId AND level = @level AND revoked_at IS NULL', { userId, level });
}

function partsOf(questionSet) {
  return Object.entries(json(questionSet, {})).map(([roundId, questionIds]) => ({ roundId, questionIds }));
}

function examDto(x) {
  return {
    examId: x.id,
    attemptNo: Number(x.attempt_no),
    startedAt: iso(x.started_at),
    completedAt: iso(x.completed_at),
    score: x.score === null ? null : Number(x.score),
    maxScore: x.max_score === null ? null : Number(x.max_score),
    pct: x.pct === null ? null : round1(Number(x.pct)),
    passed: Boolean(x.passed),
    parts: json(x.parts, []),
  };
}

/** Status of one level (progress.certifications[level]; progress.certification = foundation). */
async function certificationStatus(db, config, userId, level = 'foundation', _tracks) {
  const s = settings(config);
  const lv = levelOf(config, level);
  const tracks = _tracks || (await trackProgress(db, userId));
  const exams = await db.all(
    'SELECT * FROM cert_exams WHERE user_id = @userId AND level = @level ORDER BY attempt_no DESC',
    { userId, level: lv.id },
  );
  const open = exams.find((x) => x.status === 'in_progress');
  if (await isReviewerId(db, config, userId)) {
    return {
      level: lv.id, title: lv.title, requires: lv.requires, prerequisiteMet: true,
      unlockPct: s.unlockPct, passPct: s.passPct, maxAttempts: reviewerMax(config), attemptsUsed: exams.length, eligible: true,
      track: pickTracks(tracks, lv.tracks),
      inProgress: open ? { examId: open.id, attemptNo: Number(open.attempt_no), startedAt: iso(open.started_at), parts: partsOf(open.question_set) } : null,
      exams: exams.filter((x) => x.status === 'completed').map(examDto),
      certificate: null,
      preview: true,
    };
  }
  const prerequisiteMet = !lv.requires || Boolean(await getCertificate(db, userId, lv.requires));
  const base = {
    unlockPct: s.unlockPct,
    passPct: s.passPct,
    maxAttempts: await allowedAttempts(db, config, userId, lv.id),
    attemptsUsed: exams.length,
    eligible: prerequisiteMet && isEligible(tracks, s.unlockPct, lv.tracks),
    track: pickTracks(tracks, lv.tracks),
    inProgress: open
      ? { examId: open.id, attemptNo: Number(open.attempt_no), startedAt: iso(open.started_at), parts: partsOf(open.question_set) }
      : null,
    exams: exams.filter((x) => x.status === 'completed').map(examDto),
    certificate: certificateDto(await getCertificate(db, userId, lv.id), config),
  };
  return { level: lv.id, title: lv.title, requires: lv.requires, prerequisiteMet, ...base };
}

/** All levels: { foundation, practitioner, advanced } */
async function allCertifications(db, config, userId) {
  const tracks = await trackProgress(db, userId);
  const out = {};
  for (const lv of levelsOf(config)) out[lv.id] = await certificationStatus(db, config, userId, lv.id, tracks);
  return out;
}

const TRACK_NAMES = { ea: 'EA Foundation modules', togaf: 'TOGAF topics', kbf: 'Foundation knowledge-base articles', kbp: 'Practitioner knowledge-base articles', kba: 'Advanced knowledge-base articles' };
function lockedMessage(tracks, unlockPct, lv) {
  const parts = lv.tracks.map((k) => `${tracks[k] ? tracks[k].done : 0}/${tracks[k] ? tracks[k].total : 0} ${TRACK_NAMES[k] || k}`);
  return (
    `The ${lv.title} exam unlocks when at least ${unlockPct}% of the ${lv.tracks.map((k) => TRACK_NAMES[k] || k).join(' and ')} are marked complete ` +
    `(you have ${parts.join(' and ')}).`
  );
}

/** POST /cert/exams -> { status: 200|201, body } */
async function startExam(db, config, user, level) {
  const s = settings(config);
  const lv = levelOf(config, level);
  const preview = isReviewerEmail(config, user.email);
  return db.tx(async (t) => {
    if (!preview && (await getCertificate(t, user.id, lv.id))) throw err('already_certified', `You already hold the ${lv.title} certificate.`);
    const max = preview ? reviewerMax(config) : await allowedAttempts(t, config, user.id, lv.id);
    const used = await attemptsUsed(t, user.id, lv.id);
    const open = await t.get("SELECT * FROM cert_exams WHERE user_id = @userId AND level = @level AND status = 'in_progress'", { userId: user.id, level: lv.id });
    if (open) {
      return {
        status: 200,
        body: {
          examId: open.id,
          attemptNo: Number(open.attempt_no),
          maxAttempts: max,
          attemptsLeft: Math.max(0, max - used),
          startedAt: iso(open.started_at),
          parts: partsOf(open.question_set),
          level: lv.id,
          resumed: true,
          ...(preview ? { preview: true } : {}),
        },
      };
    }
    if (!preview && lv.requires && !(await getCertificate(t, user.id, lv.requires))) {
      const req = levelOf(config, lv.requires);
      throw err('exam_locked', `The ${lv.title} exam requires the ${req.title} certificate first.`);
    }
    const tracks = await trackProgress(t, user.id);
    if (!preview && !isEligible(tracks, s.unlockPct, lv.tracks)) throw err('exam_locked', lockedMessage(tracks, s.unlockPct, lv));
    if (used >= max) {
      throw err('attempts_exhausted', `You have used all ${max} exam attempts. Contact the EA team to request another attempt.`);
    }

    const rounds = await t.all(
      'SELECT id, questions_per_attempt FROM quiz_rounds WHERE active = 1 AND level = @level ORDER BY sort_order, id',
      { level: lv.id },
    );
    const set = {};
    for (const r of rounds) {
      const ids = (await t.all('SELECT id FROM questions WHERE round_id = @roundId AND active = 1', { roundId: r.id })).map((q) => q.id);
      if (!ids.length) continue;
      const n = r.questions_per_attempt ? Math.min(Number(r.questions_per_attempt), ids.length) : ids.length;
      set[r.id] = shuffle(ids).slice(0, n);
    }
    if (!Object.keys(set).length) throw err('exam_locked', `The ${lv.title} exam is not configured yet.`);

    const id = crypto.randomUUID();
    const startedAt = new Date();
    await t.insert('cert_exams', {
      id,
      user_id: user.id,
      level: lv.id,
      attempt_no: used + 1,
      status: 'in_progress',
      question_set: JSON.stringify(set),
      started_at: startedAt,
      is_preview: preview ? 1 : 0,
    });
    await audit(t, { actorUserId: user.id, action: 'cert.exam_start', entity: 'cert_exam', entityId: id, detail: { level: lv.id, attemptNo: used + 1, preview } });
    return {
      status: 201,
      body: {
        examId: id,
        attemptNo: used + 1,
        maxAttempts: max,
        attemptsLeft: max - used - 1,
        startedAt: startedAt.toISOString(),
        parts: partsOf(set),
        level: lv.id,
        resumed: false,
        ...(preview ? { preview: true } : {}),
      },
    };
  });
}

/** POST /cert/exams/:examId/submit */
async function submitExam(db, config, { user, sessionId, ip }, examId, body) {
  const s = settings(config);
  if (!body || typeof body !== 'object' || !Array.isArray(body.parts)) throw err('validation', 'parts must be an array');
  let completedAt = new Date();
  if (body.completedAt !== undefined) {
    if (typeof body.completedAt !== 'string' || Number.isNaN(Date.parse(body.completedAt))) {
      throw err('validation', 'completedAt must be an ISO-8601 timestamp');
    }
    completedAt = new Date(body.completedAt);
    if (completedAt.getTime() > Date.now() + 5 * 60 * 1000) throw err('validation', 'completedAt is in the future');
  }

  const exam = await db.get('SELECT * FROM cert_exams WHERE id = @id AND user_id = @userId', { id: String(examId), userId: user.id });
  if (!exam) throw err('not_found', 'Exam not found', 404);
  if (exam.status !== 'in_progress') throw err('exam_closed', 'This exam attempt has already been submitted.');
  const lv = levelOf(config, exam.level || 'foundation');
  const preview = Boolean(Number(exam.is_preview)) || isReviewerEmail(config, user.email);
  const startedAt = new Date(iso(exam.started_at));
  if (completedAt < startedAt) completedAt = new Date();

  // Answers must cover exactly the issued question set.
  const issued = json(exam.question_set, {});
  const byRound = new Map();
  for (const p of body.parts) {
    if (!p || typeof p.roundId !== 'string' || !Array.isArray(p.answers)) throw err('validation', 'each part needs roundId and answers[]');
    if (!issued[p.roundId]) throw err('validation', `Round "${p.roundId}" is not part of this exam`);
    if (byRound.has(p.roundId)) throw err('validation', `Duplicate part "${p.roundId}"`);
    byRound.set(p.roundId, p.answers);
  }
  for (const [roundId, ids] of Object.entries(issued)) {
    const answers = byRound.get(roundId);
    if (!answers) throw err('validation', `Missing answers for part "${roundId}"`);
    const want = new Set(ids);
    const seen = new Set();
    for (const a of answers) {
      if (!a || typeof a.questionId !== 'string') throw err('validation', 'each answer needs a questionId');
      if (!want.has(a.questionId)) throw err('validation', `Question "${a.questionId}" was not issued in part "${roundId}"`);
      if (seen.has(a.questionId)) throw err('validation', `Duplicate answer for question "${a.questionId}"`);
      if (a.response === undefined) throw err('validation', `Missing response for question "${a.questionId}"`);
      if (JSON.stringify(a.response).length > 8000) throw err('validation', `Response too large for question "${a.questionId}"`);
      if (a.timeMs !== undefined && a.timeMs !== null && (!Number.isInteger(a.timeMs) || a.timeMs < 0 || a.timeMs > 86_400_000)) {
        throw err('validation', `timeMs must be a non-negative integer (question "${a.questionId}")`);
      }
      seen.add(a.questionId);
    }
    if (seen.size !== want.size) throw err('validation', `Part "${roundId}" requires ${want.size} answers, got ${seen.size}`);
  }

  // Score each part against the server answer key.
  const parts = [];
  for (const [roundId, ids] of Object.entries(issued)) {
    const qs = new Map(
      (await db.all('SELECT id, type, points, answer_key FROM questions WHERE round_id = @roundId', { roundId })).map((q) => [q.id, q]),
    );
    const scored = byRound.get(roundId).map((a) => {
      const q = qs.get(a.questionId);
      if (!q) throw err('validation', `Unknown question "${a.questionId}"`);
      const { correct, points } = scoreAnswer(q, a.response);
      return {
        questionId: q.id,
        response: JSON.stringify(a.response),
        correct,
        points,
        maxPoints: Number(q.points),
        timeMs: a.timeMs === undefined ? null : a.timeMs,
        clientCorrect: typeof a.correct === 'boolean' ? a.correct : null,
      };
    });
    const score = scored.reduce((n, a) => n + a.points, 0);
    const maxScore = scored.reduce((n, a) => n + a.maxPoints, 0);
    parts.push({ roundId, score, maxScore, pct: maxScore ? round1((100 * score) / maxScore) : 0, scored, questions: ids.length });
  }
  const score = parts.reduce((n, p) => n + p.score, 0);
  const maxScore = parts.reduce((n, p) => n + p.maxScore, 0);
  const pctExact = maxScore ? (100 * score) / maxScore : 0;
  const passed = maxScore > 0 && score * 100 >= s.passPct * maxScore;
  const partsOut = parts.map(({ roundId, score: sc, maxScore: mx, pct }) => ({ roundId, score: sc, maxScore: mx, pct }));

  const who = await db.get(
    'SELECT u.display_name, u.email, d.name AS department FROM users u LEFT JOIN departments d ON d.id = u.department_id WHERE u.id = @id',
    { id: user.id },
  );
  let certificate = null;

  await db.tx(async (t) => {
    // Re-check inside the transaction so a double submit cannot score twice.
    const cur = await t.get('SELECT status FROM cert_exams WHERE id = @id', { id: exam.id });
    if (!cur || cur.status !== 'in_progress') throw err('exam_closed', 'This exam attempt has already been submitted.');
    for (const p of parts) {
      const attemptId = crypto.randomUUID();
      await t.insert('quiz_attempts', {
        id: attemptId,
        user_id: user.id,
        round_id: p.roundId,
        session_id: sessionId || null,
        started_at: startedAt,
        completed_at: completedAt,
        score: p.score,
        max_score: p.maxScore,
        passed: p.maxScore > 0 && p.score * 100 >= s.passPct * p.maxScore ? 1 : 0,
        created_at: new Date(),
        cert_exam_id: exam.id,
      });
      for (const a of p.scored) {
        await t.run(
          `INSERT INTO quiz_answers (attempt_id, question_id, response, correct, points, time_ms, client_correct)
           VALUES (@attemptId, @questionId, @response, @correct, @points, @timeMs, @clientCorrect)`,
          {
            attemptId,
            questionId: a.questionId,
            response: a.response,
            correct: a.correct ? 1 : 0,
            points: a.points,
            timeMs: a.timeMs,
            clientCorrect: a.clientCorrect === null ? null : a.clientCorrect ? 1 : 0,
          },
        );
      }
    }
    await t.run(
      `UPDATE cert_exams SET status = 'completed', completed_at = @completedAt, score = @score, max_score = @maxScore,
              pct = @pct, passed = @passed, parts = @parts WHERE id = @id`,
      { id: exam.id, completedAt, score, maxScore, pct: round1(pctExact), passed: passed ? 1 : 0, parts: JSON.stringify(partsOut) },
    );
    await audit(t, {
      actorUserId: user.id,
      action: 'cert.exam_submit',
      entity: 'cert_exam',
      entityId: exam.id,
      detail: { level: lv.id, attemptNo: Number(exam.attempt_no), score, maxScore, pct: round1(pctExact), passed, preview },
      ip,
    });
    if (passed && !preview && !(await getCertificate(t, user.id, lv.id))) {
      const issuedAt = new Date();
      let id = newCertificateId(lv.prefix, issuedAt);
      for (let i = 0; i < 5 && (await t.get('SELECT certificate_id FROM certificates WHERE certificate_id = @id', { id })); i++) {
        id = newCertificateId(lv.prefix, issuedAt);
      }
      const row = {
        certificate_id: id,
        user_id: user.id,
        level: lv.id,
        exam_id: exam.id,
        display_name: who.display_name,
        department: who.department || null,
        score_pct: round1(pctExact),
        issued_at: issuedAt,
      };
      await t.insert('certificates', row, 'certificate_id');
      certificate = certificateDto({ ...row, issued_at: issuedAt.toISOString() }, config);
      await enqueue(t, {
        to: who.email,
        template: 'certificate_issued',
        payload: {
          displayName: who.display_name,
          department: who.department || null,
          certificateId: id,
          scorePct: certificate.scorePct,
          issuedAt: certificate.issuedAt,
          title: lv.title,
          level: lv.id,
          verifyPath: `/api/v1/cert/verify/${id}`,
        },
      });
      await audit(t, { actorUserId: user.id, action: 'cert.issue', entity: 'certificate', entityId: id, detail: { examId: exam.id, level: lv.id, scorePct: certificate.scorePct }, ip });
    }
  });

  const max = preview ? reviewerMax(config) : await allowedAttempts(db, config, user.id, lv.id);
  const used = await attemptsUsed(db, user.id, lv.id);
  if (preview) {
    return { examId: exam.id, level: lv.id, attemptNo: Number(exam.attempt_no), score, maxScore, pct: round1(pctExact), passed, parts: partsOut, attemptsLeft: Math.max(0, max - used), certificate: null, preview: true };
  }
  return {
    examId: exam.id,
    level: lv.id,
    attemptNo: Number(exam.attempt_no),
    score,
    maxScore,
    pct: round1(pctExact),
    passed,
    parts: partsOut,
    attemptsLeft: certificate ? 0 : Math.max(0, max - used),
    certificate,
  };
}

/** GET /cert/verify/:certificateId (public) */
async function verifyCertificate(db, certificateId, config = {}) {
  const id = String(certificateId || '').trim().toUpperCase();
  if (!id || id.length > 32) return null;
  const c = await db.get('SELECT * FROM certificates WHERE certificate_id = @id AND revoked_at IS NULL', { id });
  return c ? { valid: true, ...certificateDto(c, config) } : null;
}

/** POST /admin/users/:userId/cert-attempts */
async function grantAttempts(db, config, actor, userId, body, ip) {
  const uid = Number(userId);
  if (!Number.isInteger(uid) || uid <= 0) throw err('validation', 'userId must be a positive integer');
  const extra = body && body.extra !== undefined ? Number(body.extra) : 1;
  if (!Number.isInteger(extra) || extra < 1 || extra > 3) throw err('validation', 'extra must be an integer between 1 and 3');
  const note = body && typeof body.note === 'string' ? body.note.trim().slice(0, 500) || null : null;
  const lv = levelOf(config, body && body.level);
  const target = await db.get('SELECT id FROM users WHERE id = @id', { id: uid });
  if (!target) throw err('not_found', 'User not found', 404);
  await db.tx(async (t) => {
    await t.insert('cert_attempt_grants', { user_id: uid, level: lv.id, extra, granted_by: actor.id, note, created_at: new Date() });
    await audit(t, { actorUserId: actor.id, action: 'cert.grant_attempts', entity: 'user', entityId: String(uid), detail: { level: lv.id, extra, note }, ip });
  });
  return { level: lv.id, attemptsUsed: await attemptsUsed(db, uid, lv.id), maxAttempts: await allowedAttempts(db, config, uid, lv.id) };
}

module.exports = {
  certificationStatus,
  allCertifications,
  levelsOf,
  levelOf,
  trackProgress,
  startExam,
  submitExam,
  verifyCertificate,
  grantAttempts,
  getCertificate,
  computeTracks,
  isEligible,
  newCertificateId,
  isReviewerId,
};
