# Heimdall Hub

## Project structure

- `web/` — The Heimdall Hub dashboard (Next.js). **This is the main app.**
- Root `package.json` — A separate portfolio site; not the hub.

## Dev server

Always start the dev server from `web/`:

```sh
cd web && npm run dev
```

Do NOT run `npm run dev` from the repo root — that starts the wrong app.
