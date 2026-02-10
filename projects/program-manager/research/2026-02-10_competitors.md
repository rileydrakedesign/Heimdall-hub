# Research — Competitor scan (2026-02-10)

Scope: Agent for X (priority #1) and Class Chat AI (priority #2).
Constraints: some sources are JS-heavy / bot-protected; log when blocked.

---

## Iteration 1 — competitors/pricing/packaging (credits + per-seat + teacher freemium)

### Agent for X — pricing is converging on **per-seat + credits** (and “AI everywhere” bundles)

#### Motion — explicit per-seat + monthly AI credits + $/credit overage narrative
- URL: https://www.usemotion.com/pricing
- Pricing/packaging (from page extract):
  - Pro AI: **$19/seat/mo** (credits: **7,500 credits/seat/month**, with “25 cents/100 credits” shown)
  - Business AI: **$29/seat/mo** (credits: **15,000 credits/seat/month**, with “19 cents/100 credits” shown)
  - Also notable: permissions/access control appears only on Business tier.
- Implication for Agent for X:
  - Users are being trained to accept **metered AI** and expect **(a) visible quotas and (b) permissions** as you move up-market.

#### Taplio — bundles the full creator loop, with credit framing (AI credits + comment credits)
- URL: https://taplio.com/pricing
- Packaging signals:
  - Explicit “AI credits (per month)” and “Comment credits (per month)” surfaced in the plan comparison.
  - Copy includes an explicit safety objection ("Is Taplio safe?") in the pricing-page FAQ.
- Implication for Agent for X:
  - Competing stacks are **workflow suites**, not “a writing tool”. Packaging uses **credits** for variable-cost operations (generation + engagement).

> Blocked/low-signal today: Hypefury pricing is bot-protected.

### Class Chat AI — education pricing ladders are **Free → per-educator → custom district**

#### MagicSchool — clear educator seat pricing + custom district plan
- URL: https://www.magicschool.ai/pricing
- Pricing/packaging (from page extract):
  - Free
  - Plus: **$8.33 USD/user/mo billed annually** (or **$12.99 monthly**)
  - District: **Custom** ("customization and oversight at scale")
- Implication:
  - Buyers are trained to separate **teacher value** (seat pricing) from **district governance** (custom contracting).

#### Khanmigo — teacher free tier + low consumer price anchor + district “request pricing”
- URL: https://www.khanmigo.ai/pricing
- Packaging signals:
  - Teachers: "Get started — it’s free"
  - Parents/learners: **$4/month** (or **$44/year**)
  - District tools: **Request pricing** (SSO + rostering + CSM)
- Implication for Class Chat AI:
  - A strong price anchor exists at **$4/mo consumer**, but districts pay for **deployment + data + rostering**.

---

## Iteration 2 — pain points/objections (privacy + governance copy is part of the product)

### Agent for X — enterprise-style security postures are now on mainstream productivity tools

#### Motion security page — SOC 2 Type II + “we do not train on your data” + data residency constraints
- URL: https://www.usemotion.com/security
- Notable claims (high-signal excerpts):
  - SOC 2 Type II completed; security kit available by request.
  - Hosted on GCP; data stored in the United States; explicitly says EU-only storage not currently supported.
  - AI policy: Motion uses third-party LLMs; **does not train models on your data**, and states providers do not use inputs/outputs for training.
- Implication for Agent for X:
  - Even “creator-adjacent” agents will be expected to explain: **training defaults, retention, storage region, and security artifacts**.

### Class Chat AI — edtech vendors are explicit about vendor list + “no training” guarantees

#### SchoolAI privacy policy — explicit vendor list + “no training on PII/conversations” commitment
- URL: https://schoolai.com/privacy
- Notable commitments (extract highlights):
  - Mentions FERPA/COPPA posture.
  - Mentions vendors (AWS, ElephantSQL, OpenAI) and claims: AI providers **do not use** PII/conversations/completions for training.
- Implication for Class Chat AI:
  - “Trust” is not vibes; it’s specific: **vendors, what leaves the system, and training/retention posture**.

---

## Iteration 3 — workflow expectations (in-workflow surfaces + integration + rollout mechanics)

### Agent for X — the workflow surface is expanding beyond web apps: extensions + launchers + agents

#### Taplio — Chrome extension + newsletter as workflow + acquisition loop
- URL: https://taplio.com/linkedin-chrome-extension
- Workflow expectation:
  - A free companion extension can deliver **in-context insights + quick actions** and act as top-of-funnel.

#### Typefully — team workflows + automation + “agent hooks” are shipping as first-class features
- URL: https://typefully.com/changelog
- Workflow expectations (from extract):
  - Team collaboration signals: “Draft Activity” change log (audit trail for drafts).
  - Automation surface: Zapier integration + API + MCP + Webhooks mentioned in Dec 17, 2025 entry.
  - New Raycast extension (Feb 10) makes “idea → scheduled post” possible without opening browser.
- Implication for Agent for X:
  - Users will increasingly expect **audit trails**, **approvals**, and **agent-friendly integration points**.

### Class Chat AI — K-12 comm stacks normalize multi-channel delivery + templates + translation

#### ParentSquare mass communications — templates, translations, multi-channel delivery, “no password sharing” social cross-posting
- URL: https://www.parentsquare.com/mass-communications/
- Workflow expectations it normalizes:
  - Message templates and translations.
  - Broadcast to SMS/email/app/web/voice.
  - Social cross-posting without sharing Facebook/Twitter passwords.
- Implication for Class Chat AI:
  - If Class Chat AI touches parent/family comms, buyers will expect **multi-channel + templating + translation + governance**.

#### Remind resources — district rollout artifacts: rostering, SSO, safety/security overviews
- URL: https://www.remind.com/resources
- Workflow expectations:
  - “Fact sheets” for rostering, SSO, safety/security, data dashboards.
- Implication:
  - District purchases come with **implementation collateral** as part of GTM.

---

## Iteration 4 — channel/marketing tactics (affiliates + content engine + proof surfaces)

### Agent for X — affiliate programs are explicit and high-leverage for creator SaaS

#### Taplio affiliates — 30% commission for a year + strict rule against paid ads
- URL: https://taplio.com/affiliates
- Tactics:
  - Revenue calculator + public earnings proof.
  - Commission: **30% for a full year**.
  - Explicit policy: **no paid advertising** allowed.
- Implication for Agent for X:
  - Affiliate motion can be a primary early channel, but you need **clear affiliate rules** and conversion-ready landing.

### Class Chat AI — content marketing is used to sell “responsible AI” + admin outcomes

#### MagicSchool blog index — steady publishing cadence across Trust & Safety + admin/district themes
- URL: https://www.magicschool.ai/blog
- GTM pattern:
  - Frequent posts framed around safety, standards alignment, district governance, and implementation.

#### SchoolAI blog index — publishes “prompt engineering for teachers” + “AI data privacy questions” topics
- URL: https://schoolai.com/blog
- GTM pattern:
  - SEO capture + trust-building (teacher productivity + privacy checklists).

---

## Iteration 5 — trust/privacy concerns (how “trust primitives” are being productized)

### Agent for X — trust primitives: security kits, training defaults, retention, and data residency

#### Motion security + privacy policy — explicit security artifacts + data collection boundaries
- URL: https://www.usemotion.com/security
- URL: https://www.usemotion.com/privacy
- Signals:
  - Security kit + SOC 2 report available by request.
  - Privacy policy details data collected (calendar integrations, cookies/analytics, payment via Stripe).
  - AI security policy describes LLM usage + non-training claim.
- Implication for Agent for X:
  - A lightweight “trust pack” (FAQ + controls + audit log) isn’t optional if you’re automating actions.

### Class Chat AI — trust primitives: child/student data commitments + retention + deletion at school direction

#### ClassDojo privacy policy highlights — student-data addendum + retention driven by school direction
- URL: https://www.classdojo.com/privacy/
- Signals:
  - Explicit student-data addendum and retention/deletion framed as **school-directed**.

#### Remind (ParentSquare) privacy policy — explicitly frames district-provided SIS data + COPPA flows
- URL: https://www.remind.com/privacy-policy

#### MagicSchool AI data privacy explainer — “zero data retention” attestations + admin controls narrative
- URL: https://www.magicschool.ai/blog-posts/ai-data-privacy

#### SchoolAI terms — explicitly prohibits scraping/bots (useful as a trust/legal benchmark for what districts expect)
- URL: https://schoolai.com/terms

---

## Blocked / JS-heavy / bot-protected (logged)
- https://hypefury.com/pricing (bot verification)
- https://www.g2.com/products/motion/reviews (403 / requires JS)
- https://www.g2.com/products/reclaim-ai/reviews (403 / requires JS)
- https://www.g2.com/products/magicschool-ai/reviews (403 / requires JS)
- https://www.g2.com/products/schoolai/reviews (403 / requires JS)
- https://www.reddit.com/r/productivity/search/?q=Motion%20app%20pricing&restrict_sr=1 (403)
- https://www.reddit.com/r/Teachers/search/?q=magicschool%20ai&restrict_sr=1 (403)
- https://www.usemotion.com/features (404)
- https://reclaim.ai/features (404)
- https://www.usemotion.com/affiliate (404)
- https://reclaim.ai/affiliate (404)
- https://taplio.com/blog/is-taplio-safe/ (404)
- https://help.reclaim.ai/en/articles/5528333-privacy-security (404)
- https://www.khanmigo.ai/privacy (404)
- https://taplio.com/privacy (404)
- https://www.chatpdf.com/pricing (404)
