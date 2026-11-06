'use strict';
const express = require('express');
const svc = require('../services/signoff');

module.exports = function signoffRoutes({ db, config, outbox, otpLimiter }) {
  const r = express.Router();

  r.get('/statement', async (req, res) => {
    res.json(svc.statementDto(await svc.getStatement(db)));
  });

  // Sign-off is now confirmed with the user's password; codes are only used at sign-up and reset.
  r.post('/otp', (req, res) => {
    res.status(410).json({ error: { code: 'gone', message: 'Sign-off codes are no longer used — confirm the sign-off with your password.' } });
  });

  r.post('/', otpLimiter, async (req, res) => {
    const out = await svc.sign(db, config, req.user, req.body, { ip: req.ip, userAgent: req.get('user-agent') });
    if (outbox) outbox.kick();
    res.status(201).json(out);
  });

  return r;
};
