# Research — Web pain points scan (2026-02-10)

Scope: Agent for X (priority #1) and Class Chat AI (priority #2).
Method: pull pain points / objections / workflow expectations from competitor pricing pages, FAQs, and privacy/security docs.
Constraints: some sources are blocked (403/bot). Logged.

---

## Iteration 1 — competitors/pricing/packaging → implied buyer anxieties

### Agent for X — buyer anxiety is *cost volatility + governance* (credits + permissions)

- Motion pricing exposes AI credits/seat/month and shows an explicit $/credit line; higher tier adds permissions/access control.
  - URL: https://www.usemotion.com/pricing

- Taplio pricing bakes in “AI credits” + “comment credits” — meaning the product assumes users want the **creation + engagement** loop.
  - URL: https://taplio.com/pricing

**Pain point implied:** users want automation, but fear (1) runaway usage costs and (2) losing control as the system becomes more agentic.

### Class Chat AI — teacher freemium + district monetization is the standard ladder

- MagicSchool: $0 → $/educator → custom district.
  - URL: https://www.magicschool.ai/pricing

- Khanmigo: free for teachers, low consumer anchor ($4/mo), district tools are “request pricing” with SSO/rostering + CSM.
  - URL: https://www.khanmigo.ai/pricing

**Pain point implied:** districts don’t pay for “chat”, they pay for **rollout, governance, and outcomes evidence**.

---

## Iteration 2 — pain points/objections (explicitly stated in trust docs)

### Agent for X — objection set looks increasingly like enterprise procurement

- Motion security page directly addresses:
  - SOC 2 Type II
  - security kit availability
  - “does not train on your data” claim for AI
  - data residency limitations (US-hosted)
  - URL: https://www.usemotion.com/security

**Objection patterns to expect for Agent for X:**
- “Do you train on my drafts/analytics?”
- “Where is my data stored?”
- “Can you provide a security kit / SOC2 report?”

### Class Chat AI — objection: “what exactly happens to student data?”

- SchoolAI privacy policy explicitly discusses Student Data categories and states it anonymizes/masks data sent to third parties, and claims providers (incl. OpenAI) do not use PII/conversations for training.
  - URL: https://schoolai.com/privacy

- MagicSchool privacy/security page positions itself as evaluated for safety/privacy and emphasizes not encouraging PII submission.
  - URL: https://www.magicschool.ai/privacy

**Objection patterns:**
- “Does the vendor store or train on chats?”
- “What vendors/subprocessors touch the data?”
- “Can we sign a DPA and control retention/deletion?”

---

## Iteration 3 — workflow expectations (what users now assume)

### Agent for X — expectation: **auditable content ops** + integrations

- Typefully changelog shows teams want audit trails (“Draft Activity”) and automation primitives (Zapier, API, webhooks, MCP).
  - URL: https://typefully.com/changelog

- Taplio extension copy implies users want a free in-context companion for creation/engagement/lead workflows.
  - URL: https://taplio.com/linkedin-chrome-extension

**Workflow expectation:** users will increasingly demand:
- approvals + audit logs (“what changed after I reviewed?”)
- integration hooks so the agent can sit inside existing systems

### Class Chat AI — expectation: district comm stacks ship *templates, translation, and multi-channel* by default

- ParentSquare mass communications normalizes templates + translations + SMS/email/app/web/voice broadcasts.
  - URL: https://www.parentsquare.com/mass-communications/

- Remind resources page functions as implementation library (rostering, SSO, safety/security, dashboards).
  - URL: https://www.remind.com/resources

**Workflow expectation:** districts expect both the product and the rollout package (fact sheets, onboarding decks, admin analytics).

---

## Iteration 4 — channel/marketing tactics (what’s working as top-of-funnel)

### Agent for X — affiliates + “earnings proof” is a mature playbook

- Taplio affiliate program has:
  - strong commission (30% for a year)
  - explicit rule: no paid ads
  - social proof (named creators + earned amounts)
  - URL: https://taplio.com/affiliates

**Pain point behind the tactic:** creators trust other creators more than ads; affiliate programs convert when the product has a clear promise + proof.

### Class Chat AI — content engine aims at “responsible AI” + admin enablement

- MagicSchool blog cadence includes Trust & Safety and district adoption topics.
  - URL: https://www.magicschool.ai/blog

- SchoolAI blog includes “prompt engineering for teachers” and AI privacy question lists.
  - URL: https://schoolai.com/blog

**Pain point behind the tactic:** teachers need better prompts/workflows; admins need privacy checklists and implementation guidance.

---

## Iteration 5 — trust/privacy concerns (deep trust requirements)

### Agent for X — trust requirements: “no training”, retention, and clear data boundaries

- Motion AI security policy (embedded in security page) explicitly claims inputs/outputs are not used for training; mentions temporary retention for debugging/performance.
  - URL: https://www.usemotion.com/security

- Typefully privacy policy explicitly states it won’t open drafts unless asked; includes deletion window language (purge within 30 days).
  - URL: https://typefully.com/privacy

**Trust requirement:** publish a plain-English “what we access / what we store / how to delete” statement; add user-visible controls and logs.

### Class Chat AI — trust requirements: child/student data commitments + school-directed retention

- ClassDojo privacy highlights retention/deletion tied to school direction and provides student-data addendum.
  - URL: https://www.classdojo.com/privacy/

- Remind (ParentSquare) privacy policy emphasizes district-provided SIS data and COPPA handling.
  - URL: https://www.remind.com/privacy-policy

- MagicSchool AI data privacy explainer emphasizes “no store/train on PII” and signed attestations/zero data retention claims.
  - URL: https://www.magicschool.ai/blog-posts/ai-data-privacy

**Trust requirement:** districts want explicit commitments plus artifacts (DPA, retention/deletion workflows, admin visibility).

---

## Blocked / JS-heavy / bot-protected (logged)
- Reddit searches (403):
  - https://www.reddit.com/r/productivity/search/?q=Motion%20app%20pricing&restrict_sr=1
  - https://www.reddit.com/r/Teachers/search/?q=magicschool%20ai&restrict_sr=1
- G2 reviews (403 / JS required):
  - https://www.g2.com/products/motion/reviews
  - https://www.g2.com/products/reclaim-ai/reviews
  - https://www.g2.com/products/magicschool-ai/reviews
  - https://www.g2.com/products/schoolai/reviews
