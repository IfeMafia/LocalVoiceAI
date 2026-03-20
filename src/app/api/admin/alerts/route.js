import { NextResponse } from 'next/server';
import { isAdmin, adminError } from '@/lib/adminAuth';
import db from '@/lib/db';
import { resolveAlert } from '@/lib/admin-engine/alerts';

export async function GET() {
  const auth = await isAdmin();
  if (!auth.authorized) return adminError(auth.error, auth.status);

  try {
    const res = await db.query(`
      SELECT a.*, b.name as business_name 
      FROM alerts a
      LEFT JOIN businesses b ON a.business_id = b.id
      WHERE a.resolved_at IS NULL
      ORDER BY a.created_at DESC
    `);
    return NextResponse.json({ success: true, alerts: res.rows });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await isAdmin();
  if (!auth.authorized) return adminError(auth.error, auth.status);

  try {
    const { alertId } = await request.json();
    const result = await resolveAlert(alertId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
