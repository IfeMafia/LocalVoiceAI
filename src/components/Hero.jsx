"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Mic, Sparkles, MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative pt-32 pb-24 px-6 overflow-hidden">
      <div className="max-w-[800px] mx-auto flex flex-col items-center text-center relative z-10">
        
        <Badge variant="outline" className="mb-8 py-1.5 px-4 gap-2 border-voxy-border bg-voxy-surface">
          <span className="w-2 h-2 rounded-full bg-voxy-primary animate-pulse"></span>
          <span className="text-voxy-text text-sm font-medium">Voxy AI is now in beta</span>
        </Badge>
        
        <h1 className="text-[48px] sm:text-[64px] font-bold leading-[1.1] tracking-tight text-voxy-text mb-6">
          Understand customer voice notes. <br className="hidden sm:block" />
          <span className="text-voxy-textMuted">Instantly.</span>
        </h1>
        
        <p className="text-[18px] text-voxy-textMuted leading-[1.6] mb-10 max-w-[600px]">
          A multilingual AI voice assistant that converts English, Pidgin, and Yoruba voice messages into text and generates ready-to-send replies for your business.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Button size="lg" className="w-full sm:w-auto gap-2 text-[15px]" onClick={() => router.push('/signup')}>
            Start for free <ArrowRight size={18} />
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto text-[15px]" onClick={() => router.push('/login')}>
            Log in to Dashboard
          </Button>
        </div>

        {/* Abstract Workflow Visual */}
        <div className="mt-20 flex items-center justify-center gap-4 sm:gap-8 w-full max-w-[600px]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-voxy-surface border border-voxy-border flex items-center justify-center shadow-lg">
              <Mic size={28} className="text-voxy-textMuted" />
            </div>
            <span className="text-[12px] font-medium text-voxy-textMuted uppercase tracking-wider">Voice Note</span>
          </div>

          <div className="h-px w-12 sm:w-24 bg-voxy-border relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-voxy-border"></div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-voxy-primary/10 border border-voxy-primary/30 flex items-center justify-center shadow-lg">
              <Sparkles size={28} className="text-voxy-primary" />
            </div>
            <span className="text-[12px] font-medium text-voxy-primary uppercase tracking-wider">Voxy AI</span>
          </div>

          <div className="h-px w-12 sm:w-24 bg-voxy-border relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-voxy-border"></div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-voxy-surface border border-voxy-border flex items-center justify-center shadow-lg">
              <MessageSquare size={28} className="text-voxy-textMuted" />
            </div>
            <span className="text-[12px] font-medium text-voxy-textMuted uppercase tracking-wider">Smart Reply</span>
          </div>
        </div>

      </div>
    </section>
  );
}
