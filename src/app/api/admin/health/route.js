import { NextResponse } from 'next/server';
import { isAdmin, adminError } from '@/lib/adminAuth';
import { getSystemHealth } from '@/lib/admin-engine/systemHealth';

export async function GET() {
  const auth = await isAdmin();
  if (!auth.authorized) return adminError(auth.error, auth.status);

  try {
    const health = await getSystemHealth();
    return NextResponse.json({ success: true, health });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
