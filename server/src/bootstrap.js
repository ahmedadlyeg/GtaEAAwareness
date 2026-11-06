'use strict';
/** Shared start-up used by the server and the seed scripts. */
const path = require('path');
const crypto = require('crypto');
require('dotenv').config({ path: path.resolve(__dirname, '../.env'), quiet: true });
const { loadConfig } = require('./config');
const { createDb } = require('./db');
const { createLogger } = require('./lib/log');

async function bootstrap(overrides = {}, env = process.env) {
  const config = loadConfig(env, overrides);
  const log = createLogger(config.logLevel);
  const db = await createDb(config);
  await db.migrate();
  const st = await db.get('SELECT version, body_markdown, sha256 FROM signoff_statements WHERE active = 1', {});
  if (!st) log.warn('no active sign-off statement');
  else {
    const h = crypto.createHash('sha256').update(st.body_markdown.replace(/\r\n/g, '\n'), 'utf8').digest('hex');
    if (h !== st.sha256.trim()) log.error('active statement sha256 does not match its body', { version: st.version, expected: h });
  }
  return { config, log, db };
}

module.exports = { bootstrap };
