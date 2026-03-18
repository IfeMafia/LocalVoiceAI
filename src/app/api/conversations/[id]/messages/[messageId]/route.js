import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUserFromCookie } from '@/lib/auth';

export async function DELETE(req, { params }) {
  try {
    const user = await getUserFromCookie();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id, messageId } = await params;

    // Verify the user has access to this conversation (owner or participant)
    const convRes = await db.query(
      `SELECT c.customer_id, b.owner_id 
       FROM conversations c 
       JOIN businesses b ON c.business_id = b.id 
       WHERE c.id = $1`,
      [id]
    );

    if (convRes.rowCount === 0) {
      return NextResponse.json({ success: false, error: 'Conversation not found' }, { status: 404 });
    }

    const { customer_id, owner_id } = convRes.rows[0];
    const hasAccess = user.id === customer_id || user.id === owner_id;

    if (!hasAccess) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await db.query('DELETE FROM messages WHERE id = $1 AND conversation_id = $2', [messageId, id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete message error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
