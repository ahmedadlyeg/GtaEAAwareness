'use strict';
const { err } = require('../lib/errors');

const USER_SELECT = `SELECT u.id, u.email, u.display_name, u.department_id, d.name AS department, u.job_title,
  u.role, u.first_login_at, u.last_login_at, u.is_active, u.password_hash, u.password_set_at, u.failed_logins, u.locked_until
  FROM users u LEFT JOIN departments d ON d.id = u.department_id`;

/** True when the e-mail is listed in REVIEWER_EMAILS (exam reviewer account). */
function isReviewerEmail(config, email) {
  return Boolean(config && Array.isArray(config.reviewerEmails) && email && config.reviewerEmails.includes(String(email).toLowerCase()));
}

function toUserDto(r, config) {
  if (!r) return null;
  return {
    id: r.id,
    email: r.email,
    displayName: r.display_name,
    department: r.department || null,
    jobTitle: r.job_title || null,
    role: r.role,
    firstLoginAt: r.first_login_at || null,
    reviewer: isReviewerEmail(config, r.email),
  };
}

async function getUserById(db, id) {
  return db.get(`${USER_SELECT} WHERE u.id = @id`, { id });
}
async function getUserByEmail(db, email) {
  return db.get(`${USER_SELECT} WHERE u.email = @email`, { email });
}

/** "ahmed.al-adly" -> "Ahmed Al-Adly" (placeholder until HR / AD sync). */
function displayNameFromEmail(email) {
  const local = String(email).split('@')[0];
  return local
    .split(/[._]+/)
    .filter(Boolean)
    .map((w) => w.split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('-'))
    .join(' ') || local;
}

function roleFor(config, email) {
  if (config.adminEmails.includes(email)) return 'admin';
  if (config.eaTeamEmails.includes(email)) return 'ea_team';
  return 'staff';
}
const RANK = { staff: 0, ea_team: 1, admin: 2 };

/** Normalise and check an e-mail against ALLOWED_EMAIL_DOMAINS. */
function normaliseEmail(config, raw) {
  if (typeof raw !== 'string') throw err('validation', 'email is required');
  const email = raw.trim().toLowerCase();
  if (email.length > 254 || !/^[a-z0-9._%+'-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)) {
    throw err('validation', 'email is not a valid address');
  }
  const domain = email.split('@')[1];
  if (!config.allowedDomains.includes(domain)) {
    throw err('invalid_domain', `Only ${config.allowedDomains.map((d) => '@' + d).join(', ')} addresses can sign in`);
  }
  return email;
}

/**
 * Find or auto-provision the user for a verified login, record the login time.
 * Roles from ADMIN_EMAILS / EA_TEAM_EMAILS are applied on provisioning and can
 * only elevate (never demote) an existing account.
 */
async function provisionOnLogin(db, config, email, now) {
  let user = await getUserByEmail(db, email);
  const wanted = roleFor(config, email);
  if (!user) {
    const id = await db.insert('users', {
      email,
      display_name: displayNameFromEmail(email),
      role: wanted,
      first_login_at: now,
      last_login_at: now,
      is_active: 1,
      created_at: now,
      updated_at: now,
    });
    return { user: await getUserById(db, id), created: true };
  }
  if (!Boolean(user.is_active)) throw err('forbidden', 'This account is disabled');
  const role = RANK[wanted] > RANK[user.role] ? wanted : user.role;
  await db.run(
    `UPDATE users SET last_login_at = @now, first_login_at = COALESCE(first_login_at, @now), role = @role, updated_at = @now
      WHERE id = @id`,
    { id: user.id, now, role },
  );
  return { user: await getUserById(db, user.id), created: false, roleChanged: role !== user.role };
}

async function findDepartment(db, value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  const v = value.trim();
  return db.get(
    'SELECT id, code, name FROM departments WHERE is_active = 1 AND (name = @v OR code = @v OR name_ar = @v)',
    { v },
  );
}

module.exports = {
  toUserDto,
  isReviewerEmail,
  getUserById,
  getUserByEmail,
  provisionOnLogin,
  normaliseEmail,
  displayNameFromEmail,
  findDepartment,
};
