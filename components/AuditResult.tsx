"use client";

import React, { useEffect, useState } from "react";
import { AuditResult as AuditResultType } from "@/types/audit";
import { SavingsHero } from "@/components/SavingsHero";
import { ToolBreakdown } from "@/components/ToolBreakdown";
import { CredexCTA } from "@/components/CredexCTA";
import { ShareButton } from "@/components/ShareButton";
import { LeadCapture } from "@/components/LeadCapture";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <Card className="bg-white border border-zinc-200 rounded-xl shadow-sm relative overflow-hidden">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            AI Advisory Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingSummary ? (
            <div className="space-y-2 py-2">
              <div className="h-4 bg-zinc-100 rounded animate-pulse w-full" />
              <div className="h-4 bg-zinc-100 rounded animate-pulse w-5/6" />
              <div className="h-4 bg-zinc-100 rounded animate-pulse w-4/5" />
            </div>
          ) : (
            <p className="text-zinc-700 text-sm md:text-base leading-relaxed font-normal">
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
        <Card className="bg-white border border-zinc-200 rounded-xl p-6 md:p-8 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <div className="space-y-1.5 flex-1">
              <h3 className="text-lg font-bold text-zinc-900">Your AI stack is well-optimized!</h3>
              <p className="text-zinc-600 text-sm leading-relaxed">
                Great job. You are paying within published benchmarks across all your tooling subscriptions. Sign up for our newsletter to get alerted when major vendor prices change.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 max-w-md pt-2 pl-0 sm:pl-14">
            <input 
              type="email" 
              placeholder="you@company.com" 
              className="flex-1 bg-white border border-zinc-300 text-zinc-900 rounded-lg px-4 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a7a4a]"
            />
            <Button className="bg-[#1a7a4a] text-white hover:bg-[#15633c] font-bold px-6 h-10 rounded-lg shadow-sm">
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
