"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, ShieldCheck, MessageSquare } from 'lucide-react';
import ChatInterface from '@/components/chat/ChatInterface';
import Navbar from '@/landing/sections/Navbar';

function PublicChatContent() {
  const { slug } = useParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialConversationId, setInitialConversationId] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchBusiness = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/public/business/${slug}`);
        const data = await res.json();

        if (data.success) {
          setBusiness(data.business);
          
          // Look for existing guest conversation ID in localStorage for this business
          const storedId = localStorage.getItem(`voxy_guest_conv_${data.business.id}`);
          if (storedId) {
            setInitialConversationId(storedId);
          }
        } else {
          setError(data.error || 'Business not found');
        }
      } catch (err) {
        setError('Failed to connect to Voxy');
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [slug]);

  // Persist conversation ID when it's created by ChatInterface
  // Note: We'll need a way for ChatInterface to notify the parent or just let it handle its own persistence
  // Actually, I'll modify ChatInterface to accept an onConversationCreated callback or just let it handle it.
  // For simplicity, I'll let ChatInterface handle initialization and I'll just provide the initial one.

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-voxy-primary mb-4" />
        <p className="text-voxy-muted text-sm font-medium tracking-widest uppercase">Initializing Secure Chat</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <div className="size-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20">
          <MessageSquare className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Unavailable</h1>
        <p className="text-voxy-muted max-w-sm mb-8">{error}</p>
        <a href="/" className="text-voxy-primary font-bold hover:underline">Return to Voxy Home</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans selection:bg-voxy-primary/30 selection:text-white overflow-hidden">
      <Navbar />

      <main className="flex-1 flex flex-col pt-24 pb-8 px-4 md:px-8 max-w-5xl mx-auto w-full overflow-hidden">
        {/* Chat Interface Container */}
        <div className="flex-1 min-h-0 bg-[#0F0F0F] border border-white/[0.05] rounded-[2rem] shadow-2xl overflow-hidden relative group">
           <ChatInterface 
             business={business} 
             userName="Guest" 
             isGuest={true}
             initialConversationId={initialConversationId}
             backUrl="/"
           />
        </div>

        {/* Footer Disclaimer */}
        <div className="mt-8 text-center space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-500">
           <p className="text-[10px] text-zinc-600 uppercase tracking-[0.3em] font-black">
              Session is temporary and not stored.
           </p>
           <p className="text-[11px] text-zinc-400 font-medium">
              Want to save this chat?{' '}
              <a href="/login" className="text-voxy-primary hover:underline font-bold transition-all">Log in</a>
              {' '}or{' '}
              <a href="/register" className="text-voxy-primary hover:underline font-bold transition-all">Sign up</a>
           </p>
        </div>
      </main>
    </div>
  );
}

export default function PublicChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-voxy-primary" />
      </div>
    }>
      <PublicChatContent />
    </Suspense>
  );
}
