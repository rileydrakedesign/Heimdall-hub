---
name: web-interface-guidelines
description: Enforce Vercel Web Interface Guidelines as a first-class QA gate during UI development. Use when reviewing or building web UIs, landing pages, forms, interactions, accessibility, animations, layout, and content states. Trigger on requests like "/web-interface-guidelines", "apply vercel guidelines", "UI QA", or "make it not AI slop".
---

# Web Interface Guidelines (Vercel)

This skill uses the upstream Vercel-labs Web Interface Guidelines repo *verbatim* (vendored) for QA.

Upstream source (vendored)
- Repo: https://github.com/vercel-labs/web-interface-guidelines
- Pinned commit: see `references/upstream/COMMIT_PIN.txt`

## How to use this skill

### A) Quick QA pass (default)
When asked to review a UI, produce:
1) A short summary of what was reviewed (page/component/state)
2) A checklist of PASS/FAIL items grouped by section:
   - Interactions
   - Animations
   - Layout
   - Content
   - Forms
3) Concrete fixes for each FAIL item (what to change and where)

### B) Hard gate for merges
When the user says to enforce as a hard gate, do not declare "done" until:
- all FAIL items are resolved, or
- the user explicitly accepts the exceptions (list them)

## What to read
- Read the upstream markdown in `references/upstream/` as the canonical text.
- Prefer the original wording when quoting rules.

Suggested entrypoint files (may change upstream):
- `references/upstream/README.md`
- `references/upstream/src/content/*.mdx` (if present)

## Output format
Write a QA report markdown block that can be pasted into `qa.md`:

- Title: Web Interface Guidelines QA
- Scope reviewed
- PASS list (short)
- FAIL list (actionable)
- Exceptions (if any)

## Notes
- These are guidelines, not laws. Treat them as defaults.
- Accessibility and keyboard support are never optional.
