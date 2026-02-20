# Research Brief — 2026-02-20

Priority order:
1) **Agent for X**
2) **Class Chat AI**

## What changed / what we learned today (high signal)

### 1) X’s upstream economics strongly suggest **credits + visible budgets** packaging
- X Developer Platform positions the X API as **pay-per-usage** (“No monthly subscriptions — pay only for what you use”).
- Implication: if Agent for X touches the API (even indirectly via providers), buyers will accept (and expect) **explicit caps/credits** + a UI that shows “posting budget.”
- Source:
  - https://docs.x.com/overview

### 2) “Growth loop completeness” is the baseline expectation for X creator tools
- Tweet Hunter’s pricing ladder bundles scheduling + evergreen queues + analytics + automation + CRM lists.
- Implication: our wedge can’t be “AI writing” alone; it must be **voice + safety + in-context surfaces**, while staying composable (integrations) so we’re not forced into full-suite bloat.
- Source:
  - https://tweethunter.io/pricing

### 3) Affiliate programs are not optional in creator tooling (and they drag trust/safety to top-of-funnel)
- Hypefury’s affiliate program pays recurring commissions (25% → 35% tiers).
- Implication: before we open an affiliate loop, we need canonical public artifacts: **Limits + Safety + Permissions + Revocation**.
- Source:
  - https://hypefury.crisp.help/en/article/what-is-the-hypefury-affiliate-program-sus7v3/

### 4) Classroom comms category is anchored by **“free forever”** and **“replace Piazza”** positioning
- Campuswire homepage leads with “free forever,” and positions itself as “replaces: LMS forums, Piazza” while bundling video office hours + clickers.
- Implication: Class Chat AI must justify paid value via **governance + trust + integrations** (not “chat quality”).
- Sources:
  - https://campuswire.com/
  - https://medium.com/campuswire/campuswire-faqs-c6993d93cb29

### 5) “We will never sell student data” is becoming the *headline* trust wedge in edu tools
- Campuswire’s “vs Piazza” post leads with student-data privacy and explicitly contrasts incentive alignment (paid product) vs “free funded by selling data.”
- Stanford Daily reinforces the Piazza Network/employer-data-sharing concern as a real narrative driver.
- Implication: if Class Chat AI handles course data or PDFs, trust copy can’t be generic — it should be an explicit, auditable **data-use contract**.
- Sources:
  - https://medium.com/campuswire/campuswire-vs-piazza-a-breakdown-e9a9d99896d8
  - https://stanforddaily.com/2020/10/04/concerned-with-piazzas-data-privacy-management-some-professors-look-to-alternative-discussion-forums/

## Implications

### Agent for X
- Position around: **“voice + safety + in-context replies”** rather than generic “AI writes tweets.”
- Product requirements that double as conversion:
  - Visible posting budget + caps
  - One-click pause + revoke access
  - Public “Limits + Safety + Permissions” page (linkable; affiliate-ready)

### Class Chat AI
- Win paid vs free by shipping:
  - governance/audit + admin controls
  - privacy posture (“never sell data” + retention/deletion controls)
  - LMS/SSO/LTI readiness + paperwork packet

## Blocked sources (today)
- Hypefury main pricing/affiliate landing pages show bot verification in our pipeline:
  - https://hypefury.com/pricing
  - https://hypefury.com/affiliate/
- Buffer pricing Cloudflare blocked:
  - https://buffer.com/pricing
- Reddit thread about Campuswire pricing/experience blocked 403:
  - https://www.reddit.com/r/Professors/comments/gz3xdr/campuswire_live_sessions_is_very_good/
- Product Hunt reviews blocked (Cloudflare):
  - https://www.producthunt.com/products/typefully/reviews
