/**
 * Footer.jsx
 *
 * Responsibilities:
 *   - Render brand, navigation links, legal links, and copyright
 *
 * Design intent:
 *   - Minimal, professional — does not compete with the CTA above it
 *   - All links sourced from landingData FOOTER constant
 */

import React from "react";
import Link from "next/link";
import { FOOTER } from "@/landing/landingData";

export default function Footer() {
  return (
    <footer className="border-t border-voxy-border px-6 py-12">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">

        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-4 h-4 rounded-full bg-voxy-primary flex-shrink-0" />
          <span className="font-bold text-[16px] tracking-tight text-voxy-text">
            {FOOTER.brand}
          </span>
          <span className="text-voxy-subtle text-[13px] hidden sm:inline">
            — {FOOTER.tagline}
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-8">
          {FOOTER.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] text-voxy-subtle hover:text-voxy-muted transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-[12px] text-voxy-subtle">
          {FOOTER.copyright}
        </p>

      </div>
    </footer>
  );
}
