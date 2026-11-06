'use strict';
const crypto = require('crypto');
const { err } = require('../lib/errors');
const { checkPreconditions, activeStatement } = require('./progress');
const { checkUserPassword } = require('./credentials');
const { enqueue } = require('../mail/outbox');
const { audit } = require('./audit');
const { isReviewerEmail } = require('./users');

const B32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'; // Crockford base32 (no I, L, O, U)
function receiptId(now) {
  let s = '';
  for (let i = 0; i < 8; i++) s += B32[crypto.randomInt(32)];
  return `EA-${now.toISOString().slice(0, 10).replace(/-/g, '')}-${s}`;
}

function statementDto(st) {
  return { version: st.version, title: st.title, bodyMarkdown: st.body_markdown, sha256: st.sha256.trim() };
}

async function getStatement(db) {
  const st = await activeStatement(db);
  if (!st) throw err('not_found', 'No active sign-off statement', 404);
  return st;
}

async function assertCanSign(db, user, st, config) {
  if (isReviewerEmail(config, user.email)) throw err('preconditions_not_met', 'Reviewer accounts cannot sign the acknowledgement');
  const existing = await db.get(
    'SELECT receipt_id FROM signoffs WHERE user_id = @userId AND statement_version = @v',
    { userId: user.id, v: st.version },
  );
  if (existing) throw err('preconditions_not_met', `Already signed version ${st.version} (receipt ${existing.receipt_id})`);
  const pre = await checkPreconditions(db, user.id);
  if (!pre.ok) {
    throw err(
      'preconditions_not_met',
      'Sign-off not yet possible - earn the EA Foundation certificate first (complete the reading and pass the certification exam).',
    );
  }
}

async function sign(db, config, user, body, { ip, userAgent }) {
  const { password, statementVersion, sha256 } = body || {};
  if (typeof password !== 'string' || !password) throw err('validation', 'Enter your password to confirm the sign-off');
  if (typeof statementVersion !== 'string' || typeof sha256 !== 'string') {
    throw err('validation', 'statementVersion and sha256 are required');
  }
  const st = await getStatement(db);
  if (statementVersion !== st.version || sha256.toLowerCase() !== st.sha256.trim()) {
    throw err('statement_mismatch', 'The statement you read is not the active version. Reload and read it again.');
  }
  await assertCanSign(db, user, st, config);
  // Re-authenticate: the user's password confirms the signature (failures count towards the lockout)
  await checkUserPassword(db, config, user, password);

  const signedAt = new Date();
  const rid = receiptId(signedAt);
  try {
    await db.tx(async (t) => {
      await t.insert('signoffs', {
        id: crypto.randomUUID(),
        receipt_id: rid,
        user_id: user.id,
        statement_version: st.version,
        statement_sha256: st.sha256.trim(),
        signed_at: signedAt,
        verification_method: 'password',
        ip,
        user_agent: userAgent ? String(userAgent).slice(0, 512) : null,
      });
      await enqueue(t, {
        to: user.email,
        template: 'signoff_receipt',
        payload: {
          displayName: user.display_name,
          receiptId: rid,
          statementVersion: st.version,
          statementTitle: st.title,
          statementSha256: st.sha256.trim(),
          signedAt: signedAt.toISOString(),
        },
      });
      await audit(t, {
        actorUserId: user.id,
        action: 'signoff.create',
        entity: 'signoff',
        entityId: rid,
        detail: { statementVersion: st.version, sha256: st.sha256.trim(), verifiedBy: 'password' },
        ip,
      });
    });
  } catch (e) {
    if (/UNIQUE|duplicate key/i.test(e.message)) throw err('preconditions_not_met', `Already signed version ${st.version}`);
    throw e;
  }
  return { receiptId: rid, signedAt: signedAt.toISOString() };
}

module.exports = { statementDto, getStatement, sign, receiptId };
