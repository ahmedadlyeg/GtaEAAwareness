'use strict';
/**
 * Create (or refresh) the exam-reviewer account.
 *   npm run create-reviewer                      -> exam.reviewer@gta.gov.qa / GtaExams2026!
 *   npm run create-reviewer -- <email> <password>
 *
 * The account: display name "Exam Reviewer", department Information Technology,
 * role ea_team (can open the dashboard), password set (policy applies, lockout
 * cleared), and every active module / TOGAF topic / knowledge-base article marked
 * complete. The e-mail must be listed in REVIEWER_EMAILS (default
 * exam.reviewer@gta.gov.qa) for the reviewer behaviour to apply: all exams
 * unlocked, unlimited preview sittings, no certificates, excluded from reporting.
 * Idempotent: re-running only adds missing completions and resets the password.
 */
const users = require('../services/users');
const { preparePassword, storeHash } = require('../services/credentials');
const { audit } = require('../services/audit');

const DEFAULT_EMAIL = 'exam.reviewer@gta.gov.qa';
const DEFAULT_PASSWORD = 'GtaExams2026!';
const TRACKS = ['ea', 'togaf', 'kbf', 'kbp', 'kba'];

async function createReviewer(db, config, { email: rawEmail = DEFAULT_EMAIL, password = DEFAULT_PASSWORD } = {}) {
  const email = users.normaliseEmail(config, rawEmail);
  const hash = await preparePassword(password, email);
  const now = new Date();
  const dept = await users.findDepartment(db, 'Information Technology');
  return db.tx(async (t) => {
    let u = await users.getUserByEmail(t, email);
    let created = false;
    if (!u) {
      await t.insert('users', {
        email, display_name: 'Exam Reviewer', role: 'ea_team', is_active: 1, created_at: now, updated_at: now,
      });
      created = true;
    }
    await t.run(
      `UPDATE users SET display_name = 'Exam Reviewer', job_title = 'Exam reviewer', is_active = 1,
              role = CASE WHEN role = 'admin' THEN 'admin' ELSE 'ea_team' END,
              department_id = @deptId, department_set_at = COALESCE(department_set_at, @now), updated_at = @now
        WHERE email = @email`,
      { email, deptId: dept ? dept.id : null, now },
    );
    u = await users.getUserByEmail(t, email);
    await storeHash(t, u.id, hash, now);

    const modules = await t.all(
      `SELECT id FROM content_modules WHERE active = 1 AND track IN (${TRACKS.map((_, i) => `@t${i}`).join(', ')})`,
      Object.fromEntries(TRACKS.map((k, i) => [`t${i}`, k])),
    );
    const done = new Set(
      (await t.all("SELECT DISTINCT ref FROM events WHERE user_id = @userId AND type = 'module_complete' AND ref IS NOT NULL", { userId: u.id })).map((r) => r.ref),
    );
    let added = 0;
    for (const m of modules) {
      if (done.has(m.id)) continue;
      await t.insert('events', { user_id: u.id, session_id: null, type: 'module_complete', ref: m.id, meta: JSON.stringify({ reviewerSetup: true }), created_at: now });
      added++;
    }
    await audit(t, { action: 'user.reviewer_setup', entity: 'user', entityId: String(u.id), detail: { created, completionsAdded: added } });
    return {
      userId: u.id,
      email,
      password,
      created,
      completionsAdded: added,
      modules: modules.length,
      reviewerListed: Array.isArray(config.reviewerEmails) && config.reviewerEmails.includes(email),
    };
  });
}

function printResult(r) {
  console.log(`Exam reviewer ${r.created ? 'created' : 'updated'}: ${r.email}  password: ${r.password}`);
  console.log(`  ${r.modules} modules/topics/articles complete (${r.completionsAdded} newly added); role ea_team.`);
  if (!r.reviewerListed) console.log(`  WARNING: ${r.email} is not in REVIEWER_EMAILS - add it, or the account behaves like a normal user.`);
}

if (require.main === module) {
  (async () => {
    const [email, password] = process.argv.slice(2);
    const { bootstrap } = require('../bootstrap');
    const { db, config } = await bootstrap();
    try {
      printResult(await createReviewer(db, config, { email: email || DEFAULT_EMAIL, password: password || DEFAULT_PASSWORD }));
    } catch (e) {
      console.error(e.code ? `Error: ${e.message}` : e);
      process.exitCode = 1;
    } finally {
      await db.close();
    }
  })();
}

module.exports = { createReviewer, printResult, DEFAULT_EMAIL, DEFAULT_PASSWORD };
