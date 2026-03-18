import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS auth_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash TEXT NOT NULL,
        type TEXT NOT NULL, -- 'EMAIL_VERIFICATION', 'PASSWORD_RESET', etc.
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        attempts INTEGER DEFAULT 0,
        last_sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_auth_tokens_user_type ON auth_tokens(user_id, type);
    `);

    return NextResponse.json({ success: true, message: 'Auth tokens table created successfully' });
  } catch (error) {
    console.error('Schema Update Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
