# Heimdall Hub

A personal project + task tracker (Next.js). Two top-level views — Projects
and Tasks — backed by either a Supabase Postgres DB (production) or local
YAML files (dev/fallback). The `personal` project is reserved as the default
bucket for personal tasks and cannot be deleted from the UI.

## Project structure

- `src/` — Next.js app (App Router).
- `data/projects.yaml`, `data/tasks.yaml` — local-dev source of truth. Used
  when Supabase env vars are absent. Server actions read/write these files
  directly via `fs`.
- `data/schema.sql` — Supabase schema. Paste into the Supabase SQL editor
  once per project.
- `docs/`, `kb/`, `memory/`, `playbook/`, `skills/`, `scripts/` — agent
  runtime and ops content. Not imported by the Next.js app.

## Persistence

The app picks its backend at request time based on env vars:

- **Supabase configured** (both `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
  set) → reads and writes hit Postgres. This is what runs on Vercel.
- **Otherwise** → reads and writes hit `data/*.yaml` on the local filesystem.
  This is the default for `npm run dev`. Commit YAML changes to persist them.

Both backends use the same data shape, so you can switch by toggling env vars.

### Supabase setup (one-time)

1. Create a free Supabase project at https://supabase.com.
2. In the SQL editor, paste and run the contents of `data/schema.sql`. The
   file is non-destructive and safe to re-run; it preserves legacy rows
   and just relaxes constraints on columns the new UI ignores.
3. In Vercel project settings, set two environment variables:
   - `SUPABASE_URL` *(or the legacy `NEXT_PUBLIC_SUPABASE_URL`)* — the
     project URL, e.g. `https://xxx.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` — the service-role key (Settings → API).
     Keep this secret; it bypasses RLS and is used server-side only.
4. Redeploy. Writes from the dashboard now persist in Postgres.

## Dev server

```sh
npm run dev
```

Run from the repo root. Without Supabase env vars set, the app reads/writes
`data/projects.yaml` and `data/tasks.yaml`.
