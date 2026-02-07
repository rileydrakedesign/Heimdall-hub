# PM Research Brief — 2026-02-07

Priority:
- #1 Agent for X
- #2 Class Chat AI

## What changed vs yesterday
- Added competitor evidence that **guardrails are a feature**: explicit daily posting limits + “prevent spamming and abuse” framing (Publer).
- Added "teach the user" signal for doc-chat: competitors publish **how to ask good questions** because Q&A quality is sensitive to phrasing + token limits (ChatDOC).
- Added stronger “enterprise trust primitives” framing: **SOC 2 Type II + encryption + user-controlled deletion** (Humata privacy policy).
- Added channel tactic evidence: **affiliate program as growth engine** + swipe assets + extended trials (Tweet Hunter).
- Logged additional blocked/JS-heavy sources in `research/blocked.md`.

## Agent for X — GTM takeaways (today)
- **ToS/safety anxiety is handled via productized constraints**, not just reassurance copy.
  - Publer explicitly enforces daily posting limits “to prevent spamming and abuse.”
  - Source: https://publer.com/plans
- Channel lever worth copying: affiliate program with real incentives (cookie window, longer trials, asset pack).
  - Source: https://tweethunter.io/affiliates
- Demand-capture content works when it’s *workflow education* (templates/schedulers → CTA into tool).
  - Sources: https://typefully.com/blog/twitter-post-templates and https://typefully.com/blog/tweet-schedulers

## Class Chat AI — GTM takeaways (today)
- Competitive bar is moving from “citations” → **fine-grained tracing** (page/citation/sentence/word-level).
  - Source: https://chatdoc.com/blog/source-tracing-in-ai-document-q-a-making-every-answer-verifiable-with-chatdoc/
- Users need help asking; competitors explicitly explain question strategy + token-limit constraints.
  - Source: https://chatdoc.com/blog/chatdoc-guide-how-to-make-good-queries/
- Enterprise trust posture is not vague; it’s named (SOC2) + operational (encrypt + delete).
  - Source: https://www.humata.ai/privacy-policy

## Recommended next step (1 action)
**Ship “Safe Automation” as a first-class Agent for X value prop + UX control**:
- Add a tiny “Safety” section (and product toggle) that states:
  - max posts/day defaults
  - user-editable caps
  - transparency (what will be posted + when)
  - no “hacks” / no aggressive automation

Why:
- competitor pricing pages use explicit limits + anti-abuse framing as conversion support.
  - Evidence: https://publer.com/plans

## Open blockers
- Bot/JS blocking: Hypefury homepage, multiple Typefully marketing pages, ChatDOC policy/terms endpoints (see `research/blocked.md`).
