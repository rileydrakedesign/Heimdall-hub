# Project: Insight → Summary → X Drafts Pipeline

## Goal
Create a repeatable system that takes **long-form text inputs** (starting with podcast transcripts) and produces:
1) a **quick insight breakdown** you can read in minutes, and
2) a **set of X (Twitter) post drafts** optimized for impressions *without sacrificing nuance or sounding robotic*.

Primary success criteria:
- Outputs feel **human**, **specific**, and **useful** (not generic motivational fluff).
- Captures **non-obvious / nuanced** insights and frames them clearly.
- Produces post drafts with strong hooks, clean structure, and clear takeaways.

---

## Inputs (v1)
- Plain text transcript (copy/paste)
- Optional metadata:
  - title
  - speaker(s)
  - topic tags
  - audience (who should care)
  - desired tone (default: smart, human, slightly opinionated)

---

## Outputs (v1)

### A) Insight Brief (1–2 pages)
Format:
- **TL;DR (5 bullets max)**
- **Key insights (5–10)**
  - Each insight includes:
    - *Claim* (one sentence)
    - *Why it matters* (one sentence)
    - *Evidence / quote* (short excerpt + timestamp/section ref if available)
    - *Counterpoint / nuance* (when appropriate)
- **Actionable takeaways** (3–7)
- **Best quotables** (5–10) (optional)

### B) X Draft Set
A bundle with variety, e.g. 12–25 drafts consisting of:
- 4–6 single tweets (tight, high signal)
- 6–10 short threads (5–8 tweets) with a clear arc
- 2–4 “contrarian” posts (tasteful)
- 1–2 story/lesson posts (human, concrete)

Each draft should have:
- hook
- readable line breaks
- no jargon unless necessary
- a concrete example or sharp phrasing
- optional soft CTA ("If you're building X...", "Steal this")

---

## Core approach (how we get nuance, not mush)

### 1) Segmenting the input
We should not treat a transcript as one blob.
- Chunk by speaker turns + topic shifts (heuristics)
- Keep overlap between chunks to preserve context

### 2) Extract a structured “insight pool”
For each chunk, capture candidates with a strict rubric:
- **Non-obviousness:** would a smart reader learn something new?
- **Specificity:** names, mechanisms, constraints, examples
- **Truthiness:** is it supported by the transcript, not invented?
- **Tension:** tradeoff, counterpoint, "yes but"

Store candidates as JSON objects:
- insight
- supporting excerpt
- tags
- confidence
- novelty score
- usefulness score

### 3) Deduplicate + synthesize
- Merge overlapping insights
- Keep the strongest framing
- Preserve dissent/nuance where present

### 4) Generate outputs from the same source-of-truth
- Insight Brief is the “canonical” synthesis
- X drafts are generated from that canon (not independently hallucinated)

---

## X writing principles (built into the generator)
- Lead with a **sharp claim** or **pattern**.
- Prefer **specific examples** over abstract advice.
- Use **short lines** and **intentional whitespace**.
- Avoid cringe: no forced hype, no excessive emojis, no "10x" bro tone.
- Threads should have:
  - hook
  - promise
  - bullets/steps
  - one strong closing line

---

## MVP scope (first working version)
1) CLI or simple script that takes `input.txt`
2) Produces:
   - `insights.md`
   - `x_drafts.md`
3) A small config file for:
   - number of insights
   - number of drafts
   - tone

---

## Open questions for Riley (fast answers)
1) Typical length: 30 min transcript or 2–3 hours?
2) Preferred output volume: ~12 posts or ~25?
3) Do you want the system to adopt your voice, or a neutral “smart commentator” voice?
4) Any topics to avoid on X?
