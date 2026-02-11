# Telegram Command Palette (Conventions)

These are lightweight text commands you can send in Telegram. They are not a bot UI; they are parsing conventions Clawdbot follows to route work to the right skills/scripts.

## Format

- Commands are single-line.
- Optional arguments follow.
- If a command is ambiguous, Clawdbot asks a single clarifying question.

## Commands

### Audits

- `audit repo`
  - Runs prod wiring + schema guardian + prompt QA on the active repo.

- `audit repo <name>`
  - Examples:
    - `audit repo cap`
    - `audit repo contentautomationplatform`

- `audit vps`
  - Runs VPS security snapshot (read-only).

- `ship report <repo>`
  - Produces a single consolidated report:
    - build/typecheck status
    - schema drift summary
    - dependency audit summary
    - ranked fix list

### Screenshots / UI review

- `screenshots <scope>`
  - Examples:
    - `screenshots insights`
    - `screenshots voice`

- `await feedback`
  - Switches the agent into a feedback-waiting mode for the latest screenshots/diagram.
  - Clawdbot will not iterate until you say `approve` or `tweak: ...`.

### Diagrams

- `diagram master <topic>`
- `diagram sub <topic>`

Uses the diagram-thread-cards skill and enforces the no-clipping render pipeline.

### Utility

- `status`
  - Summarize ops state: last checks + current alerts.

- `help`
  - Print this command list.

## Response style

- For audit commands:
  - send a 3–8 line summary in Telegram
  - write the full report into the relevant repo as markdown
- For screenshot/diagram commands:
  - validate the artifact visually before sending
