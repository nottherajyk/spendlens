"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LeadCaptureProps {
  auditId: string;
  defaultTeamSize: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function LeadCapture({
  auditId,
  defaultTeamSize,
  open,
  onOpenChange,
  onSuccess,
}: LeadCaptureProps) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  // Honeypot field
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          company,
          role,
          teamSize: defaultTeamSize,
          auditId,
          website, // honeypot
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit lead");
      }

      setLoading(false);
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      setLoading(false);
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white border border-zinc-200 text-zinc-900 rounded-xl p-6 shadow-md">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-bold text-zinc-900 text-left">
            Save & Email Your Report
          </DialogTitle>
          <DialogDescription className="text-zinc-500 text-xs text-left">
            We&apos;ll email you a copy of your AI Spend Audit along with dynamic links so you can share it with your team.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-left">
          {/* Honeypot field (hidden from users, but visible to autocomplete/bots) */}
          <input
            type="text"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            style={{ display: "none" }}
            tabIndex={-1}
            autoComplete="off"
          />

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Work Email <span className="text-[#1a7a4a]">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400 h-10 rounded-lg text-sm focus-visible:ring-[#1a7a4a] focus-visible:ring-offset-1 focus-visible:border-[#1a7a4a]"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="company" className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Company Name <span className="text-zinc-400 font-normal">(Optional)</span>
            </Label>
            <Input
              id="company"
              type="text"
              placeholder="Acme Corp"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400 h-10 rounded-lg text-sm focus-visible:ring-[#1a7a4a] focus-visible:ring-offset-1 focus-visible:border-[#1a7a4a]"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="role" className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Your Role <span className="text-zinc-400 font-normal">(Optional)</span>
            </Label>
            <Input
              id="role"
              type="text"
              placeholder="Engineering Manager"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400 h-10 rounded-lg text-sm focus-visible:ring-[#1a7a4a] focus-visible:ring-offset-1 focus-visible:border-[#1a7a4a]"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-600 font-semibold bg-rose-500/10 border border-rose-500/20 rounded-lg p-2.5">
              {error}
            </p>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
            >
              Skip
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#1a7a4a] hover:bg-[#15633c] text-white font-bold px-4 h-10 rounded-lg shadow-sm"
            >
              {loading ? "Sending..." : "Email My Report →"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
