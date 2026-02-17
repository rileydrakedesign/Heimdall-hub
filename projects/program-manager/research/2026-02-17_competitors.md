# Competitors / Pricing / Packaging — 2026-02-17

Context: Daily PM sweep. Focus priority order: (1) Agent for X, (2) Class Chat AI.

---

## Iteration 1 — competitors / pricing / packaging (new sources)

### Agent for X (X/Twitter writing + scheduling + growth)

**Typefully** (X + LinkedIn, threads-first)
- Pricing coverage / tiers and key gates (Free/Starter/Creator/Team):
  - https://socialrails.com/blog/typefully-pricing
- Independent review notes (positioning, limitations like tagging):
  - https://efficient.app/apps/typefully
- Official pricing page exists, but readability extract was unreliable in this run (log):
  - https://typefully.com/pricing

**Hypefury** (automation + engagement features)
- Pricing tiers + account limits overview:
  - https://socialrails.com/blog/hypefury-pricing
- Official pricing page blocked by bot verification during fetch (log):
  - https://hypefury.com/features-pricing/

**Sprout Social** (enterprise social management / approvals / add-ons)
- Pricing + add-ons positioning (premium analytics, listening, services):
  - https://sproutsocial.com/pricing/

**Buffer** (multi-platform scheduler)
- Pricing page fetch blocked (Cloudflare) during run (log):
  - https://buffer.com/pricing


### Class Chat AI (edu-focused chat / classroom assistant / tutoring)

**MagicSchool** (teacher tools + student tools; individual + district)
- Pricing structure: Free, Plus (per-user), Custom enterprise/district tier:
  - https://www.magicschool.ai/pricing

**SchoolAI** (Spaces + Mission Control; teacher/district governance)
- Pricing structure (Free/Pro/Scale) with governance + integrations emphasized:
  - https://schoolai.com/pricing

**Khanmigo** (Khan Academy AI tutor)
- Pricing: free for teachers; paid for learners/parents; district tools via request:
  - https://www.khanmigo.ai/pricing

---

## Iteration 2 — pain points/objections (competitor/packaging relevant notes)

### Agent for X
- Typefully review notes suggest **LinkedIn tagging support** is a workflow gap (API constraint), which is a real packaging/tradeoff vs “post in native app for final touches”.
  - https://efficient.app/apps/typefully

### Class Chat AI
- MagicSchool/SchoolAI/Khanmigo all weave **compliance + governance** into plan comparisons, implying “trust features” are not just enterprise—often visible on pricing pages.
  - https://www.magicschool.ai/pricing
  - https://schoolai.com/pricing
  - https://www.khanmigo.ai/pricing

---

## Iteration 3 — workflow expectations (competitor/packaging relevant notes)

### Agent for X
- Sprout’s workflow concept (compose → approval workflows → publishing) appears to be a major enterprise packaging driver, but Sprout Support content was blocked by Cloudflare during fetch (log):
  - https://support.sproutsocial.com/hc/en-us/articles/205974715-Message-Approval-Workflows

### Class Chat AI
- SchoolAI explicitly productizes **observability/governance** (Mission Control, auditability, real-time monitoring) as part of the platform value.
  - https://help.schoolai.com/en/articles/10270403-monitor-student-activity-with-mission-control
  - https://schoolai.com/trust/student-safety
- MagicSchool productizes “Student Rooms” (teacher-created, room-based activities) as a packaging primitive for classroom deployment.
  - https://www.controlaltachieve.com/2025/01/abracadabr-ai-magicschool-ai-rooms-for.html
  - https://www.magicschool.ai/magicstudent

---

## Iteration 4 — channels/marketing tactics (competitor/packaging relevant notes)

### Agent for X
- Typefully runs an affiliate program (distribution lever for creator tooling).
  - https://support.typefully.com/en/articles/8718317-typefully-s-affiliate-program
- Hypefury also runs an affiliate program, but their main landing page is bot-gated during fetch; Crisp Help article is accessible.
  - https://hypefury.crisp.help/en/article/what-is-the-hypefury-affiliate-program-sus7v3/
  - (blocked) https://hypefury.com/affiliate/

### Class Chat AI
- MagicSchool leans heavily into **PD/certifications/webinars** as a GTM channel (training-as-marketing and rollout collateral).
  - https://www.magicschool.ai/professional-development
  - https://www.magicschool.ai/magicschool-for-districts

---

## Iteration 5 — trust/privacy concerns (competitor/packaging relevant notes)

### Agent for X
- Typefully’s privacy policy is explicit about collecting X account identifiers + API keys to operate; also describes encryption and deletion timelines.
  - https://typefully.com/privacy
- X OAuth 2.0 Authorization Code Flow w/ PKCE docs (baseline expectation for secure auth + refresh-token handling).
  - https://docs.x.com/fundamentals/authentication/oauth-2-0/authorization-code

### Class Chat AI
- SchoolAI Trust Center positions SOC2 Type 2 + FERPA/COPPA + "no ads/no data selling" as top-level trust pillars.
  - https://schoolai.com/trust
- MagicSchool privacy claims: no LLM provider storage/training; contractual deletion requirements; “zero data retention” attestations.
  - https://www.magicschool.ai/blog-posts/ai-data-privacy
