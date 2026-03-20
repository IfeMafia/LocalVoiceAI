import db from '@/lib/db';

/**
 * Logs an administrative action to the audit_logs table.
 */
export async function logAdminAction({ 
  adminEmail = 'system@voxy.ai', 
  action, 
  entityType = null, 
  entityId = null, 
  details = null 
}) {
  try {
    const query = `
      INSERT INTO audit_logs (admin_email, action, entity_type, entity_id, details)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const res = await db.query(query, [adminEmail, action, entityType, entityId, details]);
    return { success: true, log: res.rows[0] };
  } catch (error) {
    console.error('[AuditLog] Error logging action:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetches filtered audit logs.
 */
export async function getAuditLogs({ entityId = null, action = null, limit = 50 } = {}) {
  try {
    let query = `SELECT * FROM audit_logs`;
    const params = [];
    const conditions = [];

    if (entityId) {
      conditions.push(`entity_id = $${params.length + 1}`);
      params.push(entityId);
    }
    if (action) {
      conditions.push(`action = $${params.length + 1}`);
      params.push(action);
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(' AND ');
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const res = await db.query(query, params);
    return res.rows;
  } catch (error) {
    console.error('[AuditLog] Error fetching logs:', error);
    return [];
  }
}
