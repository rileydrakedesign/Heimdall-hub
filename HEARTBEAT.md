# HEARTBEAT.md — active

## Autonomous task: portfolio isometric room scene + Playwright screenshots
On each heartbeat:
1) Check `memory/2026-02-18.md` for the latest state + next steps.
2) Verify the portfolio repo scene is rendering locally:
   - repo: `/home/claw/clawd/work/riley-portfolio`
   - assets: `public/iso-pixel/dev-room/manifest.json` + `base_plate.png` + `asset_*.png`
3) Ensure Playwright can run and actually produces screenshots:
   - run `npm run test:e2e` (or targeted spec)
   - confirm `test-results/room-desktop.png` + `test-results/room-mobile.png` exist
4) If Playwright is stuck/failing, capture the error/logs and fix one blocker per heartbeat.
5) When screenshots exist, send them to Riley in Telegram with a short status.
