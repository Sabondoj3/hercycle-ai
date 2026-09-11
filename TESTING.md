# Testing

`npm test` (vitest) — `tests/safety.test.ts` covers cycle math, prediction gating, alert wording (no-diagnosis assertion across all rule combinations), urgent-disclosure regex, password policy.

Add before production: authz tests per route (user A cannot read user B), deletion-cascade test, report-PDF test, AI red-team prompts, rate-limit tests. `npm run lint && npm run build` in CI.
