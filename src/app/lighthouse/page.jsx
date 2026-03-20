import { getDashboardStats } from '@/lib/admin_queries/admin';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Building2, Activity, DollarSign, Trophy, ArrowRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

const AdminStatCard = ({ title, value, description, icon: Icon, colorClass }) => (
  <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl flex flex-col h-full hover:border-white/10 transition-all group">
    <div className="flex items-start justify-between mb-4">
      <div className={`size-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-voxy-primary transition-colors`}>
        <Icon size={20} className={colorClass} />
      </div>
      <div className="text-[12px] font-semibold text-zinc-500 text-right">{title}</div>
    </div>
    
    <div>
      <h3 className="text-3xl font-bold text-white mb-1 tracking-tight">{value}</h3>
      <p className="text-[13px] text-zinc-500 font-medium">{description}</p>
    </div>
  </div>
);

export default async function LighthouseOverviewPage() {
  const stats = await getDashboardStats();

  const statCards = [
    { 
      title: 'Total Businesses', 
      value: stats.totalBusinesses, 
      description: 'Total companies on the platform',
      icon: Building2,
      colorClass: 'text-voxy-primary'
    },
    { 
      title: 'Active Accounts', 
      value: stats.activeBusinesses, 
      description: 'Active in the last 7 days',
      icon: Activity,
      colorClass: 'text-blue-400'
    },
    { 
      title: 'Monthly Spend', 
      value: `$${stats.totalCost.toFixed(2)}`, 
      description: 'Combined infrastructure costs',
      icon: DollarSign, 
      colorClass: 'text-emerald-400'
    },
  ];

  return (
    <DashboardLayout title="Admin Home">
      <div className="max-w-[1400px] mx-auto pt-8 pb-32 space-y-10">
        
        {/* Page Header */}
        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl font-bold text-white tracking-tight">Admin Overview</h1>
          <p className="text-[15px] text-zinc-500">
            Monitor platform activity, manage business accounts, and track infrastructure costs.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          {statCards.map((stat, i) => (
            <AdminStatCard key={i} {...stat} />
          ))}
        </div>

        {/* Top Businesses */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <div className="p-8 border-b border-white/[0.03] flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <TrendingUp size={16} className="text-voxy-primary" />
                <h2 className="text-[12px] font-semibold text-zinc-500">Usage Analytics</h2>
              </div>
              <p className="text-xl font-bold text-white tracking-tight">Top business accounts</p>
            </div>
            <Link 
              href="/lighthouse/businesses" 
              className="px-6 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-[13px] font-medium text-zinc-400 hover:text-white hover:border-white/20 transition-all underline decoration-voxy-primary/30 underline-offset-4"
            >
              View all businesses
            </Link>
          </div>

          <div className="divide-y divide-white/[0.03]">
            {stats.topBusinesses.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center justify-center opacity-50">
                 <Activity size={32} className="text-zinc-800 mb-4" />
                 <p className="text-[13px] font-medium text-zinc-600">No activity data available yet</p>
              </div>
            ) : (
              stats.topBusinesses.map((b, i) => (
                <div key={b.id} className="flex items-center justify-between p-6 hover:bg-white/[0.01] transition-all group">
                  <div className="flex items-center gap-6">
                    <div className="font-bold text-2xl text-zinc-800 tracking-tighter tabular-nums w-8">
                       {i + 1}
                    </div>
                    <div>
                        <Link 
                          href={`/lighthouse/businesses/${b.id}`} 
                          className="font-bold text-lg text-white group-hover:text-voxy-primary transition-colors tracking-tight flex items-center gap-3"
                        >
                          {b.name}
                          <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-voxy-primary" />
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                           <Badge variant="outline" className="text-[10px] font-medium border-white/5 bg-white/5 text-zinc-500 py-0 h-5">Verified Business</Badge>
                        </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xl font-bold text-white tracking-tight tabular-nums">
                      ${b.cost.toFixed(2)}
                    </div>
                    <p className="text-[11px] font-medium text-zinc-500 mt-1">Monthly Billing</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
