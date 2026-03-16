import React from 'react';
import Link from 'next/link';

const RecentConversations = ({ conversations }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'AI Responding':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">AI Responding</span>;
      case 'AI Resolved':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">AI Resolved</span>;
      case 'Needs Owner Response':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">Needs Owner Response</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">{status}</span>;
    }
  };

  return (
    <div className="bg-zinc-900/50 border border-white/10 rounded-2xl shadow-xl backdrop-blur-md overflow-hidden">
      <div className="p-6 border-b border-white/5">
        <h2 className="text-xl font-bold text-white">Recent Conversations</h2>
        <p className="text-zinc-400 text-sm">Most recent interactions with your customers</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-zinc-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Customer</th>
              <th className="px-6 py-4 font-semibold">Last Message</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Time</th>
              <th className="px-6 py-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {conversations && conversations.length > 0 ? (
              conversations.map((conv) => (
                <tr key={conv.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                        {conv.customer_name?.charAt(0) || 'C'}
                      </div>
                      <span className="text-zinc-200 font-medium">{conv.customer_name || 'Anonymous'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-[200px] truncate">
                    <span className="text-zinc-400 text-sm italic">"{conv.last_message || 'N/A'}"</span>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(conv.status)}
                  </td>
                  <td className="px-6 py-4 text-zinc-500 text-sm">
                    {conv.time}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/business/conversation/${conv.id}`}
                      className="inline-flex items-center justify-center px-4 py-1.5 rounded-lg bg-zinc-800 text-white text-xs font-medium hover:bg-zinc-700 transition-all border border-white/5 group-hover:border-white/20"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-zinc-500 italic">
                  No recent conversations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentConversations;
