import prisma from '../prisma';
import { getAdminDb } from '../supabase';

export async function getDashboardStats() {
  const supabase = getAdminDb();
  
  // Total businesses
  const { count: totalBusinesses } = await supabase
    .from('businesses')
    .select('id', { count: 'exact', head: true });

  // Active businesses (last 7 days)
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  
  const { data: activeLogs } = await supabase
    .from('usage_logs')
    .select('business_id')
    .gte('created_at', lastWeek.toISOString());
    
  const activeBusinesses = new Set(activeLogs?.map(log => log.business_id)).size;

  // Total cost
  const { data: costData } = await supabase
    .from('usage_logs')
    .select('cost_estimate');
    
  const totalCost = costData?.reduce((sum, log) => sum + Number(log.cost_estimate), 0) || 0;

  // Top 5 businesses by cost
  const { data: allLogs } = await supabase
    .from('usage_logs')
    .select('business_id, cost_estimate, businesses(name, slug)');
    
  const businessCostMap = {};
  allLogs?.forEach(log => {
    if (!businessCostMap[log.business_id]) {
      businessCostMap[log.business_id] = {
        name: log.businesses?.name || 'Unknown',
        cost: 0
      };
    }
    businessCostMap[log.business_id].cost += Number(log.cost_estimate);
  });
  
  const topBusinesses = Object.entries(businessCostMap)
    .map(([id, info]) => ({ id, name: info.name, cost: info.cost }))
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 5);

  return {
    totalBusinesses: totalBusinesses || 0,
    activeBusinesses,
    totalCost,
    topBusinesses
  };
}

export async function getAllBusinesses() {
  try {
    const businesses = await prisma.business.findMany({
      include: {
        transactions: {
          select: { type: true, amount: true }
        },
        owner: {
          select: { email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return businesses.map(b => {
      const totalPurchased = b.transactions
        .filter(t => t.type === 'credit_purchase')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        
      const totalUsed = b.transactions
        .filter(t => t.type === 'credit_usage')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      return {
        ...b,
        owner_email: b.owner?.email || 'Unknown',
        creditBalance: b.creditBalance,
        totalPurchased,
        totalUsed,
        // Match existing UI props
        created_at: b.createdAt,
        totalUsageCount: totalUsed // Using credit usage as proxy for request count in this context
      };
    });
  } catch (error) {
    console.error('[Admin Query] Error fetching businesses:', error);
    return [];
  }
}

export async function getBusinessDetails(id) {
  const supabase = getAdminDb();
  
  const { data: business, error } = await supabase
    .from('businesses')
    .select(`
      id, name, slug, owner_id, status, created_at,
      usage_logs (
        id, type, tokens_used, duration, cost_estimate, created_at
      )
    `)
    .eq('id', id)
    .single();
    
  if (error) return null;

  const { data: userData } = await supabase.auth.admin.getUserById(business.owner_id);
  business.owner_email = userData?.user?.email || 'Unknown';

  let totalLlmTokens = 0, totalSttDuration = 0, totalTtsUsage = 0;
  let llmCost = 0, sttCost = 0, ttsCost = 0, totalCost = 0;
  const dailyStats = {};

  business.usage_logs?.forEach(log => {
    const cost = Number(log.cost_estimate) || 0;
    totalCost += cost;
    
    const dateStr = new Date(log.created_at).toISOString().split('T')[0];
    if (!dailyStats[dateStr]) {
      dailyStats[dateStr] = { date: dateStr, count: 0, cost: 0 };
    }
    dailyStats[dateStr].count += 1;
    dailyStats[dateStr].cost += cost;

    if (log.type === 'llm') {
      totalLlmTokens += log.tokens_used || 0;
      llmCost += cost;
    } else if (log.type === 'stt') {
      totalSttDuration += log.duration || 0;
      sttCost += cost;
    } else if (log.type === 'tts') {
      totalTtsUsage += log.duration || log.tokens_used || 0; 
      ttsCost += cost;
    }
  });

  return {
    ...business,
    stats: {
      totalLlmTokens, totalSttDuration, totalTtsUsage, requestsCount: business.usage_logs?.length || 0,
      totalCost, llmCost, sttCost, ttsCost,
    },
    charts: Object.values(dailyStats).sort((a, b) => a.date.localeCompare(b.date))
  };
}

export async function updateBusinessStatus(id, newStatus) {
  const supabase = getAdminDb();
  const { error } = await supabase
    .from('businesses')
    .update({ status: newStatus })
    .eq('id', id);
  return !error;
}
