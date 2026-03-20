"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, CheckCircle2, AlertCircle, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function ResetPasswordContent() {
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
"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, CheckCircle2, AlertCircle, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      router.push('/login');
    }
  }, [token, router]);

  const handleReset = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
        toast.error("Password must be at least 8 characters long.");
        return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
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
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-[420px] bg-voxy-surface border border-voxy-border rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-voxy-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-voxy-primary w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Password Updated</h2>
          <p className="text-voxy-muted mb-8 leading-relaxed">
            Your password has been successfully reset. <br/> You can now log in with your new password.
          </p>
          <Button onClick={() => router.push('/login')} className="w-full bg-voxy-primary text-black font-bold h-12 rounded-xl">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-voxy-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[420px] relative z-10">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center justify-center gap-3 mb-10 group">
             <div className="size-10">
               <img src="/favicon.jpg" alt="Voxy" className="w-10 h-10 object-contain rounded-xl" />
             </div>
             <span className="text-2xl font-black text-voxy-text tracking-tighter uppercase italic">VOXY</span>
          </Link>
          <h1 className="text-3xl font-black text-voxy-text tracking-tight mb-3">Reset Password</h1>
          <p className="text-voxy-muted text-sm leading-relaxed">
            Set a new, secure password for your Voxy account.
          </p>
        </div>

        <div className="bg-voxy-surface border border-voxy-border rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-8 duration-700">
          <form onSubmit={handleReset} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-xs text-voxy-muted uppercase tracking-widest font-black">New Password</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-voxy-muted transition-colors group-focus-within:text-voxy-primary" size={18} />
                <Input
                  type={showPasswords ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create new password"
                  className="bg-background border-border h-14 pl-12 transition-all rounded-2xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-voxy-muted uppercase tracking-widest font-black">Confirm Password</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-voxy-muted transition-colors group-focus-within:text-voxy-primary" size={18} />
                <Input
                  type={showPasswords ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="bg-background border-border h-14 pl-12 transition-all rounded-2xl"
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
                 className="accent-voxy-primary w-4 h-4 rounded-md" 
               />
               <label htmlFor="show" className="text-xs text-voxy-muted cursor-pointer select-none">Show passwords</label>
            </div>

            <Button
              type="submit"
              disabled={loading || !password || !confirmPassword}
              className="w-full bg-voxy-primary text-black h-14 rounded-2xl font-black tracking-widest uppercase text-xs hover:scale-[1.01] transition-all shadow-lg active:scale-[0.99] group mt-4"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (
                <div className="flex items-center justify-center gap-2">
                  Update Password
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t border-voxy-border text-center">
             <Link href="/login" className="text-voxy-muted hover:text-voxy-primary text-[10px] font-black uppercase tracking-widest transition-colors">
               Cancel and go back
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-voxy-primary" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
