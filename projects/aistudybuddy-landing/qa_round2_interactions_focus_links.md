# Web Interface Guidelines QA — Round 2 (interactions + focus + links)

Scope reviewed
- Implemented landing app: `work/AIStudyBuddy/landing/src/App.tsx`

Focus
- Interactions, focus, links, anchors, and common navigation behaviors.

## PASS
- Links are links: primary CTAs and nav use `<a href>`.
- Skip link exists and is visible on focus.
- Anchor targets exist for in-page navigation (`#demo`, `#privacy`, `#terms`) and sections use `scroll-mt-24` to account for sticky header.

## FAIL (actionable)
1) Focus-visible states for non-button links
- `a:hover` is defined via Tailwind classes, but non-CTA links rely on browser default focus.
Fix
- Ensure all nav and footer links have clear focus-visible styling (not only the global `:focus-visible`). Consider adding `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-900`.

2) Accordion accessibility
- `<details>/<summary>` is good baseline, but the summary has `list-none` and no explicit focus styling.
Fix
- Add focus-visible styling to `<summary>` and ensure the hit target is generous.

3) Loading button pattern (future)
- The CTA is a link, so no loading state needed. If we add email capture forms later, apply the loading label guidance.

## Notes
- The page is mostly static, so many guidelines about optimistic updates and loading flicker are not applicable.
- Next QA pass should happen after we add real Privacy/Terms pages or real external links.

## No exceptions requested
