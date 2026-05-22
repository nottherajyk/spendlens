"use client";

import React from "react";
import { ToolAudit } from "@/types/audit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ToolBreakdownProps {
  tools: ToolAudit[];
}

export function ToolBreakdown({ tools }: ToolBreakdownProps) {
  const getRecommendationBadge = (rec: ToolAudit["recommendation"]) => {
    switch (rec) {
      case "stay":
        return (
          <Badge className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20 px-2 py-0.5 rounded-md text-xs font-semibold uppercase">
            Optimal
          </Badge>
        );
      case "downgrade":
        return (
          <Badge className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/20 px-2 py-0.5 rounded-md text-xs font-semibold uppercase">
            Downgrade
          </Badge>
        );
      case "switch":
        return (
          <Badge className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border-indigo-500/20 px-2 py-0.5 rounded-md text-xs font-semibold uppercase">
            Switch
          </Badge>
        );
      case "check_credits":
        return (
          <Badge className="bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border-pink-500/20 px-2 py-0.5 rounded-md text-xs font-semibold uppercase">
            Credits Opportunity
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white tracking-tight">Tool Breakdowns</h2>
        <span className="text-xs text-zinc-400 font-medium">
          {tools.length} Subscriptions Audited
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((t, idx) => (
          <Card 
            key={`${t.tool}-${idx}`}
            className="group relative overflow-hidden bg-zinc-950/40 border border-white/10 hover:border-white/20 transition-all duration-300 rounded-2xl shadow-lg hover:shadow-2xl"
          >
            {/* Hover card border highlight */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500/50 via-purple-500/50 to-pink-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors duration-200">
                {t.tool}
              </CardTitle>
              {getRecommendationBadge(t.recommendation)}
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 bg-white/5 rounded-xl p-3 border border-white/5">
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Current plan</p>
                  <p className="text-sm font-bold text-white mt-0.5 truncate">{t.currentPlan}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Current spend</p>
                  <p className="text-sm font-bold text-white mt-0.5">
                    {t.currentMonthlySpend > 0 ? `$${t.currentMonthlySpend}/mo` : "Free"}
                  </p>
                </div>
              </div>

              {t.estimatedMonthlySavings > 0 && (
                <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-emerald-400">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-semibold">Potential Savings</span>
                  </div>
                  <span className="text-sm font-extrabold">+${t.estimatedMonthlySavings}/mo</span>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-xs font-semibold text-zinc-300">Recommendation:</p>
                <p className="text-xs text-white bg-white/5 rounded-lg p-2.5 border border-white/5 font-medium leading-relaxed italic">
                  &ldquo;{t.recommendedAction}&rdquo;
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-white/10">
                <p className="text-xs font-semibold text-zinc-300">Analysis reasoning:</p>
                <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                  {t.reasoning}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
