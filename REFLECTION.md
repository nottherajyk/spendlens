# Reflection — SpendLens

## 1. The hardest bug I hit this week

On Day 4, after getting the full end-to-end flow working for the first time, I noticed that navigating to `/audit/[id]` for a newly created audit would sometimes render data from a previous audit. My first hypothesis was a bug in the Supabase query — maybe I was reading the wrong row ID. I added a `console.log` of the `id` param in the Server Component and confirmed it was the correct UUID. But the rendered data was still wrong.

My second hypothesis was a JavaScript closure issue — maybe `id` was being captured from a stale closure in a `useEffect`. But this was a Server Component with no client-side data fetching, so closures weren't the issue.

After 45 minutes, I started suspecting Next.js caching. I checked the Network tab in DevTools and saw the page was returning a `200` with `Age: 47` in the response headers — it was a cached response. Next.js App Router was caching the page at the CDN edge even though the data was unique per request.

The fix was two lines: `export const dynamic = 'force-dynamic'` at the top of `page.tsx` and `cache: 'no-store'` in the Supabase fetch options. Both were necessary — the first prevents static generation, the second prevents the fetch cache layer from reusing a prior response.

What I should have caught earlier: any page with genuinely unique data per `params` should default to `force-dynamic`. I didn't think about this at the start because I was thinking of the page as "just rendering from a database" — but Next.js doesn't know that two different UUIDs mean two different pages unless you tell it.

## 2. A decision I reversed mid-week

On Day 2, I designed the cross-tool redundancy check to be fully deterministic — the engine would flag any pair of overlapping tools (e.g., both Claude Pro and ChatGPT Plus) as redundant and recommend dropping one. I spent about an hour mapping out all the tool pairs and use-case combinations.

By Day 3, I reversed this. The problem: redundancy depends heavily on context I don't have. A solo founder using Claude for writing and ChatGPT for coding workflows via plugins isn't wasting money — they have a reason. A 3-person team paying for both tools for the same use case probably is redundant. But I can't distinguish these cases from form inputs alone.

What made me reverse it: I wrote the test case for "Claude Pro + ChatGPT Plus, use_case: mixed" and realized the engine would either always flag it (false positives for legitimate multi-tool users) or never flag it (missing the redundancy for users who genuinely don't need both). Neither was "defensible to a finance person."

The resolution: the deterministic engine notes a *possible* redundancy with a specific question ("Do both tools serve the same use case for the same people?"), and the AI summary can address it in context. This is the right division of labor — deterministic math for the clear-cut cases, language model for the ambiguous ones.

## 3. What I'd build in week 2

The user interviews surfaced one theme clearly: people want to see their spend *contextualized against their team size*. "You're spending $300/mo on AI tools" is abstract. "Your AI spend per developer is $150/mo — teams your size average $60/mo" is actionable.

Week 2 priority: **Benchmark mode**. Collect enough audit data (anonymized, aggregated) to build real percentile distributions by team size and use case. Show users where they sit in the distribution. This changes the product from "audit tool" to "industry benchmark" — a far more shareable and defensible product.

I'd also want:
- Dynamic OG image generation with actual savings numbers (currently static template)
- PDF export of the full report (high-request item from interviews)
- A Slack bot version: "SpendLens Bot will audit your team's AI spend monthly and DM the EM with a digest"
- Webhook for Credex: when a lead with >$500/mo savings submits, ping a Credex Slack channel in real time

## 4. How I used AI tools

I used Claude (claude.ai) and Cursor throughout the week. Specifically:

- **Cursor** for autocomplete while writing `auditEngine.ts` — the repetitive per-tool evaluation logic was well-suited to completion, though I reviewed every suggestion carefully because pricing math errors are silent and consequential.
- **Claude** for first drafts of the email template copy, the `LANDING_COPY.md`, and for rubber-ducking architecture decisions when I was stuck.
- **I did not trust AI** for: the pricing data (all verified manually against vendor pages), the audit engine logic (hand-written and tested), or the user interview notes (obviously).

One specific time the AI was wrong: I asked Claude to suggest the right Next.js config to disable page caching on dynamic routes. It suggested wrapping the page in `Suspense` and using `useSearchParams` to force client-side rendering. This was wrong for my use case — I needed server-side data, not client-side. The actual fix (`export const dynamic = 'force-dynamic'`) I found in the Next.js docs directly. The AI's suggestion would have broken SSR entirely.

## 5. Self-rating

| Dimension | Score | Reason |
|---|---|---|
| Discipline | 7/10 | Committed work most days but Day 5 was shorter than planned because I underestimated the Resend setup time. |
| Code quality | 7/10 | The audit engine is clean and well-typed. The API routes could use more consistent error handling. |
| Design sense | 8/10 | The results page looks good. The form is functional but could be more visually engaging. |
| Problem-solving | 8/10 | The caching bug and the redundancy logic decision both got resolved well, just not immediately. |
| Entrepreneurial thinking | 7/10 | The GTM and economics docs show real thinking. The user interviews changed my product framing in a meaningful way. |
