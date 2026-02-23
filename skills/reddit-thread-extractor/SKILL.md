---
name: reddit-thread-extractor
description: Extract Reddit threads and (optionally) specific high-signal comments for lead discovery based on user-provided topics/keywords. Use when you need to find candidate Reddit posts via web search (e.g., site:reddit.com queries) and then extract the full post + comments using a 3-tier fallback: (1) Reddit .json endpoint parsing, (2) old.reddit.com HTML parsing, (3) readability-style page text extraction. Useful for customer discovery, intent mining, and drafting replies.
---

# Reddit thread extractor (3-tier fallback)

## Inputs you need from the user
- **Topic / search description** (e.g., “X growth tools”, “AI scheduling for Twitter”, “automated posting”)  
- Optional: **subreddits**, **recency** (day/week/month), **languages**, **negative keywords**
- Optional: whether to return **threads only** or also **target comments** (recommended)

## Output format (return this shape)
Return a JSON-ish object in the chat:
- `query_plan`: final search strings used
- `threads`: list of
  - `url`, `title`, `subreddit` (best-effort), `reason_matched`
  - `post`: `{author, created_utc?, text}`
  - `top_comments`: array (by score / relevance)
  - `targets` (optional): specific comment IDs/links to reply to
- `extraction_notes`: tier used, partial/failed reasons, rate-limit hints

## Workflow

### 1) Discover candidate threads (site:reddit.com)
Use `web_search` with 2–4 queries:
- Base:
  - `site:reddit.com ("<topic>" OR <synonym>) (tool OR app OR software OR service OR recommend OR alternative)`
- Intent:
  - `site:reddit.com <topic> ("anyone tried" OR "worth it" OR "pricing" OR "safe" OR "banned" OR "rate limit")`
- Competitors (optional):
  - `site:reddit.com (taplio OR typefully OR tweethunter OR hypefury) (safe OR banned OR automation)`

Filter results to URLs that look like Reddit threads:
- Prefer: `/r/<sub>/comments/<id>/...`
- Skip: user profiles, subreddit listing pages, image pages, AMP variants

### 2) Extract each thread with 3-tier fallbacks
Tier order:

**Tier 1 — `.json` endpoint (best)**
- Convert thread URL → JSON URL by appending `.json`.
- Parse post + comment tree.
- If comments contain `kind: "more"` placeholders, treat as **partial** unless you explicitly implement expansion.
- Use the bundled script:
  - `python3 skills/reddit-thread-extractor/scripts/reddit_extract.py <url> --format json`

**Tier 2 — old Reddit HTML (fallback)**
- Convert `www.reddit.com` → `old.reddit.com`.
- Parse post body + visible comments from HTML.
- Use the bundled script:
  - `python3 skills/reddit-thread-extractor/scripts/reddit_extract.py <url> --tier html --format json`

**Tier 3 — readability-style text (last resort)**
- If Tier 1+2 fail (403, bot wall, weird variants), fetch with `web_fetch` and extract main content:
  - `web_fetch(url, extractMode="markdown")`
- You may only get the **post** reliably; comments are often incomplete.

### 3) Select target comments (optional but recommended)
If the user wants “specific target comments/posts”, rank comments by:
- **Intent**: asking for recommendations, complaining about limits/bans, asking “is it safe”, “what tool do you use”, “any alternatives”, “pricing?”
- **Recency** (if available)
- **Score** (upvotes)

Return:
- up to **5 target threads**
- up to **1–3 target comments per thread** (reply targets)

## Notes / guardrails
- Reddit can rate-limit. Use a realistic User-Agent and backoff.
- Do not attempt to evade CAPTCHAs or bot challenges.
- Keep outputs concise: store full raw extracts in files only if requested.
