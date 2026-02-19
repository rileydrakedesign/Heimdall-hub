# HEARTBEAT.md — Dispatcher + Task Queue

## Dispatch Rules
1. Scan **Active Tasks** below for status `active` or `blocked`.
2. Work active tasks in priority order (urgent → high → medium → low).
   - Run the **Check**. Pass → mark `done`, move to Completed, notify Riley.
   - Fail → execute **Next step**. One blocker per task per heartbeat.
   - Update **Log** and **Updated** after any action.
3. Blocked tasks → check if blocker cleared → flip to `active`.
4. Notify Riley only on: completion, 3+ heartbeat stalls, decisions needed.
5. No active tasks → `HEARTBEAT_OK`.

Periodic (rotate, not every heartbeat):
- Maintain `MEMORY.md` from daily logs (every ~3 days).
- Refresh `memory/latest.md` with last 24–48h summary.
- Check `docs/now.md` is current.

---

## Active Tasks

### TASK-001: Portfolio isometric room — Playwright screenshots
- **Status:** active
- **Priority:** high
- **Created:** 2026-02-18
- **Updated:** 2026-02-18
- **Owner:** Heimdall
- **Objective:** Get isometric pixel room rendering in riley-portfolio + produce desktop/mobile Playwright screenshots
- **Check:** `test-results/room-desktop.png` + `test-results/room-mobile.png` exist in `work/riley-portfolio/`
- **Next step:** Debug Playwright — ensure Chromium installed, dev server starts, screenshots captured
- **Blockers:** Playwright hangs/fails to produce output
- **Log:**
  - 2026-02-18: Created RoomCanvas.tsx, manifest.json, asset pipeline. Playwright not producing screenshots yet.

### TASK-003: Portfolio isometric room — deep research & plan
- **Status:** done
- **Priority:** high
- **Created:** 2026-02-19
- **Updated:** 2026-02-19
- **Owner:** Heimdall (sub-agent: portfolio-research)
- **Objective:** Produce an exhaustive implementation plan for the isometric room scene
- **Check:** `projects/riley-portfolio-plan.md` exists ✅
- **Log:**
  - 2026-02-19: Spawned sub-agent. Completed in ~7min. 1,427-line plan with 30+ sources, 9 phases.

### TASK-002: Idea validation pipeline (nightly cron)
- **Status:** active
- **Priority:** urgent
- **Created:** 2026-02-18
- **Updated:** 2026-02-18
- **Owner:** cron:idea-validation-nightly
- **Objective:** Managed by nightly cron job. See cron for methodology and output format.
- **Check:** All `status: idea` projects in `data/projects.yaml` have a corresponding report at `projects/program-manager/research/idea-validation/<project-id>.md`
- **Next step:** Cron handles execution. Heartbeat only verifies reports exist for all ideas.
- **Blockers:** None
- **Log:**
  - 2026-02-18: Task created. Nightly cron job set up. 3 ideas queued: scene-splitter, polymarket-sentiment, card-optimizer.

---

## Completed

_(none yet)_
