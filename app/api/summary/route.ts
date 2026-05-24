import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { AuditResult } from "@/types/audit";

// Fallback template when Gemini API is unavailable
function summaryFallback(audit: AuditResult): string {
  const { totalMonthlySavings, tools, teamSize, useCase } = audit;
  const topSaving = [...tools].sort(
    (a, b) => b.estimatedMonthlySavings - a.estimatedMonthlySavings
  )[0];

  if (totalMonthlySavings === 0) {
    return `Your ${teamSize}-person team's AI spend looks well-optimized for ${useCase} work. You're on appropriate plans across all tools with no significant waste identified. Keep an eye on seat counts as your team grows — that's typically where overages first appear.`;
  }

  return `Your team could save $${totalMonthlySavings}/month ($${totalMonthlySavings * 12}/year) on AI tools. The biggest opportunity is ${topSaving.tool}: ${topSaving.recommendedAction}. ${
    totalMonthlySavings > 500
      ? "At this savings level, sourcing credits through Credex could extend those savings further."
      : "Small adjustments now compound significantly over a year."
  }`;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: max 10 calls/IP/hour
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!checkRateLimit(ip, 10)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429 }
      );
    }

    const audit: AuditResult = await request.json();

    // Build the prompt for Gemini
    const systemPrompt = `You are a concise, financially literate advisor helping a startup team understand their AI tool spend.
You write in clear, direct prose — no bullet points, no headers. One paragraph, approximately 100 words.
Do not use hedging language like "it seems" or "perhaps." Be specific and direct.
Do not manufacture urgency or push Credex — mention it once if savings are significant, otherwise omit.`;

    const toolBreakdown = audit.tools
      .map(
        (t) =>
          `- ${t.tool} (${t.currentPlan}, ${t.currentMonthlySpend > 0 ? "$" + t.currentMonthlySpend + "/mo" : "free"}): ${t.recommendedAction}. Saves $${t.estimatedMonthlySavings}/mo.`
      )
      .join("\n");

    const userPrompt = `Here is an AI spend audit for a team:

Team size: ${audit.teamSize}
Primary use case: ${audit.useCase}
Total current monthly spend: $${audit.totalCurrentSpend}
Total potential monthly savings: $${audit.totalMonthlySavings}

Tool breakdown:
${toolBreakdown}

Write a 100-word personalized summary of this audit. Lead with the most impactful finding. Be specific about which tool and why. End with one sentence of forward-looking advice.`;

    // Call Gemini API
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      console.warn("GEMINI_API_KEY not set, using fallback template");
      return NextResponse.json({ summary: summaryFallback(audit) });
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `${systemPrompt}\n\n${userPrompt}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 300,
            },
          }),
        }
      );

      if (!response.ok) {
        console.error("Gemini API error:", response.status, await response.text());
        return NextResponse.json({ summary: summaryFallback(audit) });
      }

      const data = await response.json();
      const summary =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        summaryFallback(audit);

      return NextResponse.json({ summary });
    } catch (apiError) {
      console.error("Gemini API call failed:", apiError);
      return NextResponse.json({ summary: summaryFallback(audit) });
    }
  } catch (error) {
    console.error("Summary API error:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
