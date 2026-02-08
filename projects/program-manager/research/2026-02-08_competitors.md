# Research — Competitor scan (2026-02-08)

Scope: Agent for X (priority #1) and Class Chat AI (priority #2).
Constraints: some sources are JS-heavy / bot-protected; log when blocked.

---

## Iteration 1 — competitors/pricing/packaging (work-platform + edtech baselines)

### Agent for X — “AI inside work platforms” are normalizing *agents + credits + per-seat* pricing

#### ClickUp — AI is its own product line (per-user AI tiers + paygo credits)
- URL: https://clickup.com/pricing
- Packaging signals:
  - Core app priced per user (e.g., Unlimited $7/user/mo billed yearly; Business $12/user/mo billed yearly).
  - Separate AI pricing ladder:
    - “Brain AI” $9/user/mo (unlimited assistant + “@Brain Agent” + multi-model chat (ChatGPT/Gemini/Claude) + enterprise search)
    - “Everything AI” $28/user/mo (adds notetaker, automations/dashboards, etc.)
    - “AI Super Credits” pay-as-you-go ("$10 for 10,000 credits")
- Implication for Agent for X:
  - Users are being trained on **(1) per-seat, (2) AI as an add-on, and (3) metered credits** for heavier automations.

#### Asana — “AI Studio + extra credits” as the expansion lever
- URL: https://asana.com/pricing
- Packaging signals:
  - Starter ($10.99/user/mo billed annually) includes “Asana AI” and “AI Studio (with additional credits for purchase)”.
  - Higher tiers add scaled security/compliance (audit log API, SIEM/DLP support) at Enterprise+.
- Implication for Agent for X:
  - **Credits** are a standard monetization model for “agentic” or workflow-heavy features.

#### Atlassian Rovo Dev — explicit usage-based credits + admin quota controls
- URL: https://www.atlassian.com/licensing/rovo
- Pricing:
  - “Rovo Dev Standard is priced at $20 per developer per month” with “2,000 Rovo Dev credits per developer per month”; overage “$0.01 per credit”.
  - Admins can set limits; customers can monitor usage.
- Implication for Agent for X:
  - If Agent for X offers “research + multi-draft + scheduling” loops, **quota visibility + controls** become trust primitives.

### Class Chat AI — districts want “scale packages”: compliance + SSO/LMS + oversight

#### MagicSchool — education-specific packaging: per-educator + custom district plan
- URL: https://www.magicschool.ai/pricing
- Pricing/packaging:
  - Free (individual teacher exploration)
  - Plus: “$8.33 USD/user/mo (billed annually)” / “$12.99 billed monthly”
  - District plan: Custom ("customization and oversight at scale")
- Feature packaging cues:
  - Student workflow features ("Student Rooms", quizzes, batch writing feedback)
  - Admin features (SSO, LMS launch, tool management controls, dashboards)
- Implication for Class Chat AI:
  - Education buyers pay for **rollout + governance** (SSO/LMS, controls, reporting), not just model quality.

#### SchoolAI — competitive bar: RAG + Chrome extension + compliance badges called out on pricing page
- URL: https://schoolai.com/pricing
- Packaging signals (even without explicit $ amounts in extracted text):
  - Free/Pro/Scale tiers emphasize:
    - RAG (Retrieval-Augmented Generation)
    - Chrome Extension
    - “FERPA & COPPA compliant, SOC2 & 1EdTech certified”
    - LMS-integrated student spaces, SIS rostering, audit/observability features (“LLM Audit Traces” by request)
- Implication:
  - Class Chat AI’s enterprise wedge is **compliance + observability** paired with RAG.

---

## Iteration 2 — pain points/objections (pricing FAQ + privacy policies)

### Agent for X — objection: “is this safe?” is being answered directly in competitor FAQs

#### Taplio — “Is Taplio safe?” objection handling (positions itself as human-like behavior)
- URL: https://taplio.com/pricing
- Copy (FAQ excerpt):
  - “Is Taplio safe? Yes… it behaves exactly like a real LinkedIn user would… It doesn’t rely on hacks or shortcuts…”
- Implication for Agent for X:
  - Users *need* a **platform-safety narrative**. For X specifically, this should map to: rate limits, human-in-the-loop review, and “no credential sharing / no scraping” posture.

### Class Chat AI — objection: student data handling must be explicit (what they *don’t* do)

#### MagicSchool privacy policy — explicit “we do not…” commitments (sell/share/train)
- URL: https://www.magicschool.ai/privacy-policy
- Notable commitments (Student Data section):
  - “We do not: Sell student personal data… use student data for targeted advertising… use Student Data to train, fine-tune, or improve… or permit any third-party AI provider to do so.”
  - Mentions FERPA context and school-directed processing.
- Implication:
  - Class Chat AI must ship **plain-English negative commitments** + a separate student-data policy (not buried in generic privacy copy).

---

## Iteration 3 — workflow expectations (integrations + “stay in workflow”)

### Class Chat AI — expectation: launch from LMS/SSO and embed student rooms into coursework

#### MagicSchool integrations page — “launch in the tools you already use”
- URL: https://www.magicschool.ai/integrations
- Workflow expectations it normalizes:
  - LMS embedding (“Add MagicStudent Rooms as course materials… streamline student access”)
  - SSO/rostering (Clever/ClassLink/Microsoft/Google)
  - Admin angle: centralized management of access + analytics
- Implication for Class Chat AI:
  - Integrations are not “nice to have”; they’re the **default adoption path**.

### Agent for X — expectation: a single tool covers idea→draft→schedule→engage→analytics

#### Taplio — bundles creation + scheduling + engagement + analytics
- URL: https://taplio.com
- Signals:
  - “Create… Schedule… Engage… Track performance with advanced analytics”
  - Free Chrome companion extension is used as a top-of-funnel ("Taplio X Chrome extension… without a Taplio subscription")
- Implication for Agent for X:
  - A credible “Agent” pitch is the **full loop**, not a writing assistant.

---

## Iteration 4 — channel/marketing tactics (extension wedge + proof surfaces)

### Class Chat AI — Chrome extension as distribution wedge (“no new tab”)

#### MagicSchool — Chrome extension as in-workflow acquisition + retention
- URL: https://www.magicschool.ai/blog-posts/chrome-extension
- GTM pattern:
  - Extension keeps users in Gmail/Docs; sells convenience.
  - Social proof: Chrome Web Store reviews embedded in the post.
  - CTA ladder: “sign up for free” + “install extension” + upsell to full app.

#### SchoolAI — browser extension page (same “anywhere you teach” framing)
- URL: https://schoolai.com/products/browser-extension
- GTM pattern:
  - Minimal, benefit-first page: “right where you're already working.”

### Agent for X — “secure, no automation” posture used as a differentiator (especially on LinkedIn)

#### AuthoredUp homepage — security/privacy badges are in the hero section
- URL: https://authoredup.com
- Trust/positioning:
  - “100% Secure” (explicitly: “we do not collect your cookies”)
  - “GDPR Compliant” + “Hosted in the EU”
- Implication for Agent for X:
  - If any browser extension is used, competitors are training users to ask: **do you store cookies/credentials?**

---

## Iteration 5 — trust/privacy concerns (enterprise-grade specificity)

### Class Chat AI — “zero retention” + embeddings + SOC2/ISO claims are becoming table stakes

#### Notion AI security practices — detailed explanation of embeddings + retention + training defaults
- URL: https://www.notion.com/help/notion-ai-security-practices
- Notable trust primitives:
  - “By default… do not use Customer Data to train any models”
  - “LLM providers utilize zero data retention for Enterprise plan workspaces”
  - Explains embeddings + vector DB storage; mentions SOC 2 Type 2 + ISO 27001 scope.
- Implication for Class Chat AI:
  - Education buyers will increasingly expect **(1) retention controls, (2) model training defaults, (3) a clear RAG/embedding story, (4) compliance posture**.

### Agent for X — “guardrails + governance” as enterprise narrative (even for marketing tools)

#### Jasper Trust Foundation — “marketing-led, IT-governed AI” framing
- URL: https://www.jasper.ai/trust
- Implication:
  - Even in creator tools, the trust narrative is shifting from “quality output” → “governed workflows + permissions + compliance.”
