# Research — Pain points (web, non-Reddit) (2026-02-07)

Scope: Agent for X (priority #1) and Class Chat AI (priority #2).
Constraint: sources may be blocked; continue regardless.

---

## Iteration 1 — competitors/pricing/packaging reveals “what hurts enough to pay for”

### Agent for X — pain: free tiers avoid X; paying is about reliability + constraints
- Source: https://publer.com/plans
- Signals:
  - Free excludes X entirely (“You cannot connect Twitter / X accounts in the free version.”)
  - Paid plans emphasize unlimited scheduling + workflows (threads, RSS automations).
- Pain framing:
  - X posting is treated as a higher-risk/higher-value workflow than other socials.

### Class Chat AI — pain: verification is the product (not just answers)
- Source: https://chatdoc.com/
- Signals:
  - “Click Footnotes, Reveal Context” + “Highlight Text, View Quotes” → the pain is “I need to prove this came from the doc.”

---

## Iteration 2 — pain points/objections: safety & abuse anxiety in social tools

### Agent for X — objection: “automation = spam / ToS trouble”
- Source: https://publer.com/plans
- Explicit rationale in pricing/features:
  - “we enforce daily posting limits to prevent spamming and abuse.”
- Implication:
  - Users want automation, but they also want **guardrails** that keep them out of trouble.

---

## Iteration 3 — workflow expectations: users need help asking (and the product must teach them)

### Class Chat AI — pain: broad questions degrade quality; token limits are the hidden constraint
- Source: https://chatdoc.com/blog/chatdoc-guide-how-to-make-good-queries/
- Quotes / specifics worth mirroring in product/UI:
  - “different ways of phrasing a question might lead to entirely different answers”
  - “Ask one question at a time” / “Be specific”
  - Explains token limits as a cause of worse answers when questions are broad.
- Implication:
  - We should ship “question templates” + “tighten your question” UI (and maybe an auto-suggested follow-up thread).

---

## Iteration 4 — channel/marketing tactics: what prospects are trained to believe

### Agent for X — pain: "consistent posting is hard and time-consuming" (template content as demand capture)
- Source: https://typefully.com/blog/twitter-post-templates
- Pain language:
  - “consistently creating engaging content is challenging and very time-consuming.”
- Implication:
  - Marketing that promises “more posts” isn’t enough; it needs to promise **faster, repeatable, on-brand** output.

### Agent for X — pain: consistency + timing + analytics (scheduler value props)
- Source: https://typefully.com/blog/tweet-schedulers
- Normalized pains:
  - maintaining consistency when busy
  - reaching a global audience at the right times
  - tracking analytics to iterate

---

## Iteration 5 — trust/privacy concerns: adoption blockers are explicit and solvable

### Class Chat AI — trust primitive: verifiability (granularity matters)
- Source: https://chatdoc.com/blog/source-tracing-in-ai-document-q-a-making-every-answer-verifiable-with-chatdoc/
- Adoption blocker:
  - “reliability” is a gating concern; they frame tracing as protection against hallucinations.

### Class Chat AI — privacy primitive: audit posture + encryption + user-controlled deletion
- Source: https://www.humata.ai/privacy-policy
- Concrete trust signals:
  - “SOC 2 Type II compliant”
  - encrypted at rest + in transit
  - “Clients have the ability to delete their data permanently at any time.”
- Implication:
  - For Class Chat AI, a privacy page can close deals if it’s specific and control-oriented.
