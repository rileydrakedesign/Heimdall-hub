# Research — Competitor scan (2026-02-11)

Scope: Agent for X (priority #1) and Class Chat AI (priority #2).
Constraints: some sources are JS-heavy / bot-protected; log when blocked.

---

## Iteration 1 — competitors/pricing/packaging (creator SaaS tiers + “AI automation included”)

### Agent for X — pricing patterns: **mid-tier creator plans ($10–$100/mo) + feature bundling**

#### Tweet Hunter — value prop is an “X growth OS”, not just AI writing
- URL: https://tweethunter.io/pricing
- Packaging signals (from pricing page extract):
  - Core bundle includes: “Over 2M viral tweets library”, “Tweet and thread scheduling”, “Evergreen tweets”, “Auto-DM”, “Auto-plug”, “Auto-retweet”, “Hide URL previews”, analytics, and “Add unlimited Twitter accounts”.
  - AI is presented as a distinct bundle (“AI WRITER”) plus “X CRM” lists + “AI generated replies”.
- Implication for Agent for X:
  - The market is buying **a loop** (discover → write → schedule → engage → measure), and expects automation features to be **first-class**.

#### Postwise — clear tier ladder tied to usage (accounts + AI posts + scheduling horizon)
- URL: https://postwise.ai/pricing
- Pricing/packaging (from page extract):
  - Basic: **$37/mo** (3 accounts, 500 AI posts/mo, 3 months scheduling)
  - Boss: **$59/mo** (5 accounts, 1,000 AI posts/mo, 12 months scheduling)
  - Unlimited: **$97/mo** (unlimited accounts, unlimited AI posts, unlimited scheduling, custom AI training)
- Implication:
  - Users understand “**AI output quotas**” (posts/month) + “**planning horizon**” (months scheduling) as natural axes for pricing.

#### Typefully — “social sets” + team/agency tiers (distribution + permissions are monetized)
- URL: https://typefully.com/pricing
- Pricing/packaging (from page extract via r.jina.ai):
  - Creator: **$12.50/mo** (yearly billing)
  - Team: **$49/mo**
  - Agency: **$99/mo**
  - Plan differentiators prominently include: “Social Sets”, “Total Members”, “Set Members Permissions”, plus integrations (API/Zapier) and AI usage buckets.
- Implication:
  - As soon as you support multiple accounts/brands (“social sets”), **permissions + auditability** become paid unlocks.

### Class Chat AI — pricing pattern: **freemium → low monthly paid**, anchored on “citations” + usage limits

#### Class Chat AI — free plan constrained by uploads + question quota; paid plan gates “unlimited + citations”
- URL: https://classchatai.com/pricing/
- Pricing/packaging (from page extract):
  - Basic: **$0/mo** (3 file uploads, 25 AI questions/month)
  - Business: **$7.99/mo** (unlimited uploads, unlimited classes, “unlimited AI questions with citations”, priority support)
- Implication for Class Chat AI:
  - Pricing is communicating: “**citations = trust feature**” and “**unlimited classes** = power-user workflow”.

#### Piazza — explicit instructor + department licensing (pricing clarity, enterprise path)
- URL: https://support.piazza.com/support/solutions/articles/48001161300-paid-model-for-piazza-q-a
- Pricing/packaging (from page extract):
  - Instructor license: **$379/term (≤400 students)**, **$429/term (≤700)**, **$479/term (unlimited class size)**.
  - Department license: **$9,000/year (≤2,000 students)**, **$12,000/year (≤3,000)**.
- Implication:
  - Academic discussion tools normalize **term-based licensing** and **department contracts** as the enterprise ladder.

---

## Iteration 2 — pain points/objections (ban anxiety + “paywall backlash” + trust in citations)

### Agent for X — core objection: “will this get my account flagged/banned?”

#### Tweet Hunter Terms — explicitly frames “circumventing Twitter’s ToS” as abuse (and grounds termination)
- URL: https://tweethunter.io/terms-of-use
- High-signal excerpt (from terms page extract):
  - Reserves the right to cancel service if you “attempted to abuse our system”, including “using Tweet Hunter to circumvent Twitter's Terms of Service or Policy”.
  - Prohibited uses include violating Twitter’s ToS (anti-spam around tweets/mentions/replies/retweets/DMs).
- Implication for Agent for X:
  - Safety isn’t a nice-to-have: **anti-abuse posture** and explicit constraints reduce conversion friction and protect users.

### Class Chat AI — core objection: “is the answer actually from my docs (or hallucinated)?”

#### Class Chat AI homepage — positions “verified answers with citations” as central value prop
- URL: https://classchatai.com/
- Claim (from page extract): “chat with your documents to get verified answers with citations.”
- Caveat (signal): the page includes low-signal template FAQ content, which can undermine trust.
- Implication:
  - In this category, marketing needs to be **as trustworthy as the product** (polish matters because the promise is verification).

#### Piazza paid model statement — attempts to pre-empt backlash: “we will not be placing ads” + “money shouldn’t be the reason you can’t use Piazza”
- URL: https://support.piazza.com/support/solutions/articles/48001161300-paid-model-for-piazza-q-a
- Implication:
  - Pricing transitions create churn risk; vendors use explicit reassurance (no ads, hardship exceptions) to reduce objection.

---

## Iteration 3 — workflow expectations (agent surfaces + integrations + live learning patterns)

### Agent for X — workflows are becoming **agent-friendly** (MCP/API/Zapier) + **launcher surfaces**

#### Typefully changelog — audit trails + automation origin labels (MCP/API) + Raycast extension
- URL: https://typefully.com/changelog
- Workflow expectations (from changelog extract):
  - “Draft Activity logs every change… and where the change came from. For example, if an AI agent created the draft, it’s labelled MCP or API.”
  - Raycast extension: create drafts across multiple platforms, schedule, manage lifecycle “without opening a browser”.
  - Integration hooks: API + Zapier + MCP + webhooks (Dec 17, 2025 entry).
- Implication for Agent for X:
  - Users will expect: **(1) automation hooks, (2) audit trails, (3) ability to act from wherever they work**.

#### Typefully MCP Server docs — “manage queue through natural conversation”
- URL: https://support.typefully.com/en/articles/13128440-typefully-mcp-server
- Workflow expectation:
  - “Connect your favorite AI assistant… create posts, schedule content, manage your queue… through natural conversation.”
- Implication:
  - A credible Agent for X will need: **a tight permissions model + an audit log** for any AI-driven actions.

### Class Chat AI — workflows in “class chat” are often synchronous + moderated (queueing, polls, breakouts)

#### Campuswire Live Sessions — features reflect classroom reality (queueing + polls + breakout rooms)
- URL: https://campuswire.com/livesessions
- Workflow expectations normalized:
  - “Smart queuing” via raised hands + upvotes.
  - “Active learning” polls and slide presentation.
  - Breakout rooms, including “smart assign” grouping.
- Implication for Class Chat AI:
  - “Chat” is not only doc-Q&A; buyers expect **moderation/queueing primitives** and **structured participation**.

---

## Iteration 4 — channel/marketing tactics (affiliate programs + comparative SEO + “special offer” packaging)

### Agent for X — proven channels: **affiliate** + **comparative SEO** + **in-product lead magnets**

#### Typefully affiliate program — formalizes influencer distribution as a system
- URL: https://support.typefully.com/en/articles/8718317-typefully-s-affiliate-program
- Tactics (from page extract):
  - Positions affiliates as a core growth lever; links to guides and affiliate ToS.
- Implication for Agent for X:
  - A clean affiliate motion (terms + dashboard + payout clarity) can be a primary early channel.

#### Typefully pricing page — “Compare” navigation is basically SEO moat-building
- URL: https://typefully.com/pricing
- “Compare” links (from pricing page extract):
  - Typefully vs Buffer / vs Hypefury / vs TweetHunter / etc.
- Implication:
  - Competitors are investing in **high-intent comparison pages** as durable acquisition.

#### Tweet Hunter pricing page — “special offer” lead magnet bundling
- URL: https://tweethunter.io/pricing
- Tactic (from page extract):
  - “Start your trial and get Tweet Hunter University for free! Our 25+ pages growth guide…”
- Implication:
  - Expect users to respond to **bundled education** (“University”, templates, playbooks) as conversion accelerants.

### Class Chat AI — low-price monthly plans compete on “citations + unlimited” and can ride student SEO

#### Class Chat AI pricing — “unlimited questions with citations” as the upgrade hook
- URL: https://classchatai.com/pricing/

---

## Iteration 5 — trust/privacy concerns (automation compliance + retention + “no ads” promises)

### Agent for X — trust primitives: explicit anti-abuse + data policy + user responsibility boundaries

#### Tweet Hunter privacy policy — standard privacy expectations (collection, retention, transfers)
- URL: https://tweethunter.io/privacy-policy
- Trust signals (from page extract):
  - Explicit sections on retention (“retain… only as long as necessary”), transfers, disclosure.
- Implication:
  - Agent for X needs an equally legible posture (retention window + deletion path + what data is used for training).

#### Tweet Hunter terms — explicitly warns about platform ToS compliance and forbids bots/scraping
- URL: https://tweethunter.io/terms-of-use
- Trust/compliance implication:
  - Any “Agent for X” must bake in **rate limits, caps, and safe defaults** (and explain them as user protection).

### Class Chat AI — trust primitives: pricing reassurance + enterprise licensing options

#### Piazza paid model — reassurance about no ads + exceptions + enterprise license option
- URL: https://support.piazza.com/support/solutions/articles/48001161300-paid-model-for-piazza-q-a
- Implication for Class Chat AI:
  - Education buyers want predictable pricing and clear governance paths (department/district licensing).

---

## Blocked / JS-heavy / bot-protected (logged)
- https://zotgpt.uci.edu/classchat/ (403)
- https://help.x.com/en/rules-and-policies/x-automation (403 / bot protection)
- https://developer.x.com/en/developer-terms/policy (JS-heavy; extraction not usable)
