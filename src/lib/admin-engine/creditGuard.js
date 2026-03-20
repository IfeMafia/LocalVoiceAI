import db from '@/lib/db';

/**
 * Enforces credit rules for businesses.
 */
export async function checkCreditHealth(businessId) {
  try {
    const res = await db.query('SELECT credit_balance, is_ai_enabled FROM businesses WHERE id = $1', [businessId]);
    const business = res.rows[0];

    if (!business) return { allowed: false, reason: 'Business not found' };

    if (!business.is_ai_enabled) {
      return { allowed: false, reason: 'AI has been manually disabled for this business.' };
    }

    if (business.credit_balance <= 0) {
      // Auto-disable if balance hit zero
      await db.query('UPDATE businesses SET is_ai_enabled = false WHERE id = $1', [businessId]);
      return { 
        allowed: false, 
        reason: 'Credit balance exhausted. AI features have been disabled.',
        alert: {
          type: 'credit_low',
          severity: 'critical',
          message: 'Credit balance hit 0. AI disabled automatically.'
        }
      };
    }

    if (business.credit_balance < 10) {
      return { 
        allowed: true, 
        warning: 'Low credit balance remaining.',
        alert: {
          type: 'credit_low',
          severity: 'high',
          message: `Low credit alert: ${business.credit_balance} credits remaining.`
        }
      };
    }

    return { allowed: true };
  } catch (error) {
    console.error('[CreditGuard] Error:', error);
    return { allowed: true }; // Fail open for production safety, but log error
  }
}

/**
 * Calculates if a request should be rate limited.
 */
export async function checkRateLimit(businessId) {
  // Implementation note: In a real high-scale app, use Redis. 
  // For now, we utilize the usage_logs table for a window-based check.
  const res = await db.query(`
    SELECT COUNT(*) as count, b.rate_limit_per_min
    FROM usage_logs u
    JOIN businesses b ON u.business_id = b.id
    WHERE u.business_id = $1 AND u.created_at >= NOW() - INTERVAL '1 minute'
    GROUP BY b.rate_limit_per_min
  `, [businessId]);

  if (res.rows.length > 0) {
    const { count, rate_limit_per_min } = res.rows[0];
    if (parseInt(count) >= rate_limit_per_min) {
      return { limited: true, limit: rate_limit_per_min };
    }
  }

  return { limited: false };
}
