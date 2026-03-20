import db from '@/lib/db';
import { logAdminAction } from './audit';

/**
 * Manages per-business overrides and intervention.
 */
export async function updateBusinessControl(businessId, { 
  is_ai_enabled, 
  rate_limit_per_min, 
  forced_model 
}) {
  try {
    const fields = [];
    const values = [];
    let i = 1;

    if (is_ai_enabled !== undefined) {
      fields.push(`is_ai_enabled = $${i++}`);
      values.push(is_ai_enabled);
    }
    if (rate_limit_per_min !== undefined) {
      fields.push(`rate_limit_per_min = $${i++}`);
      values.push(rate_limit_per_min);
    }
    if (forced_model !== undefined) {
      fields.push(`forced_model = $${i++}`);
      values.push(forced_model);
    }

    if (fields.length === 0) return { success: false, error: 'No fields provided' };

    values.push(businessId);
    const query = `UPDATE businesses SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`;
    
    const res = await db.query(query, values);

    // LOG ACTION
    await logAdminAction({
      action: 'BUSINESS_INTERVENTION',
      entityType: 'business',
      entityId: businessId,
      details: JSON.stringify(Object.keys({ is_ai_enabled, rate_limit_per_min, forced_model }).filter(k => arguments[1][k] !== undefined))
    });

    return { success: true, business: res.rows[0] };
  } catch (error) {
    console.error('[BusinessController] Error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Bans or blocks specific customers (WIP logic)
 */
export async function blockCustomer(businessId, customerId) {
  // Logic to add to a block-list table if it exists
  return { success: true };
}
