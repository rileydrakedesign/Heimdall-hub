# PM Research Brief — 2026-02-06

Priority:
- #1 Agent for X
- #2 Class Chat AI

## What changed vs yesterday
- Added explicit competitor evidence that **Auto-DM / automations** are sold as “game changers” (distribution/lead capture pain).
- Added **API-level workflow primitives** (citations toggle, agent-mode latency trade, streaming) from AskYourPDF docs.
- Added stronger privacy/trust framing from AskYourPDF privacy policy + reinforced “won’t upload proprietary docs” objection.
- Logged multiple blocked sources (Cloudflare/JS) in `research/blocked.md`.

## Agent for X — GTM takeaways (today)
- The product category is being sold as a **system** (ideas → draft → schedule → automate → measure), not a generator.
  - Source: https://tweethunter.io/ and https://tweethunter.io/pricing
- Distribution/lead capture is a core job: Auto-DM is highlighted as a “game changer.”
  - Source: https://tweethunter.io/
- Trust concern to preempt: “Is this safe?” / ToS anxiety shows up explicitly in adjacent tools’ pricing FAQs.
  - Source: https://taplio.com/pricing

## Class Chat AI — GTM takeaways (today)
- Trust/verification remains the wedge: citations + side-by-side view are central in competitor copy.
  - Source: https://www.chatpdf.com/
- Privacy objection is not edge-case: users explicitly refuse to upload proprietary docs.
  - Source: https://hn.algolia.com/api/v1/items/35626312
- Concrete control wins: API docs show deletion endpoints + explicit citation toggles + agent-mode latency/quality trade.
  - Source: https://docs.askyourpdf.com/

## Recommended next step (1 action)
Ship one **Agent for X “Distribution Loop” demo** asset (not just before/after writing):
- 20–30s clip: raw notes → drafted post → queued schedule → optional “reply/DM follow-up” step (even if mocked) → simple metric screenshot.

Why:
- competitors are selling the *loop*, and Auto-DM/distribution is the memorable “game changer.”

## Open blockers
- Bot/JS blocking on Hypefury pricing + SciSpace/Typeset + Buffer + G2 pricing pages (see `research/blocked.md`).
