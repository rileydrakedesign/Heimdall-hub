# Riley Portfolio — Interactive Isometric Room

## Vision
A pixel-art, semi-animated isometric room that acts as the navigation UI.
- Clickable hotspots open routes/panels (Work, About, Contact).
- Feels like a tiny game: ambient motion + hover/click feedback.

## Tech
- Next.js (App Router) + Tailwind
- PixiJS for rendering + interactions
- Playwright for interaction + visual smoke tests

## Current assets (approved)
Stored in the portfolio repo under:
- `public/iso-pixel/dev-room/` (in https://github.com/rileydrakedesign/rileyd-portfolio)

Files:
- `approved_scene_plate.png`
- `base_plate.png`
- `asset_desk_computer_setup.png`
- `asset_developer_character.png`
- `asset_organizational_cabinet.png`
- `manifest.json`

## Next actions
1) Implement `src/components/RoomCanvas.tsx` MVP:
   - create Pixi Application
   - load `base_plate.png` as background
   - load dynamic sprites from `asset_*.png`
   - define hotspot hit areas and route mapping
2) Add a simple interaction test in Playwright.

## Notes
The isometric asset pipeline lives in the OpenClaw workspace under:
- `skills/isometric-pixel-nano-banana/` (generation + extraction workflow)
