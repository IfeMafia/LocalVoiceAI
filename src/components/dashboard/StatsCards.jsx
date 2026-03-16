import React from 'react';
import { MessageSquare, Users, CheckCircle, AlertCircle } from 'lucide-react';

const StatsCard = ({ title, value, description, icon: Icon, colorClass }) => (
  <div className="bg-zinc-900/50 border border-white/10 p-6 rounded-2xl shadow-xl backdrop-blur-md">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-lg ${colorClass}`}>
        <Icon size={24} />
      </div>
    </div>
    <h3 className="text-zinc-400 text-sm font-medium">{title}</h3>
    <p className="text-3xl font-bold text-white mt-1">{value}</p>
    <p className="text-zinc-500 text-xs mt-2">{description}</p>
  </div>
);

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Conversations',
      value: stats?.total || 0,
      description: 'Cumulative total conversations',
      icon: MessageSquare,
      colorClass: 'bg-blue-500/10 text-blue-400',
    },
    {
      title: 'Active Conversations Today',
      value: stats?.activeToday || 0,
      description: 'Conversations with activity today',
      icon: Users,
      colorClass: 'bg-purple-500/10 text-purple-400',
    },
    {
      title: 'AI Resolved Conversations',
      value: stats?.aiResolved || 0,
      description: 'Handled entirely by AI',
      icon: CheckCircle,
      colorClass: 'bg-emerald-500/10 text-emerald-400',
    },
    {
      title: 'Owner Interventions',
      value: stats?.ownerInterventions || 0,
      description: 'Owner replied at least once',
      icon: AlertCircle,
      colorClass: 'bg-orange-500/10 text-orange-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <StatsCard key={index} {...card} />
      ))}
    </div>
  );
};

export default StatsCards;
