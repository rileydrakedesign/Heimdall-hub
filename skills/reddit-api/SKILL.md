---
name: reddit-api
description: Authenticated Reddit API actions (read + write) via OAuth script app credentials stored on the VPS. Supports dry-run by default; requires confirm=true for any write.
---

# reddit-api (OAuth script app) — write-safe by default

This skill is for **authenticated** Reddit actions (posting/commenting/replying, inbox, etc.).

For read-only thread extraction, prefer the existing `reddit-thread-extractor` skill.

## Required env vars
Set these in OpenClaw config `env.vars` (recommended) or in the process environment:
- `REDDIT_CLIENT_ID`
- `REDDIT_CLIENT_SECRET`
- `REDDIT_USERNAME`
- `REDDIT_PASSWORD`
- `REDDIT_USER_AGENT` (example: `openclaw:v1.0 (by u/<username>)`)

## Write safety
- **Dry-run is the default**.
- Writes only happen when you pass `--confirm true`.

## Commands
All commands are implemented by:

```bash
python3 skills/reddit-api/scripts/reddit_api.py <command> [args]
```

### 1) Submit a text post
```bash
python3 skills/reddit-api/scripts/reddit_api.py submit_post \
  --subreddit "test" \
  --title "Hello" \
  --text "This is a test" \
  --confirm true
```

### 2) Comment on a post or reply to a comment
You can pass a fullname (`t3_...` or `t1_...`) **or** a Reddit URL.

```bash
python3 skills/reddit-api/scripts/reddit_api.py comment \
  --parent "https://www.reddit.com/r/test/comments/POSTID/title/" \
  --text "Comment text" \
  --confirm true
```

### 3) Fetch unread inbox items
```bash
python3 skills/reddit-api/scripts/reddit_api.py inbox_unread --limit 25
```

## Output
Returns JSON to stdout with:
- `ok` boolean
- `dry_run` boolean
- `request` (sanitized)
- `result` (best-effort)
- `error` (if any)
