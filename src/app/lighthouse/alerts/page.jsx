"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle, 
  Clock, 
  Building2,
  MoreVertical,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Badge } from '@/components/ui/badge';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
    
    // Connect to SSE for real-time alerts
    const eventSource = new EventSource('/api/admin/live');
    eventSource.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      if (type === 'alert') {
        setAlerts(prev => [data, ...prev]);
        toast(data.message, { icon: '🚨', duration: 5000 });
      }
    };

    return () => eventSource.close();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await fetch('/api/admin/alerts');
      const data = await res.json();
      if (data.success) setAlerts(data.alerts);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (alertId) => {
    try {
      const res = await fetch('/api/admin/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertId }),
      });
      const data = await res.json();
      if (data.success) {
        setAlerts(prev => prev.filter(a => a.id !== alertId));
        toast.success('Alert resolved');
      }
    } catch (e) {
      toast.error('Failed to resolve alert');
    }
  };

  const getSeverityColor = (sev) => {
    switch (sev) {
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <DashboardLayout title="Security Alerts">
      <div className="max-w-[1200px] mx-auto pt-8 pb-32 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-4">
              Alert Feed
              <Badge variant="outline" className="text-red-500 border-red-500/20 bg-red-500/5">
                {alerts.length} Pending
              </Badge>
            </h1>
            <p className="text-[15px] text-zinc-500">Real-time monitoring of anomalies, credit issues, and system errors.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="animate-spin text-voxy-primary w-8 h-8" />
            <p className="text-zinc-500 font-medium">Scanning for alerts...</p>
          </div>
        ) : alerts.length === 0 ? (
          <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-20 flex flex-col items-center justify-center text-center">
             <div className="size-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6">
                <CheckCircle size={32} />
             </div>
             <h3 className="text-xl font-bold text-white">All Clear</h3>
             <p className="text-zinc-500 mt-2">No active alerts detected across the platform.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 flex items-start justify-between group hover:border-white/10 transition-all animate-in fade-in slide-in-from-left-4"
              >
                <div className="flex items-start gap-5">
                  <div className={`size-12 rounded-xl border flex items-center justify-center shrink-0 ${getSeverityColor(alert.severity)}`}>
                    {alert.type === 'anomaly' ? <AlertTriangle size={20} /> : <AlertCircle size={20} />}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${getSeverityColor(alert.severity)}`}>
                        {alert.type.replace('_', ' ')}
                      </span>
                      <span className="text-zinc-600 text-[11px] font-medium flex items-center gap-1">
                        <Clock size={12} /> {new Date(alert.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[16px] font-bold text-white tracking-tight">{alert.message}</p>
                    {alert.business_name && (
                      <div className="flex items-center gap-2 text-[13px] text-zinc-500 font-medium">
                        <Building2 size={14} /> {alert.business_name}
                      </div>
                    )}
                  </div>
                </div>
                
                <button 
                  onClick={() => handleResolve(alert.id)}
                  className="px-6 h-10 bg-white/5 border border-white/10 rounded-xl text-[13px] font-bold text-zinc-400 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all flex items-center gap-2"
                >
                  <CheckCircle size={14} /> Resolve
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
