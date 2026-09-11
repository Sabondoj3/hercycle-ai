# Privacy

- Consent records per type/version; withdrawal for optional items in Settings.
- bcrypt passwords (12 rounds), JWT sessions, audit on login/export/delete.
- TLS in transit; Postgres encryption-at-rest (provider-level); S3-SSE for vault in production.
- Least-privilege DB role; admins never browse health records (role-gated + audit; admin portal is Phase 2).
- Export (JSON) + Delete (cascade) self-serve. No health-data sale, no ad targeting.
- Neutral notifications + private mode + PIN field; no sensitive push without consent.
- Secrets via env only; no keys in client bundle.
