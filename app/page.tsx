"use client";

import React from "react";
import Image from "next/image";
import { SpendForm } from "@/components/SpendForm";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-950 selection:bg-emerald-700/10 selection:text-emerald-950">
      {/* Background Subtle Gradient blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl transform -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-6 h-20 flex items-center justify-between border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="SpendLens Logo" width={28} height={28} className="object-contain" />
          <span className="font-bold tracking-tight text-zinc-900 text-xl">
            Spend<span className="text-[#1a7a4a]">Lens</span>
          </span>
        </div>
        <div>
          <a
            href="https://credex.rocks"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold bg-[#1a7a4a] hover:bg-[#15633c] text-white px-4 py-2 rounded-full transition-all duration-200 shadow-sm"
          >
            Built by Credex
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center px-6 py-12 md:py-20 space-y-16 max-w-5xl mx-auto w-full">
        <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-12">
          {/* Hero Left Content */}
          <div className="flex-1 space-y-6 text-left lg:pt-8 max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-zinc-900">
              Find out what your <br />
              AI stack is <span className="text-[#1a7a4a]">actually costing you.</span>
            </h1>
            <p className="text-base md:text-lg text-zinc-600 leading-relaxed font-normal">
              Free 2-minute audit. No login. See exactly where your team is overspending on AI tools — and what to do about it.
            </p>
          </div>

          {/* Spend Form Right */}
          <div className="w-full lg:w-auto flex-shrink-0 flex justify-center">
            <SpendForm />
          </div>
        </div>

        {/* Social Proof Block */}
        <section className="w-full pt-8 space-y-8">
          <div className="text-left space-y-2">
            <h2 className="text-xs font-semibold text-[#1a7a4a] uppercase tracking-widest">
              Trusted by Product & Engineering Teams
            </h2>
            <p className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tight">
              150+ teams audited their AI spend this month.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#f9fafb] border border-zinc-200 rounded-xl p-6 relative overflow-hidden shadow-sm">
              <p className="text-zinc-600 text-sm leading-relaxed italic">
                &ldquo;Found $340/mo in redundant seats in about 90 seconds. Paid for itself before I finished reading the report.&rdquo;
              </p>
              <div className="mt-4 pt-4 border-t border-zinc-100 flex flex-col">
                <span className="text-xs font-bold text-zinc-900">Engineering Manager</span>
                <span className="text-[10px] text-zinc-500">22-person Series A startup</span>
              </div>
            </div>

            <div className="bg-[#f9fafb] border border-zinc-200 rounded-xl p-6 relative overflow-hidden shadow-sm">
              <p className="text-zinc-600 text-sm leading-relaxed italic">
                &ldquo;Finally something that explains the difference between all these plans in plain English.&rdquo;
              </p>
              <div className="mt-4 pt-4 border-t border-zinc-100 flex flex-col">
                <span className="text-xs font-bold text-zinc-900">Solo Founder</span>
                <span className="text-[10px] text-zinc-500">Pre-revenue SaaS</span>
              </div>
            </div>

            <div className="bg-[#f9fafb] border border-zinc-200 rounded-xl p-6 relative overflow-hidden shadow-sm">
              <p className="text-zinc-600 text-sm leading-relaxed italic">
                &ldquo;Used this before our Q2 budget review. Saved us an awkward conversation with the CFO.&rdquo;
              </p>
              <div className="mt-4 pt-4 border-t border-zinc-100 flex flex-col">
                <span className="text-xs font-bold text-zinc-900">CTO</span>
                <span className="text-[10px] text-zinc-500">8-person fintech startup</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Block */}
        <section className="w-full pt-8 space-y-8 text-left">
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <h3 className="text-base font-bold text-zinc-900">Is this actually free? What&apos;s the catch?</h3>
              <p className="text-sm text-zinc-600 leading-relaxed font-normal">
                Yes, completely free to use and get your audit. We capture your email if you want the report delivered — that&apos;s the entire exchange. If your audit shows significant savings, we&apos;ll introduce you to Credex (the company behind this tool), which sources discounted AI credits. No obligation, no spam.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-zinc-900">How accurate is the pricing data?</h3>
              <p className="text-sm text-zinc-600 leading-relaxed font-normal">
                Every price is sourced from official vendor pricing pages, verified weekly. We cite our sources in the report. If you notice a price that&apos;s changed, there&apos;s a &ldquo;flag this&rdquo; link on every tool&apos;s audit card.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-zinc-900">What data do you store?</h3>
              <p className="text-sm text-zinc-600 leading-relaxed font-normal">
                Your tool list and savings numbers are stored (to generate your shareable link). Your email and company name are never shown in the public-facing audit URL — only you receive those in the email report.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-zinc-900">Can I share my audit with my team or manager?</h3>
              <p className="text-sm text-zinc-600 leading-relaxed font-normal">
                Yes. Every audit gets a unique shareable URL. Company name and email are stripped from the public version — only tool usage and savings numbers are visible.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-zinc-900">What if my stack is already optimized?</h3>
              <p className="text-sm text-zinc-600 leading-relaxed font-normal">
                We&apos;ll tell you that directly. The tool is designed to be honest — &ldquo;you&apos;re spending well&rdquo; is a valid (and useful) audit result. No manufactured urgency.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-200 py-8 text-center text-xs text-zinc-500 relative z-10 bg-[#f9fafb]">
        <p className="mb-2">© 2026 SpendLens. All rights reserved.</p>
        <p>
          SpendLens is a lead-generation asset powered by{" "}
          <a
            href="https://credex.rocks"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1a7a4a] font-bold hover:underline"
          >
            Credex
          </a>
          . We source discounted AI credits for growing startups.
        </p>
      </footer>
    </div>
  );
}
