# Latest Context (rolling 24–48h summary)
**Updated:** 2026-02-19 00:08 UTC

## Infrastructure overhaul (2026-02-18)
- Rewrote AGENTS.md as lightweight boot sequence + workspace router (~2KB)
- Boot now requires only 1 active read: `memory/latest.md` (everything else auto-injected)
- Merged TASKS.md into HEARTBEAT.md (auto-injected, eliminates extra reads)
- HEARTBEAT.md now serves as both dispatcher and task queue
- Populated docs/now.md and docs/inbox.md (were empty)

## Task queue (HEARTBEAT.md)
- TASK-001: Portfolio Pixi room — Playwright screenshots (active, blocked on browser execution)
- TASK-002: Idea validation pipeline — managed by nightly cron (active)

## Cron jobs (5 total now)
- PM brief M/W/F 10:00 PT — OK
- OPS daily repo health 09:15 UTC — OK (flagged 12 high wiring drift on ContentAutomationPlatform)
- PM research sweep 07:30 PT daily — OK
- OPS weekly VPS security Mon 09:30 UTC — ⚠️ erroring ("delivery target missing")
- **NEW:** Idea validation pipeline 03:00 UTC nightly — validates all `status: idea` projects

## Idea pipeline (4 ideas in data/projects.yaml)
- scene-splitter — AI scene generation + asset extraction (productize Nano Banana pipeline)
- polymarket-sentiment — prediction market sentiment tracker (Exploding Topics for odds data)
- card-optimizer — Plaid-based credit card recommendation engine (affiliate monetized)
- dev-infra-agent — agentic GitHub middleware for living infrastructure diagrams + docs

## Card Optimizer deep-dive completed
- Full validation report at `projects/program-manager/research/idea-validation/card-optimizer.md`
- Real competitors: Credit Karma, NerdWallet (both use self-reported data, not actual spending)
- Luci (joinluci.com) attempted same Plaid approach ~2020, appears dead
- CardPointers/MaxRewards are card USAGE optimizers, not card SELECTION tools
- Key insight: nobody successfully uses real transaction data for card recommendations
- Recommendation: PROMOTE TO ACTIVE

## New skill built: app-store-reviews
- Location: `skills/app-store-reviews/`
- 3 scripts: search_apps.mjs, get_reviews.mjs, app_details.mjs
- Uses google-play-scraper + app-store-scraper (npm, no API keys)
- Tested and working on both stores

## Open issues
- Weekly VPS security cron erroring (job dac07a5e)
- Reddit API not yet configured — currently using Brave search snippets as workaround
- No Reddit API key limits depth of nightly validation pipeline
