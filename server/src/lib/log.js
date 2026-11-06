'use strict';
/** Minimal structured (JSON-lines) logger to stdout - ship to SIEM/ELK via the platform. */
const LEVELS = { debug: 10, info: 20, warn: 30, error: 40, silent: 100 };

function createLogger(level = 'info') {
  const min = LEVELS[level] ?? 20;
  const emit = (lvl, msg, extra) => {
    if (LEVELS[lvl] < min) return;
    const line = JSON.stringify({ t: new Date().toISOString(), level: lvl, msg, ...(extra || {}) });
    (lvl === 'error' || lvl === 'warn' ? process.stderr : process.stdout).write(line + '\n');
  };
  return {
    debug: (m, e) => emit('debug', m, e),
    info: (m, e) => emit('info', m, e),
    warn: (m, e) => emit('warn', m, e),
    error: (m, e) => emit('error', m, e),
  };
}

module.exports = { createLogger };
