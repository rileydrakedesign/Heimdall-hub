# Daily Debrief — Plan

## One-sentence
A daily briefing that compresses AI, markets, projects, and local conditions into an actionable 3–7 minute read.

## Delivery
- Channel: Telegram (to Riley)
- Schedule: daily, morning (TBD)

## Format (v0)
- Title line with date
- Sections with 3–7 bullets each
- Each section ends with 1 suggested action (when applicable)

## Data sources (TBD)
- AI papers: arXiv categories + specific authors/keywords
- Markets: watchlist tickers + macro headlines
- Current events: vetted outlets
- Surf: location + preferred provider
- Weather: default location

## System design (static-first)
- Generate debrief in an isolated cron job to avoid context bloat.
- Persist each debrief to the Heimdall Hub repo under `projects/daily-debrief/runs/YYYY-MM-DD.md`.

## Next
Collect user preferences and set up cron.
