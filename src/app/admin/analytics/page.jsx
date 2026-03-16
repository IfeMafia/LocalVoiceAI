"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Globe, 
  Clock,
  Download,
  Calendar
} from 'lucide-react';

export default function AnalyticsPage() {
  const metrics = [
    { label: "Active Nodes", value: "24", sub: "Global distribution", icon: Globe },
    { label: "Total Requests", value: "892k", sub: "+12% this month", icon: Activity },
    { label: "Avg Latency", value: "42ms", sub: "High performance", icon: Zap },
    { label: "Success Rate", value: "99.9%", sub: "Service uptime", icon: ShieldCheck },
  ];

  return (
    <DashboardLayout title="System Analytics">
      <div className="space-y-10 animate-fade-in-up">
        
        {/* Header with Date Picker placeholder */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-zinc-900 dark:text-white tracking-tight italic">Platform Performance</h1>
            <p className="mt-1 text-sm text-zinc-500 font-medium">Detailed breakdown of multilingual processing and system load.</p>
          </div>
          <div className="flex items-center gap-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/5 p-2 rounded-2xl">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#00D18F] text-black rounded-xl text-xs font-black shadow-lg shadow-[#00D18F]/20">
              <Calendar size={14} /> Last 30 Days
            </div>
            <button className="p-3 text-zinc-500 hover:text-white transition-colors">
              <Download size={18} />
            </button>
          </div>
        </div>

        {/* Top Level Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, i) => (
            <div key={i} className="voxy-card p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-[#00D18F] group-hover:bg-[#00D18F]/10 transition-all">
                <m.icon size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{m.label}</p>
                <div className="flex items-end gap-2 mt-1">
                  <h3 className="text-2xl font-display font-black text-zinc-900 dark:text-white">{m.value}</h3>
                  <span className="text-[10px] text-[#00D18F] font-bold mb-1">{m.sub.includes('+') ? m.sub : ''}</span>
                </div>
                <p className="text-[10px] text-zinc-500 mt-1 font-medium">{!m.sub.includes('+') ? m.sub : 'vs prev month'}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Visual Charts Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           
           {/* Language Distribution */}
           <div className="voxy-card p-8 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-xl">Language Distribution</h3>
                <BarChart3 className="text-zinc-600" />
              </div>
              <div className="space-y-6">
                {[
                  { lang: "English", count: "450k", pct: 65, color: "bg-blue-500" },
                  { lang: "Pidgin", count: "180k", pct: 25, color: "bg-[#00D18F]" },
                  { lang: "Yoruba", count: "62k", pct: 10, color: "bg-amber-500" }
                ].map((l) => (
                  <div key={l.lang} className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                      <span className="text-zinc-500">{l.lang}</span>
                      <span className="text-zinc-900 dark:text-white">{l.count} ({l.pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className={`h-full ${l.color}`} style={{ width: `${l.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
           </div>

           {/* Hourly Load */}
           <div className="voxy-card p-8 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-xl">Peak Activity Hours</h3>
                <TrendingUp className="text-zinc-600" />
              </div>
              <div className="flex items-end justify-between h-48 gap-2 px-2">
                {[45, 30, 60, 80, 55, 90, 70, 40, 65, 85, 30, 50].map((h, i) => (
                  <div key={i} className="flex-1 space-y-2 group cursor-pointer">
                    <div 
                      className="w-full bg-[#00D18F]/20 group-hover:bg-[#00D18F] transition-all rounded-t-sm relative"
                      style={{ height: `${h}%` }}
                    >
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[8px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                         {h}k req
                       </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-zinc-500">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>23:59</span>
              </div>
           </div>

        </div>

        {/* Geography Breakdown */}
        <div className="voxy-card p-8 flex flex-col items-center justify-center text-center space-y-4 bg-zinc-900/40 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#00D18F]/5 to-transparent pointer-events-none" />
          <div className="w-16 h-16 rounded-full bg-[#00D18F]/10 flex items-center justify-center text-[#00D18F]">
             <Globe size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-bold text-2xl uppercase italic">Africa-First Performance</h3>
            <p className="max-w-md text-sm text-zinc-500 font-medium">94% of multilingual requests are processed via edge nodes in Lagos and Johannesburg for sub-50ms latency.</p>
          </div>
          <button className="text-xs font-black uppercase tracking-[0.2em] text-[#00D18F] mt-4 flex items-center gap-2 hover:translate-x-2 transition-transform">
            View Geo-distribution Map <TrendingUp size={16} />
          </button>
        </div>

      </div>
    </DashboardLayout>
  );
}

// Internal icons to ensure availability
function Activity({ className, ...props }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      {...props}
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

function Zap({ className, ...props }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      {...props}
    >
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function ShieldCheck({ className, ...props }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      {...props}
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
