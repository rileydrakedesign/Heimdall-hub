# Research Brief — 2026-02-13

Priority order:
1) **Agent for X**
2) **Class Chat AI**

## What changed / what we learned today (high signal)

### 1) Packaging norms are converging on explicit meters (credits/caps) + governance
- Social suites (Later) openly price AI writing via **AI credits** and enforce per-profile publishing limits in lower tiers.
  - Source: https://later.com/pricing/
- Suites treat X as a **paid add-on per connected account** (Metricool: $5/mo per connected X account), a clean model for platform-specific cost/risk.
  - Source: https://metricool.com/pricing/

### 2) Edu AI buyers are trained to buy “governance + contracts,” not just model quality
- MagicSchool: Plus has transparent per-user pricing; District is custom, bundled around **SSO, SIS/LMS integrations, custom DPA, dashboards, tool controls**.
  - Source: https://www.magicschool.ai/pricing
- SchoolAI: even the Free plan markets compliance/certs (**FERPA/COPPA, SOC2, 1EdTech**) on the pricing page; Scale tier adds rostering/SSO and “custom DPAs.”
  - Source: https://schoolai.com/pricing

### 3) Trust positioning works when it’s a behavioral contract
- Khanmigo differentiates from generic chatbots by explicitly claiming it **guides learners** vs “just giving answers.”
  - Source: https://www.khanmigo.ai/

### 4) Procurement/legal objections can be predicted from COPPA mechanics
- FTC COPPA guidance is very explicit about parental notice/consent and security procedures; these become predictable questionnaire items.
  - Source: https://www.ftc.gov/business-guidance/resources/childrens-online-privacy-protection-rule-six-step-compliance-plan-your-business

### 5) X platform economics constrain “Agent for X” pricing
- X Developer Platform docs present **pay-per-usage** pricing (no monthly subscriptions).
  - Source: https://developer.x.com/en/docs/twitter-api/rate-limits

## Implications for our two products

### Agent for X
- Ship pricing/packaging around:
  - seat/account + **explicit automation caps**
  - optional **X add-on per account** (mirrors Metricool)
  - visible “usage meter” (credits) if AI writing is metered
- Trust narrative should include an “Automation Safety Facts” page that explains limits as protective (anti-spam, ToS safety, cost predictability).

### Class Chat AI
- Lead with governance and safety:
  - SSO/LMS/SIS, DPA templates, audit logs, retention/deletion controls
  - teacher-safe defaults + “what not to upload” guidance aligned with existing teacher messaging
  - Source baseline for teacher caution: https://www.commonsense.org/education/reviews/chatgpt

## Blocked sources (today)
- Buffer pricing: https://buffer.com/pricing (403 / bot protection)
- X Help Center policy pages: https://help.x.com/en/rules-and-policies/platform-manipulation-and-spam (403)
- Typefully pricing extraction unreliable: https://typefully.com/pricing
