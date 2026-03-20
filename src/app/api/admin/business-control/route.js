import { NextResponse } from 'next/server';
import { isAdmin, adminError } from '@/lib/adminAuth';
import { updateBusinessControl } from '@/lib/admin-engine/businessController';

export async function POST(request) {
  const auth = await isAdmin();
  if (!auth.authorized) return adminError(auth.error, auth.status);

  try {
    const { businessId, controls } = await request.json();
    const result = await updateBusinessControl(businessId, controls);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
