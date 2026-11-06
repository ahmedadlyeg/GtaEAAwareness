'use strict';

/** HTTP status for each contract error code. */
const STATUS = {
  validation: 400,
  weak_password: 400,
  invalid_credentials: 401,
  password_not_set: 409,
  account_exists: 409,
  account_locked: 423,
  gone: 410,
  invalid_domain: 400,
  unauthorized: 401,
  otp_invalid: 401,
  forbidden: 403,
  exam_locked: 403,
  attempts_exhausted: 403,
  already_certified: 409,
  exam_closed: 409,
  not_found: 404,
  preconditions_not_met: 409,
  statement_mismatch: 409,
  otp_expired: 410,
  otp_locked: 423,
  rate_limited: 429,
  internal: 500,
};

class ApiError extends Error {
  constructor(code, message, status) {
    super(message || code);
    this.code = code;
    this.status = status || STATUS[code] || 400;
  }
}

const err = (code, message, status) => new ApiError(code, message, status);

function errorHandler(log) {
  // eslint-disable-next-line no-unused-vars
  return (e, req, res, next) => {
    if (e instanceof ApiError) {
      return res.status(e.status).json({ error: { code: e.code, message: e.message } });
    }
    if (e && (e.type === 'entity.parse.failed' || e instanceof SyntaxError)) {
      return res.status(400).json({ error: { code: 'validation', message: 'Malformed JSON body' } });
    }
    if (e && e.type === 'entity.too.large') {
      return res.status(413).json({ error: { code: 'validation', message: 'Request body too large' } });
    }
    log.error('unhandled error', { path: req.path, err: e && e.stack });
    res.status(500).json({ error: { code: 'internal', message: 'Unexpected server error' } });
  };
}

module.exports = { ApiError, err, errorHandler, STATUS };
