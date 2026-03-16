"use client";

import React, { use } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  MapPin, 
  Phone, 
  Globe, 
  Clock, 
  MessageSquare, 
  ChevronLeft,
  Info,
  Layers,
  Award
} from 'lucide-react';
import { MOCK_BUSINESSES } from '@/lib/mockData';
import { notFound } from 'next/navigation';

export default function BusinessProfilePage({ params }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const business = MOCK_BUSINESSES.find(b => b.id === id);

  if (!business) {
    notFound();
  }

  return (
    <DashboardLayout title={`${business.name}`}>
      <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href={`/customer/chat/${business.id}`}>
              <Button variant="ghost" size="icon" className="rounded-full bg-zinc-100 dark:bg-white/5 size-12 hover:bg-[#00D18F] hover:text-white transition-all">
                <ChevronLeft className="w-6 h-6" />
              </Button>
            </Link>
            <div className="space-y-1">
              <h1 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-400">Merchant Profile</h1>
              <p className="text-2xl font-display font-black text-zinc-900 dark:text-white tracking-tight">{business.name}</p>
            </div>
          </div>
          
          <Badge className="bg-[#00D18F]/10 text-[#00D18F] border-none px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest hidden md:block">
            Verified Partner
          </Badge>
        </div>

        <div className="relative h-[32rem] rounded-[4rem] overflow-hidden shadow-[0_48px_96px_-12px_rgba(0,0,0,0.15)] group">
          <img 
            src={business.image} 
            alt={business.name}
            className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 h-[24rem] bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
          <div className="absolute bottom-12 left-12 right-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-6">
              <Badge className="bg-[#00D18F] text-white border-none px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
                {business.category}
              </Badge>
              <h1 className="text-6xl md:text-8xl font-display font-black text-white tracking-tighter leading-[1]">
                {business.name}
              </h1>
              <div className="flex flex-wrap items-center gap-8 text-white/90">
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-amber-400 fill-amber-400 shadow-xl" />
                  <span className="font-black text-2xl">{business.rating}</span>
                  <span className="text-white/50 text-xs font-black uppercase tracking-widest">Global Score</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-[#00D18F]" />
                  <span className="font-bold text-lg tracking-tight">Luxury Plaza, San Francisco</span>
                </div>
              </div>
            </div>
            
            <Link href={`/customer/chat/${business.id}`}>
              <Button className="bg-white text-zinc-900 hover:bg-[#00D18F] hover:text-white rounded-[2rem] px-12 py-10 text-xs font-black uppercase tracking-[0.3em] shadow-2xl transition-all duration-500 active:scale-90 group">
                <MessageSquare className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                Initiate Chat
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-white dark:bg-[#18181b] border border-zinc-100 dark:border-white/5 rounded-[3.5rem] p-12 md:p-16 space-y-8 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#00D18F]/10 rounded-2xl flex items-center justify-center">
                  <Info className="w-6 h-6 text-[#00D18F]" />
                </div>
                <h2 className="text-3xl font-display font-black tracking-tight">Executive Summary</h2>
              </div>
              <p className="text-zinc-500 dark:text-zinc-400 text-xl leading-relaxed font-medium italic">
                {business.description} As a premier destination in our network, we uphold the highest standards of excellence and customer satisfaction.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-zinc-100 dark:border-white/5">
                <div className="flex items-center gap-6 bg-[#fcfcfd] dark:bg-white/5 p-8 rounded-[2.5rem] transition-all hover:scale-105">
                  <Award className="w-10 h-10 text-amber-500" />
                  <div>
                    <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-1">Accreditation</h4>
                    <p className="font-display font-black text-xl text-zinc-900 dark:text-white">Elite Status 2026</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 bg-[#fcfcfd] dark:bg-white/5 p-8 rounded-[2.5rem] transition-all hover:scale-105">
                  <Layers className="w-10 h-10 text-[#00D18F]" />
                  <div>
                    <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-1">Service Level</h4>
                    <p className="font-display font-black text-xl text-zinc-900 dark:text-white">Premium Tier-1</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#18181b] border border-zinc-100 dark:border-white/5 rounded-[3.5rem] p-12 md:p-16 space-y-8 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#00D18F]/10 rounded-2xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-[#00D18F]" />
                </div>
                <h2 className="text-3xl font-display font-black tracking-tight">Operational Hours</h2>
              </div>
              <div className="grid gap-4">
                {[
                  { day: 'Monday - Friday', hours: '09:00 - 22:00' },
                  { day: 'Saturday', hours: '10:00 - 23:00' },
                  { day: 'Sunday', hours: '11:00 - 20:00' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-6 bg-[#fcfcfd] dark:bg-white/5 rounded-3xl group hover:bg-[#00D18F]/5 transition-all">
                    <span className="font-black text-[10px] uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">{item.day}</span>
                    <span className="font-display font-bold text-xl text-zinc-900 dark:text-white">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-12">
            <div className="bg-[#00D18F] rounded-[3.5rem] p-12 text-white space-y-10 shadow-2xl shadow-[#00D18F]/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-150"></div>
              <h3 className="text-2xl font-display font-black uppercase tracking-tighter relative z-10">Communications</h3>
              <div className="space-y-8 relative z-10">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-xl">
                    <Phone className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">Direct Line</h4>
                    <p className="font-display font-black text-xl">+1 (555) 000-VOXY</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-xl">
                    <Globe className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">Portal</h4>
                    <p className="font-display font-black text-xl italic underline decoration-white/20 underline-offset-4">voxy.ai/{business.id}</p>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-white text-[#00D18F] hover:bg-zinc-900 hover:text-white rounded-[2rem] py-10 font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl relative z-10 transition-all active:scale-95">
                Request Protocol
              </Button>
            </div>

            <div className="bg-white dark:bg-[#18181b] border border-zinc-100 dark:border-white/5 rounded-[3.5rem] p-12 space-y-8 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-400">Social Presence</h3>
              <div className="flex flex-wrap gap-4">
                {['Meta', 'X', 'Insta', 'Tele'].map((social) => (
                  <div key={social} className="w-14 h-14 bg-[#fcfcfd] dark:bg-white/5 rounded-2xl flex items-center justify-center font-black text-[10px] uppercase tracking-[0.1em] text-zinc-400 hover:bg-[#00D18F] hover:text-white transition-all cursor-pointer border border-zinc-100 dark:border-white/5">
                    {social}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
