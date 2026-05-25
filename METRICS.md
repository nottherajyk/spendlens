# Metrics — SpendLens

## North Star Metric

**Qualified audits completed per week** — defined as an audit where the user entered ≥2 tools, a team size, and a use case (i.e., not a test or partial fill).

Why: This metric captures genuine product-market fit. A completed audit means a real user got real value. It correlates directly with lead quality for Credex and drives all downstream outcomes (email captures, consultation bookings, credit purchases). DAU or pageviews would reward superficial traffic; completed audits reward actual utility delivered.

## 3 Input Metrics

1. **Form completion rate** (step 3 submits ÷ step 1 starts) — measures whether the UX is clear enough for users to finish. If this drops below 40%, the form has a friction problem.

2. **High-savings audit rate** (audits with >$500/mo savings ÷ total qualified audits) — measures whether the tool is reaching the right users (teams with real spend). If this is consistently low (<10%), the tool is attracting the wrong audience (too many solo users on free plans).

3. **Email capture rate** (email submissions ÷ qualified audits) — measures whether the results page is delivering enough perceived value to earn the email. Target: ≥20%.

## What I'd Instrument First

1. **Funnel drop-off per form step** — using a simple event on each "Next" click. Step 1→2→3→Submit. Find where people abandon.
2. **Time on results page** — a proxy for engagement. If average time is <20 seconds, users aren't reading the audit. If it's >3 minutes, they're probably forwarding it to someone.
3. **Share button click rate** — this is the viral loop measurement. If <2% of users click share, the shareable URL feature has no flywheel.

## Pivot Trigger

If, after 500 qualified audits: email capture rate is <8% AND high-savings audit rate is <8%.

This would mean: (a) the results page isn't compelling enough to earn the lead, AND (b) the tool is consistently reaching users with no real overspend. Both together suggest the product is solving a problem that isn't actually painful enough to act on — the pivot would be toward a different use case (e.g., procurement tool for finance teams, not self-serve for EMs).
