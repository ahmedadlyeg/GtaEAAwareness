'use strict';
const express = require('express');
const { submitAttempt, listAttempts } = require('../services/quiz');

module.exports = function quizRoutes({ db, config }) {
  const r = express.Router();
  r.post('/attempts', async (req, res) => {
    const out = await submitAttempt(db, config, { userId: req.user.id, sessionId: req.session.id }, req.body);
    res.status(201).json(out);
  });
  r.get('/attempts', async (req, res) => {
    res.json(await listAttempts(db, req.user.id));
  });
  return r;
};
