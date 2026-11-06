'use strict';
const { allCertifications, getCertificate } = require('./cert');

async function activeStatement(db) {
  return db.get(
    'SELECT version, title, body_markdown, sha256, published_at FROM signoff_statements WHERE active = 1',
  );
}

async function getProgress(db, userId, config = {}) {
  const completed = await db.all(
    "SELECT DISTINCT ref FROM events WHERE user_id = @userId AND type = 'module_complete' AND ref IS NOT NULL",
    { userId },
  );
  const kb = await db.get(
    "SELECT COUNT(DISTINCT ref) AS n FROM events WHERE user_id = @userId AND type = 'kb_view'",
    { userId },
  );
  const attempts = await db.all(
    `SELECT round_id, score, max_score, passed, completed_at FROM quiz_attempts
      WHERE user_id = @userId ORDER BY completed_at`,
    { userId },
  );
  const byRound = new Map();
  for (const a of attempts) {
    const cur = byRound.get(a.round_id);
    const pct = a.max_score ? a.score / a.max_score : 0;
    if (!cur) {
      byRound.set(a.round_id, { roundId: a.round_id, bestScore: a.score, maxScore: a.max_score, lastAt: a.completed_at, _pct: pct, passed: Boolean(a.passed) });
    } else {
      if (pct > cur._pct || (pct === cur._pct && a.score > cur.bestScore)) {
        Object.assign(cur, { bestScore: a.score, maxScore: a.max_score, _pct: pct });
      }
      cur.passed = cur.passed || Boolean(a.passed);
      if (a.completed_at > cur.lastAt) cur.lastAt = a.completed_at;
    }
  }
  const st = await activeStatement(db);
  let signoff = null;
  if (st) {
    const s = await db.get(
      'SELECT statement_version, signed_at, receipt_id FROM signoffs WHERE user_id = @userId AND statement_version = @v',
      { userId, v: st.version },
    );
    if (s) signoff = { statementVersion: s.statement_version, signedAt: s.signed_at, receiptId: s.receipt_id };
  }
  const certs = await allCertifications(db, config, userId);
  return {
    modulesCompleted: completed.map((r) => r.ref),
    kbViewed: Number(kb.n) || 0,
    attempts: [...byRound.values()].map(({ roundId, bestScore, maxScore, lastAt, passed }) => ({
      roundId,
      bestScore,
      maxScore,
      lastAt,
      passed,
    })),
    signoff,
    certification: certs.foundation,
    certifications: certs,
  };
}

/**
 * Sign-off pre-condition: the user holds a valid (non-revoked) EA Foundation certificate.
 * missingModules / missingRounds are kept (empty) for backward compatibility.
 */
async function checkPreconditions(db, userId) {
  const cert = await getCertificate(db, userId);
  return { ok: Boolean(cert), certified: Boolean(cert), missingModules: [], missingRounds: [] };
}

module.exports = { getProgress, checkPreconditions, activeStatement };
