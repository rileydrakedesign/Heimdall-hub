# PM Research Brief — 2026-02-10

Priority:
- #1 Agent for X
- #2 Class Chat AI

## What changed vs last sweep
- Confirmed **per-seat + monthly credits + $/credit overage** is a mainstream pricing pattern (Motion explicitly publishes credits/seat/month + a cents-per-credits line).
  - Source: https://www.usemotion.com/pricing
- Captured a high-signal trust benchmark for “agentic work apps”: **SOC2 + security kit + explicit AI non-training claims** (Motion security page).
  - Source: https://www.usemotion.com/security
- Found a strong creator-SaaS channel pattern: **affiliate program as primary growth engine** (Taplio: 30% commission for a year; no paid ads).
  - Source: https://taplio.com/affiliates
- Reinforced that districts pay for **rollout mechanics + governance** (SSO/rostering resources; multi-channel comm norms).
  - Sources: https://www.remind.com/resources , https://www.parentsquare.com/mass-communications/
- Logged a large set of blocked sources (G2, Reddit, some vendor pages returning 404/bot).

## Agent for X — GTM takeaways (today)
- **Pricing expectation:** if/when Agent for X becomes more agentic, buyers will expect **credit visibility + caps** (Motion publishes credits, Taplio publishes AI/comment credits).
  - Sources: https://www.usemotion.com/pricing , https://taplio.com/pricing
- **Trust posture is now feature-level:** Motion’s security page reads like an enterprise product (SOC2, security kit, AI non-training, storage region constraints).
  - Source: https://www.usemotion.com/security
- **Workflow expectation is shifting to “agent-friendly surfaces”:** Typefully is shipping audit trails and integration hooks (Zapier/API/MCP/webhooks) plus launcher surfaces (Raycast).
  - Source: https://typefully.com/changelog
- **Channel:** creators sell to creators. Taplio’s affiliate program is extremely explicit and proof-heavy.
  - Source: https://taplio.com/affiliates

## Class Chat AI — GTM takeaways (today)
- **District comm expectations:** ParentSquare normalizes templates, translations, and SMS/email/app/web/voice broadcast. If Class Chat AI touches parent comms, this is the baseline.
  - Source: https://www.parentsquare.com/mass-communications/
- **Implementation collateral is part of the product:** Remind’s resource library is effectively an enablement hub (rostering, SSO, safety/security, dashboards).
  - Source: https://www.remind.com/resources
- **Trust language is moving toward attestations and explicit vendor posture:** MagicSchool’s AI privacy explainer includes zero-retention attestations; SchoolAI privacy explicitly lists vendors and non-training claims.
  - Sources: https://www.magicschool.ai/blog-posts/ai-data-privacy , https://schoolai.com/privacy

## Recommended next step (1 action)
**Ship a single "Trust Pack" page template (reuse for both products) + link it from pricing and onboarding.**

Minimum contents (copy + UX):
- Training defaults ("we do/do not train on your data")
- Retention window + deletion workflow
- Subprocessors / vendors list
- Security artifacts: SOC2 status + how to request security kit
- For Agent for X: caps + approvals + audit log (“what posted when”)
- For Class Chat AI: district DPA + school-directed retention + admin visibility

Why:
- Competitors are increasingly explicit, and this content is doing conversion work.
  - Sources: https://www.usemotion.com/security , https://schoolai.com/privacy , https://www.magicschool.ai/blog-posts/ai-data-privacy

## Open blockers
- Bot/JS blocking: G2 reviews (403), Reddit (403), Hypefury bot verification, multiple vendor pages returning 404. See `research/blocked.md`.
