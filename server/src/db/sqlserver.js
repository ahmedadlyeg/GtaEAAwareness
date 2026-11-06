'use strict';
/**
 * Microsoft SQL Server driver (package `mssql`, tedious) implementing the same
 * data-access interface as ./sqlite.js. Application SQL uses unqualified table
 * names, so the database user must have DEFAULT_SCHEMA = ea (see
 * db/schema.sqlserver.sql). The DDL itself is applied by a DBA, not by the app.
 *
 * Portable SQL rules followed by the services so both drivers work:
 *  - named parameters as @name;
 *  - no LIMIT/TOP in SQL text: pass { limit } to all();
 *  - inserts go through insert() (RETURNING vs OUTPUT INSERTED);
 *  - timestamps are bound from JS Date objects (UTC) - no NOW()/SYSUTCDATETIME();
 *  - booleans are compared as = 1 / = 0.
 */
let sql;
try {
  sql = require('mssql');
} catch (e) {
  sql = null;
}

const GUID_RE = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/;

function bindInput(req, name, v) {
  if (v === undefined || v === null) return req.input(name, sql.NVarChar(sql.MAX), null);
  if (v instanceof Date) return req.input(name, sql.DateTime2(3), v);
  if (Buffer.isBuffer(v)) return req.input(name, sql.VarBinary(sql.MAX), v);
  if (typeof v === 'boolean') return req.input(name, sql.Bit, v);
  if (typeof v === 'number') {
    return Number.isInteger(v) && Math.abs(v) < 2 ** 31
      ? req.input(name, sql.Int, v)
      : Number.isInteger(v)
        ? req.input(name, sql.BigInt, v)
        : req.input(name, sql.Float, v);
  }
  if (typeof v === 'object') return req.input(name, sql.NVarChar(sql.MAX), JSON.stringify(v));
  return req.input(name, sql.NVarChar(sql.MAX), String(v));
}

function normalizeRow(row) {
  if (!row) return row;
  for (const k of Object.keys(row)) {
    const v = row[k];
    if (v instanceof Date) row[k] = v.toISOString();
    else if (typeof v === 'string' && GUID_RE.test(v)) row[k] = v.toLowerCase();
  }
  return row;
}

function applyTop(text, limit) {
  if (!limit) return text;
  const n = Number(limit) | 0;
  // Insert TOP (n) after the first top-level SELECT [DISTINCT].
  return text.replace(/^\s*SELECT(\s+DISTINCT)?/i, (m, d) => `SELECT${d || ''} TOP (${n})`);
}

function makeExecutor(getRequest) {
  const exec = async (text, params) => {
    const req = getRequest();
    for (const [k, v] of Object.entries(params || {})) bindInput(req, k, v);
    return req.query(text);
  };
  return {
    async all(text, params, opts = {}) {
      const r = await exec(applyTop(text, opts.limit), params);
      return r.recordset.map(normalizeRow);
    },
    async get(text, params) {
      const r = await exec(text, params);
      return normalizeRow(r.recordset[0]);
    },
    async run(text, params) {
      const r = await exec(text, params);
      return { changes: (r.rowsAffected || []).reduce((a, b) => a + b, 0) };
    },
    async insert(table, row, idColumn = 'id') {
      const cols = Object.keys(row);
      const text = `INSERT INTO ${table} (${cols.join(', ')}) OUTPUT INSERTED.${idColumn} AS id VALUES (${cols.map((c) => '@' + c).join(', ')})`;
      const r = await exec(text, row);
      const id = r.recordset[0].id;
      return typeof id === 'string' && GUID_RE.test(id) ? id.toLowerCase() : id;
    },
  };
}

async function createSqlServer({ connectionString, pool: poolOpts }) {
  if (!sql) throw new Error('DB_DRIVER=mssql requires the "mssql" package (npm install mssql)');
  if (!connectionString) throw new Error('MSSQL_CONNECTION_STRING is not set');
  const pool = new sql.ConnectionPool(
    typeof connectionString === 'string' ? connectionString : { ...connectionString, ...poolOpts },
  );
  pool.on('error', (e) => console.error('[mssql] pool error', e.message));
  await pool.connect();

  const base = makeExecutor(() => pool.request());
  const db = {
    driver: 'mssql',
    pool,
    ...base,
    async tx(fn) {
      const t = new sql.Transaction(pool);
      await t.begin(sql.ISOLATION_LEVEL.READ_COMMITTED);
      const scoped = { driver: 'mssql', ...makeExecutor(() => new sql.Request(t)) };
      scoped.tx = async (inner) => inner(scoped);
      try {
        const result = await fn(scoped);
        await t.commit();
        return result;
      } catch (e) {
        try {
          await t.rollback();
        } catch (_) {
          /* already rolled back by XACT_ABORT */
        }
        throw e;
      }
    },
    /** Production DDL is applied by a DBA; here we only check it is present. */
    async migrate() {
      const r = await pool.request().query(
        "SELECT COUNT(*) AS n FROM sys.tables t JOIN sys.schemas s ON s.schema_id = t.schema_id WHERE s.name = 'ea'",
      );
      if (!r.recordset[0].n) {
        throw new Error('Schema "ea" not found - apply db/schema.sqlserver.sql first');
      }
      const u = await pool.request().query('SELECT SCHEMA_NAME() AS s');
      if (u.recordset[0].s !== 'ea') {
        console.warn(`[mssql] default schema is "${u.recordset[0].s}", expected "ea" (ALTER USER ... WITH DEFAULT_SCHEMA = ea)`);
      }
    },
    async close() {
      await pool.close();
    },
  };
  return db;
}

module.exports = { createSqlServer, applyTop };
