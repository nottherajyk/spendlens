"use client";

import { Badge } from "@/components/ui/badge";

interface SavingsHeroProps {
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  totalCurrentSpend: number;
  teamSize: number;
}

export function SavingsHero({
  totalMonthlySavings,
  totalAnnualSavings,
  totalCurrentSpend,
  teamSize,
}: SavingsHeroProps) {
  const percentageSaved = totalCurrentSpend > 0 
    ? Math.round((totalMonthlySavings / totalCurrentSpend) * 100) 
    : 0;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-zinc-950/80 border border-white/10 p-8 md:p-12 mb-8 backdrop-blur-xl shadow-2xl">
      {/* Background Radial Glow */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left space-y-4">
          <Badge className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border-indigo-500/20 text-xs px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
            Audit Complete for {teamSize} seat{teamSize > 1 ? "s" : ""}
          </Badge>
          
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Stop guessing what your <br className="hidden md:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI stack is costing you.
            </span>
          </h1>
          
          <p className="text-zinc-400 text-sm md:text-base max-w-lg">
            We audited your subscriptions and found significant opportunities to optimize your spend. Here is your instant cost-reduction roadmap.
          </p>
        </div>

        <div className="w-full md:w-auto min-w-[280px]">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-6 text-white shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-12 -translate-y-12" />
            
            <div className="space-y-4">
              <div>
                <p className="text-indigo-200 text-xs uppercase tracking-wider font-medium">Estimated Monthly Savings</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-4xl md:text-5xl font-extrabold">${totalMonthlySavings}</span>
                  <span className="text-indigo-200 text-sm">/ mo</span>
                </div>
              </div>

              <div className="h-px bg-white/20" />

              <div className="flex justify-between items-center text-sm">
                <div>
                  <p className="text-indigo-200 text-[10px] uppercase tracking-wider">Annual Savings</p>
                  <p className="text-lg font-bold mt-0.5">${totalAnnualSavings} / yr</p>
                </div>
                {percentageSaved > 0 && (
                  <div className="bg-white/20 rounded-lg px-2.5 py-1 text-xs font-semibold backdrop-blur-sm">
                    Saved {percentageSaved}%
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
