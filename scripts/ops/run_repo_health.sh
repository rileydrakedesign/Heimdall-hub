#!/usr/bin/env bash
set -euo pipefail

REPO_PATH="${1:-/home/claw/clawd/work/ContentAutomationPlatform}"

cd "$REPO_PATH"

# 1) Build + typecheck
npm run build
node_modules/.bin/tsc -p tsconfig.json --noEmit

# 2) Wiring + schema guardian + prompt QA
node /home/claw/clawd/skills/prod-wiring-audit/scripts/prod_wiring_audit.mjs --repo "$REPO_PATH" --out "$REPO_PATH/AUDIT_REPORT.md" >/tmp/prod_wiring.json
node /home/claw/clawd/skills/supabase-schema-guardian/scripts/schema_guardian.mjs --repo "$REPO_PATH" --out "$REPO_PATH/SCHEMA_GUARDIAN_REPORT.md" >/tmp/schema_guardian.json || true
node /home/claw/clawd/skills/prompt-safety-style-qa/scripts/prompt_wiring_check.mjs --repo "$REPO_PATH" >/tmp/prompt_wiring.json || true

# 3) Dependency audit summary (non-fatal)
# Note: audit exit codes are non-zero when vulns exist; capture output.
(npm audit --omit=dev || true) > "$REPO_PATH/NPM_AUDIT_REPORT.txt"

echo "OK"