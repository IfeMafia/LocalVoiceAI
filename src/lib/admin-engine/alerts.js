import db from '@/lib/db';

/**
 * Creates a system alert.
 */
export async function createAlert({ 
  type, 
  severity, 
  message, 
  businessId = null 
}) {
  try {
    const query = `
      INSERT INTO alerts (type, severity, message, business_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const res = await db.query(query, [type, severity, message, businessId]);
    return { success: true, alert: res.rows[0] };
  } catch (error) {
    console.error('[AlertSystem] Error creating alert:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Resolves an alert.
 */
export async function resolveAlert(alertId) {
  try {
    const query = `UPDATE alerts SET resolved_at = NOW() WHERE id = $1 RETURNING *`;
    const res = await db.query(query, [alertId]);
    return { success: true, alert: res.rows[0] };
  } catch (error) {
    console.error('[AlertSystem] Error resolving alert:', error);
    return { success: false, error: error.message };
  }
}
