# Heimdall Hub

A personal project + task tracker (Next.js). The dashboard lives at the repo
root; tasks and projects are persisted as YAML in `data/`.

## Project structure

- `src/` — Next.js app (App Router). Two top-level views: Projects, Tasks.
- `data/projects.yaml`, `data/tasks.yaml` — source of truth. Server actions
  read and write these files directly via `fs`. The `personal` project is
  reserved as the default bucket for personal tasks and cannot be deleted
  from the UI.
- `docs/`, `kb/`, `memory/`, `playbook/`, `skills/`, `scripts/` — agent
  runtime and ops content. Not imported by the Next.js app.

## Dev server

```sh
npm run dev
```

Run from the repo root. Mutations from the UI write to `data/*.yaml` on the
local filesystem, so commit those files to persist changes.
