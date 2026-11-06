'use strict';
/**
 * Data-access factory. Both drivers expose the same async interface:
 *
 *   all(sql, params?, { limit? })  -> rows[]
 *   get(sql, params?)              -> row | undefined
 *   run(sql, params?)              -> { changes }
 *   insert(table, row, idColumn?)  -> generated / supplied id
 *   tx(async (db) => ...)          -> result (commit) / throws (rollback)
 *   migrate()                      -> apply (sqlite) or verify (mssql) schema
 *   close()
 *
 * Row values come back normalised: timestamps as ISO-8601 UTC strings, uuids
 * lower-case, booleans as 0/1 (sqlite) or true/false (mssql) - use Boolean().
 */
const { createSqlite } = require('./sqlite');

async function createDb(config) {
  if (config.dbDriver === 'mssql') {
    const { createSqlServer } = require('./sqlserver');
    return createSqlServer({ connectionString: config.mssqlConnectionString });
  }
  if (config.dbDriver !== 'sqlite') throw new Error(`Unknown DB_DRIVER "${config.dbDriver}"`);
  return createSqlite({ filename: config.sqlitePath });
}

module.exports = { createDb };
