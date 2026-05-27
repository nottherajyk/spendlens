"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  totalMonthlySavings: number;
  toolListSummary: string;
}

export function ShareButton({ totalMonthlySavings, toolListSummary }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-6 mb-8 shadow-sm text-left">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
            Share this report
          </h3>
          <p className="text-xs text-zinc-500 font-medium">
            Share these findings with your team, founder, or engineering managers.
          </p>
        </div>

        <Button
          onClick={handleShare}
          className={`h-11 px-6 rounded-lg font-bold transition-all duration-200 ${
            copied
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : "bg-[#1a7a4a] hover:bg-[#15633c] text-white"
          }`}
        >
          {copied ? "Link Copied! ✓" : "Copy Report URL"}
        </Button>
      </div>

      {/* OG Preview Mockup */}
      <div className="mt-6 pt-6 border-t border-zinc-200 space-y-3">
        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
          Social Share Preview Mockup (Slack/Twitter)
        </span>
        
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden p-4 flex flex-col gap-2 max-w-md mx-auto shadow-sm">
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-semibold">
            <Image src="/logo.png" alt="SpendLens Logo" width={16} height={16} className="object-contain" />
            spendlens.vercel.app
          </div>
          
          <h4 className="text-sm font-bold text-[#1a7a4a]">
            My AI Stack Could Save ${totalMonthlySavings}/mo — SpendLens Audit
          </h4>
          
          <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
            {toolListSummary} → ${totalMonthlySavings} savings identified. See your personalized, free spend audit now.
          </p>
          
          <div className="h-24 bg-gradient-to-br from-[#0f1117] via-zinc-900 to-[#1a7a4a]/20 rounded-lg flex items-center justify-center border border-zinc-800 text-center px-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl" />
            <div className="relative z-10 space-y-1">
              <p className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase">SPENDLENS REPORT</p>
              <p className="text-xl font-extrabold text-white">${totalMonthlySavings}/mo Saved</p>
              <p className="text-[9px] text-zinc-400">See Recommended Switches & Downgrades</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
