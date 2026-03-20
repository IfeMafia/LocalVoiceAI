import { getAdminDb } from './supabase';
import { detectUsageAnomaly, validateRequestMetrics } from './admin-engine/anomalyDetector';
import { checkCreditHealth, checkRateLimit } from './admin-engine/creditGuard';
import { createAlert } from './admin-engine/alerts';

export async function trackUsage({
  businessId,
  type,
  tokensUsed = null,
  duration = null,
  costEstimate,
}) {
  const supabase = getAdminDb();
  
  // 1. Check Rate Limits & Credit Health BEFORE insert (Control Layer)
  const health = await checkCreditHealth(businessId);
  const rateLimit = await checkRateLimit(businessId);

  if (!health.allowed) {
     console.warn(`[UsageTrack] Blocked: ${health.reason} for business ${businessId}`);
     if (health.alert) await createAlert({ ...health.alert, businessId });
     return { allowed: false, reason: health.reason };
  }

  if (rateLimit.limited) {
     console.warn(`[UsageTrack] Rate Limited: ${businessId}`);
     await createAlert({ 
       type: 'anomaly', 
       severity: 'medium', 
       message: `Rate limit hit: ${rateLimit.limit} req/min exceeded.`, 
       businessId 
     });
     return { allowed: false, reason: 'Rate limit exceeded' };
  }

  // 2. Anomaly Detection (Post-Validation Layer)
  const anomaly = await detectUsageAnomaly(businessId, type, costEstimate);
  if (anomaly.isAnomaly) {
    await createAlert({
      type: 'anomaly',
      severity: anomaly.severity,
      message: anomaly.reason,
      businessId
    });
  }

  const metricsAnomaly = validateRequestMetrics(type, { tokensUsed, duration });
  if (metricsAnomaly.isAnomaly) {
    await createAlert({
      type: 'anomaly',
      severity: metricsAnomaly.severity,
      message: metricsAnomaly.reason,
      businessId
    });
  }

  // 3. Log current usage
  const { error } = await supabase
    .from('usage_logs')
    .insert([{
      business_id: businessId,
      type,
      tokens_used: tokensUsed,
      duration,
      cost_estimate: costEstimate,
    }]);

  if (error) {
    console.error('Failed to track usage:', error);
    await createAlert({
      type: 'system_error',
      severity: 'high',
      message: `Database error during usage tracking: ${error.message}`,
      businessId
    });
  }

  return { allowed: true };
}
