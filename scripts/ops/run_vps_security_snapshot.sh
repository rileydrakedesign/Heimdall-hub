#!/usr/bin/env bash
set -euo pipefail

OUT_DIR="/home/claw/clawd/output/ops"
mkdir -p "$OUT_DIR"
STAMP="$(date -u +%Y-%m-%d_%H%MZ)"
OUT="$OUT_DIR/VPS_SECURITY_REPORT_${STAMP}.md"

bash /home/claw/clawd/skills/vps-security-audit/scripts/vps_security_audit.sh > "$OUT"

echo "$OUT"