# Unit Economics — SpendLens

## What's a Converted Lead Worth to Credex?

Credex sells discounted AI credits. Assume:
- Average deal: $3,000 in credits (1 year of AI tooling for a 5–10 person team)
- Credex margin on credits: ~25% (conservative for sourced/surplus inventory)
- Gross profit per deal: $750
- If a customer renews once: LTV = $1,500

So a converted customer is worth ~$750 gross profit on first purchase, ~$1,500 if they stick around.

## CAC by Channel

| Channel | Reach | Conversion | CAC |
|---|---|---|---|
| HN Show HN | ~500 visitors, ~60 completions | 2 consultations booked → 1 deal | ~$0 + ~8 hours time |
| r/SaaS post | ~300 visitors, ~30 completions | 1 consultation → 0.5 deals | ~$0 + ~2 hours time |
| X cold DM (20 DMs) | ~5 completions | 0.5 deals expected | ~$0 + ~3 hours time |
| Existing Credex customer email | ~200 completions | 5% → Credex consult = 10 consults → 4 deals | ~$0 (existing list) |

CAC across all channels: effectively $0 cash, ~2–5 hours per deal in founder/team time. Call it $200 in loaded labor cost per deal. CAC/LTV ratio: 1:7.5.

## Conversion Funnel Required for Profitability

| Stage | Rate needed | Notes |
|---|---|---|
| Visitor → Audit completed | 30% | Defensible because the tool is free, has no login barrier, and takes under 2 minutes. We assume a 70% drop-off of casual hits who just read the landing page and don't fill out the tools list. |
| Audit completed → Email captured | 20% | Only triggered when savings > $0. If savings are $0, the user has zero incentive to submit. 20% represents the subset of users who find >$100/mo savings and want the detailed breakdown or PDF delivered. |
| Email captured → Consultation booked | 10% | This is only targeted at the high-savings cohort (>$500/mo) using the CredexCTA. A 10% book rate assumes that 1 in 10 founders who realize they are throwing away $6,000/yr will jump on a call to solve it. |
| Consultation → Credit purchase | 40% | This is Credex's historical close rate for warm inbound leads who have already verified their spend and are explicitly looking for pre-negotiated volume discounts. It would be an aggressive close rate for cold sales, but for warm inbounds it is highly realistic. |

At these rates: 1,000 visitors → 300 completions → 60 email captures → 6 consultations → 2.4 deals.
Revenue from 1,000 visitors: 2.4 × $750 = $1,800 gross profit.
At $0 CAC and ~$50 in infra costs (Vercel, Supabase database storage, Resend transactional emails) per 1,000 visitors: contribution margin per 1,000 visitors ≈ $1,750.

## Path to $1M ARR in 18 Months

$1M ARR = ~$83k gross profit/month (at 25% margin on credits; this represents gross credit sales of ~$330k/month for Credex).

At $3,000 average contract value (ACV): we need ~110 new customers per month, or ~1,320/year.

What would have to be true:
1. SpendLens drives 5,000+ completed audits/month by month 6. This requires a solid viral loop (e.g., shareable `/audit/[id]` links shared by EMs on Slack driving secondary audits) and 2-3 organic distribution channels remaining highly active.
2. High-savings audit rate stays ≥15% (15% of all completions show >$500/mo savings). At 5k completions: 750 high-savings audits → 75 consultations → 30 deals → $22,500 gross profit from SpendLens-sourced leads alone.
3. Credex supplements with direct outbound sales and partnerships to reach the remaining $60,500/month target. SpendLens is a high-utility lead magnet, not the sole engine of the company.
4. Retention: customers who save $500+/mo on AI tools have strong ongoing reasons to keep buying credits. We assume a 60% renewal rate in year 2.

The $1M ARR scenario is plausible but requires SpendLens to become a genuine top-of-funnel engine, not a one-time campaign asset. That means ongoing content, social posts using anonymized aggregate data, and probably a Slack integration or an embeddable widget to drive recurring usage.

## Honest Caveats & Risks (Why This Math Could Break)

1. **Lead Quality Drift**: If our traffic comes primarily from r/startups and Indie Hackers, the majority of completions will be solo founders with $40/mo spend. They will show $0 savings and never convert to a Credex credits consultation. The math breaks if we cannot attract Series A/B engineering managers who hold the high-spend budgets.
2. **Resend Email Sandbox Block**: If users input fake or non-existent emails, our Resend email bounce rate will spike, damaging our domain reputation and landing our transactional emails in spam folders. This would tank the 20% email-to-consultation funnel.
3. **API Pricing Compression**: If Anthropic and OpenAI cut their model prices by another 50% next quarter, the absolute savings numbers will shrink significantly. An audit showing $120/mo in savings is far less motivating to an EM than one showing $600/mo, directly reducing our consultation book rate.
4. **Tool Consolidation**: If Cursor or Copilot bundle more capabilities (e.g., Cursor fully replacing Claude Pro for all developers), the redundancy opportunities will decrease, making the audit engine less valuable over time.
