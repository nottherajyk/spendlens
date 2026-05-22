import { PRICING } from "../lib/pricingData";

describe("Pricing Data Smoke Tests", () => {
  // Test 1: All 8 required tools present in PRICING
  test("all 8 tools present", () => {
    const requiredTools = [
      "cursor",
      "github_copilot",
      "claude",
      "chatgpt",
      "anthropic_api",
      "openai_api",
      "gemini",
      "windsurf",
    ];

    for (const tool of requiredTools) {
      expect(PRICING[tool]).toBeDefined();
    }
  });

  // Test 2: No negative prices
  test("no negative prices", () => {
    for (const tool of Object.keys(PRICING)) {
      for (const plan of Object.keys(PRICING[tool])) {
        expect(PRICING[tool][plan]).toBeGreaterThanOrEqual(0);
      }
    }
  });

  // Test 3: Cursor Pro is $20
  test("cursor Pro is $20", () => {
    expect(PRICING.cursor.Pro).toBe(20);
  });
});
