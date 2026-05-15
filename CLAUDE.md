# Heimdall Hub

A personal project + task tracker (Next.js). Two top-level views — Projects
and Tasks — backed by a Supabase Postgres database. The `personal` project is
reserved as the default bucket for personal tasks and cannot be deleted from
the UI.

## Project structure

- `src/` — Next.js app (App Router).
- `data/schema.sql` — Supabase schema. Paste into the Supabase SQL editor
  once per project.
- `docs/`, `kb/`, `memory/`, `playbook/`, `skills/`, `scripts/` — agent
  runtime and ops content. Not imported by the Next.js app.

## Persistence

Supabase Postgres is the single backend for both reads and writes, in every
environment. There is no local-file fallback: if Supabase can't be reached,
pages surface the error rather than silently serving stale data, and writes
return a clear "could not reach the database" message.

The app needs two environment variables wherever it runs (Vercel and local):

- `SUPABASE_URL` *(or the legacy `NEXT_PUBLIC_SUPABASE_URL`)* — the project
  URL, e.g. `https://xxx.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` — the service-role key (Settings → API). Keep
  this secret; it bypasses RLS and is used server-side only.

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

Run from the repo root. Put `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in
a `.env.local` file first — the app has no offline mode and will error on
every page until it can reach Supabase.
