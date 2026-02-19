# Pain Points / Objections (Web) — 2026-02-19

Context: Daily PM sweep (ITERATIVE, deeper). Focus priority order: (1) Agent for X, (2) Class Chat AI.

---

## Iteration 1 — competitors/pricing/packaging (pain points implied by packaging)

### Agent for X
- **X is expensive/fragile enough to be an add-on**: Metricool explicitly requires a Twitter/X add-on for access + “full Twitter/X analytics.” Pain signal: buyers expect special constraints/costs for X.
  - https://metricool.com/pricing/
- **Enterprise suites are bundling “AI assistants” into baseline plans** (AI writing isn’t a wedge; trust/voice/safety is).
  - https://www.hootsuite.com/plans

### Class Chat AI
- **Paid-model backlash is expected**: Piazza’s doc front-loads reassurance (“no ads”, hardship accommodations) which implies the pain isn’t only price; it’s perceived exploitation + classroom equity.
  - https://support.piazza.com/support/solutions/articles/48001161300-paid-model-for-piazza-q-a

---

## Iteration 2 — pain points/objections (explicitly stated)

### Agent for X
- **Spam/throttle fear manifests as “fair use” policies**: Metricool publishes a fair-use policy warning against repetitive posts and describes suspension/manual review above a threshold.
  - https://help.metricool.com/en/article/fair-use-policy-for-social-media-scheduling-oh90gv/

### Class Chat AI
- **Institutional “no” is blunt**: CU Boulder OIT explicitly says it can’t guarantee FERPA-compliant privacy for Discord servers and therefore does not recommend Discord for official classroom activities.
  - https://oit.colorado.edu/services/web-content-applications/discord
- **Instructor fear: exposing roster/enrollment info** (FERPA interpretation + external platform risk) shows up repeatedly in professor discussions.
  - https://www.reddit.com/r/Professors/comments/s3uahf/classroom_discord/

---

## Iteration 3 — workflow expectations (where users complain when tools don’t fit)

### Agent for X
- **Expectation: a unified loop** (publish + analytics + inbox + competitor tracking). Tools like Metricool/Hootsuite normalize the “suite” expectation, which creates pressure on narrow tools to feel “in-context” (extension) or “composable” (integrations) to avoid dashboard bloat.
  - https://metricool.com/pricing/
  - https://www.hootsuite.com/plans

### Class Chat AI
- **Expectation: channel separation** (Ed for durable Q&A; Discord for live office-hours queue). UW course tools page is a concrete example of the split.
  - https://courses.cs.washington.edu/courses/cse373/20au/course_tools/

---

## Iteration 4 — channel/marketing tactics (objections that show up during distribution)

### Agent for X
- **Buyers will encounter third-party “pricing sources” and policy claims**. If we don’t publish canonical “Limits + Safety” artifacts, affiliates/SEO pages will fill the vacuum.
  - (Competitive example of explicit, public guardrail artifact) https://help.metricool.com/en/article/fair-use-policy-for-social-media-scheduling-oh90gv/

### Class Chat AI
- **Procurement/IT gatekeeping**: LTI integrations are treated as data-sharing events that require documentation (ToS, privacy policy, accessibility templates, DPA). This is a distribution blocker unless you ship the paperwork.
  - https://www.bcm.edu/education/academic-faculty-affairs/faculty-resources/faculty-ed-tech/learning-management-systems/blackboard/blackboard-ultra-course-view/lti-tool-integration-requests

---

## Iteration 5 — trust/privacy concerns (the “deal killers”)

### Agent for X
- **Refresh tokens / offline access is scary unless explained**: X docs explicitly state access tokens expire in ~2 hours unless `offline.access` is used; refresh tokens keep you connected until revocation.
  - https://docs.x.com/fundamentals/authentication/oauth-2-0/authorization-code

### Class Chat AI
- **FERPA is the canonical frame**: authoritative landing page + links to statutes/regulations (what legal/procurement wants to cite).
  - https://studentprivacy.ed.gov/ferpa
- **External platforms not under institutional contract = trust risk**: CU’s registrar page is a reminder that FERPA is broad and applies across “education records.”
  - https://www.colorado.edu/registrar/students/records/ferpa

Blocked / 403 today (log)
- Buffer pricing (Cloudflare): https://buffer.com/pricing
- Discord support community thread (bot protection / 403): https://support.discord.com/hc/en-us/community/posts/1500000457362-Discord-for-Education-and-Risk-Assessment
- University of Michigan external tools page (bot protection / 403): https://documentation.its.umich.edu/node/847
