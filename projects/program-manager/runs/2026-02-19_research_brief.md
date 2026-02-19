# Research Brief — 2026-02-19

Priority order:
1) **Agent for X**
2) **Class Chat AI**

## What changed / what we learned today (high signal)

### 1) X is often treated as a **paid add-on** (separate cost + separate limits)
- Metricool’s pricing explicitly calls out a Twitter/X add-on and gates “full Twitter/X analytics.”
- Implication: buyers already accept “X is special” packaging; we should **explain X-specific limits and costs** openly rather than hide them.
- Sources:
  - https://metricool.com/pricing/

### 2) Competitors publish **fair-use thresholds** as a trust artifact (not just internal ops)
- Metricool’s Fair Use Policy states a base threshold of **600 posts/brand/month**, triggers manual checks, and can suspend posting during review.
- This is a blueprint for Agent for X: publish caps as “account protection + anti-spam hygiene,” and describe exactly what happens at each threshold.
- Source:
  - https://help.metricool.com/en/article/fair-use-policy-for-social-media-scheduling-oh90gv/

### 3) “Long-lived access” semantics are explicitly documented — and that’s what buyers worry about
- X OAuth docs: access tokens valid ~2 hours by default; `offline.access` issues refresh tokens (“stay connected until you revoke access”).
- Implication: our Safety Contract should explain token lifetime, refresh, storage, revocation, and “what we never do.”
- Source:
  - https://docs.x.com/fundamentals/authentication/oauth-2-0/authorization-code

### 4) Institutions explicitly discourage Discord for official classroom use (FERPA posture)
- CU Boulder OIT: can’t guarantee FERPA-compliant privacy; “does not recommend using Discord for official classroom activities.”
- Implication for Class Chat AI: “FERPA-aligned posture + DPA + accessibility” can be a GTM wedge vs informal tools.
- Source:
  - https://oit.colorado.edu/services/web-content-applications/discord

### 5) LTI integrations trigger a predictable procurement checklist
- BCM’s LTI integration request doc lists: privacy/FERPA, data retention/destruction, DPA, accessibility/VPAT, ToS/privacy policy links, etc.
- Implication: shipping an **IT-ready packet** (DPA template, security page, retention/deletion policy, VPAT link) is part of product.
- Source:
  - https://www.bcm.edu/education/academic-faculty-affairs/faculty-resources/faculty-ed-tech/learning-management-systems/blackboard/blackboard-ultra-course-view/lti-tool-integration-requests

## Implications

### Agent for X
- Build a canonical, linkable **"Limits + Safety + X Costs"** artifact:
  - explicit cadence caps + fair-use logic (and what triggers cooldown)
  - explain X OAuth scopes + offline access + revocation
  - a simple “X API costs and why” section (if applicable)
- Productize safety as UX:
  - visible “posting budget” + warnings before limits
  - “pause all automation” + “revoke access” buttons

### Class Chat AI
- Treat procurement as a first-class funnel:
  - publish DPA/security/retention/accessibility pages
  - provide an LTI data-flow diagram + checklist mapping
- Position against Discord/Slack as the “official classroom-safe” alternative:
  - moderation/audit, private questions to staff, governance, integrations

## Blocked sources (today)
- Buffer pricing Cloudflare blocked:
  - https://buffer.com/pricing
- Discord support community post blocked 403:
  - https://support.discord.com/hc/en-us/community/posts/1500000457362-Discord-for-Education-and-Risk-Assessment
- University of Michigan external tools documentation blocked 403:
  - https://documentation.its.umich.edu/node/847
- Ed Discussion (EdStem) marketing pages appear JS-rendered; readability extraction produced low-signal today:
  - https://edstem.org/
  - https://edstem.org/pricing
