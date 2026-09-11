# Database

PostgreSQL via Prisma (`prisma/schema.prisma`). UUIDs for sensitive entities. `createdAt/updatedAt` throughout.

Entities: users, user_profiles, consents, cycle_records, period_days, symptom_catalog, daily_symptoms, mood_logs, pain_logs, medication_logs, wellness_logs, user_notes, cycle_predictions, health_alerts, ai_conversations, ai_messages, notification_preferences, notifications, health_reports, uploaded_health_documents (health_documents), education_articles, health_rules, audit_logs, session_audits, password_reset_tokens + NextAuth account/session/verification_token.

Key relations: user→cycles→period_days; user→daily_symptoms/moods/pains/meds/wellness/notes; user→alerts/predictions/reports/conversations→messages.

Migrate: `npx prisma migrate dev`. Seed: `npm run prisma:seed` (rules, symptom catalog, articles, optional demo account when DEMO_SEED=true).
