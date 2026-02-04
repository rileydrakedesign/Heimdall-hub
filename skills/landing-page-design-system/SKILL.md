---
name: landing-page-design-system
description: Design and build high-quality, non-generic marketing landing pages for SaaS projects using a real design system. Use for landing page planning, information architecture, copy hierarchy, component specs, and implementation with strict QA gates so the UI does not look like "AI slop". Includes hard enforcement of Vercel Web Interface Guidelines and product style token extraction.
---

# Landing Page Design System

## Router
Before building, choose the smallest viable scope.
- Single-page marketing site, default.
- Add Privacy and Terms pages if collecting emails, accepting signups, or claiming privacy stances.

## Mandatory inputs
- Product name and one-sentence promise.
- Primary CTA.
- 1–3 proof assets (screenshots, gif, video, or a live demo link).
- Brand tokens or a reference UI style guide.

If missing, ask for them once.

## Process (do this in order)

### 1) Reference capture
- Collect 2–5 reference sites for layout and hierarchy.
- Extract patterns, not pixels.
Output: `references.md` with links and notes.

### 2) Design tokens
- Extract tokens from the product style guide.
- Do not invent a new aesthetic.
Output: `tokens.md`.

### 3) Page architecture
- Define sections by intent.
- Keep one primary CTA.
- Pair each claim with proof.
Output: `outline.md`.

### 4) Wire-copy
- Write headline, subhead, section headers, and bullets.
- Prefer short, skimmable blocks.
Output: `copy.md`.

### 5) Component spec
- Specify hero, CTA button, feature cards, how-it-works, demo block, FAQ, footer.
- Include states: hover, focus, loading.
Output: `components.md`.

### 6) Build
- Implement using the chosen stack.
- Use semantic HTML first.
- Ensure keyboard and focus behaviors.

### 7) QA gates (hard)
Run through the checklists.
- Vercel Web Interface Guidelines
- Basic performance and accessibility checks
- Visual consistency checks

If QA fails, fix before declaring done.

## Hard enforcement: Vercel Web Interface Guidelines
Always apply the condensed checklist.
Read: `references/vercel-web-interface-guidelines.md`

Convention
When the user types `/web-interface-guidelines`, treat it as a request to review and apply these gates to the current design.

## Hard enforcement: product style tokens
If working on Class Chat AI, read:
- `references/class-chat-style-tokens.md`

## Deliverables (for the hub)
For each landing project, create:
- `plan.md` (decisions and scope)
- `outline.md`
- `copy.md`
- `components.md`
- `qa.md` (completed checklist)

## Non-negotiables
- No decorative randomness.
- No fake testimonials.
- No mismatched spacing scales.
- No missing focus states.
- No vague copy without proof.
