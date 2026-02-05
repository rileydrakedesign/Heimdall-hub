# Agent for X — Landing Page

Repo
- https://github.com/rileydrakedesign/ContentAutomationPlatform

URL
- `/agent-for-x`

Goal
- Minimal landing page consistent with product styling.
- Primary CTA: waitlist email capture.

What shipped (first draft)
- Clean hero + waitlist card
- Feature highlight carousel (sample post/thread + extension + insights + voice)
- Subtle background accent + micro-interactions
- Verified screenshot pipeline (no overlays/popups)

Notes
- Local preview requires dummy Supabase env vars for the repo (landing-only doesn’t use auth, but the app bootstraps Supabase):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
