import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Users, 
  Building2, 
  Activity, 
  ShieldCheck,
  Zap,
  LayoutGrid,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const stats = [
    { label: "Total Platform Users", value: "4,291", icon: Users, color: "text-[#00D18F]", bg: "bg-[#00D18F]/10" },
    { label: "Verified Businesses", value: "318", icon: Building2, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Daily Transactions", value: "12.4k", icon: Zap, color: "text-blue-500", bg: "bg-blue-500/10" },
  ];

  return (
    <DashboardLayout title="System Overview">
      <div className="space-y-10 animate-fade-in-up">
        
        {/* Admin Welcome */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-display font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-3">
              <ShieldCheck className="text-[#00D18F]" size={32} />
              Admin Control Center
            </h1>
            <p className="text-sm text-zinc-500 font-medium">Monitoring Voxy global infrastructure and user activities.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-white/5 rounded-full border border-zinc-200 dark:border-white/5">
            <span className="w-2 h-2 bg-[#00D18F] rounded-full animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-widest text-[#00D18F]">System Operational</span>
          </div>
        </div>

        {/* Top Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="voxy-card p-8 group relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} -mr-8 -mt-8 rounded-full blur-3xl opacity-50 group-hover:scale-150 transition-transform`} />
              <div className="relative z-10 space-y-4">
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-zinc-500">{stat.label}</p>
                  <h3 className="text-4xl font-display font-black tracking-tight mt-1 text-zinc-900 dark:text-white">
                    {stat.value}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-[#00D18F]">
                  <TrendingUp size={14} />
                  <span>+4.5% from last week</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Platform Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 voxy-card p-8 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-xl">Platform Health</h3>
              <Activity className="text-zinc-300 dark:text-zinc-600" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 bg-zinc-50 dark:bg-zinc-800/30 rounded-2xl border border-zinc-200 dark:border-white/5 space-y-4">
                <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">API Latency</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-display font-bold text-zinc-900 dark:text-white">124ms</span>
                  <span className="text-[11px] text-[#00D18F] mb-1.5 font-bold">Excellent</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div className="w-[85%] h-full bg-[#00D18F]" />
                </div>
              </div>
              <div className="p-6 bg-zinc-50 dark:bg-zinc-800/30 rounded-2xl border border-zinc-200 dark:border-white/5 space-y-4">
                <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Database Load</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-display font-bold text-zinc-900 dark:text-white">42%</span>
                  <span className="text-[11px] text-amber-500 mb-1.5 font-bold">Stable</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div className="w-[42%] h-full bg-amber-500" />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-200 dark:border-white/5">
              <div className="flex items-center gap-3 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
                <AlertCircle className="text-red-500 flex-shrink-0" />
                <p className="text-xs font-medium text-red-500/80">
                  <span className="font-bold">Minor Issue:</span> 3 bot instances in West Africa are reporting higher than usual response times. Investigating...
                </p>
              </div>
            </div>
          </div>

          <div className="voxy-card p-8 bg-gradient-to-b from-[#00D18F]/5 to-transparent border-[#00D18F]/10 space-y-8">
            <h3 className="font-display font-bold text-xl">Quick Actions</h3>
            <div className="space-y-3">
              <Link 
                href="/admin/users"
                className="w-full p-4 flex items-center justify-between bg-white dark:bg-white/5 rounded-2xl border border-zinc-200 dark:border-white/5 hover:border-[#00D18F]/40 hover:-translate-y-0.5 transition-all text-sm font-bold shadow-sm"
              >
                <div className="flex items-center gap-3">
                   <Users size={18} className="text-[#00D18F]" />
                   View User Log
                </div>
                <ArrowRight size={14} className="text-zinc-400" />
              </Link>
              <Link 
                href="/admin/analytics"
                className="w-full p-4 flex items-center justify-between bg-white dark:bg-white/5 rounded-2xl border border-zinc-200 dark:border-white/5 hover:border-[#00D18F]/40 hover:-translate-y-0.5 transition-all text-sm font-bold shadow-sm"
              >
                <div className="flex items-center gap-3">
                   <LayoutGrid size={18} className="text-zinc-500" />
                   System Logs
                </div>
                <ArrowRight size={14} className="text-zinc-400" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

function ArrowRight({ className, ...props }) {
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
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
