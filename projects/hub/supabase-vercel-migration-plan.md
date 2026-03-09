# Heimdall Hub → "Real Dashboard" Migration Plan

**Goal:** Evolve the current GitHub-backed static dashboard (Next.js + YAML) into a lightweight but powerful authenticated web app with live data and agent write access.

**Target stack (recommended):**
- **Frontend:** Next.js (existing `web/`)
- **Hosting:** Vercel
- **Auth + DB:** Supabase (Postgres + Auth)
- **Agent writes:** Server-side API endpoints (Next.js Route Handlers) gated by **Agent Token**, writing with Supabase **service role** key
- **Durability:** Keep YAML import/export so the repo remains a portable ledger

---

## 0) Current state (baseline)
- Static Next.js dashboard lives in `web/`.
- Projects are stored in `data/projects.yaml`.
- Tasks are stored in `data/tasks.yaml`.
- Pages:
  - `/` dashboard
  - `/projects` and `/projects/[id]`
  - `/tasks`

---

## 1) Desired product behavior
### For Riley (single user)
- Login from anywhere.
- Full CRUD on projects + tasks + updates.
- Views:
  - Global task list grouped by **Backlog / In progress / Blocked / Done**
  - Project-scoped task list with **global columns** plus **per-project customization**
  - Personal tasks (visible to agents) with due/reminders

### For Agents
- Read + write tasks freely.
- Add task updates/comments.
- All writes are auditable.

---

## 2) Security model (keep it safe + simple)
### Principles
- **Agents never get direct DB keys**.
- All agent writes go through a narrow server endpoint.
- Every write produces an `audit_log` record.

### Auth
- **Riley** uses Supabase Auth (email magic link or password—your choice).
- **Agents** authenticate with `Authorization: Bearer <AGENT_TOKEN>` to your server endpoints.

### RLS (Row Level Security)
- Enable RLS on all tables.
- Policy: *authenticated user* (Riley) can read/write everything.
- Server endpoints (agent API) use **service role** key (server-only) to bypass RLS, but still log writes.

---

## 3) Database schema (v1)
Keep it intentionally small.

### `projects`
- `id` text primary key (keep your current ids like `hub`, `riley-portfolio`)
- `name` text not null
- `status` text not null (idea|active|paused|done)
- `priority` text not null (low|medium|high|urgent)
- `owner` text not null
- `next_action` text not null
- `due` timestamptz null
- `notes` text null
- `board_columns` jsonb null (default ["backlog","in_progress","blocked","done"])
- `created_at` timestamptz default now()
- `updated_at` timestamptz default now()

### `tasks`
- `id` uuid primary key default gen_random_uuid() *(or text if you prefer human ids)*
- `title` text not null
- `status` text not null (backlog|in_progress|blocked|done)
- `priority` text not null (low|medium|high|urgent)
- `area` text not null (work|personal)
- `project_id` text null references projects(id)
- `due` timestamptz null
- `blocked_by` text null
- `next_step` text null
- `created_by_type` text not null (user|agent)
- `created_by` text not null
- `assigned_to` text null
- `created_at` timestamptz default now()
- `updated_at` timestamptz default now()

### `task_updates`
- `id` uuid pk
- `task_id` uuid references tasks(id)
- `author_type` text (user|agent)
- `author` text
- `body` text
- `created_at` timestamptz default now()

### `audit_log`
- `id` uuid pk
- `actor_type` text (user|agent|system)
- `actor` text
- `action` text (task.create|task.update|task.comment|import.yaml|…)
- `entity_type` text
- `entity_id` text
- `meta` jsonb
- `created_at` timestamptz default now()

---

## 4) Supabase setup checklist (do on home computer)
### A) Create project
1. Create Supabase project
2. Save:
   - Project URL
   - Anon key
   - Service role key (**never expose to client**)

### B) Enable Auth
- Choose auth method:
  - simplest: email magic links to your email
- Create your user account

### C) Create tables
- Use Supabase SQL Editor to run the migration SQL (see **Section 8**).

### D) Turn on RLS + policies
- Apply policies (see **Section 8**).

---

## 5) Vercel setup checklist
1. Create a Vercel project connected to this repo
2. Root directory:
   - either deploy `web/` as the project root in Vercel settings
   - or restructure repo later; keep it simple for now
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only)
   - `AGENT_TOKEN` (server-only; rotate if leaked)

---

## 6) App migration steps (code)
### Phase 1 — "DB mode" scaffolding
- Add `@supabase/supabase-js` to `web/`
- Create clients:
  - browser client (anon)
  - server client (service role)
- Add feature flag:
  - if env vars missing → fall back to YAML loaders

### Phase 2 — Read paths from DB
- Replace data loaders for:
  - `/projects`
  - `/projects/[id]`
  - `/tasks`
with Supabase queries.

### Phase 3 — Admin import
- Admin-only route: `/admin/import`
  - Import `data/projects.yaml` → `projects`
  - Import `data/tasks.yaml` → `tasks`
  - Record `audit_log` entries

### Phase 4 — Agent API
Implement Next.js route handlers:
- `POST /api/agent/tasks.create`
- `POST /api/agent/tasks.update`
- `POST /api/agent/tasks.comment`

Hard requirements:
- Validate payloads (enums, max lengths)
- Rate limit
- Always write to `audit_log`

### Phase 5 — Reminders + digests
- Add scheduled job source (choose one):
  - Supabase scheduled triggers
  - Vercel cron
- v1 jobs:
  - daily personal reminders digest
  - M/W/F PM brief

---

## 7) Data durability (YAML stays valuable)
Even after DB is primary:
- Keep YAML as import/export format.
- Optional: nightly export DB → YAML and commit via GitHub Actions.
  - This keeps a diffable ledger in the repo.

---

## 8) Draft SQL (migration + RLS)
> Paste into Supabase SQL editor. Adjust as needed.

### Extensions
```sql
create extension if not exists pgcrypto;
```

### Tables
```sql
create table if not exists projects (
  id text primary key,
  name text not null,
  status text not null,
  priority text not null,
  owner text not null,
  next_action text not null,
  due timestamptz null,
  notes text null,
  board_columns jsonb null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  status text not null,
  priority text not null,
  area text not null,
  project_id text null references projects(id) on delete set null,
  due timestamptz null,
  blocked_by text null,
  next_step text null,
  created_by_type text not null,
  created_by text not null,
  assigned_to text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists task_updates (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  author_type text not null,
  author text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_type text not null,
  actor text not null,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
```

### RLS
```sql
alter table projects enable row level security;
alter table tasks enable row level security;
alter table task_updates enable row level security;
alter table audit_log enable row level security;
```

### Policies (single-user)
> Allow any authenticated user to do anything.
```sql
create policy "projects_all_authed"
on projects for all
to authenticated
using (true)
with check (true);

create policy "tasks_all_authed"
on tasks for all
to authenticated
using (true)
with check (true);

create policy "task_updates_all_authed"
on task_updates for all
to authenticated
using (true)
with check (true);

create policy "audit_log_all_authed"
on audit_log for all
to authenticated
using (true)
with check (true);
```

---

## 9) Open questions (decide later)
- Task IDs: keep human-readable text ids vs uuid.
- Multi-user expansion (not needed now).
- KPI sources + automation.
- PM/Marketing tables (experiments/feedback/campaigns) once core loop stable.
