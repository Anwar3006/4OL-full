## 2024-09-06 - Hardcoded Secrets in Markdown Documentation

**Vulnerability:** Found hardcoded `SUPABASE_SECRET_KEY` and `RESEND_API_KEY` values directly in markdown files (`VERCEL_ENV_SETUP.md` and `DEPLOYMENT_CHECKLIST.md`).

**Learning:** Secrets were exposed in documentation, likely from a copy-paste of environment variable setup instructions. While intended to be helpful, this completely compromises the keys. The repository's git history now contains these secrets, which should be considered compromised and rotated.

**Prevention:** Always use placeholder values (e.g., `<YOUR_API_KEY>`) in any committed documentation or example files. Secrets must only be stored in secure locations like Vercel's environment variable settings or local `.env` files that are gitignored. Future security scans should include checks for secret-like patterns in all file types, not just source code.

## 2024-09-06 - Missing Authorization in Server Action

**Vulnerability:** The `inviteAdminAction` server action lacked any authorization check, allowing any authenticated user to invite new administrators, leading to a privilege escalation vulnerability.

**Learning:** Server actions are effectively public API endpoints and must be treated as such. Relying on the UI to control access is insufficient, as these actions can be triggered directly. The absence of a server-side role check created a critical security flaw.

**Prevention:** All server actions that perform sensitive operations (e.g., creating, modifying, or deleting data) must explicitly verify the user's session and role-based permissions before executing their logic. Future code reviews for server actions must include a mandatory check for authorization.