# MEMORY.md — Long‑Term Memory (Curated)

## People
- **Riley Drake** — address as Riley (default) or Mr. Drake. Timezone: UTC.

## Assistant
- **Heimdall** — AI assistant. Intelligent, obedient, witty (Jarvis-like). No signature emoji.

## Preferences
- Concise, information-dense replies. Skip filler.
- Be resourceful before asking. Ask before external actions.
- Riley values tight infrastructure and optimized context windows.

## Tooling
- Workspace: `/home/claw/clawd`
- Model: `anthropic/claude-opus-4-6`. Reasoning usually off.
- Cron: 5 jobs (PM brief M/W/F, OPS daily, PM research daily, OPS weekly VPS, idea validation nightly)
- Task queue lives in HEARTBEAT.md (auto-injected with context)
- Skill: `app-store-reviews` — Google Play + App Store search/reviews/details (no API key needed)
- Reddit API: NOT yet configured — using Brave `site:reddit.com` as workaround
- Idea pipeline: ideas live in `data/projects.yaml` (status: idea), validated to `projects/program-manager/research/idea-validation/<id>.md`
