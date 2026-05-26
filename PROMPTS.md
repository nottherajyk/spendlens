# LLM Prompts — SpendLens

## Summary Generation Prompt

Used in `/api/summary/route.ts`. Sent to `gemini-1.5-flash`.

### System prompt

```
You are a concise, financially literate advisor helping a startup team understand their AI tool spend.
You write in clear, direct prose — no bullet points, no headers. One paragraph, approximately 100 words.
Do not use hedging language like "it seems" or "perhaps." Be specific and direct.
Do not manufacture urgency or push Credex — mention it once if savings are significant, otherwise omit.
```

### User prompt (templated with audit data)

```
Here is an AI spend audit for a team:

Team size: {{teamSize}}
Primary use case: {{useCase}}
Total current monthly spend: ${{currentTotal}}
Total potential monthly savings: ${{savingsTotal}}

Tool breakdown:
{{#each tools}}
- {{name}} ({{plan}}, {{seats}} seat(s)): ${{currentSpend}}/mo → {{recommendedAction}}. Saves ${{savings}}/mo.
{{/each}}

Write a 100-word personalized summary of this audit. Lead with the most impactful finding. Be specific about which tool and why. End with one sentence of forward-looking advice.
```

### Why I wrote it this way

The system prompt constrains two tendencies I observed in early drafts: (1) the model defaulting to bullet points, which breaks the "paragraph summary" UX intent, and (2) hedging language that reads as uncertainty in a context where the user wants confident direction.

The "mention Credex once if savings are significant" instruction prevents the summary from feeling like ad copy while still enabling the lead-gen use case.

### What I tried that didn't work

**First attempt:** No system prompt, just a user message. The model produced a bulleted list 3 out of 5 times, and frequently said things like "based on the information provided" which erodes trust.

**Second attempt:** Told the model to "be a personal CFO." The tone came out patronizing ("You really should consider..."). Removed persona framing entirely.

**Third attempt (current):** Describe the desired output format directly in the system prompt, no persona. Works consistently.

## Fallback Template (no API)

When the Gemini API returns a non-200 response, `summaryFallback(auditResult)` is called instead:

```typescript
function summaryFallback(audit: AuditResult): string {
  const { totalMonthlySavings, tools, teamSize, useCase } = audit
  const topSaving = [...tools].sort((a, b) => b.estimatedMonthlySavings - a.estimatedMonthlySavings)[0]
  
  if (totalMonthlySavings === 0) {
    return `Your ${teamSize}-person team's AI spend looks well-optimized for ${useCase} work. You're on appropriate plans across all tools with no significant waste identified. Keep an eye on seat counts as your team grows — that's typically where overages first appear.`
  }
  
  return `Your team could save $${totalMonthlySavings}/month ($${totalMonthlySavings * 12}/year) on AI tools. The biggest opportunity is ${topSaving.tool}: ${topSaving.recommendedAction}. ${totalMonthlySavings > 500 ? "At this savings level, sourcing credits through Credex could extend those savings further." : "Small adjustments now compound significantly over a year."}`
}
```
