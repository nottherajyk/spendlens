"use client";

import React, { useState } from "react";
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
    <div className="bg-zinc-950/60 border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Share this report
          </h3>
          <p className="text-xs text-zinc-400">
            Share these findings with your team, founder, or engineering managers.
          </p>
        </div>

        <Button
          onClick={handleShare}
          className={`h-11 px-6 rounded-xl font-bold transition-all duration-200 ${
            copied
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          {copied ? "Link Copied! ✓" : "Copy Report URL"}
        </Button>
      </div>

      {/* OG Preview Mockup */}
      <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
          Social Share Preview Mockup (Slack/Twitter)
        </span>
        
        <div className="bg-zinc-900 border border-white/5 rounded-xl overflow-hidden p-4 flex flex-col gap-2 max-w-md mx-auto shadow-inner">
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium">
            <span className="h-4 w-4 bg-indigo-500 rounded-md flex items-center justify-center text-white font-extrabold text-[8px]">
              SL
            </span>
            spendlens.vercel.app
          </div>
          
          <h4 className="text-sm font-bold text-indigo-400">
            My AI Stack Could Save ${totalMonthlySavings}/mo — SpendLens Audit
          </h4>
          
          <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
            {toolListSummary} → ${totalMonthlySavings} savings identified. See your personalized, free spend audit now.
          </p>
          
          <div className="h-24 bg-gradient-to-br from-indigo-950 via-zinc-950 to-purple-950 rounded-lg flex items-center justify-center border border-white/5 text-center px-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl" />
            <div className="relative z-10 space-y-1">
              <p className="text-[10px] text-indigo-300 font-bold tracking-widest uppercase">SPENDLENS REPORT</p>
              <p className="text-xl font-extrabold text-white">${totalMonthlySavings}/mo Saved</p>
              <p className="text-[9px] text-zinc-400">See Recommended Switches & Downgrades</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
