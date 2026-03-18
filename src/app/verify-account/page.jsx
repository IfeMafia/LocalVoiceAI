"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, ShieldCheck, ArrowRight, Loader2, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function VerifyAccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const [isExpired, setIsExpired] = useState(false);
  
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    if (!email) {
      toast.error("Email is missing. Please sign up or login again.");
      router.push('/signup');
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [email, router]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const data = e.clipboardData.getData('text').slice(0, 4);
    if (!/^\d+$/.test(data)) return;

    const newOtp = [...otp];
    data.split('').forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    
    // Focus last input or submit
    if (data.length === 4) {
      inputRefs[3].current.focus();
    }
  };

  const handleVerify = async (e) => {
    e?.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length < 4) {
      toast.error("Please enter the full 4-digit code.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: fullOtp }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'Account verified! Redirecting to login...');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        toast.error(data.error || 'Verification failed. Please check the code.');
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const res = await fetch('/api/auth/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('New code sent to your email!');
        setTimer(600);
        setIsExpired(false);
        setOtp(['', '', '', '']);
      } else {
        toast.error(data.error || 'Failed to resend code.');
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      {/* Background Glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00D18F]/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <div className="size-10 flex items-center justify-center">
             <img src="/logo.jpg" alt="Voxy" className="w-10 h-10 object-contain rounded-xl" />
           </div>
           <span className="text-2xl font-black text-white tracking-tighter uppercase italic">VOXY</span>
        </div>

        <div className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          <div className="text-center mb-10">
            <div className="size-16 bg-[#00D18F]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#00D18F]/20">
              <ShieldCheck className="w-8 h-8 text-[#00D18F]" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-3">Verify Your Email</h1>
            <p className="text-zinc-500 text-sm leading-relaxed">
              We've sent a 4-digit code to <br/>
              <span className="text-white font-bold">{email}</span>
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-8">
            <div className="flex justify-between gap-3 px-4">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={inputRefs[idx]}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  onPaste={handlePaste}
                  className="w-16 h-20 bg-[#111] border border-white/5 rounded-2xl text-center text-3xl font-black text-white focus:border-[#00D18F]/50 focus:ring-1 focus:ring-[#00D18F]/50 outline-none transition-all"
                />
              ))}
            </div>

            <div className="flex flex-col items-center gap-4 text-center">
              {isExpired ? (
                <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-widest bg-rose-500/10 px-4 py-2 rounded-full border border-rose-500/20">
                  <AlertCircle size={14} />
                  Code Expired
                </div>
              ) : (
                <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  Code expires in <span className="text-[#00D18F] font-black">{formatTime(timer)}</span>
                </div>
              )}
            </div>

            <button
              disabled={loading || otp.some(d => !d) || isExpired}
              className="w-full bg-[#00D18F] disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-black uppercase tracking-widest text-xs h-16 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(0,209,143,0.2)] group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Verify Account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5">
            <div className="flex flex-col gap-4 text-center">
              <p className="text-zinc-500 text-sm">
                Didn't receive the email?
              </p>
              <button
                onClick={handleResend}
                disabled={resending || (!isExpired && timer > 540)} // Wait 1 min before allowing resend if check isn't expired
                className="text-[#00D18F] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:opacity-80 transition-opacity disabled:opacity-40"
              >
                {resending ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw size={12} />}
                Resend New Code
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center animate-in fade-in duration-1000 delay-500">
           <Link href="/login" className="text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">
             Back to Login
           </Link>
        </div>
      </div>
    </div>
  );
}
