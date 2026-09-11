# HerCycle AI — Track. Understand. Ask. Care.

Secure, modern menstrual-cycle tracking + supportive AI companion (MVP, Phase 1).

**Safety first:** educational information only. No diagnosis. Cautious alerts. Urgent escalation.
**Privacy first:** user controls data — export/delete, private mode, neutral notifications, audited access.

## Quick start
1. `cp .env.example .env` and set `DATABASE_URL`, `NEXTAUTH_SECRET`.
2. `docker compose up -d db` (or point DATABASE_URL at any Postgres).
3. `npm install && npx prisma migrate dev && npm run prisma:seed && npm run dev`
4. Open http://localhost:3000 · Demo: `demo@hercycle.ai / DemoPass123` (demo data only, never mixed with real users).

## MVP includes (Phase 1)
Registration/login (NextAuth credentials + bcrypt), profile, period/symptom/mood/pain logging, calendar, history, prediction service, health-pattern alerts (config-driven, non-diagnostic), Her Companion AI (provider abstraction, safety system prompt, urgent escalation), reports (JSON + PDF), notifications prefs + privacy controls, vault stub, education library, onboarding, landing page.

## Scripts
`npm run dev|build|start|test|prisma:seed`

## Docs
ARCHITECTURE.md · DATABASE.md · API.md · AI-SAFETY.md · PRIVACY.md · HEALTH-RULES.md · DEPLOYMENT.md · TESTING.md

## Disclaimer
“HerCycle AI provides menstrual tracking, educational information, and supportive health insights. It does not provide medical diagnosis, treatment, or emergency services. Predictions and alerts are based on information you record and may not be accurate. Contact a qualified healthcare professional for medical concerns.”
