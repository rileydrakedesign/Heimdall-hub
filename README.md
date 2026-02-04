# Heimdall Hub

Private GitHub-backed dashboard + knowledge base.

## What this is
- **Hub**: durable notes, links, and reference pages.
- **Projects**: lightweight project tracker (status/owner/next action/etc.).

## How to use
- Edit project data: `data/projects.yaml`
- Edit pages: `docs/*.md`

## Local preview (optional)
If you have Python:
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
mkdocs serve
```

## Conventions
- Keep projects in YAML (easy to diff + PR).
- Put longer context on a project page under `docs/projects/<slug>.md`.
