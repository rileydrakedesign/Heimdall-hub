---
name: supabase-schema-guardian
description: Guard against Supabase schema drift. Use to map tables referenced in code to migrations, detect missing CREATE TABLE/RLS/policies/indexes, and generate baseline migration stubs for missing tables. Helps ensure production/staging can be reproduced from repo migrations.
---

# Supabase Schema Guardian

## Goal

Ensure the repo contains everything needed to reproduce the database schema used by the code.

## Output

- `SCHEMA_GUARDIAN_REPORT.md`
- Optional generated migrations in `supabase/migrations/_generated/` (for review)

## Workflow

1) Extract tables referenced in code
- scan for `.from("table")` patterns in `src/**` and `scripts/**`

2) Compare to migrations
- list tables created via `CREATE TABLE`
- list tables only altered via `ALTER TABLE`

3) Flag gaps
- referenced but not created
- created but missing RLS
- RLS enabled but missing policies
- missing unique indexes used for dedupe (e.g., `(user_id, x_post_id)`)

4) Generate baseline migrations (stubs)
- one file per missing table
- include:
  - `CREATE TABLE IF NOT EXISTS ...`
  - `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`
  - basic policies: select/insert/update/delete where `auth.uid() = user_id`
  - minimal indexes for user_id lookups

## Tool

- Run `node scripts/schema_guardian.mjs --repo <repo>`

See `references/policy-templates.md`.
