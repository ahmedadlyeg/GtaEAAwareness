'use strict';
const path = require('path');

const SERVER_ROOT = path.resolve(__dirname, '..');

function list(v) {
  return String(v || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}
function int(v, d) {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : d;
}
function bool(v, d) {
  if (v === undefined || v === '') return d;
  return /^(1|true|yes|on)$/i.test(String(v));
}

/** Build the runtime configuration from an env object (defaults to process.env). */
function loadConfig(env = process.env, overrides = {}) {
  const nodeEnv = env.NODE_ENV || 'development';
  const jwtSecret = env.JWT_SECRET || (nodeEnv === 'production' ? '' : 'dev-only-insecure-secret-change-me');
  if (!jwtSecret || (nodeEnv === 'production' && jwtSecret.length < 32)) {
    throw new Error('JWT_SECRET must be set (>= 32 chars) in production');
  }
  const staticDir = env.STATIC_DIR === undefined ? '..' : env.STATIC_DIR;
  const cfg = {
    env: nodeEnv,
    port: int(env.PORT, 8080),
    dbDriver: (env.DB_DRIVER || 'sqlite').toLowerCase(),
    sqlitePath: env.SQLITE_PATH === ':memory:'
      ? ':memory:'
      : path.resolve(SERVER_ROOT, env.SQLITE_PATH || './data/ea-hub.db'),
    mssqlConnectionString: env.MSSQL_CONNECTION_STRING || '',
    jwtSecret,
    jwtTtl: env.JWT_TTL || '8h',
    otpPepper: env.OTP_PEPPER || jwtSecret,
    allowedDomains: list(env.ALLOWED_EMAIL_DOMAINS || 'gta.gov.qa'),
    adminEmails: list(env.ADMIN_EMAILS),
    eaTeamEmails: list(env.EA_TEAM_EMAILS),
    // Exam reviewers: every exam unlocked, unlimited preview sittings, no certificates, excluded from reporting
    reviewerEmails: list(env.REVIEWER_EMAILS === undefined ? 'exam.reviewer@gta.gov.qa' : env.REVIEWER_EMAILS),
    reviewerMaxAttempts: 99,
    otpTtlMin: int(env.OTP_TTL_MIN, 10),
    otpMaxAttempts: int(env.OTP_MAX_ATTEMPTS, 5),
    otpMaxRequests: int(env.OTP_MAX_REQUESTS_PER_WINDOW, 3),
    otpWindowMin: int(env.OTP_REQUEST_WINDOW_MIN, 15),
    passPct: int(env.PASS_PCT, 70),
    // Foundation certification exam
    certUnlockPct: int(env.CERT_UNLOCK_PCT, 80), // % of EA modules AND % of TOGAF topics completed to unlock the exam
    certPassPct: int(env.CERT_PASS_PCT, 70), // overall exam score needed to certify
    certMaxAttempts: int(env.CERT_MAX_ATTEMPTS, 3), // first sitting + 2 retakes (admins can grant more)
    certPrefix: String(env.CERT_PREFIX || 'GTA-EAF').toUpperCase(),
    // Certification paths (mirror js/config.js certification.levels). `tracks` = content_modules.track
    // values that must each reach certUnlockPct; `requires` = certificate level needed first.
    certLevels: [
      { id: 'foundation', title: 'Enterprise Architecture Foundation', prefix: String(env.CERT_PREFIX || 'GTA-EAF').toUpperCase(), requires: null, tracks: ['ea', 'togaf'] },
      { id: 'practitioner', title: 'Enterprise Architecture Practitioner', prefix: String(env.CERT_PREFIX_PRACTITIONER || 'GTA-EAP').toUpperCase(), requires: 'foundation', tracks: ['kbp'] },
      { id: 'advanced', title: 'Enterprise Architecture Advanced', prefix: String(env.CERT_PREFIX_ADVANCED || 'GTA-EAA').toUpperCase(), requires: 'practitioner', tracks: ['kba'] },
    ],
    timezone: env.TIMEZONE || 'Asia/Qatar',
    staticDir: staticDir ? path.resolve(SERVER_ROOT, staticDir) : '',
    corsOrigins: list(env.CORS_ORIGIN),
    trustProxy: int(env.TRUST_PROXY, 0),
    rateLimitAuth: int(env.RATE_LIMIT_AUTH, 30),
    loginMaxFailures: int(env.LOGIN_MAX_FAILURES, 5), // consecutive wrong passwords before a temporary lock
    loginLockMin: int(env.LOGIN_LOCK_MIN, 15),
    setupTokenTtlMin: int(env.SETUP_TOKEN_TTL_MIN, 15),
    rateLimitApi: int(env.RATE_LIMIT_API, 1000),
    smtp: {
      host: env.SMTP_HOST || '',
      port: int(env.SMTP_PORT, 25),
      secure: bool(env.SMTP_SECURE, false),
      user: env.SMTP_USER || '',
      pass: env.SMTP_PASS || '',
    },
    mailFrom: env.MAIL_FROM || 'EA Awareness Hub <ea-hub-noreply@gta.gov.qa>',
    appBaseUrl: (env.APP_BASE_URL || 'http://localhost:8080').replace(/\/$/, ''),
    outboxPollMs: int(env.OUTBOX_POLL_MS, 5000),
    outboxMaxAttempts: int(env.OUTBOX_MAX_ATTEMPTS, 6),
    logLevel: env.LOG_LEVEL || (nodeEnv === 'test' ? 'error' : 'info'),
    serverRoot: SERVER_ROOT,
  };
  return Object.assign(cfg, overrides);
}

module.exports = { loadConfig, SERVER_ROOT };
