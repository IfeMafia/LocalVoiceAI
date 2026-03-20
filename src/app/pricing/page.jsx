"use client";

import React from "react";
import Navbar from "@/landing/sections/Navbar";
import Footer from "@/landing/sections/Footer";
import { Check, Zap, Rocket, Crown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

/**
 * Pricing data defining our pay-as-you-go model
 */
const plans = [
  {
    name: "Starter",
    description: "Perfect for testing the waters and small businesses.",
    credits: "100",
    price: "₦1,000",
    perCredit: "₦10.00",
    features: [
      "100 AI Credits",
      "Native Accent Understanding",
      "AI Drafted Replies",
      "Basic Analytics",
      "Email Support"
    ],
    cta: "Get Started",
    icon: Zap,
    popular: false,
    delay: "0ms"
  },
  {
    name: "Growth",
    description: "Scale your customer service with better efficiency.",
    credits: "500",
    price: "₦4,500",
    perCredit: "₦9.00",
    discount: "10% OFF",
    features: [
      "500 AI Credits",
      "High Priority Queue",
      "Advanced Intent Detection",
      "Team Management (Up to 3)",
      "Priority WhatsApp Support"
    ],
    cta: "Start Scaling",
    icon: Rocket,
    popular: true,
    delay: "100ms"
  },
  {
    name: "Scale",
    description: "Maximum value for high-volume businesses.",
    credits: "1,000",
    price: "₦8,000",
    perCredit: "₦8.00",
    discount: "20% OFF",
    features: [
      "1,000 AI Credits",
      "Unlimited Team Seats",
      "Custom AI Instructions",
      "Full API Access",
      "Dedicated Success Manager"
    ],
    cta: "Best Value",
    icon: Crown,
    popular: false,
    delay: "200ms"
  }
];

export default function PricingPage() {
  const router = useRouter();

  return (
    <div className="bg-white dark:bg-black min-h-screen text-voxy-text transition-colors duration-500 overflow-x-hidden">
      <Navbar />

      <main className="pt-32 pb-20 px-6 relative">
        {/* Background Decorative Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-voxy-primary/10 rounded-full blur-[120px] -z-10 translate-x-1/4 -translate-y-1/4 animate-pulse" />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#00D18F]/5 rounded-full blur-[100px] -z-10 -translate-x-1/2" />

        <div className="max-w-[1200px] mx-auto space-y-20">
          
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-top-4 duration-1000">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-voxy-primary/10 border border-voxy-primary/20 text-voxy-primary text-[10px] font-bold uppercase tracking-widest">
               <Zap size={14} className="fill-current" />
               Transparent Pricing
             </div>
             <h1 className="text-5xl md:text-7xl font-black font-display tracking-tight leading-[1.05]">
               Pay for what you <span className="text-voxy-primary">actually use.</span>
             </h1>
             <p className="text-voxy-muted text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
               No monthly subscriptions or hidden fees. Just simple, pay-as-you-go credits that never expire. Choose a bundle that fits your business volume.
             </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-10">
            {plans.map((plan) => (
              <div 
                key={plan.name}
                className={`
                  relative flex flex-col p-8 rounded-[32px] border transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 group animate-in fade-in slide-in-from-bottom-8 fill-mode-both
                  ${plan.popular 
                    ? "bg-zinc-50 dark:bg-zinc-900 border-voxy-primary shadow-[0_20px_50px_rgba(0,209,143,0.15)] scale-105 z-10" 
                    : "bg-white dark:bg-black border-zinc-100 dark:border-white/5 hover:border-voxy-primary/50"
                  }
                `}
                style={{ animationDelay: plan.delay }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-voxy-primary text-black font-black text-[10px] uppercase tracking-widest px-5 py-2 rounded-full shadow-lg">
                    Most Popular
                  </div>
                )}

                {/* Plan Header */}
                <div className="flex items-center gap-5 mb-8">
                   <div className={`p-4 rounded-[22px] transition-transform group-hover:rotate-6 ${plan.popular ? 'bg-voxy-primary text-black' : 'bg-zinc-100 dark:bg-zinc-900 text-voxy-primary'}`}>
                      <plan.icon size={28} />
                   </div>
                   <div>
                     <h3 className="text-2xl font-black tracking-tight">{plan.name}</h3>
                     <p className="text-voxy-muted text-[11px] font-bold uppercase tracking-wider">{plan.discount || 'Standard Value'}</p>
                   </div>
                </div>

                {/* Pricing Info */}
                <div className="mb-10">
                   <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black tracking-tighter text-zinc-900 dark:text-white transition-colors">{plan.price}</span>
                   </div>
                   <p className="text-voxy-muted text-sm font-medium mt-2">
                     <span className="text-voxy-text font-black">{plan.credits} Credits</span> — Approximately {plan.perCredit} per response
                   </p>
                </div>

                {/* Features List */}
                <div className="flex-1 space-y-4 mb-12">
                   {plan.features.map((feature) => (
                     <div key={feature} className="flex items-start gap-3">
                        <div className={`mt-0.5 p-1 rounded-lg shrink-0 ${plan.popular ? 'bg-voxy-primary text-black' : 'bg-voxy-primary/10 text-voxy-primary'}`}>
                           <Check size={14} strokeWidth={4} />
                        </div>
                        <span className="text-[14px] font-medium text-voxy-muted group-hover:text-voxy-text transition-colors">
                          {feature}
                        </span>
                     </div>
                   ))}
                </div>

                {/* CTA Button */}
                <Button 
                  onClick={() => router.push("/register")}
                  className={`
                    w-full h-16 rounded-2xl text-[13px] font-black uppercase tracking-widest transition-all active:scale-95
                    ${plan.popular 
                      ? "bg-voxy-primary text-black hover:bg-voxy-primary/90 shadow-xl shadow-emerald-500/30" 
                      : "bg-zinc-50 dark:bg-zinc-900 text-voxy-text hover:bg-zinc-100 dark:hover:bg-white/10"
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    {plan.cta}
                    <ArrowRight size={16} />
                  </div>
                </Button>
              </div>
            ))}
          </div>

          {/* FAQ / Trust Section */}
          <div className="pt-10 grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
             <div className="space-y-3 p-8 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-3xl border border-zinc-100 dark:border-white/5">
                <h4 className="font-black text-xl tracking-tight">Do credits expire?</h4>
                <p className="text-sm text-voxy-muted leading-relaxed">Never. Your credits stay in your account forever. Whether you use them today or next year, they're always ready when your customers reach out. We believe you should only pay for value delivered.</p>
             </div>
             <div className="space-y-3 p-8 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-3xl border border-zinc-100 dark:border-white/5">
                <h4 className="font-black text-xl tracking-tight">Can I switch plans?</h4>
                <p className="text-sm text-voxy-muted leading-relaxed">Since we follow a credit-based model, there are no "plans" to switch. You can purchase larger bundles whenever you need them to take advantage of the per-credit discounts as your volume grows.</p>
             </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
