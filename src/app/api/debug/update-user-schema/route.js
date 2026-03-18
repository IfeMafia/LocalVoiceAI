import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    await db.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
      
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS email_verification_code TEXT;
      
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS email_verification_expires TIMESTAMP;
      
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS otp_request_count INTEGER DEFAULT 0;
      
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS last_otp_request TIMESTAMP;
    `);

    return NextResponse.json({ success: true, message: 'User schema updated successfully' });
  } catch (error) {
    console.error('Schema Update Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
