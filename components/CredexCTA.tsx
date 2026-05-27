"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CredexCTAProps {
  totalMonthlySavings: number;
}

export function CredexCTA({ totalMonthlySavings }: CredexCTAProps) {
  if (totalMonthlySavings <= 500) return null;

  return (
    <div className="relative overflow-hidden rounded-xl bg-white border border-zinc-200 border-l-4 border-l-[#1a7a4a] p-8 md:p-12 mb-8 shadow-sm">
      {/* Background Subtle Gradient blobs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl transform translate-x-12 -translate-y-12" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-600/5 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl text-center md:text-left">
          <Badge className="bg-[#1a7a4a]/10 hover:bg-[#1a7a4a]/20 text-[#1a7a4a] border-emerald-700/20 text-xs px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
            Premium Optimization
          </Badge>
          
          <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 tracking-tight">
            High Savings Potential Detected
          </h2>
          
          <p className="text-zinc-600 text-sm md:text-base leading-relaxed">
            These savings are real. Credex can get you even further with discounted credits — no catch. Startups saving over $500/month are eligible for our partner program with direct access to pre-negotiated volume discounts.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0 justify-center">
          <Button 
            className="w-full sm:w-auto h-12 bg-[#1a7a4a] text-white hover:bg-[#15633c] font-bold px-8 rounded-lg shadow-sm transition-transform active:scale-[0.98] duration-200"
            onClick={() => window.open("https://credex.rocks", "_blank")}
          >
            Book a Free Credits Consultation
          </Button>
        </div>
      </div>
    </div>
  );
}
