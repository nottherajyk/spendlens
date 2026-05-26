"use client";

import React, { useEffect, useState } from "react";
import { AuditResult as AuditResultType } from "@/types/audit";
import { SavingsHero } from "@/components/SavingsHero";
import { ToolBreakdown } from "@/components/ToolBreakdown";
import { CredexCTA } from "@/components/CredexCTA";
import { ShareButton } from "@/components/ShareButton";
import { LeadCapture } from "@/components/LeadCapture";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AuditResultProps {
  audit: AuditResultType;
}

export function AuditResult({ audit }: AuditResultProps) {
  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [emailCaptured, setEmailCaptured] = useState(() => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem(`lead_captured_${audit.id}`);
    }
    return false;
  });

  // Trigger lead modal on load if email hasn't been captured yet
  useEffect(() => {
    // Check if lead was captured recently in this browser
    const captured = typeof window !== "undefined" ? localStorage.getItem(`lead_captured_${audit.id}`) : null;
    if (!captured && audit.totalMonthlySavings > 0) {
      // Small timeout to let page render
      const timer = setTimeout(() => {
        setLeadModalOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [audit.id, audit.totalMonthlySavings]);

  // Fetch AI Summary from API
  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await fetch("/api/summary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(audit),
        });

        if (!res.ok) {
          throw new Error("Failed to fetch summary");
        }

        const data = await res.json();
        setSummary(data.summary);
      } catch (err) {
        console.error("Failed to load AI summary, using fallback template", err);
      } finally {
        setLoadingSummary(false);
      }
    }

    fetchSummary();
  }, [audit]);

  const handleLeadSuccess = () => {
    setEmailCaptured(true);
    localStorage.setItem(`lead_captured_${audit.id}`, "true");
  };

  const toolListSummary = audit.tools
    .map((t) => t.tool)
    .join(", ");

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-12 space-y-8 animate-fadeIn">
      {/* Savings Hero Section */}
      <SavingsHero
        totalMonthlySavings={audit.totalMonthlySavings}
        totalAnnualSavings={audit.totalAnnualSavings}
        totalCurrentSpend={audit.totalCurrentSpend}
        teamSize={audit.teamSize}
      />

      {/* AI Summary Block */}
      <Card className="bg-zinc-950/60 border border-indigo-500/20 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl" />
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold text-white uppercase tracking-wider">
            AI Advisory Summary
          </CardTitle>
          <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-[10px] font-bold uppercase rounded-md px-2 py-0.5">
            Gemini 1.5 Flash
          </Badge>
        </CardHeader>
        <CardContent>
          {loadingSummary ? (
            <div className="space-y-2 py-2">
              <div className="h-4 bg-white/5 rounded animate-pulse w-full" />
              <div className="h-4 bg-white/5 rounded animate-pulse w-5/6" />
              <div className="h-4 bg-white/5 rounded animate-pulse w-4/5" />
            </div>
          ) : (
            <p className="text-zinc-200 text-sm md:text-base leading-relaxed font-medium">
              {summary}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Tool Breakdowns */}
      <ToolBreakdown tools={audit.tools} />

      {/* Conditional CTA for high savings */}
      <CredexCTA totalMonthlySavings={audit.totalMonthlySavings} />

      {/* Conditional "Well Spending" block for optimized setup */}
      {audit.totalMonthlySavings <= 100 && (
        <Card className="bg-zinc-950/40 border border-white/10 rounded-2xl p-6 md:p-8 text-center space-y-4">
          <div className="space-y-1.5 max-w-lg mx-auto">
            <h3 className="text-lg font-bold text-white">Your AI stack is well-optimized!</h3>
            <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
              Great job. You are paying within published benchmarks across all your tooling subscriptions. Sign up for our newsletter to get alerted when major vendor prices change.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="you@company.com" 
              className="flex-1 bg-white/5 border border-white/10 text-white rounded-xl px-4 h-10 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <Button className="bg-white text-zinc-950 hover:bg-zinc-200 font-bold px-6 h-10 rounded-xl">
              Stay Optimized
            </Button>
          </div>
        </Card>
      )}

      {/* Share Section */}
      <ShareButton
        totalMonthlySavings={audit.totalMonthlySavings}
        toolListSummary={toolListSummary}
      />

      {/* Lead capture email gate modal */}
      {!emailCaptured && (
        <LeadCapture
          auditId={audit.id || ""}
          defaultTeamSize={audit.teamSize}
          open={leadModalOpen}
          onOpenChange={setLeadModalOpen}
          onSuccess={handleLeadSuccess}
        />
      )}
    </div>
  );
}
