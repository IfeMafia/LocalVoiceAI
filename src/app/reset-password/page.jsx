"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, CheckCircle2, AlertCircle, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      router.push('/login');
    }
  }, [token, router]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (formData.newPassword.length < 8) {
        toast.error("Password must be at least 8 characters long.");
        return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: formData.newPassword }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        toast.success(data.message || 'Password reset successfully!');
        setTimeout(() => router.push('/login'), 3000);
      } else {
        toast.error(data.error || 'Failed to reset password. Link might be expired.');
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <div className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-12 text-center max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-500">
           <div className="size-20 bg-[#00D18F]/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-[#00D18F]/20">
              <CheckCircle2 className="text-[#00D18F] w-10 h-10" />
           </div>
           <h1 className="text-3xl font-black text-white tracking-tight mb-4">Password Updated</h1>
           <p className="text-zinc-500 mb-8 leading-relaxed">
             Your password has been successfully reset. <br/> Redirecting you to login...
           </p>
           <Link href="/login" className="text-[#00D18F] font-black uppercase tracking-widest text-xs hover:opacity-80 transition-opacity">
              Login Now
           </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Abstract Background Design */}
      <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(0,209,143,0.1)_0%,transparent_50%)] pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="flex items-center justify-center gap-3 mb-10">
           <div className="size-10">
             <img src="/logo.jpg" alt="Voxy" className="w-10 h-10 object-contain rounded-xl" />
           </div>
           <span className="text-2xl font-black text-white tracking-tighter uppercase italic">VOXY</span>
        </div>

        <div className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="text-left mb-10">
            <h1 className="text-3xl font-black text-white tracking-tight mb-3">Reset Password</h1>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Set a new, secure password for your Voxy account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-xs text-zinc-500 uppercase tracking-widest font-black">New Password</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within:text-[#00D18F]" size={18} />
                <Input
                  id="newPassword"
                  type={showPasswords ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Create new password"
                  className="bg-white/5 border-transparent focus:border-[#00D18F]/50 h-14 pl-12 transition-all rounded-2xl text-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-zinc-500 uppercase tracking-widest font-black">Confirm Password</Label>
              <div className="relative group">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within:text-[#00D18F]" size={18} />
                <Input
                  id="confirmPassword"
                  type={showPasswords ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm new password"
                  className="bg-white/5 border-transparent focus:border-[#00D18F]/50 h-14 pl-12 transition-all rounded-2xl text-white"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
               <input 
                 type="checkbox" 
                 id="show" 
                 checked={showPasswords} 
                 onChange={() => setShowPasswords(!showPasswords)}
                 className="accent-[#00D18F] w-4 h-4 rounded-md" 
               />
               <label htmlFor="show" className="text-xs text-zinc-500 cursor-pointer select-none">Show passwords</label>
            </div>

            <Button
              type="submit"
              disabled={loading || !formData.newPassword || !formData.confirmPassword}
              className="w-full bg-[#00D18F] text-black h-16 rounded-2xl font-black tracking-widest uppercase text-xs hover:scale-[1.01] transition-all shadow-lg active:scale-[0.99] group mt-4"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (
                <div className="flex items-center justify-center gap-2">
                  Update Password
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
             <Link href="/login" className="text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">
               Cancel and go back
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
