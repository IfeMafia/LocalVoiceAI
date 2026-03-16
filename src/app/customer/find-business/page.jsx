"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Star, MessageSquare, MapPin, Filter } from 'lucide-react';
import { MOCK_BUSINESSES } from '@/lib/mockData';

export default function FindBusinessPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBusinesses = MOCK_BUSINESSES.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout title="Discovery">
      <div className="max-w-7xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out p-4 md:p-8">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <Badge className="bg-[#00D18F]/10 text-[#00D18F] border-none px-4 py-1.5 rounded-full text-xs font-black tracking-[0.3em] uppercase mb-4">
            Curated Network
          </Badge>
          <h1 className="text-5xl md:text-7xl font-display font-black text-zinc-900 dark:text-white tracking-tighter leading-[1] italic">
            Connect with <span className="text-[#00D18F]">Excellence</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Instant AI concierge access to the most premium local services and retail experiences.
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto group">
          <div className="absolute inset-x-0 -top-20 h-64 bg-gradient-radial from-[#00D18F]/10 to-transparent blur-3xl opacity-50"></div>
          <div className="relative flex items-center bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-white/5 rounded-[3rem] p-3 shadow-2xl focus-within:ring-[12px] focus-within:ring-[#00D18F]/5 focus-within:border-[#00D18F]/30 transition-all duration-700">
            <Search className="w-6 h-6 ml-6 text-zinc-400" />
            <input 
              type="text"
              placeholder="Search by brand or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none px-6 py-4 text-xl text-zinc-900 dark:text-white placeholder:text-zinc-400 font-medium tracking-tight"
            />
            <Button className="bg-[#00D18F] hover:bg-[#00A370] text-white rounded-[2.5rem] h-14 px-10 shadow-xl shadow-[#00D18F]/20 transition-all duration-500 active:scale-95 text-xs font-black uppercase tracking-widest">
              Search
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 mt-8 opacity-60">
            {['Restaurants', 'Technology', 'Groceries', 'Wellness'].map(cat => (
              <button key={cat} onClick={() => setSearchQuery(cat)} className="px-5 py-2 rounded-full border border-zinc-200 dark:border-white/5 bg-white/50 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 hover:bg-[#00D18F] hover:text-white hover:border-[#00D18F] transition-all">
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
          {filteredBusinesses.map((business, idx) => (
            <div 
              key={business.id}
              className="group relative bg-white dark:bg-[#18181b] border border-zinc-100 dark:border-white/5 rounded-[3.5rem] overflow-hidden hover:shadow-[0_48px_96px_-12px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_48px_96px_-12px_rgba(0,0,0,0.4)] transition-all duration-700 animate-in fade-in slide-in-from-bottom-6"
              style={{ animationDelay: `${idx * 200}ms` }}
            >
              <div className="flex flex-col md:flex-row h-full">
                <div className="md:w-2/5 h-64 md:h-full overflow-hidden relative">
                  <img 
                    src={business.image} 
                    alt={business.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute top-6 left-6">
                    <Badge className="bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-2xl text-zinc-900 dark:text-white border-none px-4 py-1.5 rounded-2xl text-sm font-black flex items-center gap-1.5 shadow-2xl">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      {business.rating}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 to-transparent pointer-events-none"></div>
                </div>

                <div className="md:w-3/5 p-10 md:p-12 space-y-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <Badge className="bg-[#00D18F]/10 text-[#00D18F] border-none px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em]">
                        {business.category}
                      </Badge>
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-200 dark:bg-white/10"></span>
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Active Now</span>
                    </div>
                    <h3 className="text-4xl font-display font-black text-zinc-900 dark:text-white group-hover:text-[#00D18F] transition-colors leading-tight tracking-tighter">
                      {business.name}
                    </h3>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-4 text-lg leading-relaxed font-medium">
                      {business.description}
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-8 text-[11px] font-black text-zinc-400 uppercase tracking-widest border-t border-zinc-100 dark:border-white/5 pt-8">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-[#00D18F]" />
                        2.4 Miles
                      </div>
                      <div className="flex items-center gap-2 text-[#00D18F]">
                        <MessageSquare className="w-5 h-5" />
                        Live AI
                      </div>
                    </div>

                    <Link href={`/customer/chat/${business.id}`} className="block">
                      <Button className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-[#00D18F] dark:hover:bg-[#00D18F] hover:text-white dark:hover:text-white rounded-[1.75rem] py-8 text-xs font-black uppercase tracking-[0.25em] transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-[#00D18F]/20">
                        Initiate Connection
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredBusinesses.length === 0 && (
          <div className="text-center py-32 bg-[#fcfcfd] dark:bg-white/5 rounded-[4rem] border-4 border-dashed border-zinc-200 dark:border-white/10 animate-in zoom-in-95 duration-700">
            <h3 className="text-4xl font-display font-black text-zinc-900 dark:text-white tracking-tighter">No Brands Found</h3>
            <p className="text-zinc-500 mt-4 text-xl font-medium opacity-80">Refine your search parameters to find the perfect connection.</p>
            <Button 
              variant="outline" 
              className="mt-10 rounded-[1.5rem] px-12 h-14 border-2 font-black uppercase tracking-widest text-xs"
              onClick={() => setSearchQuery("")}
            >
              Reset Search
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

