"use client";

import { 
  ShieldAlert, 
  Zap, 
  Settings, 
  Database, 
  Key, 
  Activity 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function QuickActionsPanel() {
  const router = useRouter();

  const actions = [
    { 
      label: 'Emergency Stop', 
      icon: ShieldAlert, 
      color: 'text-red-500 bg-red-500/10',
      action: () => toast.error('Emergency protocols require multi-factor confirmation.')
    },
    { 
      label: 'Force AI Re-sync', 
      icon: RefreshCw, 
      color: 'text-blue-500 bg-blue-500/10',
      action: () => toast.success('Re-syncing AI state across nodes...')
    },
    { 
      label: 'Clear Cache', 
      icon: Database, 
      color: 'text-orange-500 bg-orange-500/10',
      action: () => toast.success('Platform cache purged.')
    },
    { 
      label: 'Security Sweep', 
      icon: Activity, 
      color: 'text-emerald-500 bg-emerald-500/10',
      action: () => toast.success('Security sweep initiated...')
    }
  ];

  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 space-y-6">
      <div className="flex items-center gap-3">
         <div className="size-8 rounded-lg bg-voxy-primary/10 flex items-center justify-center text-voxy-primary">
            <Settings size={16} />
         </div>
         <h3 className="text-base font-bold text-white tracking-tight">Quick Actions</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {actions.map((act) => (
          <button 
            key={act.label}
            onClick={act.action}
            className="flex flex-col items-center justify-center p-4 border border-white/5 rounded-2xl hover:bg-white/[0.02] hover:border-white/10 transition-all group"
          >
            <div className={`size-10 rounded-xl flex items-center justify-center mb-3 ${act.color}`}>
              <act.icon size={20} />
            </div>
            <span className="text-[11px] font-bold text-zinc-500 group-hover:text-zinc-300 transition-colors uppercase tracking-widest text-center">
              {act.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

const RefreshCw = ({ size }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/>
  </svg>
);
