"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MessageSquare, ChevronRight, Loader2 } from 'lucide-react';

export default function CustomerChatHistoryPage() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async (isInitial = false) => {
      try {
        if (isInitial) setLoading(true);
        const res = await fetch('/api/conversations');
        const data = await res.json();
        if (data.success) {
          setConversations(data.conversations);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        if (isInitial) setLoading(false);
      }
    };

    fetchConversations(true);

    const intervalId = setInterval(() => fetchConversations(false), 10000);
    window.addEventListener('focus', fetchConversations);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', fetchConversations);
    };
  }, []);

  return (
    <DashboardLayout title="Chat History">
      <div className="max-w-5xl mx-auto w-full overflow-hidden space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 p-3 sm:p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
          <div className="space-y-1">
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mt-2">
              Manage your conversations with local businesses.
            </p>
          </div>
          
          <Link href="/customer/find-business">
            <Button className="bg-[#00D18F] hover:bg-[#00A370] text-white rounded-2xl h-16 px-8 shadow-2xl shadow-[#00D18F]/30 hover:shadow-[#00D18F]/50 transition-all duration-500 active:scale-95 group">
              <Plus className="w-6 h-6 mr-2 group-hover:rotate-90 transition-transform duration-500" />
              <span className="font-bold uppercase tracking-widest text-xs">Start New Chat</span>
            </Button>
          </Link>
        </div>

        <div className="grid gap-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-[#00D18F]" />
              <p className="text-zinc-400 font-black uppercase tracking-[0.3em] text-xs">Loading conversations...</p>
            </div>
          ) : conversations.length > 0 ? (
            conversations.map((chat, idx) => (
              <Link key={chat.id} href={`/customer/chat/${chat.business_slug}`} className="block w-full">
                <div 
                  className="group relative bg-white dark:bg-[#18181b] border border-zinc-100 dark:border-white/5 rounded-2xl md:rounded-3xl p-4 hover:border-[#00D18F]/30 shadow-sm hover:shadow-xl hover:shadow-[#00D18F]/5 transition-all duration-500 cursor-pointer animate-in fade-in slide-in-from-bottom-4 flex flex-row items-center gap-3 sm:gap-4 w-full"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl overflow-hidden ring-2 ring-zinc-50 dark:ring-white/5 shadow-inner group-hover:scale-105 transition-all duration-700 bg-[#00D18F]/10 flex items-center justify-center relative shrink-0">
                      <MessageSquare className="w-6 h-6 md:w-7 md:h-7 text-[#00D18F]" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0 overflow-hidden w-full">
                    <div className="flex items-center justify-between gap-2 mb-1 min-w-0 overflow-hidden w-full">
                      <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
                        <h3 className="font-display font-bold text-base md:text-lg text-zinc-900 dark:text-white group-hover:text-[#00D18F] transition-colors truncate">
                          {chat.business_name || 'Business'}
                        </h3>
                        <Badge className="flex-shrink-0 bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 border-none px-2 py-0.5 rounded-full text-[9px] md:text-[10px] uppercase font-black tracking-wider">
                          {chat.status}
                        </Badge>
                      </div>
                      <span className="text-[10px] md:text-xs text-zinc-400 font-bold uppercase tracking-wider whitespace-nowrap shrink-0">
                        {new Date(chat.last_message_at || chat.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 w-full min-w-0 overflow-hidden">
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium truncate group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors flex-1 min-w-0 w-full block">
                        {chat.last_message || 'Click to continue your chat...'}
                      </p>
                      {chat.unread_count > 0 && (
                        <div className="size-5 md:size-6 bg-[#00D18F] text-black text-[10px] md:text-[11px] font-black rounded-full flex items-center justify-center shadow-md animate-pulse shrink-0">
                          {chat.unread_count}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-zinc-50 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0 group-hover:bg-[#00D18F]/10 shrink-0">
                    <ChevronRight className="w-4 h-4 text-[#00D18F]" />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-32 bg-[#fcfcfd] dark:bg-white/5 rounded-[3.5rem] border-4 border-dashed border-zinc-200 dark:border-white/10">
              <div className="w-24 h-24 bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl flex items-center justify-center mx-auto mb-8 text-[#00D18F]">
                <MessageSquare className="w-12 h-12" />
              </div>
              <h3 className="text-3xl font-display font-black text-zinc-900 dark:text-white tracking-tighter">No chats yet</h3>
              <p className="text-zinc-500 mt-3 text-lg font-medium opacity-80">Start a conversation with a business today.</p>
              <Link href="/customer/find-business" className="mt-10 inline-block">
                <Button className="rounded-2xl h-14 px-8 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:scale-105 transition-transform">
                  Find Businesses
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

