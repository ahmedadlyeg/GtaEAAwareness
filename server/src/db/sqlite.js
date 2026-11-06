'use strict';
/**
 * SQLite driver (better-sqlite3) implementing the data-access interface used by
 * the services. See ./index.js for the interface contract.
 */
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

function toParam(v) {
  if (v === undefined || v === null) return null;
  if (v instanceof Date) return v.toISOString();
  if (typeof v === 'boolean') return v ? 1 : 0;
  if (typeof v === 'object' && !Buffer.isBuffer(v)) return JSON.stringify(v);
  return v;
}
function bind(params) {
  const out = {};
  for (const [k, v] of Object.entries(params || {})) out[k] = toParam(v);
  return out;
}

function createSqlite({ filename }) {
  if (filename !== ':memory:') fs.mkdirSync(path.dirname(filename), { recursive: true });
  const raw = new Database(filename);
  raw.pragma('journal_mode = WAL');
  raw.pragma('foreign_keys = ON');
  raw.pragma('busy_timeout = 5000');
  const cache = new Map();
  const prep = (sql) => {
    let st = cache.get(sql);
    if (!st) {
      st = raw.prepare(sql);
      cache.set(sql, st);
    }
    return st;
  };
  let inTx = false;

  const db = {
    driver: 'sqlite',
    raw,
    async all(sql, params, opts = {}) {
      const q = opts.limit ? `${sql} LIMIT ${Number(opts.limit) | 0}` : sql;
      return prep(q).all(bind(params));
    },
    async get(sql, params) {
      return prep(sql).get(bind(params));
    },
    async run(sql, params) {
      const r = prep(sql).run(bind(params));
      return { changes: r.changes };
    },
    async insert(table, row, idColumn = 'id') {
      const cols = Object.keys(row);
      const sql = `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${cols.map((c) => '@' + c).join(', ')}) RETURNING ${idColumn} AS id`;
      return prep(sql).get(bind(row)).id;
    },
    /**
     * Runs fn(db) inside a transaction. better-sqlite3 is synchronous, so as long as
     * fn only awaits this driver's (already-resolved) promises no other request can
     * interleave statements between BEGIN and COMMIT.
     */
    async tx(fn) {
      if (inTx) return fn(db);
      raw.exec('BEGIN IMMEDIATE');
      inTx = true;
      try {
        const result = await fn(db);
        raw.exec('COMMIT');
        return result;
      } catch (e) {
        raw.exec('ROLLBACK');
        throw e;
      } finally {
        inTx = false;
      }
    },
    async migrate() {
      const ddl = fs.readFileSync(path.resolve(__dirname, '../../db/schema.sqlite.sql'), 'utf8');
      // In-place upgrades for databases created by an earlier schema version
      // (CREATE TABLE IF NOT EXISTS never adds columns or changes CHECKs).
      const tableSql = (t) => {
        const r = raw.prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = ?").get(t);
        return r ? r.sql : null;
      };
      const cols = (t) => raw.prepare(`PRAGMA table_info(${t})`).all().map((c) => c.name);
      // Tables whose CHECK / UNIQUE constraints changed are rebuilt from the DDL below:
      // rename the old table away, let the DDL create the new one, copy rows, drop the old.
      const rebuild = [];
      const needs = (t, marker) => {
        const sql = tableSql(t);
        if (sql && !sql.includes(marker)) rebuild.push(t);
      };
      needs('content_modules', "'kbp'");
      needs('cert_exams', 'level');
      needs('certificates', 'level');
      needs('cert_attempt_grants', 'level');
      needs('otp_challenges', "'signup'");
      needs('signoffs', 'verification_method');
      if (tableSql('users')) {
        const uc = cols('users');
        if (!uc.includes('password_hash')) raw.exec('ALTER TABLE users ADD COLUMN password_hash TEXT');
        if (!uc.includes('password_set_at')) raw.exec('ALTER TABLE users ADD COLUMN password_set_at TEXT');
        if (!uc.includes('failed_logins')) raw.exec('ALTER TABLE users ADD COLUMN failed_logins INTEGER NOT NULL DEFAULT 0');
        if (!uc.includes('locked_until')) raw.exec('ALTER TABLE users ADD COLUMN locked_until TEXT');
      }
      if (tableSql('quiz_rounds') && !cols('quiz_rounds').includes('level')) {
        raw.exec("ALTER TABLE quiz_rounds ADD COLUMN level TEXT NOT NULL DEFAULT 'foundation' CHECK (level IN ('foundation', 'practitioner', 'advanced'))");
      }
      if (tableSql('cert_exams') && !rebuild.includes('cert_exams') && !cols('cert_exams').includes('is_preview')) {
        raw.exec('ALTER TABLE cert_exams ADD COLUMN is_preview INTEGER NOT NULL DEFAULT 0 CHECK (is_preview IN (0, 1))');
      }
      if (tableSql('quiz_attempts') && !cols('quiz_attempts').includes('cert_exam_id')) {
        raw.exec('ALTER TABLE quiz_attempts ADD COLUMN cert_exam_id TEXT');
      }
      const oldCols = {};
      const outbox = tableSql('email_outbox');
      const rebuildOutbox = Boolean(outbox && !outbox.includes('signup_otp'));
      if (rebuild.length) {
        raw.pragma('foreign_keys = OFF'); // cannot change inside a transaction
        raw.pragma('legacy_alter_table = ON'); // keep other tables' FK text pointing at the original names
      }
      const idx = { cert_exams: 'ix_cert_exams_user', certificates: 'ix_certificates_issued', cert_attempt_grants: 'ix_cert_grants_user', otp_challenges: 'ix_otp_email_created', signoffs: 'ix_signoffs_signed_at' };
      raw.exec('BEGIN IMMEDIATE');
      try {
        for (const t of rebuild) {
          oldCols[t] = cols(t);
          if (idx[t]) raw.exec(`DROP INDEX IF EXISTS ${idx[t]}`);
          raw.exec(`ALTER TABLE ${t} RENAME TO ${t}_v1`);
        }
        if (rebuildOutbox) raw.exec('DROP INDEX IF EXISTS ix_outbox_status_next; ALTER TABLE email_outbox RENAME TO email_outbox_v1;');
        raw.exec(ddl);
        if (rebuildOutbox) raw.exec('INSERT INTO email_outbox SELECT * FROM email_outbox_v1; DROP TABLE email_outbox_v1;');
        for (const t of rebuild) {
          const keep = oldCols[t].filter((c) => cols(t).includes(c)).join(', ');
          // OR REPLACE: existing rows win over the placeholder seed rows the DDL just inserted
          raw.exec(`INSERT OR REPLACE INTO ${t} (${keep}) SELECT ${keep} FROM ${t}_v1; DROP TABLE ${t}_v1;`);
          // sign-offs made before password confirmation were verified with an e-mailed code
          if (t === 'signoffs') raw.exec("UPDATE signoffs SET verification_method = 'otp' WHERE otp_challenge_id IS NOT NULL");
        }
        raw.exec('COMMIT');
      } finally {
        if (raw.inTransaction) raw.exec('ROLLBACK');
        if (rebuild.length) {
          raw.pragma('legacy_alter_table = OFF');
          raw.pragma('foreign_keys = ON');
        }
      }
    },
    async close() {
      raw.close();
    },
  };
  return db;
}

module.exports = { createSqlite };
