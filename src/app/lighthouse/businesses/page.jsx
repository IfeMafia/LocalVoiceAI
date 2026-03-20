import { getAllBusinesses } from '@/lib/admin_queries/admin';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { Building2, Search, Filter, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default async function BusinessesListPage() {
  const businesses = await getAllBusinesses();

  return (
    <DashboardLayout title="Businesses">
      <div className="max-w-[1400px] mx-auto pt-8 pb-32 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-white tracking-tight">Business Accounts</h1>
            <p className="text-[15px] text-zinc-500">
              Manage all business entities, monitor usage, and track billing across the platform.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-voxy-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search businesses..." 
                className="bg-[#0A0A0A] border border-white/5 text-white text-[13px] font-medium rounded-xl pl-11 pr-4 h-11 focus:outline-none focus:border-voxy-primary/40 focus:bg-[#0F0F0F] transition-all w-full md:w-72"
              />
            </div>
            <button className="h-11 px-5 bg-[#0A0A0A] text-zinc-500 font-medium text-[13px] rounded-xl hover:text-white hover:border-white/20 transition-all border border-white/5 flex items-center gap-3">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>

        {/* Businesses Table */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.03] bg-white/[0.01]">
                  <th className="py-5 px-8 text-zinc-500 text-[11px] font-semibold uppercase tracking-wider">Business Name</th>
                  <th className="py-5 px-6 text-zinc-500 text-[11px] font-semibold uppercase tracking-wider">Owner Email</th>
                  <th className="py-5 px-6 text-zinc-500 text-[11px] font-semibold uppercase tracking-wider text-center">Requests</th>
                  <th className="py-5 px-6 text-zinc-500 text-[11px] font-semibold uppercase tracking-wider text-center">Billing</th>
                  <th className="py-5 px-6 text-zinc-500 text-[11px] font-semibold uppercase tracking-wider text-center">Status</th>
                  <th className="py-5 px-8 text-zinc-500 text-[11px] font-semibold uppercase tracking-wider text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {businesses.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-32 text-center">
                      <div className="flex flex-col items-center justify-center opacity-40">
                         <Building2 size={40} className="text-zinc-800 mb-4" />
                         <p className="text-[13px] font-medium text-zinc-600">No businesses onboarded yet</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  businesses.map((business) => (
                    <tr key={business.id} className="group hover:bg-white/[0.01] transition-all">
                      <td className="py-6 px-8">
                        <Link 
                          href={`/lighthouse/businesses/${business.id}`} 
                          className="font-bold text-[16px] text-white group-hover:text-voxy-primary transition-colors tracking-tight flex items-center gap-3"
                        >
                          {business.name}
                          <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all font-sans" />
                        </Link>
                      </td>
                      <td className="py-6 px-6">
                        <span className="text-[13px] font-medium text-zinc-400">{business.owner_email}</span>
                      </td>
                      <td className="py-6 px-6 text-center">
                        <span className="text-[14px] font-bold text-zinc-300 tabular-nums">{business.totalUsageCount}</span>
                      </td>
                      <td className="py-6 px-6 text-center tabular-nums">
                        <span className="text-[15px] font-bold text-white tracking-tight">${business.totalCost.toFixed(2)}</span>
                      </td>
                      <td className="py-6 px-6 text-center">
                        <Badge variant="outline" className={`
                          text-[10px] font-medium px-3 py-0.5 border-0
                          ${business.status === 'active' ? 'bg-voxy-primary/10 text-voxy-primary' :
                            business.status === 'suspended' ? 'bg-red-500/10 text-red-500' :
                            'bg-yellow-500/10 text-yellow-500'}
                        `}>
                          {business.status}
                        </Badge>
                      </td>
                      <td className="py-6 px-8 text-right">
                        <span className="text-[13px] font-medium text-zinc-500 tabular-nums">
                          {new Date(business.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
