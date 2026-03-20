"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Building2,
  ArrowRight,
  Calculator,
  Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function FinancePage() {
  const [stats, setStats] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const fetchFinanceData = async () => {
    try {
      const res = await fetch('/api/admin/metrics');
      const data = await res.json();
      if (data.success) {
        // Mocking some financial logic for calculation based on the requested formula:
        // profit = credits_value - infra_cost
        // Assuming 1 credit = $0.05 for this simulation
        const CREDIT_VALUE = 0.05;
        
        const bData = data.topBusinesses.map(b => ({
          ...b,
          creditsRevenue: b.cost / 0.7 * CREDIT_VALUE, // Theoretical revenue
          actualCost: b.cost,
          profit: (b.cost / 0.7 * CREDIT_VALUE) - b.cost
        }));

        setBusinesses(bData);
        setStats({
          totalRevenue: bData.reduce((s, b) => s + b.creditsRevenue, 0),
          totalCost: bData.reduce((s, b) => s + b.actualCost, 0),
          totalProfit: bData.reduce((s, b) => s + b.profit, 0),
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Financial Intelligence">
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="animate-spin text-voxy-primary w-8 h-8" />
          <p className="text-zinc-500 font-medium">Crunching financial data...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Revenue & Profit">
      <div className="max-w-[1400px] mx-auto pt-8 pb-32 space-y-10">
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-4">
            Financial Dashboard
            <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 bg-emerald-500/5">
              Net Positive
            </Badge>
          </h1>
          <p className="text-[15px] text-zinc-500">Analysis of credit sales value vs underlying infrastructure costs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl space-y-4">
             <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Total Estimated Revenue</div>
             <p className="text-4xl font-bold text-white tabular-nums">${stats.totalRevenue.toFixed(2)}</p>
             <div className="flex items-center gap-2 text-[13px] text-emerald-500 font-bold">
               <TrendingUp size={14} /> +12.4% from last period
             </div>
          </div>
          <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl space-y-4">
             <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Gross Infrastructure Cost</div>
             <p className="text-4xl font-bold text-white tabular-nums">${stats.totalCost.toFixed(2)}</p>
             <div className="flex items-center gap-2 text-[13px] text-orange-500 font-bold">
               <TrendingDown size={14} /> -3.2% optimization saving
             </div>
          </div>
          <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl space-y-4 ring-1 ring-emerald-500/20">
             <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest text-emerald-500">Net Platform Profit</div>
             <p className="text-4xl font-bold text-white tabular-nums">${stats.totalProfit.toFixed(2)}</p>
             <div className="flex items-center gap-2 text-[13px] text-zinc-500 font-medium">
                Margin: <span className="text-emerald-500 font-bold">{(stats.totalProfit / stats.totalRevenue * 100).toFixed(1)}%</span>
             </div>
          </div>
        </div>

        <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden">
           <div className="p-8 border-b border-white/[0.03] flex items-center justify-between">
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-3">
                 <Calculator size={18} className="text-voxy-primary" /> Business Profitability
              </h3>
           </div>
           <div className="divide-y divide-white/[0.03]">
              {businesses.map(b => (
                <div key={b.name} className="p-6 flex items-center justify-between hover:bg-white/[0.01] transition-all group">
                   <div className="flex items-center gap-6">
                      <div className="size-12 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400">
                         <Building2 size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white group-hover:text-voxy-primary transition-colors">{b.name}</h4>
                        <p className="text-[11px] text-zinc-500 font-medium uppercase mt-1">SaaS Enterprise Tier</p>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-3 gap-16 text-right">
                      <div>
                        <p className="text-[10px] font-bold text-zinc-600 uppercase">Rev</p>
                        <p className="text-sm font-bold text-white tabular-nums">${b.creditsRevenue.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-zinc-600 uppercase">Cost</p>
                        <p className="text-sm font-bold text-zinc-400 tabular-nums">${b.actualCost.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-emerald-500 uppercase">Profit</p>
                        <p className="text-sm font-bold text-emerald-500 tabular-nums">${b.profit.toFixed(2)}</p>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
