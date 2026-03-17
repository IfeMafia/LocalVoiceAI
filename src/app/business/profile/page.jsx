"use client";

import React, { useState, useEffect } from 'react';
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
  Award,
  Loader2,
  Bot,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Edit
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function BusinessProfilePreviewPage() {
  const { user, loading: authLoading } = useAuth();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusiness = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const res = await fetch('/api/businesses');
        const data = await res.json();
        if (data.success && data.business) {
          setBusiness(data.business);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchBusiness();
    }
  }, [user, authLoading]);

  if (loading || authLoading) {
    return (
      <DashboardLayout title="Your Profile">
        <div className="flex flex-col items-center justify-center h-[70vh] space-y-6">
          <Loader2 className="w-16 h-16 animate-spin text-[#00D18F]" />
          <p className="text-zinc-400 font-black uppercase tracking-[0.4em] text-sm animate-pulse">Loading Profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Profile Preview">
      <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 p-4 md:p-8">
        {/* Header Preview Info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Link href="/business/dashboard">
              <Button variant="ghost" size="icon" className="rounded-full bg-zinc-100 dark:bg-white/5 size-12 hover:bg-[#00D18F] hover:text-white transition-all">
                <ChevronLeft className="w-6 h-6" />
              </Button>
            </Link>
            <div className="space-y-1">
              <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Merchant Profile Preview</h1>
              <p className="text-xs text-zinc-500">This is how customers see your business profile</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/business/settings">
              <Button className="bg-white/10 hover:bg-white/20 text-white rounded-2xl h-11 px-6 flex items-center gap-2 border border-white/10 transition-all">
                <Edit className="w-4 h-4 text-[#00D18F]" />
                <span className="font-bold text-xs uppercase tracking-widest">Edit Profile</span>
              </Button>
            </Link>
            <Badge className="bg-[#00D18F]/20 text-[#00D18F] border-2 border-[#00D18F]/30 px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest hidden sm:flex">
              Live View
            </Badge>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative h-[18rem] sm:h-[24rem] md:h-[28rem] rounded-2xl sm:rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl group">
          <div className="w-full h-full bg-[#0a0a0a] flex items-center justify-center">
            {business?.logo_url ? (
              <img src={business.logo_url} alt={business.name} className="w-full h-full object-cover" />
            ) : (
              <Bot className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-[#00D18F]/20" />
            )}
          </div>
          <div className="absolute inset-x-0 bottom-0 h-full bg-black/60"></div>
          <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 md:bottom-12 md:left-12 md:right-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 md:space-y-4 flex-1 min-w-0">
              <Badge className="bg-[#00D18F] text-white border-none px-3.5 py-1 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] shadow-xl w-fit">
                {business?.category === 'Other' ? business?.custom_category : business?.category}
              </Badge>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-white tracking-tighter leading-[0.9] truncate">
                {business?.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-amber-400" />
                  <span className="font-black text-lg sm:text-xl">4.9</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-white/20 hidden sm:block"></div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#00D18F]" />
                  <span className="font-bold text-sm sm:text-base tracking-tight">Lagos, Nigeria</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Button disabled className="w-full bg-zinc-800 text-white/50 cursor-not-allowed rounded-xl h-14 sm:h-16 px-8 sm:px-10 border border-white/5">
                <MessageSquare className="w-4 h-4 mr-2" />
                <span className="font-black uppercase tracking-widest text-[9px] sm:text-[10px]">Chat Preview</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-white dark:bg-[#18181b] border border-zinc-100 dark:border-white/5 rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-12 space-y-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D18F]/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-10 h-10 bg-[#00D18F]/10 rounded-xl flex items-center justify-center">
                  <Info className="w-5 h-5 text-[#00D18F]" />
                </div>
                <h2 className="text-2xl font-display font-black tracking-tight">Executive Summary</h2>
              </div>
              <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed font-medium relative z-10 whitespace-pre-wrap">
                {business?.description || "Tell customers more about your business in Settings to fill this section."}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-zinc-100 dark:border-white/5 relative z-10">
                <div className="flex items-center gap-6 bg-[#fcfcfd] dark:bg-white/5 p-8 rounded-[2.5rem] transition-all hover:scale-105 group/card">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center group-hover/card:bg-amber-500 transition-colors">
                    <Award className="w-8 h-8 text-amber-500 group-hover/card:text-white" />
                  </div>
                  <div>
                    <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-1">Accreditation</h4>
                    <p className="font-display font-black text-xl text-zinc-900 dark:text-white">Elite Class 2026</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 bg-[#fcfcfd] dark:bg-white/5 p-8 rounded-[2.5rem] transition-all hover:scale-105 group/card">
                  <div className="w-16 h-16 rounded-2xl bg-[#00D18F]/10 flex items-center justify-center group-hover/card:bg-[#00D18F] transition-colors">
                    <Layers className="w-8 h-8 text-[#00D18F] group-hover/card:text-white" />
                  </div>
                  <div>
                    <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-1">Infrastructure</h4>
                    <p className="font-display font-black text-xl text-zinc-900 dark:text-white">Enterprise Tier</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#18181b] border border-zinc-100 dark:border-white/5 rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-12 space-y-8 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#00D18F]/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#00D18F]" />
                </div>
                <h2 className="text-2xl font-display font-black tracking-tight">Availability Index</h2>
              </div>
              <div className="grid gap-4">
                {business?.business_hours && Object.keys(business.business_hours).length > 0 ? (
                  Object.entries(business.business_hours).map(([day, hours], idx) => (
                    <div key={idx} className="flex items-center justify-between p-6 bg-[#fcfcfd] dark:bg-white/5 rounded-2xl group hover:bg-[#00D18F]/5 transition-all">
                      <div className="space-y-1">
                        <span className="font-black text-[9px] uppercase tracking-[0.3em] text-zinc-400">{day}</span>
                        <p className="font-display font-bold text-xl text-zinc-900 dark:text-white">
                          {hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}
                        </p>
                      </div>
                      {!hours.closed && (
                        <Badge className="bg-[#00D18F]/10 text-[#00D18F] border-none rounded-xl px-4 py-1 text-[9px] font-black uppercase tracking-widest">Active</Badge>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-500 font-medium italic p-8 text-center bg-[#fcfcfd] dark:bg-white/5 rounded-2xl">
                    Business hours not set yet.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-12">
            <div className="bg-[#00D18F] rounded-[2rem] md:rounded-[2.5rem] p-10 text-white space-y-8 shadow-2xl shadow-[#00D18F]/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-40 -mt-40 transition-transform duration-[2000ms] group-hover:scale-150"></div>
              <div className="space-y-1 relative z-10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Protocols</h3>
                <p className="text-2xl font-display font-black tracking-tighter">Direct Connect</p>
              </div>
              
              <div className="space-y-8 relative z-10">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-2xl border border-white/20 flex-shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">Encrypted Line</h4>
                    <p className="font-display font-black text-xl tracking-tight">+234 (0) VOXY</p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-2xl border border-white/20 flex-shrink-0">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">Direct Domain</h4>
                    <p className="font-display font-bold text-xl tracking-tight underline decoration-white/30 underline-offset-8">voxy.app</p>
                  </div>
                </div>
              </div>
              
              <Button disabled className="w-full bg-zinc-900/50 text-white/50 rounded-xl h-14 font-black uppercase tracking-[0.4em] text-[8px] relative z-10 border-none cursor-not-allowed">
                Action Sample
              </Button>
            </div>

            <div className="bg-white dark:bg-[#18181b] border border-zinc-100 dark:border-white/5 rounded-[2rem] p-8 md:p-10 space-y-8 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Digital Presence</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Instagram, label: 'Instagram' },
                  { icon: Twitter, label: 'X' },
                  { icon: Facebook, label: 'Facebook' },
                  { icon: Linkedin, label: 'Linkedin' }
                ].map((social) => (
                  <div key={social.label} className="h-14 bg-[#fcfcfd] dark:bg-white/5 rounded-xl flex items-center justify-center text-zinc-400 border border-zinc-100 dark:border-white/5 cursor-default">
                    <social.icon className="w-5 h-5" />
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
