import { NextRequest, NextResponse } from "next/server";
import { runAudit } from "@/lib/auditEngine";
import { supabase } from "@/lib/supabase";
import { AuditInput } from "@/types/audit";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const body: AuditInput = await request.json();

    // Validate input
    if (!body.teamSize || body.teamSize < 1 || body.teamSize > 500) {
      return NextResponse.json(
        { error: "Team size must be between 1 and 500" },
        { status: 400 }
      );
    }

    if (!body.useCase) {
      return NextResponse.json(
        { error: "Use case is required" },
        { status: 400 }
      );
    }

    if (!body.tools || body.tools.length === 0) {
      return NextResponse.json(
        { error: "At least one tool is required" },
        { status: 400 }
      );
    }

    // Validate each tool entry
    for (const tool of body.tools) {
      if (tool.monthlySpend < 0) {
        return NextResponse.json(
          { error: "Monthly spend must be >= 0" },
          { status: 400 }
        );
      }
      if (tool.seats < 1) {
        return NextResponse.json(
          { error: "Seats must be >= 1" },
          { status: 400 }
        );
      }
    }

    // Run the deterministic audit engine
    const auditResult = runAudit(body);

    // Generate UUID for the audit
    const id = uuidv4();

    // Store in Supabase
    const { error: dbError } = await supabase.from("audits").insert({
      id,
      team_size: auditResult.teamSize,
      use_case: auditResult.useCase,
      tools: auditResult.tools,
      total_current_spend: auditResult.totalCurrentSpend,
      total_monthly_savings: auditResult.totalMonthlySavings,
      total_annual_savings: auditResult.totalAnnualSavings,
      created_at: new Date().toISOString(),
    });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      // Still return the audit result even if storage fails
      return NextResponse.json({
        id,
        ...auditResult,
        warning: "Audit completed but could not be saved. Share link may not work.",
      });
    }

    return NextResponse.json({ id, ...auditResult });
  } catch (error) {
    console.error("Audit API error:", error);
    return NextResponse.json(
      { error: "Failed to process audit" },
      { status: 500 }
    );
  }
}
