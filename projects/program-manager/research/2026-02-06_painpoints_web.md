# Research — Pain points (web, non-Reddit) (2026-02-06)

Scope: Agent for X (priority #1) and Class Chat AI (priority #2).
Constraint: sources may be blocked; continue regardless.

---

## Iteration 1 — workflow pain is usually “time + consistency”, not “writing”

### Agent for X — time sink framing + desire for automations
- Tweet Hunter homepage directly calls out the pain:
  - “Are you spending hours on X every week? Getting unsatisfying results… STOP. Start investing minutes instead of hours.”
  - Source: https://tweethunter.io/
- Embedded social proof highlights **Auto-DM** as a “game changer” (distribution/lead capture pain, not drafting pain).
  - Source: https://tweethunter.io/

Implication:
- users buy relief from *maintenance work* (queueing/scheduling/distribution), not just “AI drafts”.

### Class Chat AI — “verify or it doesn’t count”
- ChatPDF leans hard into citations + side-by-side view (“Answers are linked… making it simple to verify”).
  - Source: https://www.chatpdf.com/

Implication:
- the underlying pain is epistemic: “I can’t trust this unless I can verify quickly.”

---

## Iteration 2 — objection: privacy + data lifecycle control

### Class Chat AI — “I won’t upload proprietary docs” is a mainstream objection
- Direct quote (HN ChatPDF discussion): “I also will not upload a proprietary document to this service.”
  - Source: https://hn.algolia.com/api/v1/items/35626312

### Class Chat AI — concrete controls reduce anxiety (delete endpoints)
- AskYourPDF API includes an explicit delete endpoint for documents.
  - Source: https://docs.askyourpdf.com/ (see DELETE `/v1/api/documents/{doc_id}`)

Implication:
- we should message (and ship) **delete + retention + “what is stored”** as first-class UX.

---

## Iteration 3 — objection: “is it actually using my PDF?” / hallucination fear

### Class Chat AI — users challenge grounding
- Direct quote (HN ChatPDF discussion): “How much is it actually using the PDF and how much is just normal Chat GPT knowledge?”
  - Source: https://hn.algolia.com/api/v1/items/35626312

### Class Chat AI — competitors add explicit citation toggles
- AskYourPDF chat endpoint includes a `cite_source` option.
  - Source: https://docs.askyourpdf.com/

Implication:
- citations aren’t a nice-to-have; they’re the primary objection handler.

---

## Iteration 4 — workflow expectation: background processing + “ready states”

### Class Chat AI — “agent mode” implies latency tradeoffs users will feel
- AskYourPDF docs: `agent_mode` “may take slightly longer but… generally more accurate and higher quality.”
  - Source: https://docs.askyourpdf.com/

Implication:
- if we do multi-step retrieval/agentic workflows, we must productize:
  - progress indicator
  - background processing
  - “ready to chat” states

---

## Iteration 5 — objection: account/platform safety & ToS risk (creator tools)

### Agent for X — competitors proactively answer “Is it safe?” on pricing pages
- Taplio FAQ includes: “Is Taplio safe?” and answers by emphasizing “doesn’t rely on hacks” / “behaves like a real LinkedIn user.”
  - Source: https://taplio.com/pricing

Implication:
- for Agent for X (X automation), we should preempt:
  - “will my account get throttled/banned?”
  - “are you doing anything shady?”
- and we should define an explicit **automation safety policy** (rate limits, user-in-control, transparency).
