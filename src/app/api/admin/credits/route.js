import { NextResponse } from 'next/server';
import { getUserFromCookie } from '@/lib/auth';
import { adjustCredits } from '@/lib/services/credit-service';

/**
 * POST /api/admin/credits
 * Adjust business credits (restricted to admins)
 */
export async function POST(req) {
  try {
    const user = await getUserFromCookie();
    
    // 1. Authorization check
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { businessId, amount, reason } = await req.json();

    if (!businessId || amount === undefined) {
      return NextResponse.json({ error: 'Missing businessId or amount' }, { status: 400 });
    }

    // 2. Perform adjustment
    console.log(`👤 [Admin API] Adjusting credits for biz ${businessId} by ${amount}. Reason: ${reason}`);
    const updatedBusiness = await adjustCredits(businessId, parseInt(amount), reason);

    return NextResponse.json({ 
      success: true, 
      balance: updatedBusiness.creditBalance,
      message: `Successfully adjusted credits by ${amount}` 
    });

  } catch (error) {
    console.error('[Admin Credit API] Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to adjust credits' }, { status: 500 });
  }
}
