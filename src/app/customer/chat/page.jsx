"use client";

import React from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MessageSquare, ChevronRight, Search, Clock } from 'lucide-react';
import { MOCK_BUSINESSES, MOCK_CHAT_HISTORY } from '@/lib/mockData';

export default function CustomerChatHistoryPage() {
  const getBusiness = (id) => MOCK_BUSINESSES.find(b => b.id === id);

  return (
    <DashboardLayout title="Concierge Hub">
      <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-display font-black text-zinc-900 dark:text-white tracking-tighter">
              Active <span className="text-[#00D18F]">Chats</span>
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg font-medium opacity-80">
              Manage your high-priority inquiries.
            </p>
          </div>
          
          <Link href="/customer/find-business">
            <Button className="bg-[#00D18F] hover:bg-[#00A370] text-white rounded-2xl h-16 px-8 shadow-2xl shadow-[#00D18F]/30 hover:shadow-[#00D18F]/50 transition-all duration-500 active:scale-95 group">
              <Plus className="w-6 h-6 mr-2 group-hover:rotate-90 transition-transform duration-500" />
              <span className="font-bold uppercase tracking-widest text-xs">New Inquiry</span>
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 px-2">
          {MOCK_CHAT_HISTORY.length > 0 ? (
            MOCK_CHAT_HISTORY.map((chat, idx) => {
              const business = getBusiness(chat.businessId);
              return (
                <Link key={chat.businessId} href={`/customer/chat/${chat.businessId}`}>
                  <div 
                    className="group relative bg-white dark:bg-[#18181b] border border-zinc-100 dark:border-white/5 rounded-[2.5rem] p-6 md:p-8 hover:border-[#00D18F]/30 shadow-sm hover:shadow-2xl hover:shadow-[#00D18F]/5 transition-all duration-500 cursor-pointer animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${idx * 150}ms` }}
                  >
                    <div className="flex items-center gap-6 md:gap-8">
                      <div className="relative">
                        <div className={`w-20 h-20 md:w-24 md:h-24 rounded-[1.75rem] overflow-hidden ring-8 ring-zinc-50 dark:ring-white/5 shadow-inner group-hover:scale-105 transition-all duration-700`}>
                          <img 
                            src={business?.image} 
                            alt={business?.name}
                            className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                          />
                        </div>
                        {chat.unread > 0 && (
                          <div className="absolute -top-3 -right-3 bg-[#00D18F] text-white text-[12px] font-black w-8 h-8 rounded-full flex items-center justify-center border-4 border-white dark:border-[#18181b] shadow-2xl animate-bounce">
                            {chat.unread}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <h3 className="font-display font-black text-2xl text-zinc-900 dark:text-white group-hover:text-[#00D18F] transition-colors tracking-tight">
                              {business?.name}
                            </h3>
                            <Badge className="bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 border-none px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black tracking-widest">
                              {business?.category}
                            </Badge>
                          </div>
                          <span className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em]">
                            {chat.timestamp}
                          </span>
                        </div>
                        <p className="text-zinc-500 dark:text-zinc-400 text-base font-medium line-clamp-1 max-w-xl group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                          {chat.lastMessage}
                        </p>
                        
                        <div className="flex items-center gap-4 pt-1">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#00D18F]"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#00D18F]">Response in 2m</span>
                          </div>
                        </div>
                      </div>

                      <div className="hidden md:flex items-center justify-center w-14 h-14 rounded-full bg-zinc-50 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-6 group-hover:translate-x-0 group-hover:bg-[#00D18F]/10">
                        <ChevronRight className="w-6 h-6 text-[#00D18F]" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="text-center py-32 bg-[#fcfcfd] dark:bg-white/5 rounded-[3rem] border-4 border-dashed border-zinc-200 dark:border-white/10">
              <div className="w-24 h-24 bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl flex items-center justify-center mx-auto mb-8 animate-pulse text-[#00D18F]">
                <MessageSquare className="w-12 h-12" />
              </div>
              <h3 className="text-3xl font-display font-black text-zinc-900 dark:text-white tracking-tighter">Quiet Day?</h3>
              <p className="text-zinc-500 mt-3 text-lg font-medium opacity-80">No active conversations currently.</p>
              <Link href="/customer/find-business" className="mt-10 inline-block">
                <Button className="rounded-2xl h-14 px-8 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:scale-105 transition-transform">
                  Explore Businesses
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

