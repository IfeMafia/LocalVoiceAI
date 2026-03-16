"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Recharts to prevent build errors if the package is missing
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const AreaChart = dynamic(() => import('recharts').then(mod => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then(mod => mod.Area), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });

const ConversationChart = ({ data }) => {
  const [timeRange, setTimeRange] = useState('7d'); // '24h', '7d', '30d'
  const [isRechartsLoaded, setIsRechartsLoaded] = useState(false);

  useEffect(() => {
    // Check if recharts can be loaded
    import('recharts').then(() => {
      setIsRechartsLoaded(true);
    }).catch(() => {
      setIsRechartsLoaded(false);
    });
  }, []);

  return (
    <div className="bg-zinc-900/50 border border-white/10 p-6 rounded-2xl shadow-xl backdrop-blur-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Conversation Activity</h2>
          <p className="text-zinc-400 text-sm">Monitor your message volume over time</p>
        </div>
        
        <div className="flex bg-zinc-800/50 p-1 rounded-lg self-start">
          {['24h', '7d', '30d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                timeRange === range 
                  ? 'bg-zinc-700 text-white shadow-lg' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {range === '24h' ? 'Last 24h' : range === '7d' ? 'Last 7 Days' : 'Last 30 Days'}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[350px] w-full">
        {isRechartsLoaded && data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D18F" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00D18F" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#71717a" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                stroke="#71717a" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#18181b', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#fff'
                }}
                itemStyle={{ color: '#00D18F' }}
              />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#00D18F" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorCount)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : !isRechartsLoaded ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-2 border border-dashed border-white/10 rounded-xl">
            <p className="text-sm font-medium">Chart visualization pending...</p>
            <p className="text-xs text-zinc-600 max-w-[200px] text-center">Please ensure 'recharts' is installed or wait for background processes to complete.</p>
            <code className="text-xs bg-zinc-800 px-2 py-1 rounded mt-2">npm install recharts</code>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-500 italic">
            No activity data available for this period.
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationChart;
