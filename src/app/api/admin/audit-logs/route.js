import { NextResponse } from 'next/server';
import { isAdmin, adminError } from '@/lib/adminAuth';
import { getAuditLogs } from '@/lib/admin-engine/audit';

export async function GET(request) {
  try {
    const authStatus = await isAdmin();
    if (!authStatus.authorized) {
      return adminError(authStatus.error);
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const entityId = searchParams.get('entityId');
    const limit = parseInt(searchParams.get('limit') || '50');

    const logs = await getAuditLogs({ action, entityId, limit });

    return NextResponse.json({
      success: true,
      logs
    });

  } catch (error) {
    console.error('Audit Logs API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
