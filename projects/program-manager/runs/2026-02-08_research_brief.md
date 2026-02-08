# PM Research Brief — 2026-02-08

Priority:
- #1 Agent for X
- #2 Class Chat AI

## What changed vs yesterday
- Found strong evidence that **credits/quotas are now the default pricing UX for “agents”** (per-seat + monthly credits + $/credit overage + admin controls).
  - Sources: https://www.atlassian.com/licensing/rovo , https://clickup.com/pricing , https://asana.com/pricing
- Reinforced that education buyers pay for **integrations + governance** (LMS/SSO, admin dashboards, observability), not “chat quality” alone.
  - Sources: https://www.magicschool.ai/integrations , https://schoolai.com/pricing
- Captured explicit objection-handling patterns around **“Is this safe?”** for creator/social tools.
  - Source: https://taplio.com/pricing
- Added a high-signal trust/privacy benchmark: Notion AI’s detailed **embeddings + retention + training defaults** documentation.
  - Source: https://www.notion.com/help/notion-ai-security-practices
- Logged a new batch of blocked/JS-heavy sources (G2 reviews, Buffer pricing, X Help Center pages).

## Agent for X — GTM takeaways (today)
- **Users are being trained to expect quotas/credits + caps** for advanced/agentic workflows.
  - Evidence lane: ClickUp and Atlassian Rovo Dev both expose credits + overage pricing + usage monitoring.
  - Sources: https://clickup.com/pricing , https://www.atlassian.com/licensing/rovo
- **Safety copy must be direct** (“no hacks/shortcuts”; human-like behavior) and likely needs to map to explicit UX guardrails.
  - Source: https://taplio.com/pricing
- **Chrome extension as top-of-funnel** is a proven wedge (free companion → upsell to full loop).
  - Evidence lane: Taplio’s “Taplio X” extension is usable without subscription.
  - Source: https://taplio.com

## Class Chat AI — GTM takeaways (today)
- Education competitors are selling **rollout mechanics**:
  - LMS embed, SSO/rostering, fewer tabs/logins (teacher adoption).
  - Admin controls + analytics (district governance).
  - Sources: https://www.magicschool.ai/integrations , https://schoolai.com/pricing
- “Student data” trust is communicated as **explicit negative commitments**.
  - Source: https://www.magicschool.ai/privacy-policy
- Strong trust benchmark for “AI inside your data”:
  - Notion AI explains embeddings/vector DB, retention, subprocessors, and training defaults.
  - Source: https://www.notion.com/help/notion-ai-security-practices

## Recommended next step (1 action)
**Ship a “Trust & Controls” surface for both products (same template, different claims):**
- Agent for X: safety caps + preview-before-post + what we never do (no cookies/credential storage; no hacks).
- Class Chat AI: retention controls + “no training on customer data” default + district governance checklist (SSO/LMS + admin dashboards).

Why:
- Competitors that win in regulated contexts are explicit (retention/training/controls), not vague.
  - Evidence: https://www.notion.com/help/notion-ai-security-practices , https://www.magicschool.ai/privacy-policy

## Open blockers
- Bot/JS blocking: G2 reviews (403), Buffer pricing (403), Hypefury bot verification, X Help Center pages (403). See `research/blocked.md`.
