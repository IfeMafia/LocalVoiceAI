"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Volume2, 
  Clock, 
  Languages, 
  ChevronRight,
  User
} from 'lucide-react';
import { useState } from 'react';

export default function ConversationsPage() {
  const [conversations] = useState([
    { id: 1, user: "Ayo Williams", preview: "Eku ale o, I want to confirm my order for tomorrow.", language: "Yoruba", time: "10:24 AM", status: "Auto-Replied", sentiment: "Positive" },
    { id: 2, user: "Chidi", preview: "How much is the delivery to Lekki Phase 1?", language: "Pidgin", time: "09:45 AM", status: "Manual Review", sentiment: "Neutral" },
    { id: 3, user: "Sarah", preview: "Thank you for the quick response! Very helpful.", language: "English", time: "Yesterday", status: "Resolved", sentiment: "Positive" },
    { id: 4, user: "Unknown", preview: "Voice note transcript processing...", language: "Unknown", time: "2 days ago", status: "Failed", sentiment: "N/A" },
  ]);

  return (
    <DashboardLayout title="Conversations">
      <div className="h-full flex flex-col space-y-6 animate-fade-in-up">
        
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative group w-full sm:max-w-xs">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-[#00D18F] transition-colors" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full pl-11 pr-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-[#00D18F]/20 focus:border-[#00D18F]/50 transition-all font-medium text-sm"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-xl text-sm font-bold hover:bg-zinc-100 dark:hover:bg-white/10 transition-all">
              <Filter size={16} /> Filters
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#00D18F]/10 text-[#00D18F] border border-[#00D18F]/20 rounded-xl text-sm font-bold hover:bg-[#00D18F] hover:text-black transition-all">
              <Languages size={16} /> All Languages
            </button>
          </div>
        </div>

        {/* Conversation List */}
        <div className="voxy-card overflow-hidden">
          <div className="grid grid-cols-1 divide-y divide-zinc-200 dark:divide-white/5">
            {conversations.map((conv) => (
              <div 
                key={conv.id} 
                className="group p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-50 dark:hover:bg-white/5 transition-all cursor-pointer relative"
              >
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 font-display font-bold">
                      {conv.user === 'Unknown' ? <User size={20} /> : conv.user.charAt(0)}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-black flex items-center justify-center bg-zinc-900`}>
                       <Volume2 size={10} className="text-[#00D18F]" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-display font-bold text-lg text-zinc-900 dark:text-white truncate">
                        {conv.user}
                      </h4>
                      <span className={`
                        text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border
                        ${conv.status === 'Auto-Replied' ? 'bg-[#00D18F]/10 border-[#00D18F]/20 text-[#00D18F]' : 
                          conv.status === 'Manual Review' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 
                          conv.status === 'Failed' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                          'bg-zinc-500/10 border-zinc-500/20 text-zinc-500'}
                      `}>
                        {conv.status}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1 italic">
                      "{conv.preview}"
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                       <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1 uppercase tracking-widest">
                         <Languages size={12} /> {conv.language}
                       </span>
                       <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1 uppercase tracking-widest">
                         <Clock size={12} /> {conv.time}
                       </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 pl-16 sm:pl-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Sentiment</p>
                    <span className={`text-xs font-bold ${conv.sentiment === 'Positive' ? 'text-[#00D18F]' : conv.sentiment === 'Negative' ? 'text-red-500' : 'text-zinc-500'}`}>
                      {conv.sentiment}
                    </span>
                  </div>
                  <ChevronRight size={20} className="text-zinc-300 dark:text-zinc-700 group-hover:text-[#00D18F] group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 bg-zinc-50 dark:bg-zinc-900/10 text-center border-t border-zinc-200 dark:border-white/5">
             <button className="text-sm font-bold text-[#00D18F] hover:underline flex items-center gap-2 mx-auto">
               Load Older Conversations <ChevronRight size={16} />
             </button>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
