# Insight → X Pipeline (Prototype)

This is the initial prototype for converting long-form text (podcast transcripts) into:
- an insight brief, and
- a set of X post drafts.

## Inputs
- `input/transcript.txt`
- optional `input/meta.json`

## Outputs
- `output/insights.md`
- `output/x_drafts.md`

## Run
```bash
node scripts/insight_x/run.mjs --in input/transcript.txt --out output
```

With metadata:
```bash
node scripts/insight_x/run.mjs --in input/transcript.txt --meta input/meta.json --out output
```

## Notes
- If `OPENAI_API_KEY` is present, the script can generate drafts automatically.
- Otherwise it will emit **copy/paste prompts** you can run through Heimdall manually.
