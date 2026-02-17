# Research Brief — 2026-02-17

Priority order:
1) **Agent for X**
2) **Class Chat AI**

## What changed / what we learned today (high signal)

### 1) Creator tools keep “simple ladders,” but the ecosystem is now **affiliate-native**
- Typefully has an official affiliate program (and help-center content for affiliates), suggesting referral is a core GTM loop in this category.
- Source: https://support.typefully.com/en/articles/8718317-typefully-s-affiliate-program
- Hypefury’s affiliate program details (commission tiers) are documented in their Crisp Help Center.
- Source: https://hypefury.crisp.help/en/article/what-is-the-hypefury-affiliate-program-sus7v3/

### 2) Trust risk for X tools is concretely about **token scope + long-lived access**
- X OAuth 2.0 Authorization Code Flow w/ PKCE highlights refresh tokens when `offline.access` scope is used (i.e., long-lived access is an explicit product choice that needs UX/copy).
- Source: https://docs.x.com/fundamentals/authentication/oauth-2-0/authorization-code
- Typefully’s privacy policy explicitly states collecting X identifiers and API access keys; also specifies encryption + deletion windows.
- Source: https://typefully.com/privacy

### 3) Edu AI trust has shifted from “privacy policy” to **observability + adult oversight**
- SchoolAI frames complete transparency (teachers can audit transcripts, monitor in real time) as a core safety feature.
- Sources:
  - https://schoolai.com/trust/student-safety
  - https://help.schoolai.com/en/articles/10270403-monitor-student-activity-with-mission-control

### 4) Edu platforms increasingly lead with **compliance & governance** on pricing/plan pages
- SchoolAI plan comparisons include compliance/certifications + governance tools (SOC2, FERPA/COPPA, integrations) directly on pricing.
- Source: https://schoolai.com/pricing
- MagicSchool’s pricing is explicitly structured for individual educators → plus → district/enterprise oversight.
- Source: https://www.magicschool.ai/pricing

### 5) The “no training / zero retention” claim is becoming a *proof surface* (not a tagline)
- MagicSchool’s AI data privacy explainer makes explicit claims about LLM provider deletion and “zero data retention” attestations.
- Source: https://www.magicschool.ai/blog-posts/ai-data-privacy

## Implications for our two products

### Agent for X
- We should treat **OAuth/token handling** as part of the product (not an implementation detail):
  - explain what scopes are requested, why, and how to revoke
  - show “connected accounts” with last-used time + revoke button
- We should consider an **official affiliate/referral program** earlier than planned (category norm), but only after we have:
  - an authoritative “pricing + limits + safety contract” page that affiliates can link without misinformation.

### Class Chat AI
- “Privacy” alone won’t close deals; **teacher/district observability** is the real trust primitive:
  - transcript visibility, admin dashboards, alerts, audit trails
- Packaging should map to governance requirements (SSO/LMS/SIS + role-based permissions) because that’s what’s advertised right on competitor pricing/trust pages.

## Blocked sources (today)
- Buffer pricing page blocked (Cloudflare): https://buffer.com/pricing
- Buffer support content blocked (Cloudflare): https://support.buffer.com/article/595-features-available-on-each-buffer-plan
- Hypefury official pricing/affiliate pages bot-gated: https://hypefury.com/features-pricing/ and https://hypefury.com/affiliate/
- Sprout Social Support article bot-gated: https://support.sproutsocial.com/hc/en-us/articles/205974715-Message-Approval-Workflows
- Typefully pricing page readability extract low-signal (JS-heavy): https://typefully.com/pricing
