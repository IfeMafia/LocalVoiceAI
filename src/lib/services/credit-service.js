import db from '@/lib/db';

/**
 * Standardized Credit Errors
 */
export const CREDIT_ERRORS = {
  NO_CREDITS: 'INSUFFICIENT_CREDITS',
  BUSINESS_NOT_FOUND: 'BUSINESS_NOT_FOUND'
};

/**
 * Deduct 1 credit from a business balance atomically.
 * Returns the updated balance.
 */
export async function deductCredit(businessId) {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    // 1. Check & Update balance atomically using row-level check
    const res = await client.query(
      `UPDATE businesses 
       SET credit_balance = credit_balance - 1 
       WHERE id = $1 AND credit_balance > 0 
       RETURNING credit_balance`,
      [businessId]
    );

    if (res.rowCount === 0) {
      // Check if business exists
      const checkRes = await client.query('SELECT id FROM businesses WHERE id = $1', [businessId]);
      if (checkRes.rowCount === 0) throw new Error(CREDIT_ERRORS.BUSINESS_NOT_FOUND);
      throw new Error(CREDIT_ERRORS.NO_CREDITS);
    }

    // 2. Log Transaction
    await client.query(
      `INSERT INTO transactions (business_id, type, amount, reference) 
       VALUES ($1, 'credit_usage', 1, $2)`,
      [businessId, `usage_${Date.now()}`]
    );

    await client.query('COMMIT');
    return res.rows[0].credit_balance;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Add credits to a business balance.
 */
export async function addCredits(businessId, amount, reference = null) {
  if (amount <= 0) throw new Error('Credit amount must be positive');

  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    // 1. Idempotency Check
    if (reference) {
      const existing = await client.query('SELECT id FROM transactions WHERE reference = $1', [reference]);
      if (existing.rowCount > 0) {
        await client.query('ROLLBACK');
        return null; // Already processed
      }
    }

    // 2. Update Balance
    const res = await client.query(
      `UPDATE businesses SET credit_balance = credit_balance + $1 WHERE id = $2 RETURNING *`,
      [amount, businessId]
    );

    // 3. Log Transaction
    await client.query(
      `INSERT INTO transactions (business_id, type, amount, reference) 
       VALUES ($1, 'credit_purchase', $2, $3)`,
      [businessId, amount, reference]
    );

    await client.query('COMMIT');
    return res.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Adjust credits manually (Admin use)
 */
export async function adjustCredits(businessId, amount, reason = 'Admin adjustment') {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    const res = await client.query(
      `UPDATE businesses SET credit_balance = credit_balance + $1 WHERE id = $2 RETURNING credit_balance`,
      [amount, businessId]
    );

    await client.query(
      `INSERT INTO transactions (business_id, type, amount, reference) 
       VALUES ($1, 'manual_adjustment', $2, $3)`,
      [businessId, amount, `admin_${Date.now()}`]
    );

    await client.query('COMMIT');
    return { creditBalance: res.rows[0].credit_balance };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Higher-order function to wrap AI-related actions with credit checks.
 */
export async function withCreditCheck(businessId, action) {
  // Pre-flight check
  const bizRes = await db.query('SELECT credit_balance FROM businesses WHERE id = $1', [businessId]);
  const business = bizRes.rows[0];

  if (!business) throw new Error(CREDIT_ERRORS.BUSINESS_NOT_FOUND);
  if (business.credit_balance <= 0) throw new Error(CREDIT_ERRORS.NO_CREDITS);

  // Execute the actual AI action
  const result = await action();

  // Deduct 1 credit atomically on success
  await deductCredit(businessId);

  return result;
}
