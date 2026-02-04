# Vercel Web Interface Guidelines (working extract)

Source
https://vercel.com/design/guidelines

Purpose
Use these as hard UI quality gates so pages feel designed, not generated.

This file is not a full copy. It is a condensed, actionable checklist distilled from the source.

## Interaction and accessibility gates
- Keyboard works everywhere. All flows keyboard-operable.
- Visible focus rings on every focusable element. Prefer :focus-visible.
- Manage focus in modals and popovers. Trap focus, return focus.
- Respect zoom. Never disable browser zoom.
- Do not block paste in inputs.
- Loading buttons: show a loading indicator while keeping the original label.
- Avoid spinner flicker: delay showing loading state 150–300 ms and enforce a minimum visible time 300–500 ms.
- URL as state when it improves share, refresh, back forward.
- Confirm destructive actions or provide Undo.
- Links are links. Use anchor links for navigation so normal browser behaviors work.
- Announce async updates with polite aria-live.

## Animation gates
- Honor prefers-reduced-motion.
- Prefer CSS transitions over JS driven animations.
- Animate transform and opacity, avoid layout thrash.
- Never transition all.
- Animations are interruptible and action-driven.

## Layout gates
- Optical alignment beats geometry. Adjust by 1px if it looks better.
- Deliberate alignment. Every element aligns to a grid or clear edge.
- Verify responsive coverage: mobile, laptop, ultra-wide. Test at 50% zoom.
- Avoid accidental scrollbars. Fix overflow.
- Let the browser size things. Prefer flex or grid over measuring in JS.

## Content gates
- Inline help before tooltips.
- Skeletons mirror final content to avoid layout shift.
- Accurate page titles.
- No dead ends. Every state has a next step.
- Design empty, sparse, dense, and error states.
- Use the ellipsis character … for follow-up actions.
- Resilient to long user generated content.
- Semantics before aria. Prefer native elements.
- Headings are hierarchical. Provide a skip link.

## Forms gates
- Enter submits when it should.
- Textarea: cmd or ctrl enter submits, enter inserts newline.
- Labels everywhere. Labels activate their fields.
- Keep submit enabled until submission starts, then disable while in flight and show progress.
- Do not block typing. Allow input then validate.
- Do not pre-disable submit. Surface validation by allowing submit.

## How to apply in our landing pages
- Use this file as the final QA pass before merging.
- Any new component must include keyboard and focus behavior.
- Any loading state must implement anti-flicker behavior.
