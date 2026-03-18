import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { TOKEN_TYPES, generateRawToken, storeToken } from '@/lib/auth/tokens';
import { sendPasswordResetEmail } from '@/lib/mailer';

/**
 * Step 1: Request Password Reset
 * POST /api/auth/request-password-reset
 */
export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    // 1. Find user by email
    const result = await db.query(
      'SELECT id, name, email FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    // SECURITY: Always return success, even if user not found
    if (result.rowCount === 0) {
      console.log(`[AUTH] Password reset requested for non-existent email: ${email}`);
      return NextResponse.json({ 
        success: true, 
        message: 'If this email exists, a reset link has been sent.' 
      });
    }

    const user = result.rows[0];

    // 2. Rate limit check (e.g. max 3 requests per hour, we handled it slightly in tokens service)
    // Actually, I'll just rely on the storeToken which deletes old ones, 
    // but for true rate limiting, we could check counts in DB.

    // 3. Generate Link-based token
    const rawToken = generateRawToken(TOKEN_TYPES.PASSWORD_RESET);
    const { tokenId } = await storeToken(user.id, TOKEN_TYPES.PASSWORD_RESET, rawToken, 15);

    // 4. Send Email with token identifier {tokenId}:{rawToken}
    const tokenIdentifier = `${tokenId}_${rawToken}`;
    await sendPasswordResetEmail(user.email, user.name, tokenIdentifier);

    return NextResponse.json({ 
      success: true, 
      message: 'If this email exists, a reset link has been sent.' 
    });

  } catch (error) {
    console.error('Password Reset Request Error:', error);
    // Even on error, we don't return specific error to client to avoid leaking email status easily
    return NextResponse.json({ success: false, error: 'Failed to process request' }, { status: 500 });
  }
}
