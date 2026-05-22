import { runAudit } from "../lib/auditEngine";
import { AuditInput } from "../types/audit";

describe("Audit Engine Tests", () => {
  // Test 1: Cursor Pro x 1 seat is already optimal
  test("already optimal — Cursor Pro single seat", () => {
    const input: AuditInput = {
      teamSize: 1,
      useCase: "mixed",
      tools: [
        {
          tool: "cursor",
          plan: "Pro",
          seats: 1,
          monthlySpend: 20,
        },
      ],
    };

    const result = runAudit(input);
    
    expect(result.totalMonthlySavings).toBe(0);
    expect(result.totalAnnualSavings).toBe(0);
    
    const cursorAudit = result.tools.find((t) => t.tool === "Cursor");
    expect(cursorAudit).toBeDefined();
    expect(cursorAudit?.recommendation).toBe("stay");
    expect(cursorAudit?.estimatedMonthlySavings).toBe(0);
  });

  // Test 2: Claude Team for 2 seats should downgrade to 2x Claude Pro
  test("downgrade — Claude Team for 2 users", () => {
    const input: AuditInput = {
      teamSize: 2,
      useCase: "writing",
      tools: [
        {
          tool: "claude",
          plan: "Team",
          seats: 2,
          monthlySpend: 60, // Stated spend is $60/mo
        },
      ],
    };

    const result = runAudit(input);
    
    expect(result.totalMonthlySavings).toBe(20);
    
    const claudeAudit = result.tools.find((t) => t.tool === "Claude");
    expect(claudeAudit).toBeDefined();
    expect(claudeAudit?.recommendation).toBe("downgrade");
    expect(claudeAudit?.estimatedMonthlySavings).toBe(20);
    expect(claudeAudit?.recommendedAction).toContain("individual Claude Pro");
  });

  // Test 3: GitHub Copilot Business for 1 seat should downgrade to Individual
  test("downgrade — GitHub Copilot Business for 1 user", () => {
    const input: AuditInput = {
      teamSize: 1,
      useCase: "coding",
      tools: [
        {
          tool: "github_copilot",
          plan: "Business",
          seats: 1,
          monthlySpend: 19,
        },
      ],
    };

    const result = runAudit(input);
    
    expect(result.totalMonthlySavings).toBe(9);
    
    const copilotAudit = result.tools.find((t) => t.tool === "GitHub Copilot");
    expect(copilotAudit).toBeDefined();
    expect(copilotAudit?.recommendation).toBe("downgrade");
    expect(copilotAudit?.estimatedMonthlySavings).toBe(9);
    expect(copilotAudit?.recommendedAction).toContain("Individual");
  });

  // Test 4: Cross-tool redundancy flag — ChatGPT Team and Claude Team overlap
  test("cross-tool redundancy flag — same use case", () => {
    const input: AuditInput = {
      teamSize: 10,
      useCase: "writing",
      tools: [
        {
          tool: "chatgpt",
          plan: "Team",
          seats: 10,
          monthlySpend: 300,
        },
        {
          tool: "claude",
          plan: "Team",
          seats: 10,
          monthlySpend: 300,
        },
      ],
    };

    const result = runAudit(input);
    
    // We expect the redundancy check to flag at least one of the tools for consolidation
    const chatgptAudit = result.tools.find((t) => t.tool === "ChatGPT");
    const claudeAudit = result.tools.find((t) => t.tool === "Claude");
    
    expect(
      chatgptAudit?.recommendation === "switch" || 
      claudeAudit?.recommendation === "switch"
    ).toBe(true);
    
    expect(result.totalMonthlySavings).toBeGreaterThan(0);
  });

  // Test 5: Credits opportunity for high spend
  test("credits opportunity — OpenAI API high spend", () => {
    const input: AuditInput = {
      teamSize: 5,
      useCase: "data",
      tools: [
        {
          tool: "openai_api",
          plan: "API Direct",
          seats: 1,
          monthlySpend: 800, // Spend is $800/mo (> $500/mo)
        },
      ],
    };

    const result = runAudit(input);
    
    const apiAudit = result.tools.find((t) => t.tool === "OpenAI API");
    expect(apiAudit).toBeDefined();
    expect(apiAudit?.recommendation).toBe("check_credits");
    expect(apiAudit?.recommendedAction).toContain("Credex");
  });

  // Test 6: Overpay detection
  test("overpay detection — stated spend above benchmark", () => {
    const input: AuditInput = {
      teamSize: 3,
      useCase: "mixed",
      tools: [
        {
          tool: "cursor",
          plan: "Pro",
          seats: 3,
          monthlySpend: 90, // Expect expected spend to be 3 * 20 = 60
        },
      ],
    };

    const result = runAudit(input);
    
    expect(result.totalMonthlySavings).toBe(30); // 90 - 60 = 30
    
    const cursorAudit = result.tools.find((t) => t.tool === "Cursor");
    expect(cursorAudit).toBeDefined();
    expect(cursorAudit?.recommendation).toBe("downgrade");
    expect(cursorAudit?.estimatedMonthlySavings).toBe(30);
    expect(cursorAudit?.reasoning).toContain("exceeds the published price");
  });
});
