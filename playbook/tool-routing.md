# Tool Routing (Clawdbot)

Purpose: make tool use fast, consistent, and predictable.

## Default decision tree

1) **Is it repeatable and fragile?**
- Yes → write a **script** (deterministic) and then call it.

2) **Is it multi-step and repeated across requests?**
- Yes → make a **skill** (SKILL.md + scripts + references).

3) **Does it require interactive/authenticated web state?**
- Yes → use **browser automation** or the **Tailscale noVNC remote browser**.

4) **Is it long or involves multiple parallel investigations?**
- Yes → spawn a **sub-agent** and have it report back.

## Quality gates (non-negotiable)

- Never send screenshots/diagrams without visual validation.
- Never claim build passes without an actual build log.
- Never claim security posture without evidence (listeners + ownership or explicit sudo need).

## External actions

- Anything public/external remains ask-first.
