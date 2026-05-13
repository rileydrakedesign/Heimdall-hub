-- Heimdall Hub — Supabase schema
-- Run this once in the Supabase SQL editor for your project.
-- It is safe to re-run; everything is idempotent.

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
create index if not exists tasks_status_idx on tasks(status);
create index if not exists projects_status_idx on projects(status);

-- Seed the reserved Personal project.
insert into projects (id, name, status, priority, next_action, notes)
values ('personal', 'Personal', 'active', 'medium',
        'Capture personal tasks here',
        'Default bucket for personal tasks.')
on conflict (id) do nothing;
