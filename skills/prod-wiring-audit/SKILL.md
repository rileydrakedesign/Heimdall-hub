---
name: prod-wiring-audit
description: Run a production-readiness wiring audit for a repo (Next.js/Supabase/worker apps). Use to verify builds, typecheck, lint, env vars, route auth, data-source wiring, background workers/queues, and dependency vulnerabilities. Produces a ranked fix list + a reproducible "ship report".
---

# Prod Wiring Audit

This skill turns "is it wired to production level?" into a deterministic checklist + report.

## Contract

- Input: repo path (default: current workspace repo)
- Output: `AUDIT_REPORT.md` with:
  - ✅/❌ gates
  - ranked findings (critical/high/med/low)
  - exact file paths + suggested fixes
  - next actions

## Gates (do these first)

1) Install deps deterministically
- `npm ci` (or `pnpm i --frozen-lockfile` / `yarn --frozen-lockfile`)

2) Build + typecheck
- `npm run build`
- `tsc --noEmit` (use local `node_modules/.bin/tsc`)

3) Lint (if configured)
- `npm run lint`

If any gate fails, report the failure first and stop deeper work until the repo builds.

## Wiring checks (run after gates)

### A) Data sources
- Enumerate DB tables referenced in code (`.from("...")`).
- Map each table → feature area (API routes/components/worker).
- Flag:
  - tables referenced but missing migrations
  - endpoints that read from deprecated sources
  - cross-user scoping gaps (missing `.eq("user_id", user.id)`)

### B) Auth
- Verify every user-scoped API route checks auth and scopes by user_id.
- Verify middleware protections for protected pages/routes.

### C) Background workers & scheduling
- Verify worker entrypoints exist and can run.
- Verify queue table(s) + RLS/service-role assumptions are documented.

### D) Env var + secrets hygiene
- Identify required env vars by scanning `process.env.*`.
- Ensure secrets are only used server-side.

### E) Dependency risk
- Run `npm audit --omit=dev` and summarize fixes.

## Tools

- Run `node scripts/prod_wiring_audit.mjs --repo <path>`.
- The script prints a JSON + writes `AUDIT_REPORT.md`.

## References

- See `references/report-template.md` for the exact report structure.
