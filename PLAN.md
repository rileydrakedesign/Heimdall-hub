# Riley Portfolio — Interactive Pixel Isometric Room (Plan)

## Vision
A pixel-art, semi-animated isometric room that acts as the navigation UI.
- Clickable hotspots (drawer, desk mail, monitor, bookshelf, etc.) open pages/panels.
- Feels like a tiny game: ambient motion + hover/click feedback.
- Assets generated with **Nano Banana**.

## Tech choices (initial)
- **Next.js (App Router) + Tailwind** for site shell, routing, and content pages.
- **PixiJS** (`pixi.js` + `@pixi/sound`) for rendering the room, sprites, animation, and interactions.
- **Playwright** + **@playwright/test** for visual regression and interaction smoke tests.
- **@playwright/mcp** installed for future MCP-driven screenshot automation.

## Information architecture
- / (Room)
- /work (My Work)
- /about (About)
- /contact (Contact)

Room hotspots map → routes:
- Drawer → /work
- Desk mail/envelope → /contact
- Mirror/poster/clipboard → /about
- Monitor/terminal → /work (or /projects)

## Implementation phases

### Phase 0 — Scaffold (today)
- [x] Create Next.js project
- [x] Install PixiJS
- [x] Install Playwright + browsers
- [ ] Implement a minimal Pixi canvas on the home page

### Phase 1 — Room MVP
- Create `src/components/RoomCanvas.tsx`:
  - Initialize Pixi Application
  - Load a placeholder room image + 2–3 placeholder sprites
  - Define hotspot hit areas (rectangles/polygons)
  - Cursor change on hover + click handler that calls `router.push()`

### Phase 2 — Asset pipeline
- Establish asset folder structure:
  - `public/assets/room/` (backgrounds)
  - `public/assets/props/` (drawer/mail/etc.)
  - `public/assets/sprites/` (you/mascot)
- Decide sprite sheet format:
  - simplest: individual PNGs
  - better: texture atlas (Pixi can use JSON atlases)
- Nano Banana prompt templates for consistent style:
  - palette constraints
  - isometric angle constraints
  - outline + dithering rules

### Phase 3 — Micro-interactions & polish
- Idle animations (lamp flicker, screen glow, fan spin)
- Open/close drawer animation
- Sound toggles + subtle SFX
- Prefers-reduced-motion support

### Phase 4 — Testing + deployment
- Playwright tests:
  - page loads
  - clicking hotspots navigates
  - screenshot diffs for the room
- Deploy to Vercel

## Open questions for you
1) Preferred palette / references (2–3 links)?
2) Do you want the pages to be full navigations, or in-room modal panels?
3) Any sections beyond Work/About/Contact (e.g. Writing, Speaking, Labs)?
