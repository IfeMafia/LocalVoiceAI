"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MessageSquare, ChevronRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CustomerChatHistoryPage() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/conversations');
        const data = await res.json();
        if (data.success) {
          setConversations(data.conversations);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        // toast.error('Failed to load chat history');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  return (
    <DashboardLayout title="Chats">
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
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-[#00D18F]" />
            </div>
          ) : conversations.length > 0 ? (
            conversations.map((chat, idx) => {
              return (
                <Link key={chat.id} href={`/customer/chat/${chat.business_id}`}>
                  <div 
                    className="group relative bg-white dark:bg-[#18181b] border border-zinc-100 dark:border-white/5 rounded-[2.5rem] p-6 md:p-8 hover:border-[#00D18F]/30 shadow-sm hover:shadow-2xl hover:shadow-[#00D18F]/5 transition-all duration-500 cursor-pointer animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${idx * 150}ms` }}
                  >
                    <div className="flex items-center gap-6 md:gap-8">
                      <div className="relative">
                        <div className={`w-20 h-20 md:w-24 md:h-24 rounded-[1.75rem] overflow-hidden ring-8 ring-zinc-50 dark:ring-white/5 shadow-inner group-hover:scale-105 transition-all duration-700 bg-gradient-to-tr from-[#00D18F]/20 to-[#00A370]/20 flex items-center justify-center`}>
                          <MessageSquare className="w-10 h-10 text-[#00D18F]" />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <h3 className="font-display font-black text-2xl text-zinc-900 dark:text-white group-hover:text-[#00D18F] transition-colors tracking-tight">
                              {chat.business_name || 'Business'}
                            </h3>
                            <Badge className="bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 border-none px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black tracking-widest">
                              Concierge
                            </Badge>
                          </div>
                          <span className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em]">
                            {new Date(chat.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-zinc-500 dark:text-zinc-400 text-base font-medium line-clamp-1 max-w-xl group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                          Status: {chat.status}
                        </p>
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
            <div className="text-center py-24 bg-transparent border-none">
              <h3 className="text-2xl md:text-3xl font-display font-black text-zinc-900 dark:text-white tracking-tighter">No Chats</h3>
              <p className="text-zinc-500 mt-3 text-base font-medium opacity-80">You haven't established any conversations yet.</p>
              <Link href="/customer/find-business" className="mt-8 inline-block">
                <Button className="bg-[#00D18F] hover:bg-[#00A370] text-white rounded-2xl h-14 px-8 shadow-2xl shadow-[#00D18F]/30 hover:shadow-[#00D18F]/50 transition-all duration-300 active:scale-95 font-bold uppercase tracking-widest text-xs">
                  Find a Business
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

