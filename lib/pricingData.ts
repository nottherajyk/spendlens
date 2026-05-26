// Pricing data for all supported AI tools
// All prices are per user/seat per month unless noted
// Sources verified week of May 21–27, 2026 — see PRICING_DATA.md for URLs

export const PRICING: Record<string, Record<string, number>> = {
  cursor: {
    Hobby: 0,
    Pro: 20,
    Business: 40,
    Enterprise: 0, // custom — flag for manual review
  },
  github_copilot: {
    Individual: 10,
    Business: 19,
    Enterprise: 39,
  },
  claude: {
    Free: 0,
    Pro: 20,
    Max: 100,
    Team: 30, // per seat
    Enterprise: 0, // custom
    "API Direct": 0, // usage-based
  },
  chatgpt: {
    Plus: 20,
    Team: 30, // per seat
    Enterprise: 0, // custom
    "API Direct": 0, // usage-based
  },
  anthropic_api: {
    "API Direct": 0, // usage-based — claude-sonnet-4: $3/MTok input, $15/MTok output
  },
  openai_api: {
    "API Direct": 0, // usage-based — gpt-4o: $2.50/MTok input, $10/MTok output
  },
  gemini: {
    Pro: 19.99,
    Ultra: 0, // custom workspace pricing
    API: 0, // usage-based
  },
  windsurf: {
    Free: 0,
    Pro: 15,
    Team: 35,
  },
};

// Tool display names for UI
export const TOOL_DISPLAY_NAMES: Record<string, string> = {
  cursor: "Cursor",
  github_copilot: "GitHub Copilot",
  claude: "Claude",
  chatgpt: "ChatGPT",
  anthropic_api: "Anthropic API",
  openai_api: "OpenAI API",
  gemini: "Gemini",
  windsurf: "Windsurf",
};

// Tool definitions with available plans
export const TOOLS: Record<string, { plans: string[] }> = {
  cursor: { plans: ["Hobby", "Pro", "Business", "Enterprise"] },
  github_copilot: { plans: ["Individual", "Business", "Enterprise"] },
  claude: {
    plans: ["Free", "Pro", "Max", "Team", "Enterprise", "API Direct"],
  },
  chatgpt: { plans: ["Plus", "Team", "Enterprise", "API Direct"] },
  anthropic_api: { plans: ["API Direct"] },
  openai_api: { plans: ["API Direct"] },
  gemini: { plans: ["Pro", "Ultra", "API"] },
  windsurf: { plans: ["Free", "Pro", "Team"] },
};
