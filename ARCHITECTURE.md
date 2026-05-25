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

1. **Supabase free tier → dedicated Postgres**: At 10k audits/day, connection pooling via PgBouncer becomes necessary. Supabase Pro handles this.
2. **`/api/summary` is synchronous in the page load**: At scale I'd queue summary generation (Inngest or Upstash QStash) and deliver it via SSE or polling. No user waits on Gemini API latency.
3. **Rate limiting**: Currently in-memory per instance. At scale, move to Redis (Upstash) for distributed rate limits.
4. **OG image generation**: `/api/og` currently uses `@vercel/og` which is fast but stateless. At 10k/day fine — but caching generated images in Cloudflare R2 would eliminate redundant renders.
5. **Audit engine is CPU-bound in a serverless function**: At very high concurrency, a dedicated worker (Cloudflare Worker or a lightweight Express service) with warm instances would reduce tail latency.
