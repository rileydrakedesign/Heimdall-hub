# Rooted Content Agent — Plan

## North star
A repeatable workflow that turns raw ideas + references into **informational Instagram carousel posts** with **consistent branding**, using:
- a single carousel theme per run (pixel art vs photo library)
- full-coverage background image per slide
- text placed in intentional whitespace
- exports that are reviewable and versioned in the hub

## v1 style requirements (confirmed)
- slides: full coverage image backgrounds
- text: added into whitespace (not over busy areas)
- image sources: mix of
  - pixel art generations (nano banana)
  - user-provided image library
- consistency: each carousel uses one theme (all pixel art or all photo library), and branding is consistent across posts

## Core outputs (per run)
Saved under `projects/rooted-content-agent/runs/<run-id>/`
- `brief.md` (input summary: audience, promise, angle)
- `plan.md` (slide-by-slide intent + structure)
- `copy.md` (final slide copy)
- `caption.md` (caption + CTA, optional hashtag set)
- `sources.md` (citations and claims)
- `assets/` (raw images, inspo screenshots)
- `slides/` (exported final images)
- `figma/` (figma file metadata, export notes)

## Folder conventions
Inputs:
- `projects/rooted-content-agent/files/` (mobile uploads)
Asset library:
- `projects/rooted-content-agent/library/images/` (non-pixel sources)
- `projects/rooted-content-agent/library/pixel-art/` (approved pixel art references)
Styles:
- `projects/rooted-content-agent/style/`

## Why Figma (and when it’s worth it)
Figma is worth it if you need:
- consistent typography and layout across many carousels
- easy human review and manual tweaks
- reusable components and templates
- higher visual quality than code-rendered HTML templates

Tradeoffs:
- API/auth setup
- export orchestration complexity

Recommendation:
Start with Figma as the canonical template system. Keep an escape hatch: if export automation becomes the bottleneck, fall back to HTML-render for the same template spec.

## Proposed v1 workflow (end-to-end)
1) Ingest
- read idea + references + inspo
- output `brief.md` with: audience, promise, topic boundary, what not to claim

2) Theme selection
Choose one of:
- Theme A: pixel art (nano banana)
- Theme B: photo library
Output: `theme.json` with palette, typography, spacing, image rules.

3) Carousel plan
- pick a carousel structure (7–10 slides)
- define slide intent and visual instruction per slide
Output: `plan.md`

4) Copy final
- write copy per slide with character budgets
- include emphasis rules (short lines, no clutter)
Output: `copy.md`

5) Image gathering
- for pixel art theme: generate per-slide art prompts, run generations, select best
- for library theme: select images from library + optionally gather via browser
Output: `assets/` and `image_manifest.json`

6) Figma assembly
- create a Figma file from a template
- for each slide, set background image + text fields
- export slides to `slides/`
- save Figma file key and export settings in `figma/`

7) Publish package
- generate `caption.md`
- generate a one-page `qc.md` checklist and pass/fail notes

## Template system (Figma)
We will create one master template file with:
- Frame presets: 1080x1350 (preferred), and optional 1080x1080
- Components:
  - title block
  - body block
  - footer brand mark
  - safe-area guides
- Variables:
  - type scale
  - colors
  - spacing tokens

## Automation plan (Figma API)
Phase 1: manual-assisted
- agent generates `copy.md` and `image_manifest.json`
- you paste into Figma using a structured format
- agent exports instructions

Phase 2: API-assisted
- use Figma API to:
  - duplicate a template file
  - update text nodes by name
  - update image fills by node name
  - export frames

Notes
- This requires a Figma personal access token and a template file key.
- We will store non-secret identifiers in repo. Tokens stay in environment.

## Quality gates
- copy: clarity, density, and one promise per carousel
- design: consistent theme, consistent typography, text always legible
- sources: no overclaiming, citations included when factual

## Milestones
M1: Spec + template
- define 2 themes
- create Figma template
- create first run folder structure

M2: First carousel prototype
- run end-to-end once
- export final slides into repo

M3: Automation
- implement `scripts/rooted_content/` orchestrator
- integrate browser-assisted image gathering
- integrate nano banana generation hook

## Open questions (need answers)
1) Figma basics
- do you already have a Figma template file we should use, or should I create one spec-first?
- do you prefer 1080x1350 or 1080x1080 as default?

2) Branding
- brand name to display (or just a subtle mark)
- font preference (or “use a modern sans”)
- primary palette (2–3 colors)

3) Nano banana
- do you want pixel art to look like: retro game, isometric, or flat 2D?
