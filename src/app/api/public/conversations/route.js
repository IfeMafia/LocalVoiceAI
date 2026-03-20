import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req) {
  try {
    const body = await req.json();
    const { businessId, customerName = 'Guest' } = body;

    if (!businessId) {
      return NextResponse.json({ success: false, error: 'Business ID is required' }, { status: 400 });
    }

    // Generate a guest conversation.
    // customer_id is left NULL for anonymous guests.
    const result = await db.query(
      `INSERT INTO conversations (customer_id, business_id, customer_name, status, ai_enabled, ai_allowed) 
       VALUES (NULL, $1, $2, 'AI Responding', true, true) 
       RETURNING id, ai_enabled, ai_allowed`,
      [businessId, customerName]
    );

    return NextResponse.json({ 
      success: true, 
      id: result.rows[0].id,
      ai_enabled: result.rows[0].ai_enabled,
      ai_allowed: result.rows[0].ai_allowed
    }, { status: 201 });

  } catch (error) {
    console.error('Public Conversation Init Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
