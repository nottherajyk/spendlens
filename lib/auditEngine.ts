import { AuditInput, AuditResult, ToolAudit, ToolEntry, Recommendation } from "@/types/audit";
import { PRICING, TOOL_DISPLAY_NAMES } from "./pricingData";

interface AuditOpportunity {
  recommendation: Recommendation;
  recommendedAction: string;
  estimatedMonthlySavings: number;
  reasoning: string;
}

interface RedundancyOpportunity extends AuditOpportunity {
  tool: string;
}

/**
 * Run a deterministic audit on the user's AI tool spend.
 * Evaluates: plan fit, overpay detection, cross-tool substitution, and credits opportunity.
 */
export function runAudit(input: AuditInput): AuditResult {
  const toolAudits: ToolAudit[] = [];

  for (const entry of input.tools) {
    const audit = evaluateTool(entry, input);
    toolAudits.push(audit);
  }

  // Cross-tool redundancy check
  const redundancyAudits = checkCrossToolRedundancy(input.tools, input.useCase);
  for (const ra of redundancyAudits) {
    // Find the tool in our audits and update it
    const existing = toolAudits.find((a) => a.tool === ra.tool);
    if (existing && ra.estimatedMonthlySavings > existing.estimatedMonthlySavings) {
      existing.recommendation = ra.recommendation;
      existing.recommendedAction = ra.recommendedAction;
      existing.estimatedMonthlySavings = ra.estimatedMonthlySavings;
      existing.reasoning = ra.reasoning;
    }
  }

  const totalCurrentSpend = toolAudits.reduce(
    (sum, t) => sum + t.currentMonthlySpend,
    0
  );
  const totalMonthlySavings = toolAudits.reduce(
    (sum, t) => sum + t.estimatedMonthlySavings,
    0
  );

  return {
    teamSize: input.teamSize,
    useCase: input.useCase,
    tools: toolAudits,
    totalCurrentSpend,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
  };
}

function evaluateTool(entry: ToolEntry, input: AuditInput): ToolAudit {
  const displayName = TOOL_DISPLAY_NAMES[entry.tool] || entry.tool;
  const publishedPrice = PRICING[entry.tool]?.[entry.plan] ?? 0;
  const expectedSpend = publishedPrice * entry.seats;

  // Default: stay on current plan
  let recommendation: ToolAudit["recommendation"] = "stay";
  let recommendedAction = `Continue with ${displayName} ${entry.plan}. Your current plan is appropriate for your team size and use case.`;
  let estimatedMonthlySavings = 0;
  let reasoning = `${displayName} ${entry.plan} at $${entry.monthlySpend}/mo for ${entry.seats} seat(s) is within expected range. No changes recommended.`;

  // 1. Plan fit check — Is their seat count consistent with the plan tier?
  const planFit = checkPlanFit(entry);
  if (planFit) {
    recommendation = planFit.recommendation;
    recommendedAction = planFit.recommendedAction;
    estimatedMonthlySavings = planFit.estimatedMonthlySavings;
    reasoning = planFit.reasoning;
  }

  // 2. Overpay check — Is stated spend higher than published price × seats?
  const overpay = checkOverpay(entry, expectedSpend);
  if (overpay && overpay.estimatedMonthlySavings > estimatedMonthlySavings) {
    recommendation = overpay.recommendation;
    recommendedAction = overpay.recommendedAction;
    estimatedMonthlySavings = overpay.estimatedMonthlySavings;
    reasoning = overpay.reasoning;
  }

  // 3. Cross-tool substitution (individual tool level)
  const substitution = checkSubstitution(entry, input.useCase);
  if (
    substitution &&
    substitution.estimatedMonthlySavings > estimatedMonthlySavings
  ) {
    recommendation = substitution.recommendation;
    recommendedAction = substitution.recommendedAction;
    estimatedMonthlySavings = substitution.estimatedMonthlySavings;
    reasoning = substitution.reasoning;
  }

  // 4. Credits opportunity — annual spend > $500
  const annualSpend = entry.monthlySpend * 12;
  if (annualSpend > 500) {
    // Add credits note but don't override better recommendations
    const creditsNote = `Credex may have discounted credits for ${displayName}. Check before renewing.`;
    if (recommendation === "stay" && estimatedMonthlySavings === 0) {
      recommendation = "check_credits";
      recommendedAction = creditsNote;
      reasoning = `${displayName} annual spend of $${annualSpend} exceeds $500. While your current plan is appropriate, you may be eligible for discounted credits through Credex that could reduce your effective cost.`;
    } else {
      reasoning += ` Additionally, ${creditsNote.toLowerCase()}`;
    }
  }

  return {
    tool: displayName,
    currentPlan: entry.plan,
    currentMonthlySpend: entry.monthlySpend,
    recommendation,
    recommendedAction,
    estimatedMonthlySavings,
    reasoning,
  };
}

function checkPlanFit(
  entry: ToolEntry
): AuditOpportunity | null {
  const displayName = TOOL_DISPLAY_NAMES[entry.tool] || entry.tool;

  // Claude Team for 1-2 users → suggest Claude Pro (individual) instead
  if (entry.tool === "claude" && entry.plan === "Team" && entry.seats <= 2) {
    const currentCost = entry.monthlySpend;
    const proCost = PRICING.claude.Pro * entry.seats;
    const savings = currentCost - proCost;
    if (savings > 0) {
      return {
        recommendation: "downgrade",
        recommendedAction: `Switch ${entry.seats} seat(s) from Claude Team to individual Claude Pro plans ($${PRICING.claude.Pro}/mo each).`,
        estimatedMonthlySavings: savings,
        reasoning: `Claude Team ($${PRICING.claude.Team}/seat/mo) is designed for larger teams. For ${entry.seats} user(s), individual Claude Pro plans at $${PRICING.claude.Pro}/mo each would cost $${proCost}/mo total, saving $${savings}/mo. You retain the same model access without the team management overhead.`,
      };
    }
  }

  // ChatGPT Team for 1-2 users → suggest ChatGPT Plus instead
  if (entry.tool === "chatgpt" && entry.plan === "Team" && entry.seats <= 2) {
    const currentCost = entry.monthlySpend;
    const plusCost = PRICING.chatgpt.Plus * entry.seats;
    const savings = currentCost - plusCost;
    if (savings > 0) {
      return {
        recommendation: "downgrade",
        recommendedAction: `Switch ${entry.seats} seat(s) from ChatGPT Team to individual ChatGPT Plus plans ($${PRICING.chatgpt.Plus}/mo each).`,
        estimatedMonthlySavings: savings,
        reasoning: `ChatGPT Team ($${PRICING.chatgpt.Team}/seat/mo) offers admin controls suited to larger teams. For ${entry.seats} user(s), individual Plus plans at $${PRICING.chatgpt.Plus}/mo each would cost $${plusCost}/mo total, saving $${savings}/mo.`,
      };
    }
  }

  // GitHub Copilot Business for 1 user → suggest Individual
  if (
    entry.tool === "github_copilot" &&
    entry.plan === "Business" &&
    entry.seats === 1
  ) {
    const savings =
      entry.monthlySpend - PRICING.github_copilot.Individual * entry.seats;
    if (savings > 0) {
      return {
        recommendation: "downgrade",
        recommendedAction: `Switch from ${displayName} Business to Individual plan ($${PRICING.github_copilot.Individual}/mo).`,
        estimatedMonthlySavings: savings,
        reasoning: `${displayName} Business ($${PRICING.github_copilot.Business}/seat/mo) includes org-level management features a single user doesn't need. The Individual plan at $${PRICING.github_copilot.Individual}/mo provides the same code completion capabilities, saving $${savings}/mo.`,
      };
    }
  }

  // Windsurf Team for 1-2 users → suggest Pro
  if (entry.tool === "windsurf" && entry.plan === "Team" && entry.seats <= 2) {
    const currentCost = entry.monthlySpend;
    const proCost = PRICING.windsurf.Pro * entry.seats;
    const savings = currentCost - proCost;
    if (savings > 0) {
      return {
        recommendation: "downgrade",
        recommendedAction: `Switch ${entry.seats} seat(s) from Windsurf Team to individual Pro plans ($${PRICING.windsurf.Pro}/mo each).`,
        estimatedMonthlySavings: savings,
        reasoning: `Windsurf Team ($${PRICING.windsurf.Team}/seat/mo) is optimized for larger teams. For ${entry.seats} user(s), Pro plans at $${PRICING.windsurf.Pro}/mo each would cost $${proCost}/mo, saving $${savings}/mo.`,
      };
    }
  }

  return null;
}

function checkOverpay(
  entry: ToolEntry,
  expectedSpend: number
): AuditOpportunity | null {
  const displayName = TOOL_DISPLAY_NAMES[entry.tool] || entry.tool;

  // Skip usage-based plans where published price is 0
  if (expectedSpend === 0) return null;

  // Flag if stated spend is more than 10% above expected
  if (entry.monthlySpend > expectedSpend * 1.1) {
    const overpayAmount = entry.monthlySpend - expectedSpend;
    return {
      recommendation: "downgrade",
      recommendedAction: `Verify your ${displayName} billing. You're paying $${entry.monthlySpend}/mo but the published rate for ${entry.seats} seat(s) on ${entry.plan} is $${expectedSpend}/mo.`,
      estimatedMonthlySavings: overpayAmount,
      reasoning: `Your stated spend of $${entry.monthlySpend}/mo for ${displayName} ${entry.plan} with ${entry.seats} seat(s) exceeds the published price of $${expectedSpend}/mo by $${overpayAmount}. This could indicate unused seats, a billing error, or add-on charges worth reviewing.`,
    };
  }

  return null;
}

function checkSubstitution(
  entry: ToolEntry,
  useCase: string
): AuditOpportunity | null {
  // Coding use case: Cursor Pro → mention GitHub Copilot Individual as cheaper
  if (
    useCase === "coding" &&
    entry.tool === "cursor" &&
    entry.plan === "Pro"
  ) {
    const copilotCost = PRICING.github_copilot.Individual * entry.seats;
    const savings = entry.monthlySpend - copilotCost;
    if (savings > 0) {
      return {
        recommendation: "switch",
        recommendedAction: `Consider GitHub Copilot Individual ($${PRICING.github_copilot.Individual}/mo/seat) as a cheaper alternative for coding-only use.`,
        estimatedMonthlySavings: savings,
        reasoning: `For purely coding use cases, GitHub Copilot Individual at $${PRICING.github_copilot.Individual}/mo/seat provides comparable code completion. Cursor Pro includes additional features like multi-file editing that may or may not be essential for your workflow. Potential savings: $${savings}/mo.`,
      };
    }
  }

  // Writing use case: ChatGPT Team → suggest Claude Pro/Team
  if (
    useCase === "writing" &&
    entry.tool === "chatgpt" &&
    entry.plan === "Team"
  ) {
    const claudeTeamCost = PRICING.claude.Team * entry.seats;
    if (entry.monthlySpend > claudeTeamCost) {
      return {
        recommendation: "switch",
        recommendedAction: `Consider Claude Team ($${PRICING.claude.Team}/seat/mo) as an alternative optimized for long-form writing tasks.`,
        estimatedMonthlySavings: entry.monthlySpend - claudeTeamCost,
        reasoning: `For writing-focused teams, Claude's longer context window and writing capabilities are often preferred. Claude Team at $${PRICING.claude.Team}/seat/mo is priced comparably to ChatGPT Team, and could be a better fit for your use case.`,
      };
    }
  }

  return null;
}

function checkCrossToolRedundancy(
  tools: ToolEntry[],
  useCase: string
): RedundancyOpportunity[] {
  const results: RedundancyOpportunity[] = [];

  // Check for Claude + ChatGPT overlap (non-API plans)
  const claudeEntry = tools.find(
    (t) =>
      t.tool === "claude" &&
      t.plan !== "API Direct" &&
      t.plan !== "Free"
  );
  const chatgptEntry = tools.find(
    (t) =>
      t.tool === "chatgpt" &&
      t.plan !== "API Direct"
  );

  if (claudeEntry && chatgptEntry) {
    // For single-purpose use cases, flag the more expensive one as potentially redundant
    if (useCase !== "mixed") {
      const claudeCost = claudeEntry.monthlySpend;
      const chatgptCost = chatgptEntry.monthlySpend;

      if (chatgptCost >= claudeCost) {
        results.push({
          tool: TOOL_DISPLAY_NAMES[chatgptEntry.tool],
          recommendation: "switch",
          recommendedAction: `Possible redundancy: you're paying for both ChatGPT and Claude for ${useCase}. Consider consolidating to one tool.`,
          estimatedMonthlySavings: chatgptCost,
          reasoning: `Your team uses both ChatGPT (${chatgptEntry.plan}, $${chatgptCost}/mo) and Claude (${claudeEntry.plan}, $${claudeCost}/mo) for ${useCase}. For a single use case, one tool is typically sufficient. Consolidating to Claude could save $${chatgptCost}/mo. Evaluate which tool your team actually prefers before switching.`,
        });
      } else {
        results.push({
          tool: TOOL_DISPLAY_NAMES[claudeEntry.tool],
          recommendation: "switch",
          recommendedAction: `Possible redundancy: you're paying for both Claude and ChatGPT for ${useCase}. Consider consolidating to one tool.`,
          estimatedMonthlySavings: claudeCost,
          reasoning: `Your team uses both Claude (${claudeEntry.plan}, $${claudeCost}/mo) and ChatGPT (${chatgptEntry.plan}, $${chatgptCost}/mo) for ${useCase}. For a single use case, one tool is typically sufficient. Consolidating to ChatGPT could save $${claudeCost}/mo. Evaluate which tool your team actually prefers before switching.`,
        });
      }
    }
  }

  // Check for Cursor + Copilot overlap for coding
  const cursorEntry = tools.find(
    (t) => t.tool === "cursor" && t.plan !== "Hobby"
  );
  const copilotEntry = tools.find((t) => t.tool === "github_copilot");

  if (cursorEntry && copilotEntry && (useCase === "coding" || useCase === "mixed")) {
    const cheaperTool =
      cursorEntry.monthlySpend <= copilotEntry.monthlySpend
        ? copilotEntry
        : cursorEntry;
    const cheaperName = TOOL_DISPLAY_NAMES[cheaperTool.tool];

    results.push({
      tool: cheaperName,
      recommendation: "switch",
      recommendedAction: `Possible redundancy: both Cursor and GitHub Copilot provide AI code completion. Consider using only one.`,
      estimatedMonthlySavings: cheaperTool.monthlySpend,
      reasoning: `You're paying for both Cursor ($${cursorEntry.monthlySpend}/mo) and GitHub Copilot ($${copilotEntry.monthlySpend}/mo). Both provide AI-powered code completion. Most teams find one sufficient. Dropping ${cheaperName} would save $${cheaperTool.monthlySpend}/mo.`,
    });
  }

  return results;
}
