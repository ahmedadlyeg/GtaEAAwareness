'use strict';
async function audit(db, { actorUserId = null, action, entity = null, entityId = null, detail = null, ip = null }) {
  await db.insert('audit_log', {
    actor_user_id: actorUserId,
    action,
    entity,
    entity_id: entityId === null || entityId === undefined ? null : String(entityId),
    detail: detail ? JSON.stringify(detail) : null,
    ip,
    created_at: new Date(),
  });
}
module.exports = { audit };
