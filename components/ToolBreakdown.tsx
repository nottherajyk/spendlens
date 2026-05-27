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
          <Badge className="bg-[#1a7a4a]/10 hover:bg-[#1a7a4a]/20 text-[#1a7a4a] border-emerald-700/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Optimal
          </Badge>
        );
      case "downgrade":
        return (
          <Badge className="bg-zinc-100 hover:bg-zinc-200 text-zinc-600 border-zinc-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Downgrade
          </Badge>
        );
      case "switch":
        return (
          <Badge className="bg-zinc-100 hover:bg-zinc-200 text-zinc-600 border-zinc-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Switch
          </Badge>
        );
      case "check_credits":
        return (
          <Badge className="bg-zinc-100 hover:bg-zinc-200 text-zinc-600 border-zinc-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Credits Opportunity
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-left">
        <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Tool Breakdowns</h2>
        <span className="text-xs text-zinc-500 font-medium">
          {tools.length} Subscriptions Audited
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        {tools.map((t, idx) => (
          <Card 
            key={`${t.tool}-${idx}`}
            className="group relative overflow-hidden bg-white border border-zinc-200 border-l-4 border-l-[#1a7a4a] transition-all duration-300 rounded-xl shadow-sm hover:shadow-md"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-lg font-bold text-zinc-900 group-hover:text-[#1a7a4a] transition-colors duration-200">
                {t.tool}
              </CardTitle>
              {getRecommendationBadge(t.recommendation)}
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 bg-[#f9fafb] rounded-xl p-3 border border-zinc-200">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Current plan</p>
                  <p className="text-sm font-extrabold text-zinc-900 mt-0.5 truncate">{t.currentPlan}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Current spend</p>
                  <p className="text-sm font-extrabold text-zinc-900 mt-0.5">
                    {t.currentMonthlySpend > 0 ? `$${t.currentMonthlySpend}/mo` : "Free"}
                  </p>
                </div>
              </div>

              {t.estimatedMonthlySavings > 0 && (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-emerald-800">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider">Potential Savings</span>
                  </div>
                  <span className="text-sm font-extrabold text-emerald-700">+${t.estimatedMonthlySavings}/mo</span>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Recommendation</p>
                <p className="text-xs text-zinc-800 bg-[#f9fafb] rounded-xl p-3 border border-zinc-200 font-medium leading-relaxed italic">
                  &ldquo;{t.recommendedAction}&rdquo;
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-zinc-200">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Analysis reasoning</p>
                <p className="text-xs text-zinc-600 leading-relaxed font-medium">
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
