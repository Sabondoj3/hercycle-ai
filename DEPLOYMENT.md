# Deployment

- `docker compose up --build` (db + app). Set NEXTAUTH_SECRET, AI_PROVIDER/keys, SMTP, S3 in `.env`.
- `npx prisma migrate deploy && npm run prisma:seed` on first boot.
- TLS + rate-limit + CSRF at reverse proxy (e.g. Caddy/Nginx/Cloudflare). Rotate secrets via manager.
- Backups: nightly Postgres dumps (encrypted). Vault bucket: versioned, SSE, private ACL.
