'use strict';
/**
 * Set (or reset) a user's password from the command line — for administrators and
 * developers, e.g. before the mail relay is configured.
 *   npm run set-password -- someone@gta.gov.qa 'Correct-horse-42'
 * Creates the account (as on first sign-up) if it does not exist yet. Applies the
 * same password policy as the API and clears any lockout.
 */
const { bootstrap } = require('../bootstrap');
const users = require('../services/users');
const { preparePassword, storeHash } = require('../services/credentials');
const { audit } = require('../services/audit');

async function main() {
  const [rawEmail, password] = process.argv.slice(2);
  if (!rawEmail || !password) {
    console.error('Usage: npm run set-password -- <email> <password>');
    process.exit(2);
  }
  const { db, config } = await bootstrap();
  try {
    const email = users.normaliseEmail(config, rawEmail);
    const hash = await preparePassword(password, email);
    const now = new Date();
    const user = await db.tx(async (t) => {
      let u = await users.getUserByEmail(t, email);
      if (!u) {
        const id = await t.insert('users', {
          email, display_name: users.displayNameFromEmail(email), role: 'staff', is_active: 1, created_at: now, updated_at: now,
        });
        u = await users.getUserById(t, id);
        // apply ADMIN_EMAILS / EA_TEAM_EMAILS roles without recording a login
        const p = await users.provisionOnLogin(t, config, email, now);
        await t.run('UPDATE users SET first_login_at = NULL, last_login_at = NULL WHERE id = @id', { id: p.user.id });
        u = p.user;
      }
      await storeHash(t, u.id, hash, now);
      await audit(t, { action: 'user.password_set_cli', entity: 'user', entityId: String(u.id) });
      return u;
    });
    console.log(`Password set for ${user.email} (role ${user.role}).`);
  } catch (e) {
    console.error(e.code === 'weak_password' || e.code === 'invalid_domain' || e.code === 'validation' ? `Error: ${e.message}` : e);
    process.exitCode = 1;
  } finally {
    await db.close();
  }
}

main();
