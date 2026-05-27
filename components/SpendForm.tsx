"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UseCase, ToolName, ToolEntry } from "@/types/audit";
import { TOOLS, TOOL_DISPLAY_NAMES } from "@/lib/pricingData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const STORAGE_KEY = "spendlens_form_state";

export function SpendForm() {
  const router = useRouter();
  
  // Form State
  // TODO: clean up this local storage parsing, got a bit messy on Day 4 while trying to sync inputs
  const [step, setStep] = useState(1);
  const [teamSize, setTeamSize] = useState<number>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.teamSize) return parsed.teamSize;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return 5;
  });
  const [useCase, setUseCase] = useState<UseCase>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.useCase) return parsed.useCase;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return "coding";
  });
  const [selectedTools, setSelectedTools] = useState<ToolEntry[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.selectedTools) return parsed.selectedTools;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // Local state for adding a tool
  const [currentTool, setCurrentTool] = useState<ToolName>("cursor");
  const [currentPlan, setCurrentPlan] = useState(() => {
    const plans = TOOLS.cursor?.plans || [];
    return plans.length > 0 ? plans[0] : "";
  });
  const [currentSpend, setCurrentSpend] = useState<number | "">(0);
  const [currentSeats, setCurrentSeats] = useState<number | "">(1);
  const [toolError, setToolError] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    try {
      const state = { teamSize, useCase, selectedTools };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save form state to localStorage", e);
    }
  }, [teamSize, useCase, selectedTools]);

  const handleAddTool = () => {
    setToolError("");

    const spendVal = currentSpend === "" ? 0 : currentSpend;
    const seatsVal = currentSeats === "" ? 1 : currentSeats;

    if (spendVal < 0) {
      setToolError("Spend must be >= 0");
      return;
    }

    if (seatsVal < 1) {
      setToolError("Seats must be >= 1");
      return;
    }

    // Check if tool already added
    const exists = selectedTools.some((t) => t.tool === currentTool);
    if (exists) {
      setToolError(`${TOOL_DISPLAY_NAMES[currentTool]} is already added. Remove it first to re-add.`);
      return;
    }

    const newEntry: ToolEntry = {
      tool: currentTool,
      plan: currentPlan,
      monthlySpend: spendVal,
      seats: seatsVal,
    };

    setSelectedTools([...selectedTools, newEntry]);
    
    // Reset inputs
    const keys = Object.keys(TOOLS) as ToolName[];
    const nextTool = keys.find((k) => !selectedTools.some((t) => t.tool === k) && k !== currentTool);
    if (nextTool) {
      setCurrentTool(nextTool);
    }
    setCurrentSpend(0);
    setCurrentSeats(1);
  };

  const handleRemoveTool = (toolToRemove: ToolName) => {
    setSelectedTools(selectedTools.filter((t) => t.tool !== toolToRemove));
  };

  const handleSubmit = async () => {
    if (selectedTools.length === 0) {
      setFormError("Please add at least one tool subscription to run the audit.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teamSize,
          useCase,
          tools: selectedTools,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to process audit");
      }

      // Clear localStorage state on successful submission
      localStorage.removeItem(STORAGE_KEY);

      router.push(`/audit/${data.id}`);
    } catch (err: unknown) {
      setIsSubmitting(false);
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
      setFormError(errorMessage);
    }
  };

  const getUseCaseLabel = (uc: UseCase) => {
    switch (uc) {
      case "coding": return "Software Engineering / Coding";
      case "writing": return "Marketing / Content / Writing";
      case "data": return "Data Analytics / Data Science";
      case "research": return "Research / Synthesis";
      case "mixed": return "General / Mixed Workflows";
    }
  };

  return (
    <Card className="w-full max-w-2xl bg-white border border-zinc-200 text-zinc-900 rounded-2xl shadow-md overflow-hidden">
      {/* Header gradient bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#1a7a4a] to-[#2ea865]" />
      
      <CardHeader className="space-y-1 p-6 md:p-8">
        <div className="flex justify-between items-center mb-2">
          <Badge className="bg-[#1a7a4a]/10 hover:bg-[#1a7a4a]/20 text-[#1a7a4a] border-emerald-700/20 px-3 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px]">
            Step {step} of 3
          </Badge>
          <div className="flex gap-1">
            <span className={`h-1.5 w-6 rounded-full transition-all duration-300 ${step >= 1 ? "bg-[#1a7a4a]" : "bg-zinc-200"}`} />
            <span className={`h-1.5 w-6 rounded-full transition-all duration-300 ${step >= 2 ? "bg-[#1a7a4a]" : "bg-zinc-200"}`} />
            <span className={`h-1.5 w-6 rounded-full transition-all duration-300 ${step >= 3 ? "bg-[#1a7a4a]" : "bg-zinc-200"}`} />
          </div>
        </div>
        
        <CardTitle className="text-xl md:text-2xl font-bold text-zinc-900">
          {step === 1 && "Tell us about your team"}
          {step === 2 && "Add your AI subscriptions"}
          {step === 3 && "Review and run audit"}
        </CardTitle>
        <CardDescription className="text-zinc-500 text-sm">
          {step === 1 && "We'll use this context to identify redundancies and find better plan fits."}
          {step === 2 && "Input your current seat counts and spend to benchmark against published rates."}
          {step === 3 && "Double-check your entries. We'll run a full analysis instantly."}
        </CardDescription>
      </CardHeader>
 
      <CardContent className="px-6 md:px-8 pb-6 space-y-6">
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <Label htmlFor="teamSize" className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Team Size <span className="text-[#1a7a4a]">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="teamSize"
                  type="number"
                  min={1}
                  max={500}
                  required
                  placeholder="e.g. 10"
                  value={teamSize}
                  onChange={(e) => setTeamSize(parseInt(e.target.value) || 1)}
                  className="bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400 h-11 pl-4 rounded-lg text-sm focus-visible:ring-[#1a7a4a] focus-visible:ring-offset-1 focus-visible:border-[#1a7a4a]"
                />
              </div>
            </div>
 
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Primary Use Case <span className="text-[#1a7a4a]">*</span>
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(["coding", "writing", "data", "research", "mixed"] as UseCase[]).map((uc) => (
                  <button
                    key={uc}
                    type="button"
                    onClick={() => setUseCase(uc)}
                    className={`flex flex-col items-start p-4 rounded-lg border text-left transition-all duration-200 ${
                      useCase === uc
                        ? "bg-[#1a7a4a]/10 border-[#1a7a4a] text-[#1a7a4a] shadow-sm"
                        : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                    }`}
                  >
                    <span className="text-sm font-bold capitalize">{uc}</span>
                    <span className="text-[10px] text-zinc-500 mt-1 leading-normal">
                      {getUseCaseLabel(uc)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
 
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            {/* Form inputs to add a tool */}
            <div className="bg-[#f9fafb] rounded-xl border border-zinc-200 p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="tool" className="text-xs font-semibold uppercase tracking-wider text-zinc-500">AI Tool</Label>
                  <Select
                    id="tool"
                    value={currentTool}
                    onChange={(e) => {
                      const newTool = e.target.value as ToolName;
                      setCurrentTool(newTool);
                      const plans = TOOLS[newTool]?.plans || [];
                      if (plans.length > 0) {
                        setCurrentPlan(plans[0]);
                      }
                    }}
                  >
                    {Object.keys(TOOLS).map((key) => (
                      <option key={key} value={key} className="bg-white text-zinc-900">
                        {TOOL_DISPLAY_NAMES[key]}
                      </option>
                    ))}
                  </Select>
                </div>
 
                <div className="space-y-1.5">
                  <Label htmlFor="plan" className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Plan Tier</Label>
                  <Select
                    id="plan"
                    value={currentPlan}
                    onChange={(e) => setCurrentPlan(e.target.value)}
                  >
                    {(TOOLS[currentTool]?.plans || []).map((p) => (
                      <option key={p} value={p} className="bg-white text-zinc-900">
                        {p}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
 
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="seats" className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Seats / Users</Label>
                  <Input
                    id="seats"
                    type="number"
                    min={1}
                    value={currentSeats}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCurrentSeats(val === "" ? "" : parseInt(val) || 1);
                    }}
                    className="bg-white border-zinc-300 text-zinc-900 h-10 rounded-lg text-sm focus-visible:ring-[#1a7a4a] focus-visible:ring-offset-1 focus-visible:border-[#1a7a4a]"
                  />
                </div>
 
                <div className="space-y-1.5">
                  <Label htmlFor="spend" className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Monthly Spend ($)</Label>
                  <Input
                    id="spend"
                    type="number"
                    min={0}
                    value={currentSpend}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCurrentSpend(val === "" ? "" : parseFloat(val) || 0);
                    }}
                    className="bg-white border-zinc-300 text-zinc-900 h-10 rounded-lg text-sm focus-visible:ring-[#1a7a4a] focus-visible:ring-offset-1 focus-visible:border-[#1a7a4a]"
                  />
                </div>
              </div>
 
              {toolError && (
                <p className="text-xs text-rose-600 font-semibold bg-rose-500/10 border border-rose-500/20 rounded-lg p-2.5">
                  {toolError}
                </p>
              )}
 
              <Button
                type="button"
                onClick={handleAddTool}
                className="w-full bg-[#1a7a4a] hover:bg-[#15633c] text-white font-bold h-10 rounded-lg transition-all shadow-sm"
              >
                + Add Tool Subscription
              </Button>
            </div>
 
            {/* Added Tools List */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Added Subscriptions</h3>
              {selectedTools.length === 0 ? (
                <div className="text-center py-8 rounded-xl border border-dashed border-zinc-200 bg-[#f9fafb] text-zinc-500 text-xs">
                  No tools added yet. Add at least one subscription above to proceed.
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedTools.map((t) => (
                    <div
                      key={t.tool}
                      className="flex items-center justify-between bg-[#f9fafb] border border-zinc-200 rounded-lg p-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-zinc-900">{TOOL_DISPLAY_NAMES[t.tool]}</p>
                        <p className="text-[10px] text-zinc-500 font-medium">
                          {t.plan} • {t.seats} seat{t.seats > 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-zinc-900">${t.monthlySpend}/mo</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTool(t.tool)}
                          aria-label={`Remove ${t.tool} subscription`}
                          className="text-zinc-400 hover:text-rose-600 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
 
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-2 gap-4 bg-[#f9fafb] rounded-lg border border-zinc-200 p-4">
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Team Context</p>
                <p className="text-sm font-bold text-zinc-900 mt-0.5">{teamSize} Seat{teamSize > 1 ? "s" : ""}</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Use Case</p>
                <p className="text-sm font-bold text-zinc-900 mt-0.5 capitalize">{useCase}</p>
              </div>
            </div>
 
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Subscription Summary</h3>
              <div className="space-y-2">
                {selectedTools.map((t) => (
                  <div
                    key={t.tool}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-zinc-600 font-medium">
                      {TOOL_DISPLAY_NAMES[t.tool]} ({t.plan} x {t.seats})
                    </span>
                    <span className="font-semibold text-zinc-900">${t.monthlySpend}/mo</span>
                  </div>
                ))}
                
                <Separator className="bg-zinc-200 my-3" />
                
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-[#1a7a4a]">Total Monthly Cost</span>
                  <span className="text-zinc-900 font-extrabold">
                    ${selectedTools.reduce((sum, t) => sum + t.monthlySpend, 0)}/mo
                  </span>
                </div>
              </div>
            </div>
 
            {formError && (
              <p className="text-xs text-rose-600 font-semibold bg-rose-500/10 border border-rose-500/20 rounded-lg p-2.5">
                {formError}
              </p>
            )}
          </div>
        )}
      </CardContent>
 
      <CardFooter className="flex justify-between border-t border-zinc-200 px-6 md:px-8 py-4 bg-[#f9fafb] gap-4">
        {step > 1 ? (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep(step - 1)}
            disabled={isSubmitting}
            className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
          >
            ← Back
          </Button>
        ) : (
          <div />
        )}
 
        {step < 3 ? (
          <Button
            type="button"
            onClick={() => setStep(step + 1)}
            disabled={step === 2 && selectedTools.length === 0}
            className="bg-[#1a7a4a] hover:bg-[#15633c] text-white font-bold px-6 rounded-lg shadow-sm transition-transform active:scale-[0.98]"
          >
            Next Step →
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-[#1a7a4a] hover:bg-[#15633c] text-white font-bold px-8 rounded-lg shadow-sm transition-transform active:scale-[0.98]"
          >
            {isSubmitting ? "Running Audit..." : "Run My Audit →"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
