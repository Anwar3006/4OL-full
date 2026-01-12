## 2024-09-06 - Hardcoded Secrets in Markdown Documentation

**Vulnerability:** Found hardcoded `SUPABASE_SECRET_KEY` and `RESEND_API_KEY` values directly in markdown files (`VERCEL_ENV_SETUP.md` and `DEPLOYMENT_CHECKLIST.md`).

**Learning:** Secrets were exposed in documentation, likely from a copy-paste of environment variable setup instructions. While intended to be helpful, this completely compromises the keys. The repository's git history now contains these secrets, which should be considered compromised and rotated.

**Prevention:** Always use placeholder values (e.g., `<YOUR_API_KEY>`) in any committed documentation or example files. Secrets must only be stored in secure locations like Vercel's environment variable settings or local `.env` files that are gitignored. Future security scans should include checks for secret-like patterns in all file types, not just source code.