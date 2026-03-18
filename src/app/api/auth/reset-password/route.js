import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { TOKEN_TYPES, verifyAndConsumeToken } from '@/lib/auth/tokens';
import { hashPassword } from '@/lib/auth';

/**
 * Step 2: Reset Password (using token)
 * POST /api/auth/reset-password
 */
export async function POST(req) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ success: false, error: 'Token and new password are required' }, { status: 400 });
    }

    // 1. Split token identifier: {tokenId}_{rawSecret}
    const [tokenId, rawSecret] = token.split('_');

    if (!tokenId || !rawSecret) {
        return NextResponse.json({ success: false, error: 'Invalid or malformed reset link' }, { status: 400 });
    }

    // 2. Verify and Consume Token
    // Passing type as PASSWORD_RESET
    // userId is null here because we find it via token ID
    const verification = await verifyAndConsumeToken(null, TOKEN_TYPES.PASSWORD_RESET, rawSecret, tokenId);

    if (!verification.success) {
      return NextResponse.json({ success: false, error: verification.error }, { status: 400 });
    }

    // 3. Hash New Password
    const passwordHash = await hashPassword(newPassword);

    // 4. Update User Password
    const userId = verification.userId;
    await db.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [passwordHash, userId]
    );

    console.log(`[AUTH] Password reset successful for user: ${userId}`);

    return NextResponse.json({ 
      success: true, 
      message: 'Your password has been reset successfully. You can now login.' 
    });

  } catch (error) {
    console.error('Password Reset Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to reset password. Please try again or request a new link.' }, { status: 500 });
  }
}
