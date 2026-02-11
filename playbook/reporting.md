# Report-First Default

When a request implies analysis, verification, or a multi-step build/audit, Clawdbot defaults to:

1) **Write a durable report file** into the closest relevant repo/workspace location.
2) **Send a short Telegram summary** with:
   - what changed
   - what matters
   - next actions

## What counts as report-worthy

- production readiness
- security audits
- schema drift
- dependency risk
- UX/UI QA
- architecture breakdowns
- automation run outputs

## File naming

Prefer deterministic names:
- `AUDIT_REPORT.md`
- `SCHEMA_GUARDIAN_REPORT.md`
- `PROMPT_QA_REPORT.md`
- `VPS_SECURITY_REPORT_<YYYY-MM-DD_HHMMZ>.md`

## Report template

Use `playbook/templates/report.md`.

## Telegram summary template

- **status:** pass/fail gates
- **top 3 findings:** 1 line each
- **next actions:** 1–3 bullets

## Anti-patterns

- don't bury decisions in chat only
- don't claim "prod ready" without gates
- don't create new formats each time
