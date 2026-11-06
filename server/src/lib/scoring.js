'use strict';
/**
 * Server-side scoring against questions.answer_key. Full points if correct, else 0.
 *
 *   mcq         key { answer: <index> }               response <index>
 *   truefalse   key { answer: <bool> }                response <bool>
 *   order       key { items: [..] }                   response [..] (exact order)
 *   match       key { pairs: [{ l, r }] }             response [{ l, r }] (any order, same set)
 *   categorize  key { items: [{ t, b }] }             response [{ t, b }] (any order, same set)
 */
function same(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function pairSet(arr, a, b) {
  if (!Array.isArray(arr)) return null;
  const out = [];
  for (const x of arr) {
    if (!x || typeof x !== 'object') return null;
    out.push(JSON.stringify([x[a], x[b]]));
  }
  return out.sort();
}

function isCorrect(type, key, response) {
  if (!key || typeof key !== 'object') return false;
  switch (type) {
    case 'mcq':
      return Number.isInteger(response) && response === key.answer;
    case 'truefalse':
      return typeof response === 'boolean' && response === key.answer;
    case 'order':
      return Array.isArray(response) && Array.isArray(key.items) && same(response, key.items);
    case 'match': {
      const r = pairSet(response, 'l', 'r');
      const k = pairSet(key.pairs, 'l', 'r');
      return !!r && !!k && new Set(r).size === r.length && same(r, k);
    }
    case 'categorize': {
      const r = pairSet(response, 't', 'b');
      const k = pairSet(key.items, 't', 'b');
      return !!r && !!k && new Set(r).size === r.length && same(r, k);
    }
    default:
      return false;
  }
}

function scoreAnswer(question, response) {
  let key = question.answer_key;
  if (typeof key === 'string') key = JSON.parse(key);
  const correct = isCorrect(question.type, key, response);
  return { correct, points: correct ? Number(question.points) : 0 };
}

module.exports = { isCorrect, scoreAnswer };
