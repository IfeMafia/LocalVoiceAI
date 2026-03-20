"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Globe, 
  Cpu, 
  Save, 
  Loader2, 
  Database,
  Key,
  Calendar,
  Layers,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    registrationEnabled: true,
    aiModel: 'gemini-2.0-flash',
    apiKeyRotation: 'monthly',
    platformNotification: 'Voxy system update scheduled for midnight.',
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        if (data.success) {
          setSettings(data.settings);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Settings updated successfully');
      } else {
        toast.error('Failed to save settings');
      }
    } catch (error) {
      toast.error('Connection error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Settings">
        <div className="flex flex-col items-center justify-center p-20 min-h-[60vh] text-zinc-500 space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-voxy-primary" />
          <p className="text-[13px] font-medium text-zinc-500">Loading system settings...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="System Settings">
      <div className="max-w-[1400px] mx-auto pt-8 pb-32 space-y-10">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-white tracking-tight">System Settings</h1>
            <p className="text-[15px] text-zinc-500">
              Manage platform-wide configuration, AI models, and maintenance modes.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="h-11 px-4 bg-[#0A0A0A] border border-white/5 rounded-xl flex items-center gap-3">
                <ShieldCheck size={14} className="text-voxy-primary" />
                <span className="text-[13px] font-medium text-zinc-400">Stable v1.2.0</span>
             </div>
             <button 
               onClick={handleSave}
               disabled={saving}
               className="h-11 px-8 bg-voxy-primary text-black font-bold text-[13px] rounded-xl hover:bg-voxy-primary/90 transition-all flex items-center gap-3 shadow-xl shadow-voxy-primary/10 disabled:opacity-50"
             >
               {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
               Save Changes
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Configuration */}
          <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            {/* Site Status */}
            <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 shadow-2xl overflow-hidden group">
              <div className="flex items-center gap-4 mb-10">
                <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-voxy-primary">
                  <Globe size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">Site Status</h2>
                  <p className="text-[11px] font-medium text-zinc-500 mt-1">Global visibility and registration settings</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-6 bg-white/[0.01] border border-white/[0.03] rounded-2xl hover:bg-white/[0.03] transition-all">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white tracking-tight">Maintenance Mode</p>
                    <p className="text-[11px] text-zinc-500 font-medium max-w-[400px]">Disable public access during updates. Administrators will still have access to the dashboard.</p>
                  </div>
                  <Switch 
                     checked={settings.maintenanceMode} 
                     onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})} 
                  />
                </div>
                
                <div className="flex items-center justify-between p-6 bg-white/[0.01] border border-white/[0.03] rounded-2xl hover:bg-white/[0.03] transition-all">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white tracking-tight">Open Registration</p>
                    <p className="text-[11px] text-zinc-500 font-medium max-w-[400px]">Allow new businesses to sign up without an invitation code.</p>
                  </div>
                  <Switch 
                    checked={settings.registrationEnabled} 
                    onCheckedChange={(checked) => setSettings({...settings, registrationEnabled: checked})} 
                  />
                </div>
              </div>
            </div>

            {/* AI Core */}
            <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 shadow-2xl overflow-hidden group">
              <div className="flex items-center gap-4 mb-10">
                <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-blue-500">
                  <Cpu size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">AI Configuration</h2>
                  <p className="text-[11px] font-medium text-zinc-500 mt-1">Model routing and API key management</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <label className="text-[11px] font-bold text-zinc-500 ml-1">Primary AI Model</label>
                    <div className="relative">
                      <select 
                        value={settings.aiModel}
                        onChange={(e) => setSettings({...settings, aiModel: e.target.value})}
                        className="w-full bg-[#0F0F0F] border border-white/5 rounded-xl px-5 h-14 text-[13px] font-bold text-white outline-none focus:border-voxy-primary/40 appearance-none transition-all cursor-pointer"
                      >
                        <option value="gemini-2.0-flash text-black">Gemini 2.0 Flash (Fastest)</option>
                        <option value="gemini-1.5-pro text-black">Gemini 1.5 Pro (Precision)</option>
                        <option value="gpt-4o text-black">GPT-4o (Standard)</option>
                      </select>
                      <Layers className="absolute right-5 top-1/2 -translate-y-1/2 size-4 text-zinc-600 pointer-events-none" />
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[11px] font-bold text-zinc-500 ml-1">Key Management</label>
                    <div className="relative">
                      <select 
                        value={settings.apiKeyRotation}
                        onChange={(e) => setSettings({...settings, apiKeyRotation: e.target.value})}
                        className="w-full bg-[#0F0F0F] border border-white/5 rounded-xl px-5 h-14 text-[13px] font-bold text-white outline-none focus:border-voxy-primary/40 appearance-none transition-all cursor-pointer"
                      >
                        <option value="daily text-black">Daily Rotation</option>
                        <option value="weekly text-black">Weekly Rotation</option>
                        <option value="monthly text-black">Manual Only</option>
                      </select>
                      <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 size-4 text-zinc-600 pointer-events-none" />
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Sidebar Panel */}
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
            {/* Global Broadcast */}
            <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <AlertTriangle size={80} />
               </div>
               <p className="text-[12px] font-semibold text-zinc-500 mb-4">Broadcast</p>
               <h3 className="text-lg font-bold text-white tracking-tight mb-6">System Alert</h3>
               <textarea 
                 value={settings.platformNotification}
                 onChange={(e) => setSettings({...settings, platformNotification: e.target.value})}
                 className="w-full h-32 bg-[#0F0F0F] border border-white/5 rounded-xl p-4 text-[13px] font-medium text-zinc-300 outline-none focus:border-voxy-primary/50 transition-all resize-none placeholder:text-zinc-700"
                 placeholder="Enter system alert message..."
               />
               <p className="text-[11px] font-medium text-zinc-600 mt-4 leading-relaxed italic">
                 Note: This message will be shown to all active business accounts.
               </p>
            </div>

            {/* Advanced Clearance */}
            <div className="bg-[#0A0A0A] border border-red-500/10 rounded-3xl p-8 shadow-2xl group">
               <div className="flex items-center gap-3 mb-8">
                  <div className="size-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                    <Database size={16} />
                  </div>
                  <h3 className="text-[12px] font-bold text-white">Advanced Controls</h3>
               </div>
               <div className="space-y-3">
                  <button className="w-full h-12 bg-red-500/5 border border-red-500/10 rounded-xl text-[11px] font-bold text-red-500 uppercase tracking-widest hover:bg-red-500/10 transition-all flex items-center justify-center gap-3">
                     <Database size={14} /> Clear System Cache
                  </button>
                  <button className="w-full h-12 bg-red-500/0 border border-white/5 rounded-xl text-[11px] font-bold text-zinc-500 uppercase tracking-widest hover:bg-red-500/5 hover:text-red-500 hover:border-red-500/20 transition-all flex items-center justify-center gap-3">
                     <Key size={14} /> Sign Out All Users
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
