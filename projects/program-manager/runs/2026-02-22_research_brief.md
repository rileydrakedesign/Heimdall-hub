# Research Brief — 2026-02-22

Priority order:
1) **Agent for X**
2) **Class Chat AI**

## What changed / what we learned today (high signal)

### 1) Creator tools are packaging around quotas + scheduling horizon + “voice” controls (and users accept it)
- Postwise tiers are explicitly defined by: **# social accounts**, **AI-generated posts/month**, **months of scheduling**, plus “Custom AI Voices.”
- Implication for Agent for X: we can safely price/package around **usage + planning horizon**, but must make limits visible and non-surprising.
- Source:
  - https://postwise.ai/pricing

### 2) “Twitter CRM + scheduling” bundles are normal, and risk-reversal is a conversion mechanic
- BlackMagic packages analytics + CRM primitives (notes/reminders) + scheduling (threads/replies/retweets) and sells additional accounts as add-ons.
- It also uses unusually strong risk reversal: **self-serve refunds within 14 days** + self-serve pause/cancel.
- Implication: for Agent for X, **self-serve “pause automation / revoke access / delete data”** should be treated as conversion, not support.
- Source:
  - https://blackmagic.so/pricing

### 3) Affiliate-native distribution is increasingly “productized”—and requires canonical linkable artifacts
- Typefully’s affiliate guidance pushes specific distribution surfaces: unrolled threads, Typefully Profiles, newsletters, videos.
- Implication: we need one URL that affiliates can safely share: **Safety + Limits + Pricing + What we never do**.
- Source:
  - https://support.typefully.com/en/articles/8718327-earn-with-typefully-s-affiliate-program

### 4) Edu comm tools win on course-native workflows; Slack/Discord fail on DM fragmentation
- Instructor report: Slack DM usage becomes a serious teaching pain; Ed Discussion is preferred when Q&A needs to be public/searchable, with anonymity and course features (LaTeX/polls/LTI).
- Implication for Class Chat AI: compete against Slack/Discord not on “chat,” but on **course-native structure + anonymity + governance**.
- Source:
  - https://stattlc.com/2022/07/29/using-ed-discussion-as-a-course-communication-tool/

### 5) Privacy controversies create switching moments and shape “incentive alignment” positioning
- Stanford Daily reporting ties Piazza usage to “Piazza Network” recruiting/data-sharing concerns and notes instructors switching to Ed; quotes emphasize “product company” incentive alignment.
- Implication: Class Chat AI needs explicit top-of-funnel language: **we’re paid by customers, not by selling student data**.
- Source:
  - https://stanforddaily.com/2020/10/04/concerned-with-piazzas-data-privacy-management-some-professors-look-to-alternative-discussion-forums/

## Implications

### Agent for X
- Product:
  - Ship a public **Safety + Limits + Pricing** page (one canonical URL) with explicit caps/budgets and what we don’t automate.
  - Add **self-serve revoke/pause + delete** controls; treat as a “risk reversal” feature.
  - Package by: accounts, monthly usage, and scheduling horizon (market-normal).
- GTM:
  - Prepare for affiliate-native distribution: give affiliates a canonical artifact and a one-paragraph “safe automation” pitch.

### Class Chat AI
- Product:
  - Make “anti-DM-fragmentation” a core value prop (public Q&A, resolved threads, searchable).
  - Offer anonymity as a first-class setting with clear instructor visibility semantics.
- GTM:
  - Lead with incentive alignment + governance (“not funded by selling student data”).

## Blocked sources (today)
- Hypefury features+pricing blocked by bot verification:
  - https://hypefury.com/features-pricing/
- X Help Center “X’s automation development rules” blocked by Cloudflare:
  - https://help.x.com/en/rules-and-policies/x-automation
- blog.x.com developer article on automation and multiple accounts blocked by Cloudflare:
  - https://blog.x.com/developer/en_us/topics/tips/2018/automation-and-the-use-of-multiple-accounts
