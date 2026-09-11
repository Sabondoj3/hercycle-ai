# Architecture

Next.js 14 App Router + TypeScript + Tailwind. PostgreSQL + Prisma. NextAuth (credentials/JWT). Zod validation. jsPDF server-side reports. Recharts-ready (add charts in Insights — data endpoints exist).

- `src/lib/cycle.ts` — cycle math + `predictNext()` (avg-based, confidence low/moderate/high/insufficient). Prediction service interface ready for ML later.
- `src/lib/health-rules.ts` + `src/data/health-rules.json` — config-driven screening engine. `evaluateRules()` returns cautious alerts only.
- `src/lib/ai-provider.ts` — `AIProvider` interface (mock + vendor stubs for openai/anthropic/gemini). Only minimal context (counts/averages) sent; never vault docs or full notes.
- Routes: `/api/auth/register`, `/api/cycles`, `/api/log-day`, `/api/predictions`, `/api/chat`, `/api/reports(+/[id]/pdf)`, `/api/account/export|delete`, `/api/settings`.
- i18n via `src/lib/i18n.ts` string table (en now; add hi/fr/etc. without touching components).
- Privacy: private mode, neutral notifications, quick-hide pattern, PIN hash field, audit logs.
