# API

All `/api/*` (except register) require session. Zod-validated. Rate-limit/CSRF to be enforced at proxy/middleware in production (see PRIVACY.md).

- POST `/api/auth/register` — {fullName,email,password,dateOfBirth,country,…consents} → 200 {ok,id}
- POST `/api/cycles` — {startDate,endDate?} → records period, recomputes alerts
- POST `/api/log-day` — {date,flow?,symptoms[],mood?,painScore?,painLocations[],medication?,notes?}
- GET `/api/predictions` — {stats, prediction{…,confidence,fertilityDisclaimer}}
- POST `/api/chat` — {message,conversationId?,shameFree?} → {reply,conversationId}; GET lists; DELETE?id=
- POST `/api/reports` — {range:last_cycle|3m|6m|12m} → {id,summary}; GET `/api/reports/[id]/pdf` → PDF download
- GET `/api/account/export` → full JSON; POST `/api/account/delete` → cascade delete
- POST `/api/settings` — privacyMode, neutralNotifications, pin
