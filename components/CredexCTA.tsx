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
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/60 via-purple-950/40 to-zinc-950/90 border border-indigo-500/30 p-8 md:p-12 mb-8 backdrop-blur-xl shadow-2xl">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl transform translate-x-12 -translate-y-12" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl text-center md:text-left">
          <Badge className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border-indigo-500/40 text-xs px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
            Premium Optimization
          </Badge>
          
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            High Savings Potential Detected
          </h2>
          
          <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
            These savings are real. Credex can get you even further with discounted credits — no catch. Startups saving over $500/month are eligible for our partner program with direct access to pre-negotiated volume discounts.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0 justify-center">
          <Button 
            className="w-full sm:w-auto h-12 bg-white text-zinc-950 hover:bg-zinc-150 font-bold px-8 rounded-xl shadow-lg transition-transform active:scale-[0.98] duration-200"
            onClick={() => window.open("https://credex.rocks", "_blank")}
          >
            Book a Free Credits Consultation
          </Button>
        </div>
      </div>
    </div>
  );
}
