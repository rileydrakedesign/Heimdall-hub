# Engineering Standards

## Repo hygiene
- Keep config in version control where possible.
- Prefer markdown + YAML/JSON for editable sources of truth.

## Decision records
- Use ADRs for decisions that affect future work (stack choice, architecture, key UX decisions).

## Deploy
- GitHub Actions is the default for CI/CD.
- Keep builds deterministic; avoid relying on local-only paths.
