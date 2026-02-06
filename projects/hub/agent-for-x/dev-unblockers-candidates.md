# #1 Dev Unblocker Candidates — Agent for X

Goal: identify the single engineering change that unblocks reliable shipping of packs.

## Candidate list (ranked, lean)

### 1) “Quote-grounding” enforcement in generation
**Problem:** drafts feel untrustworthy without citations.
**Unblocker:** require each claim to reference a quote block (with timestamp) or be labeled “opinion”.
- Implementation idea: generation schema with `claim[] -> evidenceQuoteId[]`.
- Output: “Evidence” section + “Posts” section.

### 2) One-click “Export pack” (Doc/Markdown)
**Problem:** too much manual copy/paste.
**Unblocker:** export a pack with consistent headings and formatting.

### 3) Style control (voice examples)
**Problem:** generic output.
**Unblocker:** capture 2–5 example posts and use them as a style anchor.

### 4) Fast ingest from Loom/YT/podcast
**Problem:** input friction.
**Unblocker:** accept a URL and fetch transcript automatically.

### 5) Review UI (edit + approve)
**Problem:** polishing takes too long.
**Unblocker:** lightweight editor + checklist.

## REQUIRED_INPUT
- Current pipeline reality: what is already implemented in ContentAutomationPlatform repo.
- Biggest pain today: ingest vs drafting vs editing vs posting.
