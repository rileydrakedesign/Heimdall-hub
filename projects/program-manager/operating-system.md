# Program Manager — Operating System (v0)

## Cadence

### Daily (morning) — execution brief
- Priority stack (today)
- 3–7 recommended next steps (ranked)
- 1–3 risks/blockers
- “What changed since yesterday”
- Experiment movement (started/stopped/won/lost)

### Daily (evening, optional) — ship log
- What shipped
- What got learned (from users/metrics)
- Next actions for tomorrow

### Weekly reviews (push) — M/W/F brief @ 10:00 (timezone TBD)
- KPI snapshot (trend, not vanity)
- Experiments review (started/stopped/won/lost)
- Funnel diagnosis (acq/activation/retention/revenue)
- User feedback themes + what we’ll ship next
- Costs/overhead check
- Cleanup: archive done work, keep `next_action` crisp

### Pull mode
- On request, generate a deeper dive for any project/metric/experiment.

## Source of truth rules
- `data/projects.yaml` is the canonical dashboard feed.
- Each project must have a single crisp `next_action`.
- When a decision changes direction, write an ADR.

## Autonomy boundaries

### I can do automatically
- Update docs in the hub repo
- Create issues/checklists in markdown
- Propose schedules and reminders

### Ask-first
- Posting publicly
- Sending emails/DMs to third parties
- Spending money / provisioning new infra
- Changing billing, DNS, production data

## Status semantics
- idea: not started
- active: in motion this week
- paused: intentionally tabled
- done: shipped/parked

## Preferences (confirmed)
- I may auto-edit `data/projects.yaml` (status/next_action/due) without asking each time.
- Weekly reviews: Mondays + Thursdays (time TBD)

## Next: confirm remaining preferences
- Weekly review time (UTC)
- Preferred format for daily check-ins (short/medium/long)
