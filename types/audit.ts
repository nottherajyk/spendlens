export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

export type ToolName =
  | "cursor"
  | "github_copilot"
  | "claude"
  | "chatgpt"
  | "anthropic_api"
  | "openai_api"
  | "gemini"
  | "windsurf";

export type Recommendation = "stay" | "downgrade" | "switch" | "check_credits";

export interface ToolEntry {
  tool: ToolName;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditInput {
  teamSize: number;
  useCase: UseCase;
  tools: ToolEntry[];
}

export interface ToolAudit {
  tool: string;
  currentPlan: string;
  currentMonthlySpend: number;
  recommendation: Recommendation;
  recommendedAction: string;
  estimatedMonthlySavings: number;
  reasoning: string;
}

export interface AuditResult {
  id?: string;
  teamSize: number;
  useCase: UseCase;
  tools: ToolAudit[];
  totalCurrentSpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  createdAt?: string;
}

export interface LeadInput {
  email: string;
  company?: string;
  role?: string;
  teamSize?: number;
  auditId: string;
  website?: string; // honeypot field
}

export interface AuditRow {
  id: string;
  team_size: number;
  use_case: UseCase;
  tools: ToolAudit[];
  total_current_spend: number;
  total_monthly_savings: number;
  total_annual_savings: number;
  created_at: string;
  email?: string;
  company?: string;
}
