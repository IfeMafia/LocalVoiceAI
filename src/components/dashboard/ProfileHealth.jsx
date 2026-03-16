import React from 'react';
import { Check, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const ProfileHealth = ({ business }) => {
  const fields = [
    { label: 'Business Name', key: 'name' },
    { label: 'Description', key: 'description' },
    { label: 'Category', key: 'category' },
    { label: 'Business Hours', key: 'business_hours' },
    { label: 'Assistant Tone', key: 'assistant_tone' },
  ];

  const completedFields = fields.filter(f => !!business?.[f.key]).length;
  const completionPercentage = Math.round((completedFields / fields.length) * 100);

  return (
    <div className="bg-zinc-900/50 border border-white/10 p-6 rounded-2xl shadow-xl backdrop-blur-md sticky top-6">
      <h2 className="text-xl font-bold text-white mb-6">Profile Health</h2>
      
      <div className="space-y-4 mb-8">
        {fields.map((field) => (
          <div key={field.key} className="flex items-center justify-between group">
            <span className="text-zinc-400 group-hover:text-zinc-200 transition-colors">{field.label}</span>
            {business?.[field.key] ? (
              <div className="bg-emerald-500/20 p-1 rounded-full text-emerald-400">
                <Check size={14} />
              </div>
            ) : (
              <div className="bg-red-500/20 p-1 rounded-full text-red-400">
                <X size={14} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-white/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-zinc-300">Completion</span>
          <span className={`text-sm font-bold ${completionPercentage === 100 ? 'text-emerald-400' : 'text-orange-400'}`}>
            {completionPercentage}%
          </span>
        </div>
        
        <div className="w-full bg-zinc-800 rounded-full h-2 mb-6">
          <div 
            className={`h-2 rounded-full transition-all duration-1000 ${completionPercentage === 100 ? 'bg-emerald-500' : 'bg-orange-500'}`}
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        <Link 
          href="/business/settings"
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black text-sm font-bold hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
        >
          Complete Profile
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default ProfileHealth;
