# Web Interface Guidelines QA — Round 1 (content + layout)

Scope reviewed
- `projects/aistudybuddy-landing/outline.md`
- `projects/aistudybuddy-landing/copy.md`

Focus
- Content + Layout guidance from Vercel Web Interface Guidelines (upstream README.md)

## PASS
- Clear, skimmable section structure (hero → proof → demo → how-it-works → features → FAQ → final CTA).
- One primary CTA intent (open beta app) is consistent.
- Demo section is early and treated as proof, not just copy.

## FAIL (actionable)
1) Accurate, specific claims
- Copy currently implies strong privacy stance ("We do not use your documents to train public models") without a linked policy.
Fix
- Either add a dedicated Privacy section/page and link it, or soften the claim to match what we can prove.

2) Avoid dead ends
- The hero secondary link is optional but not specified as an anchor target.
Fix
- Ensure the secondary link points to a real in-page anchor (e.g., #how-it-works or #demo).

3) Headings consistency
- Mix of sentence fragments and full sentences in headings.
Fix
- Pick a consistent heading style for the page (marketing pages: sentence case is fine). Keep it consistent across sections.

4) Proof strip scope creep
- "privacy-first workspace" may be true but needs either a link or a constrained, verifiable phrasing.
Fix
- Only include it if we can back it up with a short policy paragraph + link.

## Suggested edits (quick)
- Choose hero H1 option B or C (more distinctive), then keep all later section headings consistent with that tone.
- Replace the beta reassurance line with a concrete expectation (e.g., "beta is open. create an account and upload PDFs.").

## No exceptions requested
