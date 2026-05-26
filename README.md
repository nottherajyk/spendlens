# SpendLens — AI Spend Audit Tool

SpendLens helps startup founders and engineering managers discover where they're overpaying for AI tools, what to switch or downgrade, and how much they'd save — in under 2 minutes, no login required.

**Live demo:** [https://spendlens.vercel.app](https://spendlens.vercel.app)

## Screenshots

[Embed 3 screenshots or Loom link here]

## Quick Start

```bash
git clone https://github.com/nottherajyk/spendlens
cd spendlens
npm install
cp .env.example .env.local   # fill in SUPABASE_URL, SUPABASE_ANON_KEY, GEMINI_API_KEY, RESEND_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Supabase Database Setup

SpendLens relies on two Postgres tables: `audits` (to store calculation results) and `leads` (to capture leads). 

1. Go to your **Supabase Dashboard** -> **SQL Editor**.
2. Click **New Query**.
3. Copy the entire contents of [supabase/schema.sql](file:///D:/Credex%20project/spendlens/supabase/schema.sql) and paste them into the SQL Editor.
4. Click **Run** to execute the script. 

This will automatically create both tables, establish the relationships, and configure secure Row Level Security (RLS) policies to protect PII (like email and company details) from public read requests.

**Deploy:**
Push to `main` — Vercel picks it up automatically. Set the same env vars in the Vercel dashboard.

## Decisions

1. **Next.js App Router over Pages Router** — Server Components let me generate the audit result page and OG tags server-side without a separate API call, keeping cold-start latency low. Tradeoff: App Router's caching semantics are still tricky; I hit a stale-data bug on Day 4 that cost me 3 hours.

2. **Deterministic audit engine, no AI for the math** — I considered using an LLM to evaluate spend, but the audit logic has to be auditable by a finance person. An LLM producing "you could save ~$X" without traceable arithmetic is a liability. The AI is confined to the narrative summary, where imprecision is acceptable.

3. **Supabase over Firebase** — Postgres gives me SQL queries for the analytics I'd want later (average savings by use case, conversion funnel). Firebase's document model would make those awkward. The RLS rules for stripping PII from public reads were a 30-minute setup.

4. **Honeypot over hCaptcha for abuse protection** — hCaptcha adds friction for real users, especially on mobile. Honeypot + IP rate limiting handles the realistic threat model (scrapers, not determined adversaries). Documented in GTM.md. If abuse becomes real I'd layer in hCaptcha.

5. **localStorage for form persistence over URL params** — URL params would enable shareable mid-fill states but expose spend data in browser history and server logs. localStorage is private to the browser, which is the right default for financial input. Tradeoff: doesn't work across devices — acceptable for a first-pass MVP.
