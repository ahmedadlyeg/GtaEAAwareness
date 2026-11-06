'use strict';
const express = require('express');
const svc = require('../services/cert');

/** Authenticated certification routes, mounted at /api/v1/cert. */
function certRoutes({ db, config, outbox }) {
  const r = express.Router();
  r.get('/', async (req, res) => {
    res.json({ levels: await svc.allCertifications(db, config, req.user.id) });
  });
  r.post('/exams', async (req, res) => {
    const out = await svc.startExam(db, config, req.user, req.body && req.body.level);
    res.status(out.status).json(out.body);
  });
  r.post('/exams/:examId/submit', async (req, res) => {
    const out = await svc.submitExam(db, config, { user: req.user, sessionId: req.session && req.session.id, ip: req.ip }, req.params.examId, req.body);
    if (outbox && out.certificate) outbox.kick();
    res.json(out);
  });
  return r;
}

/** Public verification: GET /api/v1/cert/verify/:certificateId (no auth). */
function verifyHandler({ db, config }) {
  return async (req, res) => {
    const out = await svc.verifyCertificate(db, req.params.certificateId, config);
    if (!out) return res.status(404).json({ valid: false });
    res.json(out);
  };
}

module.exports = { certRoutes, verifyHandler };
