# Go-To-Market — SpendLens

## Exact Target User

**Primary:** Engineering Manager at a 10–50 person Series A/B startup.
They approve the AI tooling budget (usually $500–$5k/mo), get the invoices, and occasionally wonder if the spend is justified — but have no benchmark and no time to audit it manually. They're not the CFO (who'd care more), not the ICs (who just use the tools), but the person in between who has both the authority and the anxiety.

**Secondary:** Founder-CTO at a bootstrapped or pre-seed startup, 1–5 people. They're paying for multiple tools themselves, often on autopilot, and the sticker shock comes quarterly when they look at the credit card statement.

## What They Google / Scroll Before They'd Want This

- "cursor vs github copilot cost comparison"
- "how much should a startup spend on AI tools per developer"
- "reduce AI tool costs startup"
- Scrolling their Stripe invoice dashboard and noticing line items they forgot about
- Reading a HN thread about someone switching from ChatGPT Team to Claude Team

## Where They Hang Out Online

- **r/startups**, **r/SaaS** — cost-cutting threads get high engagement from this persona
- **Hacker News** — Show HN and Ask HN posts about spend optimization do well
- **Indie Hackers** — especially "how I cut my SaaS costs" posts in the feed
- **X / Twitter** — following accounts like @levelsio, @andreasklinger, @swyx — people who write about the economics of building
- **Slack:** Ramen Club, Founder Summit, OnDeck alumni Slack — EMs share tools in #tools channels
- **Discord:** buildspace (now nights and weekends), Latent Space Discord

## First 100 Users in 30 Days, $0 Budget

Week 1:
- Post on Hacker News on a Tuesday at 9:15 AM EST (right when people are settling in and procrastinating on their first coding task). Title: "Show HN: SpendLens – free AI spend auditor for startup teams." Keep the post text completely raw: explain why the pricing is hard to calculate manually, and list the 8 tools we support. Target: 15-30 upvotes, 20 completions.
- Cold DM 20 startup founders and EMs on X (specifically targeting those who have posted about their AI bills or are building in the AI space). Offer a simple, no-friction check: "Hey, built this quick tool to check for overpay on Claude/Cursor seats. No login, takes 1 min. Would love your raw feedback." Target: 5 completions.

Week 2:
- Post in r/SaaS and r/startups on a Wednesday morning before the EM standups (around 8:45 AM EST). Title: "I was sick of paying for redundant Claude + ChatGPT seats for my 5-person team, so I spent my weekend writing an audit engine." Tell the personal story of finding $140/mo in waste. Real developer pain converts 3x better than generic tool pitches.
- Post a milestone update on Indie Hackers: "How I built SpendLens in a week to solve my own AI subscription clutter."

Week 3:
- If we have gathered data from at least 15 completed audits, write an X thread sharing aggregate insights: "I audited 15 startup AI stacks this month. Here's exactly where they are wasting money (average: $240/mo)." Break down the specific findings: e.g., teams paying for ChatGPT Team seats for people who only use the API, or duplicate Windsurf + Cursor subscriptions. Real numbers draw organic shares.
- Email the writers of developer/SaaS newsletters (like TLDR, ByteByteGo, or the tips inbox of The Pragmatic Engineer). Offer them a custom aggregate stat from our audits that they can use as a quick filler graphic.

Week 4:
- Package our anonymized data into a raw markdown file called `state_of_ai_spend_2026.md` and upload it to GitHub, then share the repo link on Hacker News and X. Developers love raw data over glossy PDF marketing reports.

## Unfair Distribution Channel

Credex has a list of active users who already bought discounted API credits. They are highly cost-conscious and already trust the brand. Sending a single raw plain-text email to this list ("Hey, we built a free weekend project to audit your subscription seats in 2 minutes. No login, let us know if it finds any duplicate seats") will generate 100+ highly qualified audits on Day 1 for $0. It's the perfect warm-start.

## Week-1 Traction if This Works

- ≥200 completed audits
- ≥40 email captures (20% capture rate on completions)
- ≥3 Credex consultations booked from high-savings audits
- ≥1 organic share that drives ≥20 secondary completions (shows the shareable URL is working)
- ≥1 HN comment referencing the tool without being asked
