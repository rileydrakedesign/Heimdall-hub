# Heimdall Hub

## Project structure

The Heimdall Hub dashboard (Next.js) lives at the repo root. Sibling
directories hold non-app content:

- `data/` — YAML source read by the hub (projects, tasks, briefs).
- `projects/` — per-project agent working directories (content, not code).
- `docs/`, `kb/`, `memory/`, `playbook/`, `skills/`, `scripts/` — agent
  runtime and ops content. Not imported by the Next.js app.

## Dev server

```sh
npm run dev
```

Run from the repo root.
