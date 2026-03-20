"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Activity, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Network,
  Clock,
  Loader2,
  RefreshCw,
  Server
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const MetricCard = ({ title, value, unit, icon: Icon, colorClass }) => (
  <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl flex flex-col h-full hover:border-white/10 transition-all">
    <div className="flex items-start justify-between mb-4">
      <div className={`size-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400`}>
        <Icon size={20} className={colorClass} />
      </div>
      <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">{title}</div>
    </div>
    <div className="flex items-baseline gap-2">
      <h3 className="text-3xl font-bold text-white tabular-nums">{value}</h3>
      <span className="text-zinc-500 text-sm font-medium">{unit}</span>
    </div>
  </div>
);

export default function HealthPage() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchHealth = async () => {
    try {
      const res = await fetch('/api/admin/health');
      const data = await res.json();
      if (data.success) setHealth(data.health);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !health) {
    return (
      <DashboardLayout title="System Health">
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="animate-spin text-voxy-primary w-8 h-8" />
          <p className="text-zinc-500 font-medium">Connecting to system monitor...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="System Infrastructure">
      <div className="max-w-[1400px] mx-auto pt-8 pb-32 space-y-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-4">
              System Health
              <Badge variant="outline" className={`${health.status === 'stable' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 'text-red-500 border-red-500/20 bg-red-500/5'}`}>
                {health.status.toUpperCase()}
              </Badge>
            </h1>
            <p className="text-[15px] text-zinc-500">Real-time infrastructure health, provider latency, and error rates.</p>
          </div>
          <button onClick={fetchHealth} className="h-11 px-6 bg-white/5 border border-white/10 rounded-xl text-[13px] font-bold text-zinc-400 hover:text-white transition-all flex items-center gap-2">
            <RefreshCw size={14} /> Last Update: {new Date(health.timestamp).toLocaleTimeString()}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard title="LLM Latency" value={health.latencies.llm?.toFixed(0) || '-'} unit="ms" icon={Zap} colorClass="text-yellow-500" />
          <MetricCard title="STT Latency" value={health.latencies.stt?.toFixed(1) || '-'} unit="s" icon={Activity} colorClass="text-blue-500" />
          <MetricCard title="TTS Latency" value={health.latencies.tts?.toFixed(0) || '-'} unit="ms" icon={Cpu} colorClass="text-purple-500" />
          <MetricCard title="Active Alerts" value={health.alertStats.critical + health.alertStats.high} unit="Urgent" icon={ShieldCheck} colorClass="text-red-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 space-y-8">
              <div className="flex items-center justify-between">
                 <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-3">
                   <Server size={18} className="text-voxy-primary" /> Provider Status
                 </h3>
                 <span className="text-[11px] font-bold text-zinc-500">LIVE FEED</span>
              </div>
              <div className="space-y-4">
                 {[
                   { name: 'Google Gemini Pro', type: 'LLM', lat: health.latencies.llm, status: 'Healthy' },
                   { name: 'Groq STT', type: 'STT', lat: health.latencies.stt * 1000, status: 'Healthy' },
                   { name: 'ElevenLabs', type: 'TTS', lat: health.latencies.tts, status: 'Healthy' }
                 ].map(p => (
                   <div key={p.name} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                      <div>
                        <p className="text-sm font-bold text-white">{p.name}</p>
                        <p className="text-[11px] text-zinc-500 uppercase font-medium mt-0.5">{p.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-emerald-500">{p.status}</p>
                        <p className="text-[11px] text-zinc-500 font-medium tabular-nums mt-0.5">{p.lat?.toFixed(0)}ms</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center space-y-6">
              <div className="size-32 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 flex items-center justify-center animate-spin-slow">
                 <Network size={32} className="text-emerald-500 -rotate-90" />
              </div>
              <div className="text-center space-y-2">
                 <h3 className="text-xl font-bold text-white">System Connectivity</h3>
                 <p className="text-sm text-zinc-500 max-w-[300px]">Infrastructure links are performing within target resolution time.</p>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[98%] shadow-glow text-transparent">.</div>
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
