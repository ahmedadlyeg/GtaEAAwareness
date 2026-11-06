'use strict';
const express = require('express');
const { err } = require('../lib/errors');
const users = require('../services/users');
const { getProgress } = require('../services/progress');
const { audit } = require('../services/audit');

const EVENT_TYPES = ['module_view', 'module_complete', 'kb_view', 'kb_search', 'adm_phase_view', 'download'];

module.exports = function meRoutes({ db, config }) {
  const r = express.Router();

  r.get('/me', async (req, res) => {
    res.json({ user: users.toUserDto(req.user, config), progress: await getProgress(db, req.user.id, config) });
  });

  r.get('/me/progress', async (req, res) => {
    res.json(await getProgress(db, req.user.id, config));
  });

  r.patch('/me', async (req, res) => {
    const body = req.body || {};
    const sets = [];
    const params = { id: req.user.id, now: new Date() };
    const changed = {};
    if (body.displayName !== undefined) {
      const v = typeof body.displayName === 'string' ? body.displayName.trim() : '';
      if (v.length < 2 || v.length > 200) throw err('validation', 'displayName must be 2-200 characters');
      sets.push('display_name = @displayName');
      params.displayName = v;
      changed.displayName = v;
    }
    if (body.jobTitle !== undefined) {
      if (body.jobTitle !== null && typeof body.jobTitle !== 'string') throw err('validation', 'jobTitle must be a string');
      const v = (body.jobTitle || '').trim();
      if (v.length > 200) throw err('validation', 'jobTitle must be at most 200 characters');
      sets.push('job_title = @jobTitle');
      params.jobTitle = v || null;
      changed.jobTitle = v || null;
    }
    if (body.department !== undefined) {
      const d = await users.findDepartment(db, body.department);
      if (!d) throw err('validation', `Unknown department "${body.department}"`);
      if (req.user.department_id && req.user.department_id !== d.id) {
        throw err('forbidden', 'Your department is already set. Contact the EA team to change it.');
      }
      if (!req.user.department_id) {
        sets.push('department_id = @departmentId', 'department_set_at = @now');
        params.departmentId = d.id;
        changed.department = d.name;
      }
    }
    if (sets.length) {
      await db.run(`UPDATE users SET ${sets.join(', ')}, updated_at = @now WHERE id = @id`, params);
      await audit(db, { actorUserId: req.user.id, action: 'user.update_profile', entity: 'user', entityId: req.user.id, detail: changed, ip: req.ip });
    }
    res.json({ user: users.toUserDto(await users.getUserById(db, req.user.id), config) });
  });

  r.post('/events', async (req, res) => {
    const { type, ref, meta } = req.body || {};
    if (!EVENT_TYPES.includes(type)) throw err('validation', `type must be one of ${EVENT_TYPES.join(', ')}`);
    if (typeof ref !== 'string' || !ref.trim() || ref.length > 200) throw err('validation', 'ref must be a 1-200 character string');
    let metaJson = null;
    if (meta !== undefined && meta !== null) {
      if (typeof meta !== 'object' || Array.isArray(meta)) throw err('validation', 'meta must be an object');
      metaJson = JSON.stringify(meta);
      if (metaJson.length > 4000) throw err('validation', 'meta is too large');
    }
    await db.insert('events', {
      user_id: req.user.id,
      session_id: req.session.id,
      type,
      ref: ref.trim(),
      meta: metaJson,
      created_at: new Date(),
    });
    res.status(204).end();
  });

  return r;
};
