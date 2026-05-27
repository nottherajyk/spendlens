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
    <div className="relative overflow-hidden rounded-xl bg-white border border-zinc-200 border-l-4 border-l-[#1a7a4a] p-8 md:p-12 mb-8 shadow-sm">
      {/* Background Subtle Gradient blobs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left space-y-4">
          <Badge className="bg-[#1a7a4a]/10 hover:bg-[#1a7a4a]/20 text-[#1a7a4a] border-emerald-700/20 text-xs px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
            Audit Complete for {teamSize} seat{teamSize > 1 ? "s" : ""}
          </Badge>
          
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 leading-tight">
            Stop guessing what your <br className="hidden md:inline" />
            <span className="text-[#1a7a4a]">AI stack is costing you.</span>
          </h1>
          
          <p className="text-zinc-600 text-sm md:text-base max-w-lg">
            We audited your subscriptions and found significant opportunities to optimize your spend. Here is your instant cost-reduction roadmap.
          </p>
        </div>

        <div className="w-full md:w-auto min-w-[280px]">
          <div className="relative overflow-hidden rounded-xl bg-[#f9fafb] border border-zinc-200 p-6 text-zinc-900 shadow-sm">
            <div className="space-y-4">
              <div>
                <p className="text-zinc-500 text-[10px] uppercase tracking-wider font-bold">Estimated Monthly Savings</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-4xl md:text-5xl font-extrabold text-[#1a7a4a]">${totalMonthlySavings}</span>
                  <span className="text-zinc-500 text-sm font-semibold">/ mo</span>
                </div>
              </div>

              <div className="h-px bg-zinc-200" />

              <div className="flex justify-between items-center text-sm">
                <div>
                  <p className="text-zinc-500 text-[9px] uppercase tracking-wider font-bold">Annual Savings</p>
                  <p className="text-lg font-extrabold text-zinc-900 mt-0.5">${totalAnnualSavings} / yr</p>
                </div>
                {percentageSaved > 0 && (
                  <div className="bg-[#1a7a4a]/10 text-[#1a7a4a] border border-emerald-700/20 rounded-md px-2.5 py-1 text-xs font-bold">
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
