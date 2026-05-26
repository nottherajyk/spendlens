# User Interviews — SpendLens

Three interviews conducted May 22–26, 2026. Each was 10–15 minutes via DM/call.

---

## Interview 1 — AK, Engineering Manager, Series A SaaS (~30 people)

**Date:** May 22, 2026 | **Medium:** 15-min Zoom call

AK manages a team of 8 engineers. His company pays for GitHub Copilot Business (8 seats), ChatGPT Team (8 seats), and one engineer uses Cursor Pro individually (expensed).

**Quotes:**
- "I know we're probably paying for too much AI stuff but I have no idea what the benchmark is."
- "We have ChatGPT Team and at least 3 people barely use it. But I don't know how to justify cancelling it — what if someone needs it?"
- "If something told me 'you're 40% above average for teams your size' I'd probably act on that."

**Most surprising thing:** He didn't know his company had both ChatGPT Team AND direct Anthropic API access set up by a different engineer. He was paying for overlapping tools without realizing it.

**What it changed about my design:** Added a "possible redundancy" flag in the audit engine output. Also reinforced the benchmark mode concept — the "40% above average" framing is more motivating than absolute savings numbers.

---

## Interview 2 — SR, Solo Founder, pre-revenue side project (~6 months in)

**Date:** May 24, 2026 | **Medium:** DM on X, then voice note exchange

SR is building a B2B research tool solo. She pays for Claude Pro ($20) and Cursor Pro ($20). Total AI spend: $40/mo.

**Quotes:**
- "I'm not worried about $40/mo. The problem is when I scale up and suddenly I'm at $400 and I don't know why."
- "I'd want something that I can set up now and check back in 6 months to see if I've drifted."
- "The shareable link idea is nice — I could send it to my co-founder and be like 'here's our situation.'"

**Most surprising thing:** She explicitly said she *doesn't want* to be pushed toward Credex until she's at a spending level where it matters. She'd feel manipulated if a tool designed to help her also pushed products at her current (small) spend level.

**What it changed about my design:** Made the `<$100/mo savings` state explicitly supportive ("You're spending well") rather than trying to manufacture urgency. Also confirmed the "notify me when optimizations apply" CTA for this segment.

---

## Interview 3 — PD, Founder-CTO, 6-person data/analytics startup (Seed stage)

**Date:** May 27, 2026 | **Medium:** 12-min phone call

PD's team of 5 engineers uses a mix of OpenAI API Direct (high usage, ~$600/mo), Claude Pro for 3 people ($60/mo), and GitHub Copilot Business ($95/mo).

**Quotes:**
- "I don't want to know what I *could* save. I want to know what I'm *wasting right now.*"
- "The OpenAI bill is the one that scares me because it's variable. Every month is different."
- "If you can tell me which specific model calls are expensive and whether there's a cheaper model that would be fine for that use case — that's the product."

**Most surprising thing:** He was less interested in switching tools than in optimizing within tools. The audit's "switch to a cheaper alternative" framing was less compelling to him than "here's where you're using expensive models when cheaper ones would work." This is a different product (usage analytics, not plan comparison) — but the insight sharpened my understanding of what this MVP is and isn't.

**What it changed about my design:** Added a note in the API Direct audit output: "Variable API spend needs usage-level analytics that this tool doesn't provide — consider Helicone or a cost dashboard alongside this audit." Honest about the tool's scope rather than overpromising.
