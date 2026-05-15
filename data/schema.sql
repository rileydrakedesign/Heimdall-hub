-- Heimdall Hub — Supabase schema
-- Run this once in the Supabase SQL editor. Safe to re-run.
--
-- This file is intentionally non-destructive:
--   * Creates the new tables if they don't already exist.
--   * For pre-existing tables left over from the legacy schema, relaxes the
--     NOT NULL constraints on columns the new app no longer writes
--     (area, owner, board_columns, created_by_type, created_by). Old rows
--     are preserved; the extra columns are simply ignored by the new UI.
--   * Seeds the reserved Personal project if it isn't there yet.

-- ── 1. Fresh-install tables ───────────────────────────────────────────────

create table if not exists projects (
  id           text primary key,
  name         text not null,
  status       text not null check (status in ('idea','active','paused','done')),
  priority     text not null check (priority in ('low','medium','high','urgent')),
  next_action  text not null,
  due          text,
  notes        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists tasks (
  id           text primary key,
  title        text not null,
  status       text not null check (status in ('backlog','in_progress','blocked','done')),
  priority     text not null check (priority in ('low','medium','high','urgent')),
  project_id   text,
  due          text,
  blocked_by   text,
  next_step    text,
  notes        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists tasks_project_id_idx on tasks(project_id);
create index if not exists tasks_status_idx     on tasks(status);
create index if not exists projects_status_idx  on projects(status);

-- ── 2. Relax legacy NOT NULL constraints ──────────────────────────────────
-- Each DO block is a no-op when the column doesn't exist or is already
-- nullable, so the file is safe to run against any state of the DB.

do $$
begin
  if exists (select 1 from information_schema.columns
              where table_name='tasks' and column_name='area' and is_nullable='NO') then
    alter table tasks alter column area drop not null;
  end if;
end $$;

do $$
begin
  if exists (select 1 from information_schema.columns
              where table_name='tasks' and column_name='owner' and is_nullable='NO') then
    alter table tasks alter column owner drop not null;
  end if;
end $$;

do $$
begin
  if exists (select 1 from information_schema.columns
              where table_name='tasks' and column_name='created_by_type' and is_nullable='NO') then
    alter table tasks alter column created_by_type drop not null;
  end if;
end $$;

do $$
begin
  if exists (select 1 from information_schema.columns
              where table_name='tasks' and column_name='created_by' and is_nullable='NO') then
    alter table tasks alter column created_by drop not null;
  end if;
end $$;

do $$
begin
  if exists (select 1 from information_schema.columns
              where table_name='projects' and column_name='owner' and is_nullable='NO') then
    alter table projects alter column owner drop not null;
  end if;
end $$;

do $$
begin
  if exists (select 1 from information_schema.columns
              where table_name='projects' and column_name='board_columns' and is_nullable='NO') then
    alter table projects alter column board_columns drop not null;
  end if;
end $$;

-- ── 3. Seed the reserved Personal project ─────────────────────────────────

insert into projects (id, name, status, priority, next_action, notes)
values ('personal', 'Personal', 'active', 'medium',
        'Capture personal tasks here',
        'Default bucket for personal tasks.')
on conflict (id) do nothing;
