'use strict';
/**
 * Admin dashboard, user list and CSV export.
 *
 * Aggregation is done in JS over a handful of simple, index-friendly queries so
 * the same code runs on SQLite and SQL Server and local-time bucketing
 * (Asia/Qatar) is exact. At GTA scale (hundreds to a few thousand staff) this is
 * well within budget; the ea.v_* views serve Power BI / SSRS for heavier BI.
 */
const { err } = require('../lib/errors');
const { localParts, startOfLocalDay, addDays, localDate } = require('../lib/time');
const { toUserDto } = require('./users');
const { computeTracks, isEligible, levelsOf } = require('./cert');

const YMD = /^\d{4}-\d{2}-\d{2}$/;
const round1 = (n) => (n === null || n === undefined || Number.isNaN(n) ? null : Math.round(n * 10) / 10);
const pct = (num, den) => (den ? round1((100 * num) / den) : 0);

/** Parse from/to (local dates 'YYYY-MM-DD', inclusive, or ISO instants). Default: last 30 days. */
function parseRange(config, query) {
  const tz = config.timezone;
  const today = localDate(new Date(), tz);
  const toStr = query.to || today;
  const fromStr = query.from || addDays(YMD.test(toStr) ? toStr : localDate(new Date(toStr), tz), -29);
  const parse = (v, isEnd) => {
    if (typeof v !== 'string') throw err('validation', 'from/to must be dates');
    if (YMD.test(v)) return isEnd ? startOfLocalDay(addDays(v, 1), tz) : startOfLocalDay(v, tz);
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) throw err('validation', `Invalid date "${v}"`);
    return d;
  };
  const from = parse(fromStr, false);
  const to = parse(toStr, true); // exclusive upper bound
  if (from >= to) throw err('validation', '"from" must be before "to"');
  if (to - from > 400 * 86400000) throw err('validation', 'Date range is limited to 400 days');
  return {
    from,
    to,
    fromDate: localDate(from, tz),
    toDate: localDate(new Date(to.getTime() - 1), tz),
  };
}

async function resolveDepartment(db, value) {
  if (value === undefined || value === null || value === '') return null;
  const d = await db.get(
    'SELECT id, name FROM departments WHERE name = @v OR code = @v OR name_ar = @v',
    { v: String(value) },
  );
  if (!d) throw err('validation', `Unknown department "${value}"`);
  return d;
}

/** Load everything the dashboard / user list needs, filtered to a user population. */
async function loadBase(db, config, { departmentId, to }) {
  const users = await db.all(
    `SELECT u.id, u.email, u.display_name, u.department_id, d.name AS department, u.job_title, u.role,
            u.first_login_at, u.last_login_at, u.is_active
       FROM users u LEFT JOIN departments d ON d.id = u.department_id
      WHERE u.is_active = 1 ${departmentId ? 'AND u.department_id = @departmentId' : ''}`,
    { departmentId },
  );
  // Exam reviewers never count towards programme reporting.
  const rev = new Set(Array.isArray(config.reviewerEmails) ? config.reviewerEmails : []);
  for (let i = users.length - 1; i >= 0; i--) if (rev.has(String(users[i].email).toLowerCase())) users.splice(i, 1);
  const ids = new Set(users.map((u) => u.id));
  const inPop = (r) => ids.has(r.user_id);
  const toP = { to: to || new Date('9999-12-31T23:59:59.999Z') };

  const modules = await db.all('SELECT id, title, mandatory, sort_order, track FROM content_modules WHERE active = 1 ORDER BY sort_order', {});
  const rounds = await db.all('SELECT id, title, mandatory FROM quiz_rounds WHERE active = 1 ORDER BY sort_order', {});
  const mandatoryModules = modules.filter((m) => Boolean(m.mandatory)).map((m) => m.id);
  const mandatoryRounds = rounds.filter((r) => Boolean(r.mandatory)).map((r) => r.id);

  const learnEvents = (
    await db.all(
      `SELECT DISTINCT user_id, type, ref FROM events
        WHERE type IN ('module_view', 'module_complete') AND created_at < @to`,
      toP,
    )
  ).filter(inPop);
  const attempts = (
    await db.all(
      `SELECT id, user_id, round_id, score, max_score, passed, started_at, completed_at
         FROM quiz_attempts WHERE completed_at < @to`,
      toP,
    )
  ).filter(inPop);
  const examsAll = (
    await db.all('SELECT id, user_id, level, attempt_no, status, started_at, completed_at, pct, passed FROM cert_exams WHERE started_at < @to AND is_preview = 0', toP)
  ).filter(inPop);
  const certificatesAll = (
    await db.all('SELECT certificate_id, user_id, level, issued_at, score_pct FROM certificates WHERE revoked_at IS NULL AND issued_at < @to', toP)
  ).filter(inPop);
  const lvOf = (r) => r.level || 'foundation';
  // Foundation-level rows drive the existing (single-level) fields.
  const exams = examsAll.filter((x) => lvOf(x) === 'foundation');
  const certificates = certificatesAll.filter((c) => lvOf(c) === 'foundation');
  const grantRows = await db.all('SELECT user_id, level, SUM(extra) AS n FROM cert_attempt_grants GROUP BY user_id, level', {});
  const grants = new Map(grantRows.map((g) => [`${g.user_id}|${g.level || 'foundation'}`, Number(g.n) || 0]));
  const levels = levelsOf(config);
  const unlockPct = Number(config.certUnlockPct ?? 80);
  const baseMax = Number(config.certMaxAttempts ?? 3);
  const kbViews = (
    await db.all("SELECT user_id, COUNT(DISTINCT ref) AS n FROM events WHERE type = 'kb_view' AND created_at < @to GROUP BY user_id", toP)
  ).filter(inPop);
  const statement = await db.get('SELECT version FROM signoff_statements WHERE active = 1', {});
  const signoffs = statement
    ? (
        await db.all(
          `SELECT user_id, signed_at, receipt_id, statement_version, ip FROM signoffs
            WHERE statement_version = @v AND signed_at < @to`,
          { v: statement.version, ...toP },
        )
      ).filter(inPop)
    : [];

  // Per-user derived state
  const st = new Map(
    users.map((u) => [
      u.id,
      {
        viewed: false,
        completed: new Set(),
        passedRounds: new Set(),
        bestPct: null,
        bestAt: null,
        signed: null,
        examAttempts: 0,
        examsCompleted: 0,
        certificate: null,
        kbRead: 0,
      },
    ]),
  );
  for (const e of learnEvents) {
    const s = st.get(e.user_id);
    s.viewed = true;
    if (e.type === 'module_complete') s.completed.add(e.ref);
  }
  for (const a of attempts) {
    const s = st.get(a.user_id);
    if (Boolean(a.passed)) s.passedRounds.add(a.round_id);
    s.viewed = true;
  }
  // Best score = best completed certification exam (overall %).
  for (const x of exams) {
    const s = st.get(x.user_id);
    s.examAttempts++;
    s.viewed = true;
    if (x.status !== 'completed' || x.pct === null) continue;
    s.examsCompleted++;
    const p = Number(x.pct);
    const at = String(x.completed_at);
    if (s.bestPct === null || p > s.bestPct || (p === s.bestPct && at < s.bestAt)) {
      s.bestPct = p;
      s.bestAt = at;
    }
  }
  for (const c of certificates) st.get(c.user_id).certificate = c;
  for (const k of kbViews) st.get(k.user_id).kbRead = Number(k.n) || 0;
  for (const so of signoffs) st.get(so.user_id).signed = so;
  const trackModules = modules.map((m) => ({ id: m.id, track: m.track }));
  // Per-level state: { certified, certificate, certificateId, bestPct, bestAt, attempts, completed, maxAttempts, eligible }
  for (const [uid, s] of st.entries()) {
    s.levels = {};
    for (const lv of levels) {
      s.levels[lv.id] = { certificate: null, bestPct: null, bestAt: null, attempts: 0, completed: 0, maxAttempts: baseMax + (grants.get(`${uid}|${lv.id}`) || 0) };
    }
  }
  for (const x of examsAll) {
    const L = st.get(x.user_id).levels[lvOf(x)];
    if (!L) continue;
    L.attempts++;
    if (x.status !== 'completed' || x.pct === null) continue;
    L.completed++;
    const p = Number(x.pct);
    const at = String(x.completed_at);
    if (L.bestPct === null || p > L.bestPct || (p === L.bestPct && at < L.bestAt)) {
      L.bestPct = p;
      L.bestAt = at;
    }
  }
  for (const c of certificatesAll) {
    const L = st.get(c.user_id).levels[lvOf(c)];
    if (L) L.certificate = c;
  }
  for (const s of st.values()) {
    s.tracks = computeTracks(trackModules, s.completed);
    s.eligible = isEligible(s.tracks, unlockPct);
    s.certified = Boolean(s.certificate);
    s.modulesDone = s.eligible; // reading requirement met (exam unlocked)
    s.passedAll = s.certified;
    for (const lv of levels) {
      const L = s.levels[lv.id];
      L.certified = Boolean(L.certificate);
      L.certificateId = L.certificate ? L.certificate.certificate_id : null;
      const prereq = !lv.requires || Boolean(s.levels[lv.requires] && s.levels[lv.requires].certificate);
      L.eligible = prereq && isEligible(s.tracks, unlockPct, lv.tracks);
    }
  }
  return { users, ids, inPop, modules, rounds, mandatoryModules, mandatoryRounds, attempts, exams, certificates, examsAll, certificatesAll, levels, grants, baseMax, signoffs, st };
}

async function computeDashboard(db, config, query) {
  const tz = config.timezone;
  const range = parseRange(config, query);
  const dept = await resolveDepartment(db, query.department);
  const base = await loadBase(db, config, { departmentId: dept && dept.id, to: range.to });
  const { users, inPop, st } = base;
  const rp = { from: range.from, to: range.to };

  const sessions = (
    await db.all(
      `SELECT user_id, login_at, last_seen_at, logout_at FROM user_sessions
        WHERE login_at >= @from AND login_at < @to`,
      rp,
    )
  ).filter(inPop);
  const rangeEvents = (
    await db.all(
      `SELECT user_id, type, ref FROM events
        WHERE type IN ('module_view', 'module_complete') AND created_at >= @from AND created_at < @to`,
      rp,
    )
  ).filter(inPop);
  const answers = (
    await db.all(
      `SELECT a.user_id, qa.question_id, qa.correct FROM quiz_answers qa
         JOIN quiz_attempts a ON a.id = qa.attempt_id
        WHERE a.completed_at >= @from AND a.completed_at < @to`,
      rp,
    )
  ).filter(inPop);
  const questions = await db.all('SELECT id, tag, round_id FROM questions ORDER BY round_id, id', {});

  // ---- logins by day + heatmap -------------------------------------------
  const days = new Map();
  for (let d = range.fromDate; d <= range.toDate; d = addDays(d, 1)) days.set(d, { logins: 0, users: new Set() });
  const heat = Array.from({ length: 7 }, () => new Array(24).fill(0));
  let totalMinutes = 0;
  const activeUsers = new Set();
  const access = new Map(); // user_id -> { logins, minutes }
  for (const s of sessions) {
    const lp = localParts(s.login_at, tz);
    const day = days.get(lp.date);
    if (day) {
      day.logins++;
      day.users.add(s.user_id);
    }
    heat[lp.weekday][lp.hour]++;
    activeUsers.add(s.user_id);
    const end = s.logout_at || s.last_seen_at || s.login_at;
    const mins = Math.max(0, (new Date(end) - new Date(s.login_at)) / 60000);
    totalMinutes += mins;
    const a = access.get(s.user_id) || { logins: 0, minutes: 0 };
    a.logins++;
    a.minutes += mins;
    access.set(s.user_id, a);
  }
  const lastSeen = new Map(
    (await db.all('SELECT user_id, MAX(last_seen_at) AS last FROM user_sessions WHERE login_at < @to GROUP BY user_id', { to: range.to }))
      .filter(inPop)
      .map((r) => [r.user_id, r.last ? String(r.last) : null]),
  );
  const loginsByDay = [...days.entries()].map(([date, v]) => ({ date, logins: v.logins, uniqueUsers: v.users.size }));

  // ---- KPIs ----------------------------------------------------------------
  // Scores are certification-exam scores: each person's best completed exam
  // among sittings completed in the period.
  const enrolled = users.length;
  const rangeFrom = range.from.toISOString();
  const rangeExams = base.exams.filter((x) => x.status === 'completed' && x.completed_at && String(x.completed_at) >= rangeFrom);
  const bestInRange = new Map();
  for (const x of rangeExams) {
    const p = Number(x.pct);
    if (!bestInRange.has(x.user_id) || p > bestInRange.get(x.user_id)) bestInRange.set(x.user_id, p);
  }
  const bestPcts = [...bestInRange.values()];
  let signed = 0;
  let started = 0;
  let unlocked = 0;
  let certified = 0;
  for (const s of st.values()) {
    if (s.signed) signed++;
    if (s.viewed) started++;
    if (s.eligible || s.certified) unlocked++;
    if (s.certified) certified++;
  }
  const examTakers = new Set(rangeExams.map((x) => x.user_id));
  const certifiedInRange = new Set(
    base.certificates.filter((c) => String(c.issued_at) >= rangeFrom).map((c) => c.user_id),
  );
  const kpis = {
    enrolled,
    activeUsers: activeUsers.size,
    logins: sessions.length,
    avgScorePct: bestPcts.length ? round1(bestPcts.reduce((a, b) => a + b, 0) / bestPcts.length) : 0,
    passRatePct: pct([...examTakers].filter((u) => certifiedInRange.has(u)).length, examTakers.size),
    signoffRatePct: pct(signed, enrolled),
    avgMinutesPerUser: activeUsers.size ? round1(totalMinutes / activeUsers.size) : 0,
    certified,
    certifiedRatePct: pct(certified, enrolled),
    examAttempts: base.exams.filter((x) => String(x.started_at) >= rangeFrom).length,
    certifiedByLevel: Object.fromEntries(base.levels.map((lv) => [lv.id, [...st.values()].filter((s) => s.levels[lv.id].certified).length])),
  };
  const levelsSummary = base.levels.map((lv) => {
    let unl = 0;
    let cert = 0;
    for (const s of st.values()) {
      const L = s.levels[lv.id];
      if (L.eligible || L.certified) unl++;
      if (L.certified) cert++;
    }
    return {
      level: lv.id,
      title: lv.title,
      unlocked: unl,
      certified: cert,
      attempts: base.examsAll.filter((x) => (x.level || 'foundation') === lv.id && String(x.started_at) >= rangeFrom).length,
    };
  });

  const funnel = {
    enrolled,
    startedLearning: started,
    examUnlocked: unlocked,
    certified,
    signedOff: signed,
    // backward-compatible aliases
    completedModules: unlocked,
    passedAssessment: certified,
  };

  // ---- by department -------------------------------------------------------
  const deptRows = dept
    ? [{ id: dept.id, name: dept.name }]
    : await db.all('SELECT id, name FROM departments WHERE is_active = 1 ORDER BY sort_order, name', {});
  const groups = new Map(deptRows.map((d) => [d.id, { department: d.name, list: [] }]));
  for (const u of users) {
    const key = u.department_id ?? null;
    if (!groups.has(key)) groups.set(key, { department: key === null ? '(not set)' : u.department, list: [] });
    groups.get(key).list.push(st.get(u.id));
    (groups.get(key).ids = groups.get(key).ids || []).push(u.id);
  }
  const byDepartment = [...groups.values()]
    .filter((g) => g.list.length || g.department !== '(not set)')
    .map((g) => {
      const scored = g.list.filter((s) => s.bestPct !== null);
      return {
        department: g.department,
        users: g.list.length,
        completionPct: pct(g.list.filter((s) => s.modulesDone).length, g.list.length),
        avgScorePct: scored.length ? round1(scored.reduce((a, s) => a + s.bestPct, 0) / scored.length) : null,
        certifiedPct: pct(g.list.filter((s) => s.certified).length, g.list.length),
        signedPct: pct(g.list.filter((s) => s.signed).length, g.list.length),
      };
    });

  // ---- score distribution (best certification exam per person, completed in range) ----
  const buckets = [
    ['0-49', 0, 50],
    ['50-59', 50, 60],
    ['60-69', 60, 70],
    ['70-79', 70, 80],
    ['80-89', 80, 90],
    ['90-100', 90, 101],
  ];
  const scoreDistribution = buckets.map(([bucket, lo, hi]) => ({
    bucket,
    count: bestPcts.filter((p) => Math.floor(p) >= lo && Math.floor(p) < hi).length,
  }));

  // ---- question stats -------------------------------------------------------
  const qs = new Map(questions.map((q) => [q.id, { questionId: q.id, tag: q.tag, attempts: 0, correct: 0 }]));
  for (const a of answers) {
    const q = qs.get(a.question_id);
    if (!q) continue;
    q.attempts++;
    if (Boolean(a.correct)) q.correct++;
  }
  const questionStats = [...qs.values()].map((q) => ({
    questionId: q.questionId,
    tag: q.tag,
    attempts: q.attempts,
    correctPct: pct(q.correct, q.attempts),
  }));

  // ---- module views ----------------------------------------------------------
  // EA modules and TOGAF topics only (knowledge-base articles are not charted here).
  const isKb = (id) => String(id).startsWith('kb:');
  const mv = new Map(base.modules.filter((m) => !isKb(m.id)).map((m) => [m.id, { moduleId: m.id, title: m.title, views: 0, completers: new Set() }]));
  for (const e of rangeEvents) {
    if (isKb(e.ref)) continue;
    let m = mv.get(e.ref);
    if (!m) {
      m = { moduleId: e.ref, title: e.ref, views: 0, completers: new Set() };
      mv.set(e.ref, m);
    }
    if (e.type === 'module_view') m.views++;
    else m.completers.add(e.user_id);
  }
  const moduleViews = [...mv.values()].map((m) => ({ moduleId: m.moduleId, title: m.title, views: m.views, completions: m.completers.size }));

  // ---- recent sign-offs -------------------------------------------------------
  const userById = new Map(users.map((u) => [u.id, u]));
  const recentSignoffs = base.signoffs
    .filter((s) => s.signed_at >= range.from.toISOString())
    .sort((a, b) => (a.signed_at < b.signed_at ? 1 : -1))
    .slice(0, 10)
    .map((s) => {
      const u = userById.get(s.user_id);
      return { displayName: u.display_name, department: u.department || null, signedAt: s.signed_at, receiptId: s.receipt_id };
    });

  // ---- access, top users, top scorers, per-employee progress ---------------
  const deptAccess = [...groups.values()]
    .filter((g) => g.list.length)
    .map((g) => {
      const ids = g.ids || [];
      let logins = 0;
      let minutes = 0;
      let active = 0;
      for (const id of ids) {
        const a = access.get(id);
        if (!a) continue;
        active++;
        logins += a.logins;
        minutes += a.minutes;
      }
      return {
        department: g.department,
        users: ids.length,
        activeUsers: active,
        logins,
        minutes: round1(minutes),
        certified: g.list.filter((x) => x.certified).length,
      };
    })
    .sort((a, b) => b.logins - a.logins || b.minutes - a.minutes || a.department.localeCompare(b.department));

  const topUsersByAccess = users
    .filter((u) => access.has(u.id))
    .map((u) => {
      const a = access.get(u.id);
      return {
        userId: u.id,
        displayName: u.display_name,
        department: u.department || null,
        logins: a.logins,
        minutes: round1(a.minutes),
        lastSeenAt: lastSeen.get(u.id) || null,
      };
    })
    .sort((a, b) => b.logins - a.logins || b.minutes - a.minutes)
    .slice(0, 10);

  const topScorers = users
    .filter((u) => st.get(u.id).bestPct !== null)
    .map((u) => {
      const x = st.get(u.id);
      return {
        userId: u.id,
        displayName: u.display_name,
        department: u.department || null,
        bestPct: round1(x.bestPct),
        attempts: x.examsCompleted,
        certified: x.certified,
        certifiedAt: x.certificate ? String(x.certificate.issued_at) : null,
        _at: x.bestAt,
      };
    })
    .sort((a, b) => b.bestPct - a.bestPct || (a._at < b._at ? -1 : a._at > b._at ? 1 : 0))
    .slice(0, 10)
    .map(({ _at, ...r }) => r);

  const scorersFor = (levelId) =>
    users
      .filter((u) => st.get(u.id).levels[levelId].bestPct !== null)
      .map((u) => {
        const L = st.get(u.id).levels[levelId];
        return {
          userId: u.id,
          displayName: u.display_name,
          department: u.department || null,
          bestPct: round1(L.bestPct),
          attempts: L.completed,
          certified: L.certified,
          certifiedAt: L.certificate ? String(L.certificate.issued_at) : null,
          _at: L.bestAt,
        };
      })
      .sort((a, b) => b.bestPct - a.bestPct || (a._at < b._at ? -1 : a._at > b._at ? 1 : 0))
      .slice(0, 10)
      .map(({ _at, ...r }) => r);
  const topScorersByLevel = Object.fromEntries(base.levels.map((lv) => [lv.id, scorersFor(lv.id)]));
  const employees = users
    .map((u) => {
      const x = st.get(u.id);
      const a = access.get(u.id) || { logins: 0, minutes: 0 };
      return {
        userId: u.id,
        displayName: u.display_name,
        email: u.email,
        department: u.department || null,
        eaPct: x.tracks.ea.pct,
        togafPct: x.tracks.togaf.pct,
        kbRead: x.kbRead,
        examAttempts: x.examAttempts,
        maxAttempts: x.levels.foundation ? x.levels.foundation.maxAttempts : base.baseMax,
        bestPct: x.bestPct === null ? null : round1(x.bestPct),
        certified: x.certified,
        certificateId: x.certificate ? x.certificate.certificate_id : null,
        signed: Boolean(x.signed),
        logins: a.logins,
        minutes: round1(a.minutes),
        lastSeenAt: lastSeen.get(u.id) || null,
        kbpPct: x.tracks.kbp.pct,
        kbaPct: x.tracks.kba.pct,
        levels: Object.fromEntries(
          base.levels.map((lv) => {
            const L = x.levels[lv.id];
            return [lv.id, { certified: L.certified, certificateId: L.certificateId, bestPct: L.bestPct === null ? null : round1(L.bestPct), attempts: L.attempts, maxAttempts: L.maxAttempts, eligible: L.eligible }];
          }),
        ),
      };
    })
    .sort((a, b) => (a.displayName || '').localeCompare(b.displayName || ''));

  return {
    range: { from: range.from.toISOString(), to: range.to.toISOString(), fromDate: range.fromDate, toDate: range.toDate, timezone: tz, department: dept ? dept.name : null },
    kpis,
    loginsByDay,
    loginHeatmap: heat,
    funnel,
    byDepartment,
    scoreDistribution,
    questionStats,
    moduleViews,
    recentSignoffs,
    deptAccess,
    topUsersByAccess,
    topScorers,
    topScorersByLevel,
    levels: levelsSummary,
    employees,
    departments: (await db.all('SELECT name FROM departments WHERE is_active = 1 ORDER BY sort_order, name', {})).map((d) => d.name),
  };
}

function statusOf(s) {
  if (s.signed) return 'signed';
  if (s.certified) return 'certified';
  if (s.viewed) return 'in_progress';
  return 'not_started';
}

/** GET /admin/users. status: signed | certified (alias: passed) | in_progress | not_started | pending (= not signed). */
async function listUsers(db, config, query) {
  const dept = await resolveDepartment(db, query.department);
  const base = await loadBase(db, config, { departmentId: dept && dept.id });
  const sessions = await db.all('SELECT user_id, COUNT(*) AS n, MAX(login_at) AS last FROM user_sessions GROUP BY user_id', {});
  const sMap = new Map(sessions.map((s) => [s.user_id, s]));
  const q = typeof query.q === 'string' ? query.q.trim().toLowerCase() : '';
  const status = query.status || '';
  const allowed = ['', 'signed', 'certified', 'passed', 'in_progress', 'not_started', 'pending'];
  if (!allowed.includes(status)) throw err('validation', `status must be one of ${allowed.filter(Boolean).join(', ')}`);

  return base.users
    .filter((u) => !q || u.email.includes(q) || (u.display_name || '').toLowerCase().includes(q))
    .map((u) => {
      const s = base.st.get(u.id);
      const ss = sMap.get(u.id);
      return {
        user: toUserDto(u, config),
        lastLoginAt: (ss && ss.last) || u.last_login_at || null,
        logins: ss ? Number(ss.n) : 0,
        modulesCompleted: s.completed.size,
        bestScore: s.bestPct === null ? null : round1(s.bestPct),
        examAttempts: s.examAttempts,
        certificateId: s.certificate ? s.certificate.certificate_id : null,
        signedAt: s.signed ? s.signed.signed_at : null,
        status: statusOf(s),
      };
    })
    .filter((r) => {
      if (!status) return true;
      if (status === 'pending') return r.status !== 'signed';
      if (status === 'certified' || status === 'passed') return r.status === 'certified' || r.status === 'signed';
      return r.status === status;
    })
    .sort((a, b) => (a.user.displayName || '').localeCompare(b.user.displayName || ''));
}

/** Rows for GET /admin/export?kind=... */
async function exportRows(db, config, query) {
  const kind = query.kind;
  const tz = config.timezone;
  const dept = await resolveDepartment(db, query.department);
  const deptSql = dept ? 'AND u.department_id = @departmentId' : '';
  const range = query.from || query.to ? parseRange(config, query) : { from: new Date(0), to: new Date('9999-12-31T23:59:59.999Z') };
  const p = { departmentId: dept && dept.id, from: range.from, to: range.to };
  const rev = new Set(Array.isArray(config.reviewerEmails) ? config.reviewerEmails : []);
  const notReviewer = (r) => !rev.has(String(r.email || '').toLowerCase());
  const local = (iso) => {
    if (!iso) return null;
    const d = new Date(iso);
    const lp = localParts(iso, tz);
    return `${lp.date} ${String(lp.hour).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
  };

  switch (kind) {
    case 'employees': {
      const d = await computeDashboard(db, config, query);
      return {
        columns: ['user_id', 'email', 'display_name', 'department', 'ea_pct', 'togaf_pct', 'kb_read', 'exam_attempts', 'best_pct', 'certified', 'certificate_id', 'signed', 'logins', 'minutes', 'last_seen_at',
          'kbp_pct', 'kba_pct', 'practitioner_certified', 'practitioner_best_pct', 'practitioner_attempts', 'advanced_certified', 'advanced_best_pct', 'advanced_attempts'],
        rows: d.employees.map((e) => ({
          kbp_pct: e.kbpPct,
          kba_pct: e.kbaPct,
          practitioner_certified: e.levels.practitioner && e.levels.practitioner.certified ? 'yes' : 'no',
          practitioner_best_pct: e.levels.practitioner ? e.levels.practitioner.bestPct : null,
          practitioner_attempts: e.levels.practitioner ? e.levels.practitioner.attempts : 0,
          advanced_certified: e.levels.advanced && e.levels.advanced.certified ? 'yes' : 'no',
          advanced_best_pct: e.levels.advanced ? e.levels.advanced.bestPct : null,
          advanced_attempts: e.levels.advanced ? e.levels.advanced.attempts : 0,
          user_id: e.userId,
          email: e.email,
          display_name: e.displayName,
          department: e.department,
          ea_pct: e.eaPct,
          togaf_pct: e.togafPct,
          kb_read: e.kbRead,
          exam_attempts: e.examAttempts,
          best_pct: e.bestPct,
          certified: e.certified ? 'yes' : 'no',
          certificate_id: e.certificateId,
          signed: e.signed ? 'yes' : 'no',
          logins: e.logins,
          minutes: e.minutes,
          last_seen_at: e.lastSeenAt,
        })),
      };
    }
    case 'users': {
      const rows = await listUsers(db, config, { department: query.department });
      return {
        columns: ['id', 'email', 'display_name', 'department', 'job_title', 'role', 'status', 'first_login_at', 'last_login_at', 'logins', 'modules_completed', 'best_score_pct', 'signed_at'],
        rows: rows.map((r) => ({
          id: r.user.id,
          email: r.user.email,
          display_name: r.user.displayName,
          department: r.user.department,
          job_title: r.user.jobTitle,
          role: r.user.role,
          status: r.status,
          first_login_at: r.user.firstLoginAt,
          last_login_at: r.lastLoginAt,
          logins: r.logins,
          modules_completed: r.modulesCompleted,
          best_score_pct: r.bestScore,
          signed_at: r.signedAt,
        })),
      };
    }
    case 'attempts': {
      const rows = await db.all(
        `SELECT a.id AS attempt_id, u.email, u.display_name, d.name AS department, a.round_id, a.started_at, a.completed_at,
                a.score, a.max_score, a.passed
           FROM quiz_attempts a JOIN users u ON u.id = a.user_id LEFT JOIN departments d ON d.id = u.department_id
          WHERE a.completed_at >= @from AND a.completed_at < @to ${deptSql}
          ORDER BY a.completed_at`,
        p,
      );
      return {
        columns: ['attempt_id', 'email', 'display_name', 'department', 'round_id', 'started_at', 'completed_at', 'completed_at_local', 'duration_sec', 'score', 'max_score', 'score_pct', 'passed'],
        rows: rows.filter(notReviewer).map((r) => ({
          ...r,
          completed_at_local: local(r.completed_at),
          duration_sec: Math.round((new Date(r.completed_at) - new Date(r.started_at)) / 1000),
          score_pct: r.max_score ? round1((100 * r.score) / r.max_score) : 0,
          passed: Boolean(r.passed) ? 'yes' : 'no',
        })),
      };
    }
    case 'signoffs': {
      const rows = await db.all(
        `SELECT s.receipt_id, u.email, u.display_name, d.name AS department, s.statement_version, s.statement_sha256,
                s.signed_at, s.ip
           FROM signoffs s JOIN users u ON u.id = s.user_id LEFT JOIN departments d ON d.id = u.department_id
          WHERE s.signed_at >= @from AND s.signed_at < @to ${deptSql}
          ORDER BY s.signed_at`,
        p,
      );
      return {
        columns: ['receipt_id', 'email', 'display_name', 'department', 'statement_version', 'statement_sha256', 'signed_at', 'signed_at_local', 'ip'],
        rows: rows.filter(notReviewer).map((r) => ({ ...r, signed_at_local: local(r.signed_at) })),
      };
    }
    case 'sessions': {
      const rows = await db.all(
        `SELECT s.id AS session_id, u.email, u.display_name, d.name AS department, s.login_at, s.last_seen_at, s.logout_at,
                s.ip, s.user_agent
           FROM user_sessions s JOIN users u ON u.id = s.user_id LEFT JOIN departments d ON d.id = u.department_id
          WHERE s.login_at >= @from AND s.login_at < @to ${deptSql}
          ORDER BY s.login_at`,
        p,
      );
      return {
        columns: ['session_id', 'email', 'display_name', 'department', 'login_at', 'login_at_local', 'last_seen_at', 'logout_at', 'duration_min', 'ip', 'user_agent'],
        rows: rows.filter(notReviewer).map((r) => ({
          ...r,
          login_at_local: local(r.login_at),
          duration_min: round1((new Date(r.logout_at || r.last_seen_at || r.login_at) - new Date(r.login_at)) / 60000),
        })),
      };
    }
    default:
      throw err('validation', 'kind must be one of employees, users, attempts, signoffs, sessions');
  }
}

module.exports = { computeDashboard, listUsers, exportRows, parseRange };
