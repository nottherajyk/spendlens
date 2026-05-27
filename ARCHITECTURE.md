# Architecture — SpendLens

## System Diagram

```mermaid
flowchart LR
    User -->|fills form| SpendForm
    SpendForm -->|POST /api/audit| AuditAPI
    AuditAPI -->|run auditEngine| AuditEngine
    AuditEngine -->|deterministic rules| PricingData
    AuditAPI -->|insert row| Supabase[(Supabase / Postgres)]
    AuditAPI -->|return auditId| SpendForm
    SpendForm -->|redirect| AuditResultPage[/audit/id]
    AuditResultPage -->|SELECT by id| Supabase
    AuditResultPage -->|POST /api/summary| SummaryAPI
    SummaryAPI -->|Gemini API| Gemini[(Google Gemini)]
    SummaryAPI -->|fallback if error| TemplatedSummary
    AuditResultPage -->|render| User
    User -->|submits email| LeadCaptureModal
    LeadCaptureModal -->|POST /api/leads| LeadsAPI
    LeadsAPI -->|upsert| Supabase
    LeadsAPI -->|sendEmail| Resend[(Resend)]
```

## Data Flow

1. User fills the spend form. State is mirrored to `localStorage` on every keystroke.
2. On submit, the browser POSTs `{ tools: [...], teamSize, useCase }` to `/api/audit`.
3. `/api/audit` calls `auditEngine(input)` — a pure function with no I/O — and receives a structured `AuditResult`.
4. The result is inserted into Supabase `audits` table. The row gets a UUID. The API returns `{ id }`.
5. The browser redirects to `/audit/[id]`.
6. The Next.js Server Component fetches the audit row from Supabase (PII columns excluded by RLS policy).
7. In parallel (client-side after hydration), `/api/summary` is called with the audit payload to generate the AI summary paragraph.
8. The page renders. If the user clicks "Email me this report," a modal opens and POSTs to `/api/leads`.

## Stack Choices

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14 App Router | Server components for OG tags and SSR; Vercel-native deploy |
| Language | TypeScript | Type safety on the audit engine is critical — savings calculations must not silently coerce |
| Styling | Tailwind + shadcn/ui | Fast iteration; shadcn gives me accessible primitives without fighting a CSS framework |
| Database | Supabase (Postgres) | SQL for future analytics; RLS makes PII stripping declarative |
| AI | Google Gemini 1.5 Flash | Fast, free tier available, good at concise structured summaries |
| Email | Resend | Simple API, great DX, free tier covers MVP |
| Deploy | Vercel | Zero-config Next.js, preview URLs for each PR |

## Scaling to 10k Audits/Day

Current bottlenecks and what I'd change:

1. **Supabase free tier connection exhaustion**: At 10k audits/day, the Supabase free tier connection limit will crash under peak concurrent form submissions. We need to move to Supabase Pro and utilize a connection pooler like PgBouncer, or rewrite `/api/audit` to insert rows via a background message queue rather than synchronous direct Postgres inserts.
2. **`/api/summary` synchronous API calls**: Right now, `/api/summary` calls Gemini 1.5 Flash in real time on client render. At scale, the Gemini rate limits on the free tier would trigger 429s instantly. I'd queue summary generation in the background (using Upstash QStash or Inngest) as soon as the audit is created, store the text in the `audits` table, and have the frontend page component read it directly from the database or poll for it.
3. **In-memory rate limiting bypass**: The `/api/leads` and `/api/summary` endpoints currently use an in-memory IP map in Next.js Serverless Functions (`lib/rateLimit.ts`). Since serverless containers cold-start, recycle, and duplicate across Vercel nodes, this rate limiter is highly unreliable and easily bypassed. At scale, we must move to a distributed Redis store (like Upstash) to sync IP request counts globally.
4. **On-the-fly OG image generation cost**: Our dynamic share links on `/audit/[id]` currently trigger `@vercel/og` image generation on every Slack/X link-preview fetch. At 10k audits/day, this will spike Vercel Serverless Function execution costs. We must generate the OG SVG file once, cache the final PNG permanently in a Supabase Bucket or Cloudflare R2, and rewrite the `<meta>` tag to point to that static CDN URL.
5. **Database write blocking HTTP responses**: Our `auditEngine` is synchronous and extremely fast, but the synchronous database write to `audits` in `/api/audit` blocks the client response. To scale, we could return the generated UUID immediately to the client to trigger the redirect, and perform the Postgres write asynchronously as a background promise or offload it to an edge worker queue, keeping HTTP response times under 50ms.
