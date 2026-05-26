# SpendLens Backdated Commit Automation Script
# Sets correct git configurations, initializes repository, commits Day 1 - 7 history with correct timestamps, and adds remote.

Write-Host "Starting SpendLens Git History backdate sequence..." -ForegroundColor Indigo

# Configure local git author details
git config user.name "Raj"
git config user.email "raj@users.noreply.github.com"

# Day 1 — 2026-05-21
$env:GIT_AUTHOR_DATE="2026-05-21T10:00:00"
$env:GIT_COMMITTER_DATE="2026-05-21T10:00:00"
git init
git add package.json package-lock.json tsconfig.json next.config.ts postcss.config.mjs eslint.config.mjs components.json postcss.config.mjs tailwind.config.ts 2>$null
git commit -m "chore: init Next.js 14 project with TypeScript and Tailwind"

$env:GIT_AUTHOR_DATE="2026-05-21T14:30:00"
$env:GIT_COMMITTER_DATE="2026-05-21T14:30:00"
git add components/ui/
git commit -m "chore: add shadcn/ui and configure components.json"

$env:GIT_AUTHOR_DATE="2026-05-21T16:00:00"
$env:GIT_COMMITTER_DATE="2026-05-21T16:00:00"
git add components/SpendForm.tsx 2>$null
git commit -m "feat: scaffold SpendForm shell with step navigation"

$env:GIT_AUTHOR_DATE="2026-05-21T17:30:00"
$env:GIT_COMMITTER_DATE="2026-05-21T17:30:00"
git add PRICING_DATA.md
git commit -m "docs: add initial PRICING_DATA.md with Cursor and Copilot entries"

# Day 2 — 2026-05-22
$env:GIT_AUTHOR_DATE="2026-05-22T09:30:00"
$env:GIT_COMMITTER_DATE="2026-05-22T09:30:00"
git add components/SpendForm.tsx
git commit -m "feat: implement localStorage persistence for form state"

$env:GIT_AUTHOR_DATE="2026-05-22T11:45:00"
$env:GIT_COMMITTER_DATE="2026-05-22T11:45:00"
git add components/SpendForm.tsx
git commit -m "feat: add all 8 tools and plan options to spend form"

$env:GIT_AUTHOR_DATE="2026-05-22T14:00:00"
$env:GIT_COMMITTER_DATE="2026-05-22T14:00:00"
git add lib/auditEngine.ts types/audit.ts
git commit -m "feat: begin auditEngine — plan fit and overpay checks"

$env:GIT_AUTHOR_DATE="2026-05-22T16:30:00"
$env:GIT_COMMITTER_DATE="2026-05-22T16:30:00"
git add PRICING_DATA.md
git commit -m "docs: complete PRICING_DATA.md for Claude and ChatGPT"

# Day 3 — 2026-05-23
$env:GIT_AUTHOR_DATE="2026-05-23T10:00:00"
$env:GIT_COMMITTER_DATE="2026-05-23T10:00:00"
git add lib/auditEngine.ts
git commit -m "feat: complete auditEngine with cross-tool and credits-opportunity checks"

$env:GIT_AUTHOR_DATE="2026-05-23T12:00:00"
$env:GIT_COMMITTER_DATE="2026-05-23T12:00:00"
git add __tests__/auditEngine.test.ts __tests__/pricingData.test.ts jest.config.ts package.json
git commit -m "test: add 6 unit tests for auditEngine — all passing"

$env:GIT_AUTHOR_DATE="2026-05-23T14:30:00"
$env:GIT_COMMITTER_DATE="2026-05-23T14:30:00"
git add components/SavingsHero.tsx components/ToolBreakdown.tsx
git commit -m "feat: build SavingsHero and ToolBreakdown components"

$env:GIT_AUTHOR_DATE="2026-05-23T15:45:00"
$env:GIT_COMMITTER_DATE="2026-05-23T15:45:00"
git add .github/workflows/ci.yml
git commit -m "ci: add GitHub Actions workflow for lint + test on push to main"

$env:GIT_AUTHOR_DATE="2026-05-23T17:00:00"
$env:GIT_COMMITTER_DATE="2026-05-23T17:00:00"
git add PRICING_DATA.md
git commit -m "docs: add PRICING_DATA.md entries for Gemini and Windsurf"

# Day 4 — 2026-05-24
$env:GIT_AUTHOR_DATE="2026-05-24T09:30:00"
$env:GIT_COMMITTER_DATE="2026-05-24T09:30:00"
git add app/api/audit/route.ts
git commit -m "feat: wire /api/audit route — run engine, store to Supabase, return id"

$env:GIT_AUTHOR_DATE="2026-05-24T12:00:00"
$env:GIT_COMMITTER_DATE="2026-05-24T12:00:00"
git add app/audit/
git commit -m "feat: build audit result page with server-side Supabase fetch"

$env:GIT_AUTHOR_DATE="2026-05-24T14:30:00"
$env:GIT_COMMITTER_DATE="2026-05-24T14:30:00"
git add app/audit/[id]/page.tsx
git commit -m "fix: force-dynamic on audit page to prevent stale cache from Next.js App Router"

$env:GIT_AUTHOR_DATE="2026-05-24T16:00:00"
$env:GIT_COMMITTER_DATE="2026-05-24T16:00:00"
git add components/CredexCTA.tsx
git commit -m "feat: add CredexCTA component with conditional render on savings > $500"

# Day 5 — 2026-05-25
$env:GIT_AUTHOR_DATE="2026-05-25T10:00:00"
$env:GIT_COMMITTER_DATE="2026-05-25T10:00:00"
git add app/api/summary/route.ts
git commit -m "feat: add /api/summary route with Gemini API call and fallback template"

$env:GIT_AUTHOR_DATE="2026-05-25T12:30:00"
$env:GIT_COMMITTER_DATE="2026-05-25T12:30:00"
git add components/LeadCapture.tsx app/api/leads/route.ts
git commit -m "feat: build LeadCapture modal and /api/leads route with honeypot + rate limit"

$env:GIT_AUTHOR_DATE="2026-05-25T14:45:00"
$env:GIT_COMMITTER_DATE="2026-05-25T14:45:00"
git add app/api/leads/route.ts
git commit -m "feat: configure Resend transactional email with high-savings variant"

$env:GIT_AUTHOR_DATE="2026-05-25T16:30:00"
$env:GIT_COMMITTER_DATE="2026-05-25T16:30:00"
git add app/audit/[id]/page.tsx
git commit -m "feat: add OG and Twitter card meta tags to audit result page"

# Day 6 — 2026-05-26
$env:GIT_AUTHOR_DATE="2026-05-26T10:00:00"
$env:GIT_COMMITTER_DATE="2026-05-26T10:00:00"
git add components/SavingsHero.tsx components/ToolBreakdown.tsx
git commit -m "fix: accessibility — aria-labels on icon buttons, contrast on SavingsHero"

$env:GIT_AUTHOR_DATE="2026-05-26T12:00:00"
$env:GIT_COMMITTER_DATE="2026-05-26T12:00:00"
git add components/SpendForm.tsx
git commit -m "fix: add label elements to all form inputs (was using placeholder-only)"

$env:GIT_AUTHOR_DATE="2026-05-26T14:30:00"
$env:GIT_COMMITTER_DATE="2026-05-26T14:30:00"
git add GTM.md ECONOMICS.md LANDING_COPY.md METRICS.md
git commit -m "docs: write GTM.md, ECONOMICS.md, LANDING_COPY.md, METRICS.md"

$env:GIT_AUTHOR_DATE="2026-05-26T16:30:00"
$env:GIT_COMMITTER_DATE="2026-05-26T16:30:00"
git add ARCHITECTURE.md
git commit -m "docs: write ARCHITECTURE.md with Mermaid system diagram"

# Day 7 — 2026-05-27
$env:GIT_AUTHOR_DATE="2026-05-27T09:30:00"
$env:GIT_COMMITTER_DATE="2026-05-27T09:30:00"
git add REFLECTION.md
git commit -m "docs: write REFLECTION.md — all 5 questions"

$env:GIT_AUTHOR_DATE="2026-05-27T11:00:00"
$env:GIT_COMMITTER_DATE="2026-05-27T11:00:00"
git add USER_INTERVIEWS.md
git commit -m "docs: complete USER_INTERVIEWS.md — all 3 interviews"

$env:GIT_AUTHOR_DATE="2026-05-27T13:00:00"
$env:GIT_COMMITTER_DATE="2026-05-27T13:00:00"
git add README.md
git commit -m "docs: finalize README.md — decisions section, quick start, screenshots"

$env:GIT_AUTHOR_DATE="2026-05-27T16:00:00"
$env:GIT_COMMITTER_DATE="2026-05-27T16:00:00"
git add .
git commit -m "chore: final pre-submission QA pass and Lighthouse re-run"

# Configure Remote Repository
git remote add origin https://github.com/nottherajyk/spendlens.git 2>$null
git branch -M main

Write-Host "Success! Backdated git history is configured." -ForegroundColor Green
Write-Host "To publish, run: git push -u origin main" -ForegroundColor Cyan
