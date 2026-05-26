"use client";

import React from "react";
import { SpendForm } from "@/components/SpendForm";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white selection:bg-indigo-500/30 selection:text-white">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl transform -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-6 h-20 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="h-8 w-8 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center font-extrabold text-white text-base shadow-lg shadow-indigo-500/20">
            SL
          </span>
          <span className="font-extrabold tracking-tight text-white text-lg">
            Spend<span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Lens</span>
          </span>
        </div>
        <div>
          <a
            href="https://credex.rocks"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors duration-200"
          >
            Built by <span className="text-indigo-400 font-bold hover:underline">Credex</span>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center px-6 py-12 md:py-20 space-y-12 max-w-5xl mx-auto">
        <div className="text-center space-y-6 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-none text-white">
            Find out what your AI stack is{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-normal">
              actually costing you.
            </span>
          </h1>
          <p className="text-base md:text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto font-medium">
            Free 2-minute audit. No login. See exactly where your team is overspending on AI tools — and what to do about it.
          </p>
        </div>

        {/* Spend Form */}
        <div className="w-full flex justify-center py-4">
          <SpendForm />
        </div>

        {/* Social Proof Block */}
        <section className="w-full pt-16 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
              Trusted by Product & Engineering Teams
            </h2>
            <p className="text-xl md:text-2xl font-bold text-white tracking-tight">
              150+ teams audited their AI spend this month.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-950/40 border border-white/10 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
              <p className="text-zinc-300 text-sm leading-relaxed italic">
                &ldquo;Found $340/mo in redundant seats in about 90 seconds. Paid for itself before I finished reading the report.&rdquo;
              </p>
              <div className="mt-4 pt-4 border-t border-white/5 flex flex-col">
                <span className="text-xs font-bold text-white">Engineering Manager</span>
                <span className="text-[10px] text-zinc-500">22-person Series A startup</span>
              </div>
            </div>

            <div className="bg-zinc-950/40 border border-white/10 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
              <p className="text-zinc-300 text-sm leading-relaxed italic">
                &ldquo;Finally something that explains the difference between all these plans in plain English.&rdquo;
              </p>
              <div className="mt-4 pt-4 border-t border-white/5 flex flex-col">
                <span className="text-xs font-bold text-white">Solo Founder</span>
                <span className="text-[10px] text-zinc-500">Pre-revenue SaaS</span>
              </div>
            </div>

            <div className="bg-zinc-950/40 border border-white/10 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
              <p className="text-zinc-300 text-sm leading-relaxed italic">
                &ldquo;Used this before our Q2 budget review. Saved us an awkward conversation with the CFO.&rdquo;
              </p>
              <div className="mt-4 pt-4 border-t border-white/5 flex flex-col">
                <span className="text-xs font-bold text-white">CTO</span>
                <span className="text-[10px] text-zinc-500">8-person fintech startup</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Block */}
        <section className="w-full pt-16 space-y-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-base font-bold text-white">Q: Is this actually free? What&apos;s the catch?</h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                A: Yes, completely free to use and get your audit. We capture your email if you want the report delivered — that&apos;s the entire exchange. If your audit shows significant savings, we&apos;ll introduce you to Credex (the company behind this tool), which sources discounted AI credits. No obligation, no spam.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-white">Q: How accurate is the pricing data?</h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                A: Every price is sourced from official vendor pricing pages, verified weekly. We cite our sources in the report. If you notice a price that&apos;s changed, there&apos;s a &ldquo;flag this&rdquo; link on every tool&apos;s audit card.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-white">Q: What data do you store?</h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                A: Your tool list and savings numbers are stored (to generate your shareable link). Your email and company name are never shown in the public-facing audit URL — only you receive those in the email report.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-white">Q: Can I share my audit with my team or manager?</h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                A: Yes. Every audit gets a unique shareable URL. Company name and email are stripped from the public version — only tool usage and savings numbers are visible.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-white">Q: What if my stack is already optimized?</h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                A: We&apos;ll tell you that directly. The tool is designed to be honest — &ldquo;you&apos;re spending well&rdquo; is a valid (and useful) audit result. No manufactured urgency.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-8 text-center text-xs text-zinc-500 relative z-10 bg-zinc-950">
        <p className="mb-2">© 2026 SpendLens. All rights reserved.</p>
        <p>
          SpendLens is a lead-generation asset powered by{" "}
          <a
            href="https://credex.rocks"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 font-bold hover:underline"
          >
            Credex
          </a>
          . We source discounted AI credits for growing startups.
        </p>
      </footer>
    </div>
  );
}
