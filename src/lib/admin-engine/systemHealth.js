import db from '@/lib/db';

/**
 * Aggregates system health metrics.
 */
export async function getSystemHealth() {
  try {
    // 1. Calculate Average Latency (for LLM / STT / TTS)
    const latencyQuery = `
      SELECT type, AVG(duration) as avg_duration
      FROM usage_logs
      WHERE created_at >= NOW() - INTERVAL '24 hours'
      GROUP BY type
    `;
    const latencyRes = await db.query(latencyQuery);
    const latencies = latencyRes.rows.reduce((acc, row) => {
      acc[row.type] = parseFloat(row.avg_duration || 0);
      return acc;
    }, {});

    // 2. Fetch recent alerts (unresolved)
    const alertsQuery = `
      SELECT COUNT(*) as alert_count, severity
      FROM alerts
      WHERE resolved_at IS NULL
      GROUP BY severity
    `;
    const alertsRes = await db.query(alertsQuery);
    const alertStats = alertsRes.rows.reduce((acc, row) => {
      acc[row.severity] = parseInt(row.alert_count);
      return acc;
    }, { critical: 0, high: 0, medium: 0, low: 0 });

    // 3. Error Rate (Inferred from types or if we add an error log)
    // Note: We'll add a 'system_error' check in usage_logs or a dedicated table later.
    // For now, let's assume if usage_logs have null tokens_used but cost > 0, it's weird?
    // Let's use the alerts table 'system_error' type.
    const errorRes = await db.query(`
      SELECT COUNT(*) as count 
      FROM alerts 
      WHERE type = 'system_error' AND created_at >= NOW() - INTERVAL '1 hour'
    `);
    const errorCount = parseInt(errorRes.rows[0]?.count || 0);

    return {
      latencies,
      alertStats,
      errorCount,
      status: alertStats.critical > 0 ? 'critical' : (alertStats.high > 0 ? 'warning' : 'stable'),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('[SystemHealth] Error:', error);
    return null;
  }
}
