'use strict';
const crypto = require('crypto');
const { err } = require('../lib/errors');
const { scoreAnswer } = require('../lib/scoring');

function parseTime(v, name) {
  if (typeof v !== 'string' || Number.isNaN(Date.parse(v))) throw err('validation', `${name} must be an ISO-8601 timestamp`);
  return new Date(v);
}

/**
 * Validate, re-score (server answer key is authoritative) and store an attempt.
 *
 * Rules
 *  - roundId must be an active round; every questionId must be an active question of that round
 *    (unknown / foreign / duplicate ids -> validation error);
 *  - the attempt must answer at least quiz_rounds.questions_per_attempt questions
 *    (NULL = all active questions of the round);
 *  - maxScore = sum of points of the answered questions; passed = score/maxScore >= pass_pct.
 */
async function submitAttempt(db, config, { userId, sessionId }, body) {
  if (!body || typeof body !== 'object') throw err('validation', 'attempt body is required');
  const { roundId, answers } = body;
  if (typeof roundId !== 'string' || !roundId) throw err('validation', 'roundId is required');
  const startedAt = parseTime(body.startedAt, 'startedAt');
  const completedAt = parseTime(body.completedAt, 'completedAt');
  const now = Date.now();
  if (startedAt > completedAt) throw err('validation', 'startedAt must be before completedAt');
  if (completedAt.getTime() > now + 5 * 60 * 1000) throw err('validation', 'completedAt is in the future');
  if (!Array.isArray(answers) || answers.length === 0) throw err('validation', 'answers must be a non-empty array');
  if (answers.length > 500) throw err('validation', 'too many answers');

  const round = await db.get(
    'SELECT id, pass_pct, questions_per_attempt FROM quiz_rounds WHERE id = @roundId AND active = 1',
    { roundId },
  );
  if (!round) throw err('validation', `Unknown roundId "${roundId}"`);
  const questions = await db.all(
    'SELECT id, type, points, answer_key FROM questions WHERE round_id = @roundId AND active = 1',
    { roundId },
  );
  const byId = new Map(questions.map((q) => [q.id, q]));

  const seen = new Set();
  const unknown = [];
  const scored = [];
  for (const a of answers) {
    if (!a || typeof a !== 'object' || typeof a.questionId !== 'string') {
      throw err('validation', 'each answer needs a questionId');
    }
    if (seen.has(a.questionId)) throw err('validation', `Duplicate answer for question "${a.questionId}"`);
    seen.add(a.questionId);
    const q = byId.get(a.questionId);
    if (!q) {
      unknown.push(a.questionId);
      continue;
    }
    if (a.response === undefined) throw err('validation', `Missing response for question "${a.questionId}"`);
    const responseJson = JSON.stringify(a.response);
    if (responseJson.length > 8000) throw err('validation', `Response too large for question "${a.questionId}"`);
    const timeMs = a.timeMs === undefined || a.timeMs === null ? null : Number(a.timeMs);
    if (timeMs !== null && (!Number.isInteger(timeMs) || timeMs < 0 || timeMs > 86_400_000)) {
      throw err('validation', `timeMs must be a non-negative integer (question "${a.questionId}")`);
    }
    const { correct, points } = scoreAnswer(q, a.response);
    scored.push({
      questionId: q.id,
      response: responseJson,
      correct,
      points,
      maxPoints: Number(q.points),
      timeMs,
      clientCorrect: typeof a.correct === 'boolean' ? a.correct : null,
    });
  }
  if (unknown.length) throw err('validation', `Unknown question id(s) for round "${roundId}": ${unknown.join(', ')}`);
  const required = round.questions_per_attempt ?? questions.length;
  if (scored.length < required) {
    throw err('validation', `This round requires ${required} answers, got ${scored.length}`);
  }

  const score = scored.reduce((s, a) => s + a.points, 0);
  const maxScore = scored.reduce((s, a) => s + a.maxPoints, 0);
  const passPct = round.pass_pct === null || round.pass_pct === undefined ? config.passPct : Number(round.pass_pct);
  const passed = maxScore > 0 && score * 100 >= passPct * maxScore;
  const attemptId = crypto.randomUUID();

  await db.tx(async (t) => {
    await t.insert('quiz_attempts', {
      id: attemptId,
      user_id: userId,
      round_id: roundId,
      session_id: sessionId || null,
      started_at: startedAt,
      completed_at: completedAt,
      score,
      max_score: maxScore,
      passed: passed ? 1 : 0,
      created_at: new Date(),
    });
    for (const a of scored) {
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
  });
  return { attemptId, score, maxScore, passed };
}

async function listAttempts(db, userId) {
  const rows = await db.all(
    `SELECT id, round_id, started_at, completed_at, score, max_score, passed FROM quiz_attempts
      WHERE user_id = @userId ORDER BY completed_at DESC`,
    { userId },
  );
  return rows.map((r) => ({
    attemptId: r.id,
    roundId: r.round_id,
    startedAt: r.started_at,
    completedAt: r.completed_at,
    score: r.score,
    maxScore: r.max_score,
    passed: Boolean(r.passed),
  }));
}

module.exports = { submitAttempt, listAttempts };
