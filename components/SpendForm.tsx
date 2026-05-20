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
  const [currentSpend, setCurrentSpend] = useState<number>(0);
  const [currentSeats, setCurrentSeats] = useState<number>(1);
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

    if (currentSpend < 0) {
      setToolError("Spend must be >= 0");
      return;
    }

    if (currentSeats < 1) {
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
      monthlySpend: currentSpend,
      seats: currentSeats,
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
    <Card className="w-full max-w-2xl bg-zinc-950/80 border border-white/10 text-white rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl">
      {/* Header gradient bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
      
      <CardHeader className="space-y-1 p-6 md:p-8">
        <div className="flex justify-between items-center mb-2">
          <Badge className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border-indigo-500/20 px-3 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px]">
            Step {step} of 3
          </Badge>
          <div className="flex gap-1">
            <span className={`h-1.5 w-6 rounded-full transition-all duration-300 ${step >= 1 ? "bg-indigo-500" : "bg-zinc-800"}`} />
            <span className={`h-1.5 w-6 rounded-full transition-all duration-300 ${step >= 2 ? "bg-indigo-500" : "bg-zinc-800"}`} />
            <span className={`h-1.5 w-6 rounded-full transition-all duration-300 ${step >= 3 ? "bg-indigo-500" : "bg-zinc-800"}`} />
          </div>
        </div>
        
        <CardTitle className="text-xl md:text-2xl font-bold">
          {step === 1 && "Tell us about your team"}
          {step === 2 && "Add your AI subscriptions"}
          {step === 3 && "Review and run audit"}
        </CardTitle>
        <CardDescription className="text-zinc-400 text-sm">
          {step === 1 && "We'll use this context to identify redundancies and find better plan fits."}
          {step === 2 && "Input your current seat counts and spend to benchmark against published rates."}
          {step === 3 && "Double-check your entries. We'll run a full analysis instantly."}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 md:px-8 pb-6 space-y-6">
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <Label htmlFor="teamSize" className="text-sm text-zinc-300 font-semibold">
                Team Size <span className="text-indigo-400">*</span>
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
                  className="bg-white/5 border-white/10 text-white placeholder-zinc-500 h-11 pl-4 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-zinc-300 font-semibold">
                Primary Use Case <span className="text-indigo-400">*</span>
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(["coding", "writing", "data", "research", "mixed"] as UseCase[]).map((uc) => (
                  <button
                    key={uc}
                    type="button"
                    onClick={() => setUseCase(uc)}
                    className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-200 ${
                      useCase === uc
                        ? "bg-indigo-500/10 border-indigo-500 text-white shadow-lg"
                        : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white"
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
            <div className="bg-white/5 rounded-2xl border border-white/10 p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="tool" className="text-xs text-zinc-300 font-semibold">AI Tool</Label>
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
                      <option key={key} value={key} className="bg-zinc-950 text-white">
                        {TOOL_DISPLAY_NAMES[key]}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="plan" className="text-xs text-zinc-300 font-semibold">Plan Tier</Label>
                  <Select
                    id="plan"
                    value={currentPlan}
                    onChange={(e) => setCurrentPlan(e.target.value)}
                  >
                    {(TOOLS[currentTool]?.plans || []).map((p) => (
                      <option key={p} value={p} className="bg-zinc-950 text-white">
                        {p}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="seats" className="text-xs text-zinc-300 font-semibold">Seats / Users</Label>
                  <Input
                    id="seats"
                    type="number"
                    min={1}
                    value={currentSeats}
                    onChange={(e) => setCurrentSeats(parseInt(e.target.value) || 1)}
                    className="bg-zinc-900 border-white/10 text-white h-10 rounded-lg text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="spend" className="text-xs text-zinc-300 font-semibold">Monthly Spend ($)</Label>
                  <Input
                    id="spend"
                    type="number"
                    min={0}
                    value={currentSpend}
                    onChange={(e) => setCurrentSpend(parseFloat(e.target.value) || 0)}
                    className="bg-zinc-900 border-white/10 text-white h-10 rounded-lg text-sm"
                  />
                </div>
              </div>

              {toolError && (
                <p className="text-xs text-rose-400 font-semibold bg-rose-500/10 border border-rose-500/20 rounded-lg p-2.5">
                  {toolError}
                </p>
              )}

              <Button
                type="button"
                onClick={handleAddTool}
                className="w-full bg-white hover:bg-zinc-200 text-zinc-950 font-bold h-10 rounded-xl transition-all shadow-md"
              >
                + Add Tool Subscription
              </Button>
            </div>

            {/* Added Tools List */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Added Subscriptions</h3>
              {selectedTools.length === 0 ? (
                <div className="text-center py-8 rounded-2xl border border-dashed border-white/10 bg-white/5 text-zinc-500 text-xs">
                  No tools added yet. Add at least one subscription above to proceed.
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedTools.map((t) => (
                    <div
                      key={t.tool}
                      className="flex items-center justify-between bg-zinc-900/60 border border-white/10 rounded-xl p-3"
                    >
                      <div>
                        <p className="text-sm font-bold text-white">{TOOL_DISPLAY_NAMES[t.tool]}</p>
                        <p className="text-[10px] text-zinc-500">
                          {t.plan} • {t.seats} seat{t.seats > 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold">${t.monthlySpend}/mo</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTool(t.tool)}
                          className="text-zinc-500 hover:text-rose-400 transition-colors"
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
            <div className="grid grid-cols-2 gap-4 bg-white/5 rounded-2xl border border-white/10 p-4">
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Team Context</p>
                <p className="text-sm font-bold text-white mt-0.5">{teamSize} Seat{teamSize > 1 ? "s" : ""}</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Use Case</p>
                <p className="text-sm font-bold text-white mt-0.5 capitalize">{useCase}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Subscription Summary</h3>
              <div className="space-y-2">
                {selectedTools.map((t) => (
                  <div
                    key={t.tool}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-zinc-300">
                      {TOOL_DISPLAY_NAMES[t.tool]} ({t.plan} x {t.seats})
                    </span>
                    <span className="font-semibold text-white">${t.monthlySpend}/mo</span>
                  </div>
                ))}
                
                <Separator className="bg-white/10 my-3" />
                
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-indigo-400">Total Monthly Cost</span>
                  <span className="text-white">
                    ${selectedTools.reduce((sum, t) => sum + t.monthlySpend, 0)}/mo
                  </span>
                </div>
              </div>
            </div>

            {formError && (
              <p className="text-xs text-rose-400 font-semibold bg-rose-500/10 border border-rose-500/20 rounded-lg p-2.5">
                {formError}
              </p>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between border-t border-white/10 px-6 md:px-8 py-4 bg-zinc-950/90 gap-4">
        {step > 1 ? (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep(step - 1)}
            disabled={isSubmitting}
            className="text-zinc-400 hover:text-white hover:bg-white/5"
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
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 rounded-xl shadow-lg transition-transform active:scale-[0.98]"
          >
            Next Step →
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold px-8 rounded-xl shadow-lg transition-transform active:scale-[0.98]"
          >
            {isSubmitting ? "Running Audit..." : "Run My Audit →"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
