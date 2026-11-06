'use strict';
/**
 * Generate realistic demo data for the admin dashboard (DEV ONLY).
 *
 *   npm run seed:demo            # wipes users + activity in the dev DB, then generates
 *   npm run seed:demo -- --users 250 --days 60 --seed 7
 *
 * ~180 users across departments, sessions over the past 45 days weighted to
 * business hours Sunday-Thursday (Asia/Qatar), module/TOGAF-topic/KB events,
 * certification exam sittings per level (foundation; ~30% of certified users go on to read the
 * Practitioner knowledge-base articles and sit the practitioner exam, ~30% of those the advanced one;
 * up to 3 sittings each, sampled per part and scored with the
 * real answer keys), certificates, and sign-offs for certified users. Refuses to run against SQL Server unless --force is given.
 */
const { scoreAnswer } = require('../lib/scoring');
const { startOfLocalDay, addDays, localDate, localParts } = require('../lib/time');

function arg(name, def) {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : def;
}

function rng(seed) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const r = {
    next,
    int: (lo, hi) => lo + Math.floor(next() * (hi - lo + 1)),
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    chance: (p) => next() < p,
    weighted(items, weights) {
      const total = weights.reduce((s, w) => s + w, 0);
      let x = next() * total;
      for (let i = 0; i < items.length; i++) {
        x -= weights[i];
        if (x < 0) return items[i];
      }
      return items[items.length - 1];
    },
    uuid() {
      const b = Buffer.alloc(16);
      for (let i = 0; i < 16; i++) b[i] = Math.floor(next() * 256);
      b[6] = (b[6] & 0x0f) | 0x40;
      b[8] = (b[8] & 0x3f) | 0x80;
      const h = b.toString('hex');
      return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
    },
  };
  return r;
}

const FIRST = ['Mohammed', 'Ahmed', 'Abdullah', 'Khalid', 'Hamad', 'Ali', 'Jassim', 'Saad', 'Nasser', 'Fahad', 'Omar', 'Yousef',
  'Abdulrahman', 'Tamim', 'Mubarak', 'Salem', 'Faisal', 'Hassan', 'Ibrahim', 'Rashid', 'Fatima', 'Maryam', 'Aisha', 'Noora',
  'Hessa', 'Moza', 'Sara', 'Lulwa', 'Amna', 'Reem', 'Dana', 'Latifa', 'Shaikha', 'Alanoud', 'Muneera', 'Hind', 'Priya', 'Rahul',
  'Anil', 'Joseph', 'Maria', 'John', 'Tarek', 'Rania', 'Hossam', 'Mona', 'Karim', 'Layla', 'Samir', 'Nadia'];
const LAST = ['Al-Thani', 'Al-Kuwari', 'Al-Marri', 'Al-Sulaiti', 'Al-Mohannadi', 'Al-Hajri', 'Al-Naimi', 'Al-Kaabi', 'Al-Emadi',
  'Al-Mannai', 'Al-Ansari', 'Al-Khulaifi', 'Al-Obaidli', 'Al-Jaber', 'Al-Dosari', 'Al-Shahwani', 'Al-Malki', 'Al-Baker',
  'Al-Sada', 'Al-Hammadi', 'Nair', 'Menon', 'Fernandes', 'Haddad', 'Mansour', 'Khalil', 'Saleh', 'Farouk', 'Aziz', 'Rahman'];
const TITLES = {
  'Information Technology': ['Systems Analyst', 'Software Engineer', 'Database Administrator', 'Network Engineer', 'IT Security Specialist',
    'Solution Architect', 'Service Desk Lead', 'Infrastructure Engineer', 'Business Analyst', 'Integration Developer', 'IT Project Manager'],
  default: ['Specialist', 'Senior Specialist', 'Section Head', 'Analyst', 'Coordinator', 'Officer', 'Expert'],
};
const DEPT_WEIGHTS = {
  'Information Technology': 40, 'Planning & Quality': 9, 'Taxpayer Services': 12, 'Tax Policies': 6, 'Income Tax': 9,
  'Tax Revenues': 8, 'Legal Affairs': 4, 'Internal Audit': 5, 'Human Resources': 5, 'Consumption Tax': 7, 'Tax Treaties & International Cooperation': 3, 'Financial & Administrative Affairs': 5, 'Public Relations & Communication': 3, Other: 2,
};
// Sun..Sat activity weights (Qatar work week is Sunday-Thursday) and hour-of-day weights.
const DOW_W = [1.0, 1.0, 0.95, 0.9, 0.75, 0.06, 0.18];
const HOUR_W = [0, 0, 0, 0, 0, 0, 0.1, 0.6, 2.2, 3.0, 3.2, 2.8, 2.0, 2.4, 1.6, 0.6, 0.3, 0.25, 0.3, 0.35, 0.3, 0.2, 0.1, 0.02];
const KB = ['kb-capability-map', 'kb-principles-catalogue', 'kb-arb-terms', 'kb-integration-patterns', 'kb-data-classification',
  'kb-cloud-policy', 'kb-glossary', 'kb-adr-template', 'kb-tech-radar'];
const ADM = ['preliminary', 'vision', 'business', 'is', 'technology', 'opportunities', 'migration', 'governance', 'change', 'requirements'];
const SEARCHES = ['cloud', 'api standard', 'arb', 'data owner', 'togaf', 'integration', 'capability map', 'principles', 'oracle', 'sharepoint'];

/** Build a correct (or deliberately wrong) response for a question from its key. */
function makeResponse(r, q, wantCorrect) {
  const key = JSON.parse(q.answer_key);
  switch (q.type) {
    case 'mcq':
      return wantCorrect ? key.answer : (key.answer + r.int(1, 3)) % 4;
    case 'truefalse':
      return wantCorrect ? key.answer : !key.answer;
    case 'order': {
      const items = [...key.items];
      if (!wantCorrect) [items[0], items[1]] = [items[1], items[0]];
      return items;
    }
    case 'match': {
      const pairs = key.pairs.map((p) => ({ ...p }));
      if (!wantCorrect && pairs.length > 1) [pairs[0].r, pairs[1].r] = [pairs[1].r, pairs[0].r];
      return pairs.reverse();
    }
    case 'categorize': {
      const items = key.items.map((p) => ({ ...p }));
      if (!wantCorrect) items[0].b = items[0].b === 'principle' ? 'standard' : `${items[0].b}-x`;
      return items;
    }
    default:
      return null;
  }
}

async function seedDemo(db, config, opts = {}) {
  const r = rng(Number(opts.seed ?? 20261102));
  const N = Number(opts.users ?? 180);
  const DAYS = Number(opts.days ?? 45);
  const tz = config.timezone;
  const now = new Date();
  const today = localDate(now, tz);
  const startDay = addDays(today, -(DAYS - 1));

  const departments = await db.all('SELECT id, name FROM departments ORDER BY sort_order', {});
  const allModules = await db.all('SELECT id, mandatory, track FROM content_modules WHERE active = 1 ORDER BY sort_order', {});
  const modules = allModules.filter((m) => m.track === 'ea' || m.track === 'togaf'); // the course
  const kbTrack = { kbp: allModules.filter((m) => m.track === 'kbp'), kba: allModules.filter((m) => m.track === 'kba') };
  const allRounds = await db.all('SELECT id, mandatory, pass_pct, questions_per_attempt, level FROM quiz_rounds WHERE active = 1 ORDER BY sort_order', {});
  const roundsByLevel = { foundation: [], practitioner: [], advanced: [] };
  for (const x of allRounds) (roundsByLevel[x.level || 'foundation'] || roundsByLevel.foundation).push(x);
  const rounds = roundsByLevel.foundation;
  const levelCfg = Object.fromEntries((config.certLevels || []).map((l) => [l.id, l]));
  const prefixOf = (lv) => (levelCfg[lv] && levelCfg[lv].prefix) || { foundation: 'GTA-EAF', practitioner: 'GTA-EAP', advanced: 'GTA-EAA' }[lv];
  const titleOf = (lv) => (levelCfg[lv] && levelCfg[lv].title) || `Enterprise Architecture ${lv[0].toUpperCase()}${lv.slice(1)}`;
  const unlockPct = Number(config.certUnlockPct ?? 80);
  const certPass = Number(config.certPassPct ?? 70);
  const maxAttempts = Number(config.certMaxAttempts ?? 3);
  const questions = await db.all('SELECT id, round_id, type, points, answer_key FROM questions WHERE active = 1', {});
  const statement = await db.get('SELECT version, sha256, title FROM signoff_statements WHERE active = 1', {});
  const qByRound = new Map(allRounds.map((x) => [x.id, questions.filter((q) => q.round_id === x.id)]));

  /** Random instant on a local day, weighted by hour-of-day; never in the future. */
  const instantOn = (ymd, minHour = 0) => {
    const hours = HOUR_W.map((w, h) => (h >= minHour ? w : 0));
    const h = hours.some((w) => w > 0) ? r.weighted([...Array(24).keys()], hours) : 23;
    const t = new Date(startOfLocalDay(ymd, tz).getTime() + h * 3600e3 + r.int(0, 3599) * 1000);
    return t > now ? new Date(now.getTime() - r.int(60, 3 * 3600) * 1000) : t;
  };
  /** Pick a local day in [fromYmd, today] weighted by weekday. */
  const dayFrom = (fromYmd, bias = 0) => {
    const days = [];
    for (let d = fromYmd; d <= today; d = addDays(d, 1)) days.push(d);
    const w = days.map((d, i) => DOW_W[localParts(startOfLocalDay(d, tz).getTime() + 12 * 3600e3, tz).weekday] * (1 + bias * Math.exp(-i / 4)));
    return r.weighted(days, w);
  };

  const counts = { users: 0, sessions: 0, events: 0, exams: 0, attempts: 0, answers: 0, certificates: 0, practitioner: 0, advanced: 0, signoffs: 0 };
  const certIds = new Set();
  const CERT_CHARS = '23456789ABCDEFGHJKMNPQRSTVWXYZ';
  const shuffled = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(r.next() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  await db.tx(async (t) => {
    // ---- wipe (dev only) -----------------------------------------------------
    for (const tbl of ['quiz_answers', 'quiz_attempts', 'certificates', 'cert_attempt_grants', 'cert_exams', 'signoffs', 'events', 'user_sessions', 'email_outbox', 'audit_log', 'otp_challenges', 'users']) {
      await t.run(`DELETE FROM ${tbl}`, {});
    }

    const usedEmails = new Set();
    const deptNames = Object.keys(DEPT_WEIGHTS).filter((n) => departments.some((d) => d.name === n));
    const fixed = [
      { email: 'ea.admin@gta.gov.qa', name: 'EA Admin', role: 'admin', dept: 'Information Technology', title: 'Head of Enterprise Architecture' },
      { email: 'it.director@gta.gov.qa', name: 'IT Director', role: 'admin', dept: 'Information Technology', title: 'Director of Information Technology' },
      ...['ea.architect1', 'ea.architect2', 'ea.architect3', 'ea.analyst'].map((e, i) => ({
        email: `${e}@gta.gov.qa`, name: `EA Team ${i + 1}`, role: 'ea_team', dept: 'Information Technology', title: i < 3 ? 'Enterprise Architect' : 'EA Analyst',
      })),
    ];
    for (const a of [...config.adminEmails]) {
      if (!fixed.some((f) => f.email === a)) fixed.push({ email: a, name: a.split('@')[0], role: 'admin', dept: 'Information Technology', title: 'Administrator' });
    }

    for (let i = 0; i < N; i++) {
      let email;
      let name;
      let role = 'staff';
      let deptName;
      let title;
      if (i < fixed.length) {
        ({ email, name, role } = fixed[i]);
        deptName = fixed[i].dept;
        title = fixed[i].title;
      } else {
        const f = r.pick(FIRST);
        const l = r.pick(LAST);
        name = `${f} ${l}`;
        const base = `${f}.${l.replace(/^Al-/, 'al')}`.toLowerCase().replace(/[^a-z.]/g, '');
        email = `${base}@gta.gov.qa`;
        for (let k = 2; usedEmails.has(email); k++) email = `${base}${k}@gta.gov.qa`;
        deptName = r.weighted(deptNames, deptNames.map((n) => DEPT_WEIGHTS[n]));
        title = r.pick(TITLES[deptName] || TITLES.default);
      }
      usedEmails.add(email);
      const dept = departments.find((d) => d.name === deptName);
      const hasDept = role !== 'staff' || r.chance(0.94);

      // Engagement profile: launch campaign spike in the first week.
      const engaged = role !== 'staff' ? 1 : r.next();
      const firstDay = dayFrom(startDay, 6);
      const firstLogin = instantOn(firstDay);
      const userId = await t.insert('users', {
        email,
        display_name: name,
        department_id: hasDept ? dept.id : null,
        department_set_at: hasDept ? firstLogin : null,
        job_title: title,
        role,
        first_login_at: firstLogin,
        last_login_at: firstLogin,
        is_active: 1,
        created_at: firstLogin,
        updated_at: firstLogin,
      });
      counts.users++;

      // Sessions
      const nSessions = Math.max(1, Math.round(1 + engaged * r.int(1, 10)));
      const sessions = [];
      for (let s = 0; s < nSessions; s++) {
        const login = s === 0 ? firstLogin : instantOn(dayFrom(localDate(firstLogin, tz)));
        if (login < firstLogin) continue;
        sessions.push(login);
      }
      sessions.sort((a, b) => a - b);
      let lastLogin = firstLogin;
      const sessRows = [];
      for (const login of sessions) {
        const durMin = r.int(2, 8) + Math.round(engaged * r.int(0, 35));
        let last = new Date(login.getTime() + durMin * 60e3);
        if (last > now) last = now;
        const sid = r.uuid();
        await t.insert('user_sessions', {
          id: sid,
          user_id: userId,
          login_at: login,
          last_seen_at: last,
          logout_at: r.chance(0.55) ? last : null,
          ip: `10.${r.int(10, 40)}.${r.int(0, 255)}.${r.int(2, 254)}`,
          user_agent: r.pick([
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36 Edg/141.0',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15',
          ]),
          token_jti: r.uuid(),
        });
        sessRows.push({ id: sid, login, last });
        if (login > lastLogin) lastLogin = login;
        counts.sessions++;
      }
      await t.run('UPDATE users SET last_login_at = @l WHERE id = @id', { id: userId, l: lastLogin });

      // Learning events spread across sessions
      const ev = async (type, ref, at, sid, meta) => {
        await t.insert('events', { user_id: userId, session_id: sid, type, ref, meta: meta ? JSON.stringify(meta) : null, created_at: at });
        counts.events++;
      };
      const within = (s) => new Date(s.login.getTime() + r.next() * Math.max(30e3, s.last - s.login));
      const startsLearning = role !== 'staff' || engaged > 0.08;
      const modulesToFinish = engaged > 0.38 ? modules.length : Math.floor(engaged * 4 * modules.length);
      let lastLearnAt = firstLogin;
      if (startsLearning) {
        for (let m = 0; m < modules.length; m++) {
          const s = sessRows[Math.min(sessRows.length - 1, Math.floor((m / modules.length) * sessRows.length))];
          const at = within(s);
          await ev('module_view', modules[m].id, at, s.id, { lang: r.chance(0.35) ? 'ar' : 'en' });
          if (r.chance(0.3)) await ev('module_view', modules[m].id, within(r.pick(sessRows)), s.id);
          const optionalSkip = !Boolean(modules[m].mandatory) && r.chance(0.45);
          if (m < modulesToFinish && !optionalSkip) {
            const done = new Date(at.getTime() + r.int(2, 12) * 60e3);
            await ev('module_complete', modules[m].id, done > s.last ? s.last : done, s.id);
            if (done > lastLearnAt) lastLearnAt = done;
          }
        }
        for (let k = r.int(0, Math.round(engaged * 8)); k > 0; k--) await ev('kb_view', r.pick(KB), within(r.pick(sessRows)), null);
        for (let k = r.int(0, Math.round(engaged * 3)); k > 0; k--) await ev('kb_search', r.pick(SEARCHES), within(r.pick(sessRows)), null, { results: r.int(0, 12) });
        for (let k = r.int(0, Math.round(engaged * 6)); k > 0; k--) await ev('adm_phase_view', r.pick(ADM), within(r.pick(sessRows)), null);
        if (r.chance(engaged * 0.5)) await ev('download', r.pick(['ea-principles.pdf', 'arb-request-form.docx', 'capability-map.pdf']), within(r.pick(sessRows)), null);
      }

      // Certification exam: unlocked at >= unlockPct of EA modules and of TOGAF topics.
      const doneIds = new Set();
      for (let m = 0; m < modules.length; m++) {
        if (m < modulesToFinish) doneIds.add(modules[m].id);
      }
      const trk = { ea: [0, 0], togaf: [0, 0] };
      for (const m of modules) {
        const k = m.track === 'togaf' ? 'togaf' : 'ea';
        trk[k][1]++;
        if (doneIds.has(m.id)) trk[k][0]++;
      }
      const eligible = Object.values(trk).every(([d, n]) => n === 0 || d * 100 >= unlockPct * n);
      const skill = 0.45 + engaged * 0.45;
      /** Sits up to maxAttempts exams of one level after `after`; returns completion time of the passing sitting or null. */
      const sitExams = async (level, after, skillBase, sittings) => {
        const lvRounds = roundsByLevel[level] || [];
        if (!lvRounds.length) return null;
        for (let attempt = 0; attempt < sittings; attempt++) {
          const s = sessRows[sessRows.length - 1];
          let started = new Date(Math.max(after.getTime(), s.login.getTime()) + r.int(5, 60) * 60e3 + attempt * r.int(18, 72) * 3600e3);
          if (started > now) {
            // squeeze the sitting into the time left (the demo window ends now)
            const from = Math.max(after.getTime(), lastLearnAt.getTime());
            if (from > now.getTime() - 2 * 3600e3) return null;
            started = new Date(from + 30 * 60e3 + r.next() * (now.getTime() - from - 2 * 3600e3));
          }
          const examId = r.uuid();
          let cursor = started.getTime();
          const partRows = [];
          const set = {};
          for (const round of lvRounds) {
            const pool = qByRound.get(round.id) || [];
            const n = round.questions_per_attempt ? Math.min(Number(round.questions_per_attempt), pool.length) : pool.length;
            const qs = shuffled(pool).slice(0, n);
            set[round.id] = qs.map((q) => q.id);
            let score = 0;
            let max = 0;
            const answerRows = [];
            for (const q of qs) {
              const response = makeResponse(r, q, r.chance(Math.min(0.97, skillBase + attempt * 0.08)));
              const sc = scoreAnswer(q, response);
              const timeMs = r.int(8, 80) * 1000;
              cursor += timeMs;
              score += sc.points;
              max += Number(q.points);
              answerRows.push({ q, response, sc, timeMs });
            }
            partRows.push({ round, score, max, answerRows });
          }
          const completed = new Date(Math.min(cursor, now.getTime()));
          const score = partRows.reduce((acc, p) => acc + p.score, 0);
          const max = partRows.reduce((acc, p) => acc + p.max, 0);
          const pctExact = max ? (100 * score) / max : 0;
          const passed = max > 0 && score * 100 >= certPass * max;
          await t.insert('cert_exams', {
            id: examId, user_id: userId, level, attempt_no: attempt + 1, status: 'completed', question_set: JSON.stringify(set),
            started_at: started, completed_at: completed, score, max_score: max, pct: Math.round(pctExact * 10) / 10, passed: passed ? 1 : 0,
            parts: JSON.stringify(partRows.map((p) => ({ roundId: p.round.id, score: p.score, maxScore: p.max, pct: p.max ? Math.round((1000 * p.score) / p.max) / 10 : 0 }))),
          });
          counts.exams++;
          for (const p of partRows) {
            const attemptId = r.uuid();
            await t.insert('quiz_attempts', {
              id: attemptId, user_id: userId, round_id: p.round.id, session_id: s.id, started_at: started, completed_at: completed,
              score: p.score, max_score: p.max, passed: p.max && p.score * 100 >= Number(p.round.pass_pct) * p.max ? 1 : 0,
              created_at: completed, cert_exam_id: examId,
            });
            counts.attempts++;
            for (const x of p.answerRows) {
              await t.run(
                `INSERT INTO quiz_answers (attempt_id, question_id, response, correct, points, time_ms, client_correct)
                 VALUES (@attemptId, @qid, @resp, @correct, @points, @timeMs, @correct)`,
                { attemptId, qid: x.q.id, resp: JSON.stringify(x.response), correct: x.sc.correct ? 1 : 0, points: x.sc.points, timeMs: x.timeMs },
              );
              counts.answers++;
            }
          }
          if (completed > lastLearnAt) lastLearnAt = completed;
          if (passed) {
            let cid;
            do {
              cid = `${prefixOf(level)}-${completed.getUTCFullYear()}-${Array.from({ length: 6 }, () => CERT_CHARS[r.int(0, CERT_CHARS.length - 1)]).join('')}`;
            } while (certIds.has(cid));
            certIds.add(cid);
            await t.insert('certificates', {
              certificate_id: cid, user_id: userId, level, exam_id: examId, display_name: name, department: hasDept ? dept.name : null,
              score_pct: Math.round(pctExact * 10) / 10, issued_at: completed,
            }, 'certificate_id');
            await t.insert('email_outbox', {
              to_email: email, template: 'certificate_issued',
              payload: JSON.stringify({ displayName: name, certificateId: cid, level, title: titleOf(level), scorePct: Math.round(pctExact * 10) / 10, issuedAt: completed.toISOString() }),
              status: 'sent', attempts: 1, next_attempt_at: completed, created_at: completed, sent_at: completed,
            });
            if (level === 'foundation') counts.certificates++;
            else counts[level]++;
            return completed;
          }
        }
        return null;
      };
      /** Marks most articles of a knowledge-base track complete after `after`; returns the last completion time. */
      const readKb = async (list, share, after) => {
        let last = after;
        const pick = shuffled(list).slice(0, Math.ceil(list.length * share));
        for (const m of pick) {
          let at = new Date(after.getTime() + r.int(1, 4 * 24 * 60) * 60e3);
          if (at > now) at = new Date(after.getTime() + r.next() * Math.max(60e3, now - after - 60e3));
          await ev('module_view', m.id, new Date(at.getTime() - r.int(3, 20) * 60e3), null);
          await ev('module_complete', m.id, at, null);
          if (at > last) last = at;
        }
        return { last, eligible: pick.length * 100 >= unlockPct * list.length };
      };

      let certifiedAt = null;
      if (eligible && startsLearning && rounds.length && (role !== 'staff' || r.chance(0.88))) {
        certifiedAt = await sitExams('foundation', lastLearnAt, skill, r.chance(0.12) ? 1 : maxAttempts); // a few stop after one try
      }
      const certified = Boolean(certifiedAt);
      // Practitioner (~30% of foundation-certified) and Advanced (~30% of those), after reading the KB track.
      if (certifiedAt && kbTrack.kbp.length && r.chance(0.62)) {
        const kp = await readKb(kbTrack.kbp, r.chance(0.85) ? 0.85 + r.next() * 0.15 : 0.6, certifiedAt);
        const practAt = kp.eligible ? await sitExams('practitioner', kp.last, skill - 0.02, r.chance(0.2) ? 1 : maxAttempts) : null;
        if (practAt && kbTrack.kba.length && r.chance(0.42)) {
          const ka = await readKb(kbTrack.kba, r.chance(0.85) ? 0.8 + r.next() * 0.2 : 0.5, practAt);
          if (ka.eligible) await sitExams('advanced', ka.last, skill - 0.04, r.chance(0.25) ? 1 : maxAttempts);
        }
      } else if (certifiedAt && kbTrack.kbp.length && r.chance(0.25)) {
        await readKb(kbTrack.kbp, 0.2 + r.next() * 0.5, certifiedAt); // reading, not yet eligible
      }

      // Sign-off (requires the certificate)
      if (statement && certified && r.chance(0.82)) {
        let signedAt = new Date(lastLearnAt.getTime() + r.int(2, 60 * 24) * 60e3);
        if (signedAt >= now) signedAt = new Date(lastLearnAt.getTime() + r.next() * Math.max(60e3, now - lastLearnAt - 60e3));
        const receipt = `EA-${signedAt.toISOString().slice(0, 10).replace(/-/g, '')}-${r.uuid().replace(/-/g, '').slice(0, 8).toUpperCase()}`;
        await t.insert('signoffs', {
          id: r.uuid(), receipt_id: receipt, user_id: userId, statement_version: statement.version, statement_sha256: statement.sha256.trim(),
          signed_at: signedAt, verification_method: 'password', ip: `10.${r.int(10, 40)}.${r.int(0, 255)}.${r.int(2, 254)}`, user_agent: 'demo',
        });
        await t.insert('email_outbox', {
          to_email: email, template: 'signoff_receipt',
          payload: JSON.stringify({ displayName: name, receiptId: receipt, statementVersion: statement.version, statementTitle: statement.title, statementSha256: statement.sha256.trim(), signedAt: signedAt.toISOString() }),
          status: 'sent', attempts: 1, next_attempt_at: signedAt, created_at: signedAt, sent_at: signedAt,
        });
        await t.insert('audit_log', {
          actor_user_id: userId, action: 'signoff.create', entity: 'signoff', entity_id: receipt,
          detail: JSON.stringify({ statementVersion: statement.version, demo: true }), ip: null, created_at: signedAt,
        });
        counts.signoffs++;
      }
    }
  });
  return counts;
}

if (require.main === module) {
  (async () => {
    const { bootstrap } = require('../bootstrap');
    const { db, config } = await bootstrap();
    if (db.driver !== 'sqlite' && !process.argv.includes('--force')) {
      throw new Error('seed:demo wipes users and activity - refusing to run against SQL Server without --force');
    }
    const t0 = Date.now();
    const counts = await seedDemo(db, config, { users: arg('users', 180), days: arg('days', 45), seed: arg('seed', 20261102) });
    console.log(`seed:demo done in ${Date.now() - t0} ms`, counts);
    const { createReviewer, printResult } = require('./createReviewer');
    printResult(await createReviewer(db, config));
    console.log('Admin accounts: ea.admin@gta.gov.qa, it.director@gta.gov.qa (no password yet: sign up once with the emailed code — it prints in the server console — or run: npm run set-password -- <email> <password>)');
    await db.close();
  })().catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
}

module.exports = { seedDemo };
