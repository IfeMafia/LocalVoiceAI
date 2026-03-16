import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUserFromCookie } from '@/lib/auth';

export async function GET(req) {
  try {
    const user = await getUserFromCookie();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get('businessId');
    
    let result;
    if (user.role === 'customer') {
      // Fetch all conversations for the customer
      result = await db.query(
        `SELECT c.*, b.name as business_name, b.image as business_image, b.category as business_category 
         FROM conversations c
         JOIN businesses b ON c.business_id = b.id
         WHERE c.customer_id = $1
         ORDER BY c.updated_at DESC`,
        [user.id]
      );
    } else if (businessId) {
      // Find specific conversation between user and business (if applicable)
      result = await db.query(
        'SELECT * FROM conversations WHERE business_id = $1 ORDER BY updated_at DESC',
        [businessId]
      );
    } else {
      // Fetch all conversations for the owner's business
      result = await db.query(
        `SELECT c.*, b.name as business_name 
         FROM conversations c
         JOIN businesses b ON c.business_id = b.id
         WHERE b.owner_id = $1
         ORDER BY c.updated_at DESC`,
        [user.id]
      );
    }

    return NextResponse.json({ success: true, conversations: result.rows });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getUserFromCookie();
    const body = await req.json();
    const { businessId, customerName } = body;

    if (!businessId) {
      return NextResponse.json({ success: false, error: 'Business ID is required' }, { status: 400 });
    }

    // Use customer_id if authenticated, else fallback to name for guests
    const customerId = user ? user.id : null;
    const finalName = customerName || (user ? user.name : 'Guest');

    let existing;
    if (customerId) {
      existing = await db.query(
        'SELECT id FROM conversations WHERE business_id = $1 AND customer_id = $2 LIMIT 1',
        [businessId, customerId]
      );
    } else {
      existing = await db.query(
        'SELECT id FROM conversations WHERE business_id = $1 AND customer_name = $2 LIMIT 1',
        [businessId, finalName]
      );
    }

    if (existing.rowCount > 0) {
      return NextResponse.json({ success: true, id: existing.rows[0].id, message: "Existing conversation found" });
    }

    const result = await db.query(
      'INSERT INTO conversations (business_id, customer_id, customer_name, status) VALUES ($1, $2, $3, $4) RETURNING id',
      [businessId, customerId, finalName, 'AI Responding']
    );

    return NextResponse.json({ 
      success: true, 
      message: "Conversation started", 
      id: result.rows[0].id 
    }, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
