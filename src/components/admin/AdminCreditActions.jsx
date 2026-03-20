"use client";

import React, { useState } from 'react';
import { Plus, Minus, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

/**
 * AdminCreditActions - Inline component for manual credit adjustments
 */
export default function AdminCreditActions({ businessId, currentBalance }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAdjust = async (amount) => {
    const reason = window.prompt(`Reason for ${amount > 0 ? 'adding' : 'removing'} ${Math.abs(amount)} credits:`, 'Manual Admin Adjustment');
    if (reason === null) return; // Cancelled

    try {
      setLoading(true);
      const res = await fetch('/api/admin/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId, amount, reason })
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        router.refresh();
      } else {
        toast.error(data.error || 'Failed to adjust credits.');
      }
    } catch (err) {
      toast.error('Network error during adjustment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button 
        onClick={() => handleAdjust(10)}
        disabled={loading}
        title="Add 10 Credits"
        className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
      >
        {loading ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
      </button>

      <button 
        onClick={() => handleAdjust(-10)}
        disabled={loading || currentBalance < 10}
        title="Deduct 10 Credits"
        className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
      >
        {loading ? <Loader2 size={12} className="animate-spin" /> : <Minus size={12} />}
      </button>

      {/* Manual Input Trigger */}
      <button 
        onClick={() => {
          const val = window.prompt('Enter exact amount to add (positive) or remove (negative):');
          if (val && !isNaN(val)) handleAdjust(parseInt(val));
        }}
        disabled={loading}
        title="Exact Amount"
        className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all text-[10px] font-bold"
      >
        EXT
      </button>
    </div>
  );
}
