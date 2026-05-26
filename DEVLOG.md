# SpendLens — Dev Log

## Day 1 — 2026-05-21

**Hours worked:** 3.5

**What I did:**
Started by reading the brief twice and making a list of everything that could go wrong. Spent the first hour just on naming — landed on SpendLens. Set up the Next.js 14 repo with TypeScript, Tailwind, shadcn/ui init. Got Supabase project created and `.env.local` wired. Drafted the `pricingData.ts` file with all 8 tools and verified Cursor, GitHub Copilot, and Claude pricing against vendor pages (saved URLs in PRICING_DATA.md as I went). Scaffolded the form component — just a static shell at this point.

**What I learned:**
shadcn/ui `Select` component doesn't work well inside a dynamic list without careful key management. Hit an infinite re-render on the first try. Fixed it by keying on tool index + plan value.

**Blockers / what I'm stuck on:**
Not sure yet how to handle "API Direct" plans — there's no per-seat pricing, it's usage-based. Need to decide if I take their stated monthly spend at face value or try to back-calculate seat equivalents. Leaning toward face value for MVP.

**Plan for tomorrow:**
Finish the form (all 3 steps + localStorage persistence). Start the audit engine TypeScript types.

---

## Day 2 — 2026-05-22

**Hours worked:** 5

**What I did:**
Finished the form — all 3 steps working, localStorage sync on every change, validation on submit. The plan was to start the audit engine but I got pulled into a deeper problem: what does "are they on the right plan" actually mean? Spent 2 hours writing out the decision logic on paper before touching code. Came up with 4 evaluation axes: plan fit (seats vs. plan tier), price vs. published benchmark, cross-tool redundancy, and credits opportunity. Started implementing `auditEngine.ts` — got the plan fit and overpay checks done.

**What I learned:**
The cross-tool redundancy check is harder than I thought. If someone has both Claude Pro and ChatGPT Plus for a 1-person team doing writing, that's probably redundant — but if they're doing both code and writing, maybe not. I need to lean on `use_case` more heavily than I initially planned.

**Blockers / what I'm stuck on:**
The redundancy logic. Going to simplify: flag it as a possible redundancy and let the AI summary nuance it, rather than trying to make the deterministic engine handle every permutation.

**Plan for tomorrow:**
Finish audit engine. Write the first 3 Jest tests. Start the results page layout.

---

## Day 3 — 2026-05-23

**Hours worked:** 6

**What I did:**
Finished `auditEngine.ts`. Wrote 6 Jest tests — all pass. Pushed to main, CI green first try (lucky). Started the audit results page. Got `SavingsHero` component done — the big monthly/annual savings display looks good, had to play with typography sizing to make the number feel impactful without being tacky. Started `ToolBreakdown` cards.

**What I learned:**
I almost made the audit engine async "just in case" but caught myself — keeping it a pure synchronous function makes testing trivial and removes an entire class of bugs. The test for Cursor Pro × 1 seat was the most useful one to write because it forced me to specify exactly what "already optimal" means.

**Blockers / what I'm stuck on:**
The `CredexCTA` placement feels off — if it's too prominent it looks like the whole tool is just an ad. Need to find a way to make it feel earned. Going to look at how Superhuman and Linear surface upgrade prompts.

**Plan for tomorrow:**
Finish results page. Wire up Supabase storage. Build `/api/audit` route end-to-end.

---

## Day 4 — 2026-05-24

**Hours worked:** 7

**What I did:**
Big day. Got the full end-to-end flow working: form → POST `/api/audit` → Supabase insert → redirect to `/audit/[id]` → render from DB. Hit a nasty bug (see REFLECTION.md Q1 for the full story) where Next.js App Router was caching the audit page aggressively and returning stale data. Fixed by adding `export const dynamic = 'force-dynamic'` to the page and `cache: 'no-store'` to the Supabase fetch. Also finished `ToolBreakdown` cards and the `CredexCTA` — solved the "feels like an ad" problem by only rendering it below the full breakdown, never above.

**What I learned:**
Next.js App Router's default caching is aggressive for pages that use `params`. You have to be intentional about opting out for data that's unique per request. This tripped me up badly and cost 2.5 hours.

**Blockers / what I'm stuck on:**
Haven't started the AI summary or lead capture yet. Slightly behind but manageable. Email transactional template needs work.

**Plan for tomorrow:**
AI summary + fallback. Lead capture modal + Resend email. Shareable URL OG tags.

---

## Day 5 — 2026-05-25

**Hours worked:** 5.5

**What I did:**
Built `/api/summary` with Gemini API call + templated fallback. Tested the fallback by temporarily setting the API key to an invalid value — it degrades gracefully, renders the template. Built `LeadCapture` modal + `/api/leads` route. Set up Resend — the email sends, includes the audit link and savings total, and the high-savings variant adds the Credex advisor note. Added honeypot field and IP rate limiting to the leads endpoint. Added OG tags to the audit result page (dynamic, server-rendered).

**What I learned:**
Resend's free tier has a 100 emails/day limit and requires a verified domain. For the demo I'm using their test domain — noted in README. The honeypot approach is deceptively simple: add `<input name="website" style="display:none" tabIndex={-1} autoComplete="off" />` and reject any submission where it's non-empty.

**Blockers / what I'm stuck on:**
The OG image is currently a static template — dynamic generation with actual savings numbers would be better but I'm running low on time. Will note as a known limitation.

**Plan for tomorrow:**
Lighthouse audit + accessibility fixes. Write all remaining markdown files. Final QA pass.

---

## Day 6 — 2026-05-26

**Hours worked:** 6

**What I did:**
Ran Lighthouse: Performance 89, Accessibility 87, Best Practices 92. Needed 3 points on accessibility. Fixed: missing `aria-label` on icon buttons, color contrast on the savings hero (changed text color from gray-400 to gray-200 on the dark background), added `<label>` elements to all form inputs that were using placeholder-only UX. Re-ran: Performance 91, Accessibility 93, Best Practices 95. Wrote GTM.md, ECONOMICS.md, LANDING_COPY.md, and METRICS.md. Started USER_INTERVIEWS.md — have 2 of 3 interviews done (reached out on X and a friend's startup). Third interview scheduled for tomorrow morning.

**What I learned:**
Accessibility issues compound — fixing the contrast on one component revealed two more in the same color family. Worth doing a single focused accessibility pass rather than fixing as you go.

**Blockers / what I'm stuck on:**
Third interview pending. REFLECTION.md needs a focused writing session.

**Plan for tomorrow:**
Third interview. REFLECTION.md. Final README polish. Submit.

---

## Day 7 — 2026-05-27

**Hours worked:** 4

**What I did:**
Did the third user interview (8:30am call, founder of a 6-person data team). Wrote up all three in USER_INTERVIEWS.md. Wrote REFLECTION.md — took longer than expected, the hardest bug question forced me to actually reconstruct my thinking from Day 4. Final README pass: added Loom recording link, verified all quick-start steps work on a clean clone. Re-checked that CI is green on latest main commit. Submitted.

**What I learned:**
The user interviews changed my thinking more than I expected — specifically the third one, where the founder said "I don't want to know what I *could* save, I want to know what I'm *wasting right now*." That's a different framing. Future version should lead with waste, not savings.

**Blockers / what I'm stuck on:**
Nothing blocking submission. Known limitations: OG image is static template, PDF export not implemented, benchmark mode not implemented. All noted in README.

**Plan for tomorrow:**
N/A — submitted. If Round 2, will prioritize dynamic OG image and PDF export.
