"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Mail, 
  ArrowRight, 
  Loader2,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { FORGOT_PASSWORD_CONTENT } from '@/landing/forgotPasswordData';
import { AuthAlternativeAction } from '@/components/layout/AuthLayout';

export default function ForgotPasswordPage() {
  const { forgotPassword, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // samkiel and tobi boss the api for this file will be here
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      // Error handled by useAuth
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-voxy-text font-sans selection:bg-voxy-primary/30 selection:text-white p-4 sm:p-8 relative overflow-hidden">
      
      {/* Dynamic background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-voxy-primary/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Logo - Centered */}
      <div className="mb-12 relative z-10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <img src="/favicon.jpg" alt="Voxy Logo" className="w-6 h-6 rounded-full flex-shrink-0 transition-transform group-hover:scale-110 object-cover" />
          <span className="font-sans font-bold text-[22px] tracking-tight text-voxy-text">VOXY</span>
        </Link>
      </div>

      <div className="w-full max-w-[520px] bg-voxy-surface border border-voxy-border rounded-2xl p-6 sm:p-10 lg:p-12 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] relative z-10">
        
        {!isSubmitted ? (
          <>
            <div className="mb-10 text-center">
              <Link href="/login" className="inline-flex items-center gap-2 text-xs text-voxy-muted hover:text-voxy-primary transition-colors mb-6 uppercase tracking-wider font-bold">
                <ArrowLeft size={14} /> Back to Sign In
              </Link>
              <h2 className="text-[28px] sm:text-[32px] font-sans font-bold tracking-tight mb-3">
                {FORGOT_PASSWORD_CONTENT.form.title}
              </h2>
              <p className="text-[15px] text-voxy-muted leading-relaxed max-w-[380px] mx-auto">
                {FORGOT_PASSWORD_CONTENT.form.subheading}
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs text-voxy-muted uppercase tracking-wider font-semibold">
                  Email Address
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-voxy-muted group-focus-within:text-voxy-primary transition-colors" size={16} />
                  <Input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com" 
                    className="pl-12 bg-background border-border h-12 transition-all text-[15px]" 
                    required 
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full h-12 text-[16px] font-bold mt-2 bg-voxy-primary text-black hover:bg-voxy-primary/90 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-[0_0_25px_rgba(16,185,129,0.15)]">
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    {FORGOT_PASSWORD_CONTENT.form.button} <ArrowRight size={18} />
                  </div>
                )}
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-voxy-primary/10 border border-voxy-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
              <Mail className="text-voxy-primary" size={40} />
            </div>
            <h2 className="text-[28px] font-sans font-bold tracking-tight mb-3">
              {FORGOT_PASSWORD_CONTENT.form.successTitle}
            </h2>
            <p className="text-[16px] text-voxy-muted leading-relaxed max-w-[340px] mx-auto mb-10">
              {FORGOT_PASSWORD_CONTENT.form.successSubheading} <span className="text-voxy-text font-bold text-voxy-primary">{email}</span>. Click the link in the email to safely reset your password.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setIsSubmitted(false)}
              className="w-full border-voxy-border text-voxy-muted hover:text-voxy-text hover:bg-muted h-12 font-medium"
            >
              Didn't receive an email? Try again
            </Button>
          </div>
        )}

        <div className="mt-10 pt-8 border-t border-voxy-border">
          <AuthAlternativeAction 
            message="Remember your password?"
            actionLabel="Sign in"
            actionHref="/login"
          />
        </div>
      </div>

      {/* Footer support text */}
      <p className="mt-12 text-[13px] text-voxy-muted relative z-10">
        Need more help? Contact our <Link href="/support" className="text-voxy-primary hover:underline font-semibold transition-colors">support team</Link>
      </p>

    </div>
  );
}
