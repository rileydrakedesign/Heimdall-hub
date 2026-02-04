# AIStudyBuddy / Class Chat AI — Landing Site Plan

## 1) What I learned from the repo (so far)

### Product
- **Name (in repo):** Class Chat AI (a.k.a. AIStudyBuddy)
- **What it does:** Students upload course PDFs (slides/textbooks/notes) and ask questions.
- **Core differentiator:** **Verifiable answers** grounded in the student’s *own* materials with **inline citations** (and in doc mode, citation → jump-to-page).
- **Two primary modes:**
  1) **Chat with a class** (multi-document retrieval)
  2) **Chat with a document** (single document + page navigation)
- **Why it wins vs “just use ChatGPT”:** trust + course-specific grounding + fast retrieval across *their* docs.

### Target user
- College/university students (18–30), reading-heavy classes, already using AI tools but worried about hallucinations and wasted time hunting through PDFs.

### Key user jobs-to-be-done
- “Find where the professor/textbook covers X.”
- “Explain X *using my course materials* and show me where it came from.”
- “Study faster without sacrificing trust.”

### Conversion goal (assumption to confirm)
Because the product is **pre-launch/beta** in the brief, the landing should optimize for a single primary action:
- **Primary CTA:** *Try the app* (if open) OR *Join the waitlist / request beta access* (if gated)

> Riley: confirm whether anyone can sign up right now at `app.classchatai.com` or if we’re still gating access.

---

## 2) Landing site information architecture (minimal, high-converting)

### Core message (one sentence)
**“Ask questions across your class PDFs and get reliable answers with citations.”**

### Proof points (only the ones that move the needle)
1) **Citations you can click** → instantly verify
2) **Search across all course docs** (not one PDF at a time)
3) **Fast workflow** (upload → ask → jump to source)
4) **Privacy posture** (encrypted at rest / your workspace)

### What we should *not* do
- Don’t lead with architecture/tech stack.
- Don’t list every feature mode (study guides/quotes/etc.) on the first pass.
- Don’t overload with multiple CTAs.

---

## 3) Page outlines (intentional)

### Page 1 — Home (single landing page)
**Goal:** convert (Try / Join waitlist) in under ~60 seconds.

**Sections**
1) **Hero**
   - Headline: clear promise (verifiable answers from *your* class docs)
   - Subhead: 1 sentence explaining the workflow
   - Primary CTA (one): “Try Class Chat” / “Get beta access”
   - Secondary CTA (optional): “Watch demo” (only if we have a short video/gif)
2) **Social proof / trust bar** (lightweight)
   - “Built for students” + 2–3 credibility signals (privacy, citations, speed)
3) **Problem → Solution (tight)**
   - 3 bullets: Ctrl+F fails, cross-doc hunting, AI hallucinations
   - Then: “Class Chat AI fixes this with cited answers from your materials.”
4) **How it works (3 steps)**
   - Upload → Ask → Verify (click citation / jump to page)
   - Use 1 annotated screenshot or short loop
5) **Key features (3 cards, max 4)**
   - Multi-doc class chat
   - Inline citations
   - Doc viewer jump-to-page
   - Privacy-first workspace (optional)
6) **FAQ (5 questions max)**
   - “Does it use my files to train models?”
   - “What file types are supported?”
   - “How are citations generated?”
   - “Is this allowed for school?” (academic integrity framing)
   - “Is there a free plan?” (or “pricing” if needed)
7) **Final CTA**
   - Repeat the primary CTA with a short reassurance line
8) **Footer**
   - Links: Privacy, Terms, Contact

**Primary UX decisions**
- Keep scanning-friendly (short sections, strong hierarchy, minimal paragraphs).
- Always pair claims with proof: citation demo beats copy.

---

### Page 2 — Pricing (optional, only if we’re ready)
**Goal:** reduce uncertainty; provide a simple path to paid.

**Structure**
- Two tiers max on first pass:
  - Free (limited uploads/queries)
  - Pro (higher limits + priority)
- Include: “What happens if I hit limits?” + “Cancel anytime.”

> If pricing is not finalized, replace this page with **Waitlist** and collect emails.

---

### Page 3 — Privacy (required)
**Goal:** reduce the #1 adoption blocker (uploading class materials).

**Sections**
- What we store
- Encryption & retention basics
- Model training stance (explicit)
- Data deletion request path

---

### Page 4 — Terms (required)
Standard SaaS terms + acceptable use.

---

### Page 5 — Contact (tiny)
Email + “Report a bug” link (and optionally a short form).

---

## 4) Content inputs I need from you (to finish the first draft)
1) Final product naming: **Class Chat AI** vs **AIStudyBuddy** (pick one for the landing headline)
2) Primary CTA: **Try now** vs **Request beta / waitlist**
3) Any existing brand assets: logo, wordmark, preferred font, screenshots, demo video
4) What’s the one thing you *most* want users to believe? (e.g., “I can trust it” vs “It saves me time”)
