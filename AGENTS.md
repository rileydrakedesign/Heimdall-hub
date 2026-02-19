# AGENTS.md — Core Instructions

## Boot Sequence
OpenClaw auto-injects: SOUL.md, USER.md, IDENTITY.md, TOOLS.md, HEARTBEAT.md, MEMORY.md.
On session start, actively read only what's missing from context:
1. `memory/latest.md` → rolling 24–48h summary (~1KB)

Use `memory_search` for anything older. Raw daily logs in `memory/YYYY-MM-DD.md` if needed.

If `BOOTSTRAP.md` exists, follow it first, then delete it.

---

## Workspace Router

### State (what's happening now)
- `TASKS.md` — active task queue (heartbeat works from this)
- `HEARTBEAT.md` — heartbeat dispatch rules
- `MEMORY.md` — curated long-term memory
- `memory/YYYY-MM-DD.md` — daily session logs
- `memory/ops-state.json` — OPS runner state

### Projects
- `data/projects.yaml` — project registry (source of truth)
- `work/riley-portfolio/docs/` — Portfolio plan + implementation docs (moved to repo)
- `projects/program-manager/` — PM command center (war room, KPIs, GTM, research, runs)
- `projects/*/` — per-project specs
- `docs/now.md` — this week's focus
- `docs/inbox.md` — untriaged ideas

### Code
- `work/ContentAutomationPlatform/` — Agent for X
- `work/AIStudyBuddy/` — Class Chat AI
- `work/riley-portfolio/` — Portfolio (Pixi isometric room)
- `work/rileyd-portfolio/` — Heimdall Hub dashboard

### Automation
- `scripts/ops/ops_runner.mjs` — daily/weekly health checks
- `scripts/insight_x/` — content pipeline
- `output/` — generated artifacts
- `skills/` — custom skills

### Identity
- `SOUL.md` · `USER.md` · `IDENTITY.md` · `TOOLS.md`

---

## Rules

**Memory:** Write it down — mental notes don't survive restarts. Use `memory/YYYY-MM-DD.md` for raw logs, `MEMORY.md` for curated facts. Maintain MEMORY.md every ~3 days during heartbeats.

**Tasks:** Any autonomous or multi-step operation → add to `TASKS.md`. Heartbeat works active tasks by priority, one blocker per task per cycle. See `HEARTBEAT.md` for dispatch logic.

**Safety:** No data exfiltration. `trash` > `rm`. Ask before any external action (emails, tweets, posts).

**Group chats:** You're a participant, not Riley's proxy. Speak when you add value, stay silent otherwise.

**Formatting:** No markdown tables on Discord/WhatsApp. Wrap Discord links in `<>`. No headers on WhatsApp.
