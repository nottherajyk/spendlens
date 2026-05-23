import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { AuditResult as AuditResultType } from "@/types/audit";
import { AuditResult } from "@/components/AuditResult";

export const dynamic = "force-dynamic";

interface AuditPageProps {
  params: {
    id: string;
  };
}

// Fetch audit data server-side
async function getAudit(id: string): Promise<AuditResultType | null> {
  const { data, error } = await supabase
    .from("audits")
    .select("id, team_size, use_case, tools, total_current_spend, total_monthly_savings, total_annual_savings, created_at")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Failed to fetch audit from Supabase:", error);
    return null;
  }

  // Map database snake_case to typescript camelCase
  return {
    id: data.id,
    teamSize: data.team_size,
    useCase: data.use_case,
    tools: data.tools,
    totalCurrentSpend: data.total_current_spend,
    totalMonthlySavings: data.total_monthly_savings,
    totalAnnualSavings: data.total_annual_savings,
    createdAt: data.created_at,
  };
}

// Generate dynamic Metadata for SEO & OG Share preview
export async function generateMetadata({ params }: AuditPageProps): Promise<Metadata> {
  const audit = await getAudit(params.id);

  if (!audit) {
    return {
      title: "Audit Not Found — SpendLens",
      description: "This AI spend audit could not be found.",
    };
  }

  const toolList = audit.tools.map((t) => t.tool).join(", ");

  return {
    title: `My AI Stack Could Save $${audit.totalMonthlySavings}/mo — SpendLens Audit`,
    description: `${toolList} → $${audit.totalMonthlySavings} savings identified. See your personalized, free spend audit now.`,
    openGraph: {
      title: `My AI Stack Could Save $${audit.totalMonthlySavings}/mo — SpendLens Audit`,
      description: `${toolList} → $${audit.totalMonthlySavings} savings identified. See your audit.`,
      url: `/audit/${params.id}`,
      type: "website",
      images: [
        {
          url: `/api/og?id=${params.id}`, // Static placeholder or custom dynamic OG image handler
          width: 1200,
          height: 630,
          alt: `SpendLens Audit — $${audit.totalMonthlySavings}/mo Potential Savings`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `My AI Stack Could Save $${audit.totalMonthlySavings}/mo — SpendLens Audit`,
      description: `${toolList} → $${audit.totalMonthlySavings} savings identified. See your audit.`,
      images: [`/api/og?id=${params.id}`],
    },
  };
}

export default async function AuditPage({ params }: AuditPageProps) {
  const audit = await getAudit(params.id);

  if (!audit) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white selection:bg-indigo-500/30 selection:text-white">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl transform -translate-y-1/2 pointer-events-none" />
      
      {/* Header */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-6 h-20 flex items-center justify-between border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-8 w-8 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center font-extrabold text-white text-base shadow-lg shadow-indigo-500/20">
            SL
          </span>
          <span className="font-extrabold tracking-tight text-white text-lg">
            Spend<span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Lens</span>
          </span>
        </Link>
        <div>
          <Link
            href="/"
            className="text-xs font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-xl transition-all duration-200"
          >
            Create New Audit
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto py-8">
        <AuditResult audit={audit} />
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-8 text-center text-xs text-zinc-500 bg-zinc-950">
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
