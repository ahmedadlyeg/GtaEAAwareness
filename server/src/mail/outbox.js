'use strict';
/**
 * Transactional e-mail outbox. Producers insert rows (inside their own DB
 * transaction); a background worker sends them with retry + exponential backoff.
 *
 * Transport: SMTP (nodemailer) when SMTP_HOST is set - intended for the GTA
 * Exchange / Microsoft 365 relay - otherwise a dev transport that prints the
 * message (including OTP codes) to the console. Rows stay in email_outbox in
 * both cases. With real SMTP the OTP code is redacted from the stored payload
 * once the message is sent or has failed permanently.
 */
const nodemailer = require('nodemailer');
const { render } = require('./templates');

async function enqueue(db, { to, template, payload }) {
  const now = new Date();
  return db.insert('email_outbox', {
    to_email: to,
    template,
    payload: JSON.stringify(payload),
    status: 'queued',
    attempts: 0,
    next_attempt_at: now,
    created_at: now,
  });
}

function backoffMs(attempts) {
  return Math.min(60 * 60 * 1000, 30 * 1000 * 2 ** Math.max(0, attempts - 1));
}

function createTransport(config, log) {
  if (config.smtp.host) {
    const t = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      requireTLS: !config.smtp.secure && config.smtp.port === 587,
      auth: config.smtp.user ? { user: config.smtp.user, pass: config.smtp.pass } : undefined,
      pool: true,
      maxConnections: 2,
    });
    return { kind: 'smtp', send: (msg) => t.sendMail(msg), close: () => t.close() };
  }
  return {
    kind: 'dev',
    async send(msg) {
      log.info('dev-mail (not sent - SMTP_HOST unset)', { to: msg.to, subject: msg.subject, text: msg.text });
      return { messageId: `dev-${Date.now()}` };
    },
    close() {},
  };
}

function createOutbox({ db, config, log, transport }) {
  const tx = transport || createTransport(config, log);
  const redact = tx.kind === 'smtp';
  let timer = null;
  let running = false;
  let again = false;

  async function finish(row, status, extra) {
    let payload = row.payload;
    if (redact && status !== 'queued') {
      try {
        const p = JSON.parse(payload);
        if (p.code) p.code = '******';
        payload = JSON.stringify(p);
      } catch (_) {
        /* keep */
      }
    }
    await db.run(
      `UPDATE email_outbox SET status = @status, payload = @payload, last_error = @last_error,
         sent_at = @sent_at, next_attempt_at = @next WHERE id = @id`,
      { id: row.id, status, payload, last_error: extra.error || null, sent_at: extra.sentAt || null, next: extra.next || new Date() },
    );
  }

  async function processOnce() {
    if (running) {
      again = true;
      return 0;
    }
    running = true;
    let sent = 0;
    try {
      const now = new Date();
      const rows = await db.all(
        `SELECT id, to_email, template, payload, attempts FROM email_outbox
          WHERE status = 'queued' AND next_attempt_at <= @now ORDER BY id`,
        { now },
        { limit: 20 },
      );
      for (const row of rows) {
        // Optimistic claim so several app instances can share one outbox.
        const lease = new Date(Date.now() + 2 * 60 * 1000);
        const claim = await db.run(
          `UPDATE email_outbox SET attempts = attempts + 1, next_attempt_at = @lease
            WHERE id = @id AND status = 'queued' AND attempts = @attempts`,
          { id: row.id, attempts: row.attempts, lease },
        );
        if (!claim.changes) continue;
        const attempts = row.attempts + 1;
        try {
          const msg = render(row.template, JSON.parse(row.payload), { baseUrl: config.appBaseUrl, timezone: config.timezone });
          await tx.send({ from: config.mailFrom, to: row.to_email, subject: msg.subject, text: msg.text, html: msg.html });
          await finish(row, 'sent', { sentAt: new Date() });
          sent++;
        } catch (e) {
          const final = attempts >= config.outboxMaxAttempts;
          log.warn('outbox send failed', { id: row.id, attempts, final, err: e.message });
          await finish(row, final ? 'failed' : 'queued', {
            error: String(e.message).slice(0, 1000),
            next: new Date(Date.now() + backoffMs(attempts)),
          });
        }
      }
    } catch (e) {
      log.error('outbox worker error', { err: e.stack });
    } finally {
      running = false;
    }
    if (again) {
      again = false;
      setImmediate(() => processOnce());
    }
    return sent;
  }

  return {
    transportKind: tx.kind,
    processOnce,
    /** Ask the worker to run soon (used right after an OTP is queued). */
    kick() {
      setImmediate(() => processOnce().catch(() => {}));
    },
    start() {
      if (!timer) {
        timer = setInterval(() => processOnce(), config.outboxPollMs);
        timer.unref();
      }
    },
    stop() {
      if (timer) clearInterval(timer);
      timer = null;
      tx.close();
    },
  };
}

module.exports = { enqueue, createOutbox, backoffMs };
