import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUserFromCookie } from '@/lib/auth';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const user = await getUserFromCookie();

    // 1. Fetch conversation details to check ownership
    const convResult = await db.query(
      'SELECT customer_id, business_id FROM conversations WHERE id = $1',
      [id]
    );

    if (convResult.rowCount === 0) {
      return NextResponse.json({ success: false, error: 'Conversation not found' }, { status: 404 });
    }

    const conversation = convResult.rows[0];

    // Ownership logic:
    // - If it's a guest conversation (customer_id is null), allow access.
    // - If it's a user conversation, require user.id to match customer_id OR be the business owner.
    if (conversation.customer_id) {
      if (!user) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }

      // Check if user is the business owner
      const bizRes = await db.query(
        'SELECT owner_id FROM businesses WHERE id = $1',
        [conversation.business_id]
      );
      const ownerId = bizRes.rows[0]?.owner_id;

      if (user.id !== conversation.customer_id && user.id !== ownerId) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }
    }

    // 2. Fetch messages
    // If guest (no user), use a dummy UUID to satisfy $2 (hidden_for check)
    const result = await db.query(
      'SELECT * FROM messages WHERE conversation_id = $1 AND NOT ($2 = ANY(COALESCE(hidden_for, \'{}\'))) ORDER BY created_at ASC',
      [id, user?.id || '00000000-0000-0000-0000-000000000000']
    );

    // 3. Mark messages sent TO this user as read
    // If user is guest OR role is customer, mark messages from ai or owner as read
    if (!user || user.role === 'customer') {
      await db.query(
        "UPDATE messages SET is_read = true WHERE conversation_id = $1 AND sender_type IN ('ai', 'owner')",
        [id]
      );
    } else {
      // User is business owner, mark customer messages as read
      await db.query(
        "UPDATE messages SET is_read = true WHERE conversation_id = $1 AND sender_type = 'customer'",
        [id]
      );
    }

    return NextResponse.json({ success: true, messages: result.rows });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { content, senderType, setStatus } = body;

    const result = await db.query(
      'INSERT INTO messages (conversation_id, sender_type, content) VALUES ($1, $2, $3) RETURNING *',
      [id, senderType, content]
    );

    // Update conversation's updated_at and optionally status
    if (setStatus) {
      await db.query(
        'UPDATE conversations SET updated_at = CURRENT_TIMESTAMP, status = $2 WHERE id = $1',
        [id, setStatus]
      );
    } else {
      await db.query(
        'UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [id]
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: result.rows[0] 
    }, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
