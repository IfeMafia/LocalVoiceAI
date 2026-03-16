"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import StatsCards from '@/components/dashboard/StatsCards';
import ConversationChart from '@/components/dashboard/ConversationChart';
import RecentConversations from '@/components/dashboard/RecentConversations';
import ProfileHealth from '@/components/dashboard/ProfileHealth';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    activeToday: 0,
    aiResolved: 0,
    ownerInterventions: 0
  });
  const [business, setBusiness] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [timeRange, setTimeRange] = useState('7d');

  const fetchChartData = async (range, bizId) => {
    let days = 7;
    if (range === '24h') days = 1;
    if (range === '30d') days = 30;

    const labels = [];
    const points = [];

    if (range === '24h') {
      // Group by hour for last 24h
      for (let i = 23; i >= 0; i--) {
        const start = new Date();
        start.setHours(start.getHours() - i, 0, 0, 0);
        const end = new Date(start);
        end.setHours(end.getHours() + 1);

        const { count } = await supabase
          .from('conversations')
          .select('*', { count: 'exact', head: true })
          .eq('business_id', bizId)
          .gte('created_at', start.toISOString())
          .lt('created_at', end.toISOString());

        points.push({
          name: start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          count: count || 0
        });
      }
    } else {
      // Group by day
      for (let i = days - 1; i >= 0; i--) {
        const start = new Date();
        start.setDate(start.getDate() - i);
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setDate(end.getDate() + 1);

        const { count } = await supabase
          .from('conversations')
          .select('*', { count: 'exact', head: true })
          .eq('business_id', bizId)
          .gte('created_at', start.toISOString())
          .lt('created_at', end.toISOString());

        points.push({
          name: start.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }),
          count: count || 0
        });
      }
    }
    setChartData(points);
  };

  useEffect(() => {
    if (!user) return;

    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const { data: bizData } = await supabase
          .from('businesses')
          .select('*')
          .eq('owner_id', user.id)
          .single();

        setBusiness(bizData);
        if (bizData?.id) {
          // Fetch stats, conversations, and initial chart
          const { count: total } = await supabase.from('conversations').select('*', { count: 'exact', head: true }).eq('business_id', bizData.id);
          const { count: aiRes } = await supabase.from('conversations').select('*', { count: 'exact', head: true }).eq('business_id', bizData.id).eq('status', 'AI Resolved');
          const { count: ownerInt } = await supabase.from('conversations').select('*', { count: 'exact', head: true }).eq('business_id', bizData.id).eq('status', 'Needs Owner Response');
          
          const today = new Date();
          today.setHours(0,0,0,0);
          const { count: active } = await supabase.from('conversations').select('*', { count: 'exact', head: true }).eq('business_id', bizData.id).gte('created_at', today.toISOString());

          setStats({
            total: total || 0,
            activeToday: active || 0,
            aiResolved: aiRes || 0,
            ownerInterventions: ownerInt || 0
          });

          const { data: recent } = await supabase.from('conversations').select('*').eq('business_id', bizData.id).order('created_at', { ascending: false }).limit(10);
          setConversations((recent || []).map(c => ({
            ...c,
            time: new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            customer_name: c.customer_name || 'Customer'
          })));

          await fetchChartData(timeRange, bizData.id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [user]);

  // Handle time range change
  useEffect(() => {
    if (business?.id && !loading) {
      fetchChartData(timeRange, business.id);
    }
  }, [timeRange]);

  if (loading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#00D18F]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Business Owner'}
          </h1>
          <p className="mt-2 text-zinc-400">
            Here’s what’s happening with your business today.
          </p>
        </div>

        <StatsCards stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ConversationChart 
              data={chartData} 
              timeRange={timeRange}
              setTimeRange={setTimeRange}
            />
            <RecentConversations conversations={conversations} />
          </div>
          <div>
            <ProfileHealth business={business} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
