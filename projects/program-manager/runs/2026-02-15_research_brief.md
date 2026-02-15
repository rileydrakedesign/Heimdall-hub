# Research Brief — 2026-02-15

Priority order:
1) **Agent for X**
2) **Class Chat AI**

## What changed / what we learned today (high signal)

### 1) X creator suites use a simple price ladder, but the real differentiators are “AI writer” + automation + custom-model upsells
- Tweet Hunter (via detailed review) shows a clean ladder ($49 → $99 → $200) where:
  - mid-tier adds AI writer + hooks/ideas + prediction
  - top-tier adds “train a custom model” + AI replies
- Source: https://www.nichepursuits.com/tweet-hunter-review/

### 2) Creator tools face a blunt objection: automations can feel “robotic,” and buyers will read that in third-party comparisons
- Postwise comparison explicitly lists “automations can make ‘seem robotic’.”
- Source: https://kawaak.com/blog/en/postwise-alternatives-us/

### 3) Edu discussion pricing norms: per-term / class-size-based licensing, plus reassurance language is part of adoption
- Piazza’s instructor license ($379/$429/$479 per term by class size) and department licenses ($9k/$12k per year) illustrate how “per-course” markets price.
- Piazza explicitly states “no ads” and includes hardship language (“never want money to be the reason you can’t use Piazza”).
- Source: https://support.piazza.com/support/solutions/articles/48001161300-paid-model-for-piazza-q-a

### 4) Doc-chat trust expectations are now table stakes: citations + side-by-side + delete controls + SOC2 language
- ChatPDF markets citations, side-by-side view, and security claims (encryption + delete controls + SOC2 Type II certified storage provider).
- Source: https://www.chatpdf.com/

### 5) FERPA-era buyer checklists are explicit: “no training,” retention/deletion, access logs, SOC2
- Vendor-facing guidance enumerates exactly what institutions expect from AI vendors.
- Source: https://element451.com/blog/ai-student-data-and-ferpa-compliance

## Implications for our two products

### Agent for X
- Treat “robotic automation” as the central trust objection. Win with:
  - **Safe Mode** (approval workflow + visible caps) and explain *why* limits exist
  - “Voice lock” + diff preview so editing is fast (quality objection)
- Plan ladder should stay legible (like Tweet Hunter/Postwise), but the differentiator is a **clear behavioral contract** around automation.

### Class Chat AI
- Pricing + onboarding should mirror edu norms:
  - term/class-size options (or at least “course pack” pricing)
  - explicit “no ads” stance + deletion/retention controls
- Trust posture should be shipped as artifacts:
  - a 1-page “Data Use + No-Training + Retention/Deletion + Audit Logs” fact sheet
  - citations + side-by-side verification in the core UI

## Blocked sources (today)
- Typefully pricing extract unreliable/low-signal (JS-heavy): https://typefully.com/pricing
- Hypefury pricing bot-protected: https://hypefury.com/pricing
- X Help Center blocked (Cloudflare): https://help.x.com/en/using-x/x-pro
- JHU guidelines blocked (Cloudflare): https://teaching.jhu.edu/university-teaching-policies/generative-ai/guidelines/
- GSU guidance blocked (Cloudflare): https://technology.gsu.edu/technology-services/cybersecurity/university-technology-policies/generative-ai-guidance/
