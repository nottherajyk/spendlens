# Tests — SpendLens

All tests are in `__tests__/`. Run with:

```bash
npm test
```

Or for watch mode during development:

```bash
npm run test:watch
```

## Test Files

### `__tests__/auditEngine.test.ts`

Covers the core audit engine logic. All 6 tests must pass.

| Test | What it covers |
|---|---|
| `already optimal — Cursor Pro single seat` | Single user on Cursor Pro ($20/mo) → `recommendation: "stay"`, savings `$0` |
| `downgrade — Claude Team for 2 users` | 2 users on Claude Team ($60/mo) → recommend 2× Claude Pro ($40/mo), savings `$20` |
| `downgrade — GitHub Copilot Business for 1 user` | 1 user on GitHub Copilot Business ($19/mo) → recommend Individual ($10/mo), savings `$9` |
| `cross-tool redundancy flag — same use case` | Claude Pro + ChatGPT Plus, use_case: writing, 1 user → redundancy flag on one tool |
| `credits opportunity — OpenAI API high spend` | OpenAI API Direct, $800/mo → Credex credits flag present in recommendations |
| `overpay detection — stated spend above benchmark` | Cursor Pro × 3 seats, stated $90/mo (correct is $60) → flags possible billing anomaly |

### `__tests__/pricingData.test.ts`

Smoke tests to verify the shape of `PRICING` constant.

| Test | What it covers |
|---|---|
| `all 8 tools present` | PRICING has entries for all 8 required tools |
| `no negative prices` | All pricing values are ≥ 0 |
| `cursor Pro is $20` | Spot check a specific known value |
