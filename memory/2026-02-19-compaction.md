# Memory Flush — 2026-02-19 (pre-compaction)

## Config changes
- AGENTS.md rewritten as lightweight boot + workspace router (~2KB). Boot requires only 1 active read: `memory/latest.md`.
- HEARTBEAT.md now serves dual role: dispatcher + task queue (TASKS.md merged in, then removed).
- Created `memory/latest.md` as rolling 24-48h summary to replace loading full daily logs on boot.
- MEMORY.md trimmed of empty placeholder sections.
- docs/now.md and docs/inbox.md populated (were empty).

## New tool integrations
- Built `app-store-reviews` skill at `skills/app-store-reviews/` — Google Play + Apple App Store search/reviews/details via npm scrapers (no API keys). Tested and working.
- Reddit API NOT yet configured — currently using Brave `site:reddit.com` search snippets as workaround. Riley aware, setup pending.

## New cron job
- Idea validation pipeline added (nightly 03:00 UTC, isolated agentTurn, job id: a9a99289). Checks `data/projects.yaml` for `status: idea` entries, validates new ones, writes reports to `projects/program-manager/research/idea-validation/<id>.md`.

## Project state changes
- 4 ideas added to `data/projects.yaml`: scene-splitter, polymarket-sentiment, card-optimizer, dev-infra-agent.
- Card Optimizer full validation report completed manually at `projects/program-manager/research/idea-validation/card-optimizer.md`. Recommendation: promote to active.
- Portfolio deep research plan completed by sub-agent: `projects/riley-portfolio-plan.md` (1,427 lines, 9 phases, 30+ sources).
- TASK-003 (portfolio research) marked done. TASK-001 (Playwright screenshots) still blocked. TASK-002 (idea validation) managed by nightly cron.

## Riley preferences confirmed
- Wants infrastructure tight and context-window optimized — minimize boot token cost.
- Task queue must be auto-injected (lives in HEARTBEAT.md, not separate file).
- Prefers autonomous research via sub-agents with progress tracked in heartbeat.
