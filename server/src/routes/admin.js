'use strict';
const express = require('express');
const { computeDashboard, listUsers, exportRows } = require('../services/dashboard');
const { toCsv } = require('../lib/csv');
const { audit } = require('../services/audit');
const { grantAttempts } = require('../services/cert');

module.exports = function adminRoutes({ db, config }) {
  const r = express.Router();

  r.get('/dashboard', async (req, res) => {
    res.json(await computeDashboard(db, config, req.query));
  });

  r.post('/users/:userId/cert-attempts', async (req, res) => {
    res.json(await grantAttempts(db, config, req.user, req.params.userId, req.body || {}, req.ip));
  });

  r.get('/users', async (req, res) => {
    res.json(await listUsers(db, config, req.query));
  });

  r.get('/export', async (req, res) => {
    const { columns, rows } = await exportRows(db, config, req.query);
    await audit(db, {
      actorUserId: req.user.id,
      action: 'admin.export',
      entity: 'export',
      entityId: req.query.kind,
      detail: { rows: rows.length, from: req.query.from || null, to: req.query.to || null, department: req.query.department || null },
      ip: req.ip,
    });
    const stamp = new Date().toISOString().slice(0, 10);
    res.set('Content-Type', 'text/csv; charset=utf-8');
    res.set('Content-Disposition', `attachment; filename="ea-hub-${req.query.kind}-${stamp}.csv"`);
    res.send(toCsv(columns, rows));
  });

  return r;
};
