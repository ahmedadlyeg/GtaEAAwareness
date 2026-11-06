'use strict';
/**
 * Upsert modules, rounds and questions (answer keys) from src/seed/questions.json
 * (or a file given as the first CLI argument). Usage: npm run seed:questions [-- path/to/file.json]
 */
const fs = require('fs');
const path = require('path');

const TYPES = ['mcq', 'truefalse', 'order', 'match', 'categorize'];

function validateKey(q) {
  const k = q.answerKey;
  const bad = (m) => {
    throw new Error(`question ${q.id}: ${m}`);
  };
  if (!TYPES.includes(q.type)) bad(`type must be one of ${TYPES.join(', ')}`);
  if (!k || typeof k !== 'object') bad('answerKey is required');
  if (q.type === 'mcq' && !Number.isInteger(k.answer)) bad('mcq answerKey.answer must be an integer index');
  if (q.type === 'truefalse' && typeof k.answer !== 'boolean') bad('truefalse answerKey.answer must be boolean');
  if (q.type === 'order' && !(Array.isArray(k.items) && k.items.length > 1)) bad('order answerKey.items must be an array');
  if (q.type === 'match' && !(Array.isArray(k.pairs) && k.pairs.every((p) => p && 'l' in p && 'r' in p))) bad('match answerKey.pairs must be [{l,r}]');
  if (q.type === 'categorize' && !(Array.isArray(k.items) && k.items.every((p) => p && 't' in p && 'b' in p))) bad('categorize answerKey.items must be [{t,b}]');
}

async function upsert(t, table, keyCol, row) {
  const exists = await t.get(`SELECT ${keyCol} FROM ${table} WHERE ${keyCol} = @${keyCol}`, { [keyCol]: row[keyCol] });
  const cols = Object.keys(row).filter((c) => c !== keyCol);
  if (exists) {
    await t.run(`UPDATE ${table} SET ${cols.map((c) => `${c} = @${c}`).join(', ')} WHERE ${keyCol} = @${keyCol}`, row);
    return 'updated';
  }
  await t.run(`INSERT INTO ${table} (${Object.keys(row).join(', ')}) VALUES (${Object.keys(row).map((c) => '@' + c).join(', ')})`, row);
  return 'inserted';
}

async function seedQuestions(db, data) {
  const stats = { modules: 0, rounds: 0, inserted: 0, updated: 0, deactivated: 0 };
  for (const q of data.questions || []) validateKey(q);
  await db.tx(async (t) => {
    for (const m of data.modules || []) {
      await upsert(t, 'content_modules', 'id', {
        id: m.id,
        title: m.title,
        title_ar: m.titleAr || null,
        mandatory: m.mandatory === false ? 0 : 1,
        version: m.version || 1,
        sort_order: m.sortOrder ?? 100,
        active: m.active === false ? 0 : 1,
        track: ['ea', 'togaf', 'kbf', 'kbp', 'kba'].includes(m.track) ? m.track : 'ea',
      });
      stats.modules++;
    }
    for (const r of data.rounds || []) {
      await upsert(t, 'quiz_rounds', 'id', {
        id: r.id,
        title: r.title,
        mandatory: r.mandatory === false ? 0 : 1,
        pass_pct: r.passPct ?? 70,
        questions_per_attempt: r.questionsPerAttempt ?? null,
        level: ['foundation', 'practitioner', 'advanced'].includes(r.level) ? r.level : 'foundation',
        sort_order: r.sortOrder ?? 100,
        active: r.active === false ? 0 : 1,
      });
      stats.rounds++;
    }
    for (const q of data.questions || []) {
      const res = await upsert(t, 'questions', 'id', {
        id: q.id,
        round_id: q.roundId,
        tag: q.tag || null,
        type: q.type,
        prompt: q.prompt || null,
        points: q.points ?? 1,
        answer_key: JSON.stringify(q.answerKey),
        active: q.active === false ? 0 : 1,
        updated_at: new Date(),
      });
      stats[res]++;
    }
    if (data.deactivateMissing) {
      const keep = new Set((data.questions || []).map((q) => q.id));
      for (const r of data.rounds || []) {
        const rows = await t.all('SELECT id FROM questions WHERE round_id = @roundId AND active = 1', { roundId: r.id });
        for (const row of rows) {
          if (!keep.has(row.id)) {
            await t.run('UPDATE questions SET active = 0, updated_at = @now WHERE id = @id', { id: row.id, now: new Date() });
            stats.deactivated++;
          }
        }
      }
    }
  });
  return stats;
}

if (require.main === module) {
  (async () => {
    const { bootstrap } = require('../bootstrap');
    const file = path.resolve(process.argv[2] || path.join(__dirname, 'questions.json'));
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const { db } = await bootstrap();
    const stats = await seedQuestions(db, data);
    console.log(`seed:questions from ${file}:`, stats);
    await db.close();
  })().catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
}

module.exports = { seedQuestions };
