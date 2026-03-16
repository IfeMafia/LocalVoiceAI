"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  CreditCard,
  Languages,
  ArrowRight,
  Bot
} from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'assistant', label: 'AI Assistant', icon: Bot },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Plan & Billing', icon: CreditCard },
  ];

  return (
    <DashboardLayout title="Settings">
      <div className="flex flex-col lg:flex-row gap-10 animate-fade-in-up">
        
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all
                ${activeTab === tab.id 
                  ? 'bg-[#00D18F] text-black shadow-lg shadow-[#00D18F]/20' 
                  : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white'
                }
              `}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-8">
          
          {activeTab === 'profile' && (
            <div className="voxy-card p-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-3xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-display font-black text-3xl text-zinc-500 overflow-hidden border-2 border-dashed border-zinc-300 dark:border-white/10 group-hover:border-[#00D18F] transition-all cursor-pointer">
                    S
                  </div>
                  <div className="absolute -bottom-2 -right-2 p-2 bg-[#00D18F] text-black rounded-lg shadow-lg">
                    <ArrowRight size={14} className="-rotate-45" />
                  </div>
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl">Samkiel Workspace</h3>
                  <p className="text-sm text-zinc-500 mt-1">Update your business details and public profile.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Business Name</label>
                  <input type="text" defaultValue="Samkiel AI Solutions" className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-xl px-4 py-3.5 outline-none focus:border-[#00D18F]/50 transition-all font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Contact Email</label>
                  <input type="email" defaultValue="hello@samkiel.com" className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-xl px-4 py-3.5 outline-none focus:border-[#00D18F]/50 transition-all font-medium" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Business Description</label>
                  <textarea rows="4" className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-xl px-4 py-3.5 outline-none focus:border-[#00D18F]/50 transition-all font-medium resize-none">We provide cutting edge AI solutions for small businesses across Africa.</textarea>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button className="px-8 py-3.5 bg-[#00D18F] text-black rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-[#00D18F]/20">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'assistant' && (
            <div className="voxy-card p-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-4 p-4 bg-[#00D18F]/5 border border-[#00D18F]/20 rounded-2xl">
                <Languages className="text-[#00D18F]" />
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                  Your assistant is currently configured for <span className="text-[#00D18F] font-bold">English</span>, <span className="text-[#00D18F] font-bold">Pidgin</span>, and <span className="text-[#00D18F] font-bold">Yoruba</span>.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-display font-bold text-lg mb-4">Auto-Reply Logic</h4>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-white/5 rounded-xl border border-zinc-200 dark:border-white/5 hover:border-[#00D18F]/30 transition-all cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center text-zinc-500 group-hover:text-[#00D18F] transition-colors">
                          <Bot size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-sm">Full Autonomous Mode</p>
                          <p className="text-[11px] text-zinc-500">AI replies to everything based on your knowledge base.</p>
                        </div>
                      </div>
                      <div className="w-10 h-5 bg-[#00D18F] rounded-full relative">
                        <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                      </div>
                    </label>

                    <label className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-white/5 rounded-xl border border-zinc-200 dark:border-white/5 hover:border-[#00D18F]/30 transition-all cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center text-zinc-500 group-hover:text-[#00D18F] transition-colors">
                          <Globe size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-sm">Draft Only</p>
                          <p className="text-[11px] text-zinc-500">AI prepares replies but you must approve them before sending.</p>
                        </div>
                      </div>
                      <div className="w-10 h-5 bg-zinc-300 dark:bg-zinc-700 rounded-full relative">
                        <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full" />
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="voxy-card p-12 text-center space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="inline-flex p-4 rounded-3xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/5 mb-2">
                <CreditCard size={40} className="text-[#00D18F]" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-bold text-3xl italic">Voxy Pro</h3>
                <p className="text-sm text-zinc-500 font-medium">You are currently on the professional tier.</p>
              </div>
              <div className="pt-4">
                <button className="px-10 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl">
                  Manage Subscription
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </DashboardLayout>
  );
}
