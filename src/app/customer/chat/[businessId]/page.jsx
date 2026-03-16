"use client";

import React, { use } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ChatInterface from '@/components/chat/ChatInterface';
import { MOCK_BUSINESSES } from '@/lib/mockData';
import { notFound } from 'next/navigation';

export default function BusinessChatPage({ params }) {
  const resolvedParams = use(params);
  const { businessId } = resolvedParams;
  const business = MOCK_BUSINESSES.find(b => b.id === businessId);

  if (!business) {
    notFound();
  }

  return (
    <DashboardLayout title={`Chat with ${business.name}`}>
      <div className="h-[calc(100vh-140px)] min-h-[600px] flex flex-col max-w-5xl mx-auto">
        <div className="flex-1 overflow-hidden">
          <ChatInterface business={business} />
        </div>
      </div>
    </DashboardLayout>
  );
}
