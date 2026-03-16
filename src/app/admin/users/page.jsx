"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal,
  Mail,
  Calendar,
  Shield,
  UserCheck,
  UserX
} from 'lucide-react';

export default function UsersPage() {
  const users = [
    { id: 1, name: "Samkiel", email: "sam@voxy.ai", role: "Admin", status: "Active", joined: "Oct 12, 2025" },
    { id: 2, name: "Ayo Williams", email: "ayo@business.com", role: "Business", status: "Active", joined: "Oct 15, 2025" },
    { id: 3, name: "Sarah Chidi", email: "sarah@gmail.com", role: "Customer", status: "Active", joined: "Nov 02, 2025" },
    { id: 4, name: "John Doe", email: "john@doe.net", role: "Customer", status: "Inactive", joined: "Dec 01, 2025" },
    { id: 5, name: "Tech Corp", email: "admin@techcorp.io", role: "Business", status: "Pending", joined: "Dec 05, 2025" },
  ];

  return (
    <DashboardLayout title="User Management">
      <div className="space-y-6 animate-fade-in-up">
        
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative group flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-[#00D18F] transition-colors" />
            <input 
              type="text" 
              placeholder="Search users by name or email..." 
              className="w-full pl-11 pr-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-[#00D18F]/20 focus:border-[#00D18F]/50 transition-all font-medium text-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-xl text-sm font-bold hover:bg-zinc-100 dark:hover:bg-white/10 transition-all">
              <Filter size={16} /> Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-3 bg-[#00D18F] text-black rounded-xl text-sm font-bold shadow-lg shadow-[#00D18F]/20 hover:scale-105 transition-all">
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        {/* Users Table Card */}
        <div className="voxy-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-900/10">
                  <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">User</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Role</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Joined On</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center font-bold text-zinc-600 dark:text-zinc-400">
                          {user.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-display font-bold text-zinc-900 dark:text-white truncate">{user.name}</p>
                          <p className="text-[12px] text-zinc-500 flex items-center gap-1">
                            <Mail size={12} /> {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        {user.role === 'Admin' ? <Shield size={14} className="text-[#00D18F]" /> : <Users size={14} className="text-zinc-400" />}
                        <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{user.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-[12px] text-zinc-500 font-medium">
                        <Calendar size={14} /> {user.joined}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`
                        text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border
                        ${user.status === 'Active' ? 'bg-[#00D18F]/10 border-[#00D18F]/20 text-[#00D18F]' : 
                          user.status === 'Pending' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 
                          'bg-red-500/10 border-red-500/20 text-red-500'}
                      `}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-zinc-400 hover:text-[#00D18F] transition-colors rounded-lg hover:bg-[#00D18F]/10">
                          <UserCheck size={18} />
                        </button>
                        <button className="p-2 text-zinc-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/10">
                          <UserX size={18} />
                        </button>
                        <button className="p-2 text-zinc-400 hover:text-white transition-colors">
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Placeholder */}
          <div className="p-6 border-t border-zinc-200 dark:border-white/5 flex items-center justify-between text-[12px] text-zinc-500 font-bold uppercase tracking-widest">
            <span>Showing 1 to 5 of 128 users</span>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-zinc-100 dark:bg-white/5 rounded-lg opacity-50 cursor-not-allowed">Prev</button>
              <button className="px-4 py-2 bg-zinc-100 dark:bg-white/5 rounded-lg hover:bg-[#00D18F] hover:text-black transition-all">Next</button>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

function Users({ className, ...props }) {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
