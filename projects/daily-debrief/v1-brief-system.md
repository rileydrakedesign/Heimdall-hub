# Daily Debrief / Morning Brief — v1 System Spec

## Goal
A **daily morning brief** Riley can read in ~3–7 minutes that is:
- high-signal, skimmable, and actionable
- built from **configurable sources**
- produces a durable artifact (Markdown) that lives in the Hub
- can later be generated/sent automatically via cron

This formalizes (and replaces scattered) “brief” behavior into a single, configurable system.

---

## Product shape
### 1) Brief generator
A pipeline that:
1. Reads a **brief profile** config (sections, sources, formatting rules)
2. Fetches/derives inputs (news, markets, AI papers, project status, agent activity, weather/surf, etc.)
3. Produces a Markdown doc with stable formatting
4. Persists the output to the repo (and optionally sends it to Telegram)

### 2) Brief library (in Hub)
- A browsable list of past briefs
- Each brief stored at:
  - `projects/daily-debrief/runs/YYYY-MM-DD.md`

### 3) Brief settings UI (in Hub)
A place to “attune”:
- sources (RSS, websites, watchlists, keywords)
- section order and size
- output verbosity + style
- delivery preferences (later)

---

## Brief structure (v1)
### Core sections
1) **Top 5 / Executive Summary**
- 5 bullets max, each: what happened → why it matters → 1-liner implication

2) **Current events (general)**
- 5–10 bullets, focus on high-signal macro + geopolitics + business

3) **Markets (tailored)**
- Watchlist tickers + major indices + big movers
- “What moved and why” (headlines + catalysts)
- Optional: “Today’s setup” (what to watch)

4) **AI / Tech brief (targeted)**
- Top papers (arXiv) + key product/news
- Emphasize: practical capability changes, tools, infra, dev sourcing

5) **Ops / Projects / Agent work**
- What changed since yesterday (projects/tasks)
- What’s blocked
- Suggested next actions

6) **Local (optional)**
- Weather + surf (if enabled)

---

## Configuration model (static-first)
Keep config in YAML so it’s easy to version and later import into Supabase.

### Config file
- `data/briefs.yaml`

### Key concepts
- **Brief Profile**: a named preset (e.g. `default-morning`, `markets-heavy`, `ai-heavy`)
- **Sections**: ordered blocks with a target length and rules
- **Sources**: typed connectors (RSS, website list, arXiv query, market watchlist)

---

## Output format (Markdown contract)
Hard requirements:
- Title includes date/time and profile name
- Every section uses consistent heading level
- Bullets only; no long paragraphs
- Every factual bullet should include a source link (where possible)

Filename contract:
- `projects/daily-debrief/runs/YYYY-MM-DD.md`

---

## Implementation phases
### Phase A — Spec + config + storage (now)
- Create `data/briefs.yaml` with default profile + placeholders
- Add documentation for how to tune sources

### Phase B — Generator script (repo-local)
- Node script that reads config and writes the Markdown output
- Start with minimal connectors:
  - RSS feeds
  - website fetch via `web_fetch`
  - arXiv RSS/category feeds

### Phase C — Hub UI
- Add a “Briefs” section in the dashboard
- Settings editor (initially: YAML + docs; later: UI)

### Phase D — Automation
- Cron job to generate every morning and send to Telegram
- Backfill + archive runs

---

## Open questions to finalize (when you’re home)
- Delivery time + timezone
- Market watchlist tickers + macro focus
- Preferred news sources (general)
- AI scope: categories/keywords/authors
- Max length and tone constraints
