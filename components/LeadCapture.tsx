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
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border border-white/10 text-white rounded-2xl p-6 backdrop-blur-2xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Save & Email Your Report
          </DialogTitle>
          <DialogDescription className="text-zinc-400 text-xs">
            We&apos;ll email you a copy of your AI Spend Audit along with dynamic links so you can share it with your team.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
            <Label htmlFor="email" className="text-xs text-zinc-300 font-semibold">
              Work Email <span className="text-indigo-400">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder-zinc-500 h-10 rounded-lg text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="company" className="text-xs text-zinc-300 font-semibold">
              Company Name <span className="text-zinc-500 font-normal">(Optional)</span>
            </Label>
            <Input
              id="company"
              type="text"
              placeholder="Acme Corp"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder-zinc-500 h-10 rounded-lg text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="role" className="text-xs text-zinc-300 font-semibold">
              Your Role <span className="text-zinc-500 font-normal">(Optional)</span>
            </Label>
            <Input
              id="role"
              type="text"
              placeholder="Engineering Manager"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder-zinc-500 h-10 rounded-lg text-sm"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-400 font-semibold bg-rose-500/10 border border-rose-500/20 rounded-lg p-2.5">
              {error}
            </p>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-zinc-400 hover:text-white hover:bg-white/5"
            >
              Skip
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 h-10 rounded-lg shadow-lg"
            >
              {loading ? "Sending..." : "Email My Report →"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
