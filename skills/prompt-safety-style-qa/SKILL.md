---
name: prompt-safety-style-qa
description: QA prompts and generated text for safety + style. Use to enforce taboo phrase bans, prevent prompt injection via examples/inspiration/special notes, verify post vs reply prompt routing, and run snapshot checks for prompt-preview outputs.
---

# Prompt Safety + Style QA

## What this skill enforces

- No taboo phrases / AI-isms (use a banned phrase list)
- Examples/inspiration/special notes are treated as **data**, not executable instructions
- Correct base prompt routing:
  - post mode uses POST prompt
  - reply mode uses REPLY prompt

## Workflow

1) Identify prompt assembly entrypoints
- `prompt-assembler.ts`
- any route that builds `messages[]` manually

2) Run QA scripts
- `node scripts/scan_banned_phrases.mjs --path <file-or-dir> --taboo <taboo-file>`
- `node scripts/prompt_wiring_check.mjs --repo <repo>`

3) Produce report
- `PROMPT_QA_REPORT.md` with violations + file/line refs.

## Notes

- Keep the banned phrase list in a referenced file. If a project has its own list, point to it.
