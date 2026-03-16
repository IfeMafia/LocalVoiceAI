import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  MessageSquare, 
  Users, 
  Globe, 
  ArrowRight, 
  Clock, 
  Settings as SettingsIcon,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const stats = [
    { label: "Total Conversations", value: "1,284", icon: MessageSquare, trend: "+12.5%" },
    { label: "AI Auto-Replies", value: "892", icon: Users, trend: "+18.2%" },
    { label: "Efficiency Rate", value: "94.8%", icon: Globe, trend: "+4.1%" },
  ];

  const recentActivities = [
    { id: 1, user: "Ayo", action: "sent a voice note", time: "2 mins ago", type: "English" },
    { id: 2, user: "Chidi", action: "requested a quote", time: "15 mins ago", type: "Pidgin" },
    { id: 3, user: "Folake", action: "confirmed an order", time: "1 hr ago", type: "Yoruba" },
  ];

  return (
    <DashboardLayout title="Business Dashboard">
      <div className="space-y-10 animate-fade-in-up">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-zinc-900 dark:text-white tracking-tight">
              Welcome back, <span className="text-[#00D18F]">Voxy Partner</span>
            </h1>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400 max-w-lg leading-relaxed">
              Your AI assistant is currently monitoring 12 active conversation threads across 3 languages.
            </p>
          </div>
          <Link 
            href="/business/settings"
            className="flex items-center gap-2 px-6 py-3 bg-[#00D18F]/10 text-[#00D18F] rounded-xl font-bold hover:bg-[#00D18F]/20 transition-all w-fit"
          >
            <SettingsIcon size={18} />
            Assistant Settings
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="voxy-card p-6 group hover:shadow-xl hover:shadow-[#00D18F]/5">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-[#00D18F]/10 text-[#00D18F] group-hover:scale-110 transition-transform">
                  <stat.icon size={24} />
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#00D18F] bg-[#00D18F]/10 px-2 py-1 rounded-full">
                  <TrendingUp size={12} />
                  {stat.trend}
                </div>
              </div>
              <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-3xl font-display font-black mt-2 text-zinc-900 dark:text-white">
                {stat.value}
              </h3>
            </div>
          ))}
        </div>

        {/* Two Column Layout for deeper insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Recent Conversations */}
          <div className="voxy-card overflow-hidden">
            <div className="p-6 border-b border-zinc-200 dark:border-white/5 flex items-center justify-between">
              <h3 className="font-display font-bold text-lg">Recent Conversations</h3>
              <Link href="/business/conversation" className="text-[12px] font-bold text-[#00D18F] hover:underline flex items-center gap-1">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="divide-y divide-zinc-200 dark:divide-white/5">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="p-6 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-600 dark:text-zinc-400">
                      {activity.user.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">
                        {activity.user} <span className="text-zinc-500 font-normal">{activity.action}</span>
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[11px] text-[#00D18F] font-bold px-2 py-0.5 bg-[#00D18F]/10 rounded-md uppercase tracking-wider">
                          {activity.type}
                        </span>
                        <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                          <Clock size={10} /> {activity.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 text-zinc-400 hover:text-[#00D18F] transition-colors">
                    <MessageSquare size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Assistant Performance Card */}
          <div className="voxy-card p-8 flex flex-col justify-center items-center text-center space-y-6 bg-gradient-to-br from-[#00D18F]/5 to-transparent border-[#00D18F]/10">
            <div className="w-20 h-20 rounded-3xl bg-[#00D18F] flex items-center justify-center shadow-lg shadow-[#00D18F]/20">
              <Bot className="w-10 h-10 text-black animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="font-display font-bold text-2xl">Voxy AI is Healthy</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
                Your multilingual model is performing optimally. No manual intervention required in the last 24 hours.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-xs font-bold text-zinc-500 uppercase">Avg Response</p>
                <p className="text-lg font-display font-bold text-[#00D18F]">1.2s</p>
              </div>
              <div className="w-px h-8 bg-zinc-200 dark:border-white/10 self-center" />
              <div className="text-center">
                <p className="text-xs font-bold text-zinc-500 uppercase">Confidence</p>
                <p className="text-lg font-display font-bold text-[#00D18F]">98%</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

// Simple internal Bot icon since lucide-react might not have a specific 'Bot' in all versions or I want a custom one
function Bot({ className, ...props }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      {...props}
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  );
}
