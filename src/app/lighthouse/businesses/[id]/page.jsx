import { getBusinessDetails } from '@/lib/admin_queries/admin';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Building2, Activity, DollarSign, Cpu, Settings, Trash2, ShieldAlert, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default async function BusinessDetailsPage({ params }) {
  const resolvedParams = await params;
  const business = await getBusinessDetails(resolvedParams.id);

  if (!business) {
    return (
      <DashboardLayout title="Not Found">
        <div className="p-20 text-center flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-white mb-4">Business record not found</h2>
          <Link href="/lighthouse/businesses" className="text-voxy-primary font-medium hover:underline flex items-center gap-2">
            <ArrowLeft size={16} /> Back to directory
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const { stats } = business;

  const statCards = [
    { label: 'LLM Tokens', value: stats.totalLlmTokens.toLocaleString(), icon: Cpu, cost: `$${stats.llmCost.toFixed(2)}` },
    { label: 'STT Duration', value: `${stats.totalSttDuration.toFixed(1)}s`, icon: Activity, cost: `$${stats.sttCost.toFixed(2)}` },
    { label: 'TTS Usage', value: stats.totalTtsUsage.toLocaleString(), icon: Activity, cost: `$${stats.ttsCost.toFixed(2)}` },
    { label: 'Total Requests', value: stats.requestsCount, icon: Settings, cost: `$${stats.totalCost.toFixed(2)}` },
  ];

  return (
    <DashboardLayout title="Business Details">
      <div className="max-w-[1400px] mx-auto pt-8 pb-32 space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="space-y-4">
            <Link href="/lighthouse/businesses" className="text-[13px] font-medium text-zinc-500 hover:text-white transition-colors flex items-center gap-2">
              <ArrowLeft size={14} /> Back to Businesses
            </Link>
            <div className="space-y-2">
               <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-bold text-white tracking-tight">{business.name}</h1>
                  <Badge variant="outline" className={`
                    text-[10px] font-medium px-3 py-0.5 border-0
                    ${business.status === 'active' ? 'bg-voxy-primary/10 text-voxy-primary' :
                      business.status === 'suspended' ? 'bg-red-500/10 text-red-500' :
                      'bg-yellow-500/10 text-yellow-500'}
                  `}>
                    {business.status}
                  </Badge>
               </div>
               <p className="text-[15px] text-zinc-500 font-medium">{business.owner_email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <form action={async () => {
                'use server';
                const { updateBusinessStatus } = await import('@/lib/admin_queries/admin');
                await updateBusinessStatus(business.id, business.status === 'suspended' ? 'active' : 'suspended');
             }}>
                <button type="submit" className={`h-11 px-6 rounded-xl font-bold text-[13px] transition-all border ${
                  business.status === 'suspended' ? 'bg-voxy-primary/10 text-voxy-primary border-voxy-primary/20 hover:bg-voxy-primary/20' : 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20'
                }`}>
                  {business.status === 'suspended' ? 'Activate Account' : 'Suspend Account'}
                </button>
             </form>

             {business.status !== 'flagged' && (
               <form action={async () => {
                  'use server';
                  const { updateBusinessStatus } = await import('@/lib/admin_queries/admin');
                  await updateBusinessStatus(business.id, 'flagged');
               }}>
                  <button type="submit" className="h-11 px-6 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 font-bold text-[13px] rounded-xl hover:bg-yellow-500/20 transition-all flex items-center gap-2">
                    <ShieldAlert size={14} /> Flag
                  </button>
               </form>
             )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          {statCards.map((stat, i) => (
            <div key={i} className="bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl flex flex-col h-full hover:border-white/10 transition-all group">
              <div className="flex items-start justify-between mb-6">
                <div className="text-[12px] font-semibold text-zinc-500">{stat.label}</div>
                <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-voxy-primary transition-colors">
                  <stat.icon size={18} />
                </div>
              </div>
              <div className="mt-auto">
                <h3 className="text-3xl font-bold text-white mb-2 tracking-tight tabular-nums">{stat.value}</h3>
                <p className="text-[13px] font-medium text-voxy-primary/80">Cost: {stat.cost}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Combined Cost Card */}
        <div className="p-10 bg-[#0A0A0A] border border-white/5 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
           <div className="space-y-1 text-center sm:text-left">
             <p className="text-[12px] font-semibold text-zinc-500 uppercase tracking-wider">Total consumption</p>
             <h2 className="text-5xl font-bold text-white tracking-tight tabular-nums">${stats.totalCost.toFixed(2)}</h2>
           </div>
           <div className="size-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-voxy-primary shadow-xl shadow-voxy-primary/5">
                <DollarSign className="w-8 h-8" />
           </div>
        </div>

        {/* Usage Logs */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <div className="flex items-center gap-3 mb-8">
            <Activity size={18} className="text-voxy-primary" />
            <h2 className="text-xl font-bold text-white tracking-tight">Daily Usage History</h2>
          </div>
          
          <div className="space-y-3">
            {business.charts.length === 0 ? (
              <div className="py-20 text-center text-zinc-600">
                 <p className="text-[14px] font-medium">No usage records found for this period</p>
              </div>
            ) : (
              business.charts.map(day => (
                <div key={day.date} className="flex items-center justify-between p-5 bg-white/[0.01] border border-white/5 rounded-2xl hover:bg-white/[0.03] transition-all group">
                  <div className="text-[15px] font-semibold text-zinc-300">{day.date}</div>
                  <div className="flex items-center gap-8">
                    <div className="text-zinc-500 font-medium text-[13px]">{day.count} requests</div>
                    <div className="text-voxy-primary font-bold tabular-nums">${day.cost.toFixed(2)}</div>
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
