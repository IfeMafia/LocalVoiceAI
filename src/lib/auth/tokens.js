import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';

export const TOKEN_TYPES = {
  EMAIL_VERIFICATION: 'EMAIL_VERIFICATION',
  PASSWORD_RESET: 'PASSWORD_RESET',
  EMAIL_CHANGE: 'EMAIL_CHANGE',
};

/**
 * Generate a secure token (either fixed-length OTP or long random string)
 */
export const generateRawToken = (type) => {
  if (type === TOKEN_TYPES.EMAIL_VERIFICATION || type === TOKEN_TYPES.EMAIL_CHANGE) {
    // 4-digit OTP for email verification/change
    return Math.floor(1000 + Math.random() * 9000).toString();
  }
  // Long hex token for password reset links
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Store a hashed version of the token in the database
 */
export const storeToken = async (userId, type, rawToken, expiresInMinutes = 15) => {
  const tokenHash = await bcrypt.hash(rawToken, 10);
  const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

  // Clean up any existing tokens of the same type for this user
  await db.query(
    'DELETE FROM auth_tokens WHERE user_id = $1 AND type = $2',
    [userId, type]
  );

  const result = await db.query(
    `INSERT INTO auth_tokens (user_id, token_hash, type, expires_at) 
     VALUES ($1, $2, $3, $4) 
     RETURNING id`,
    [userId, tokenHash, type, expiresAt]
  );

  // Return the raw token and the token_id so we can identify the hash for lookup
  return {
    tokenId: result.rows[0].id,
    rawToken: rawToken
  };
};

/**
 * Verify a token (passed as ID:SECRET or just SECRET for OTPs if user context exists)
 */
export const verifyAndConsumeToken = async (userId, type, rawToken, tokenId = null) => {
  let query;
  let params;

  if (tokenId) {
    // 1. Pointed lookup by ID (Case: Link-based flows like password reset)
    query = `SELECT id, token_hash, expires_at, user_id FROM auth_tokens WHERE id = $1 AND type = $2`;
    params = [tokenId, type];
  } else {
    // 2. Lookup by userId (Case: Contextual OTP flows like registration)
    query = `SELECT id, token_hash, expires_at FROM auth_tokens WHERE user_id = $1 AND type = $2`;
    params = [userId, type];
  }

  const result = await db.query(query, params);

  if (result.rowCount === 0) {
    return { success: false, error: 'Request expired or invalid.' };
  }

  const { id, token_hash, expires_at, user_id: dbUserId } = result.rows[0];

  // 1. Check expiration
  if (new Date() > new Date(expires_at)) {
    await db.query('DELETE FROM auth_tokens WHERE id = $1', [id]);
    return { success: false, error: 'Token has expired.' };
  }

  // 2. Compare hash
  const isValid = await bcrypt.compare(rawToken, token_hash);
  if (!isValid) {
    // Optional: track attempts and rate limit here? 
    return { success: false, error: 'Invalid verification token.' };
  }

  // 3. Consume token
  await db.query('DELETE FROM auth_tokens WHERE id = $1', [id]);

  return { success: true, userId: dbUserId || userId };
};

/**
 * Rate limit check for requesting tokens
 */
export const canRequestToken = async (userId, type, limitPerHour = 3) => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const result = await db.query(
        "SELECT COUNT(*) FROM auth_tokens WHERE user_id = $1 AND type = $2 AND created_at > $3",
        [userId, type, oneHourAgo]
    );
    return parseInt(result.rows[0].count) < limitPerHour;
};
