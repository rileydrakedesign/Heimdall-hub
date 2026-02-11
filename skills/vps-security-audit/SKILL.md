---
name: vps-security-audit
description: Run a repeatable security posture audit for a Linux VPS hosting Clawdbot/OpenClaw. Use to identify exposed ports, unknown listeners, SSH hardening, firewall status, Tailscale exposure, noVNC/VNC risk, and OpenClaw gateway posture. Produces a prioritized "risk → fix" report with commands.
---

# VPS Security Audit

Goal: quickly answer “is this tight?” with evidence.

## Output
- `VPS_SECURITY_REPORT.md` (ranked risks, current state, and fixes)

## Audit steps (read-only)

### 1) Identify listening services
- `ss -lntp`
- Flag anything bound to `0.0.0.0` or public interface.
- Flag anything bound to Tailscale that shouldn’t be.

### 2) OpenClaw posture
- `openclaw status`
- `openclaw security audit --deep`
- Verify gateway is loopback-only unless explicitly intended.

### 3) Tailscale posture
- `tailscale status`
- Confirm which ports are exposed on `tailscale0`.
- If using noVNC/VNC: confirm bind to `tailscale0` and whether auth exists.

### 4) SSH hardening
- Prefer key-only auth.
- Disable root login.
- Optional: Fail2ban.

### 5) Firewall
- UFW/iptables summary.

## Known sharp edges (common)
- VNC/noVNC running with `-nopw` (tailnet compromise risk)
- Unknown listener on `:443` bound to Tailscale
- Reverse proxy in front of control ui without `gateway.trustedProxies`

## Tool
- Run `bash scripts/vps_security_audit.sh > VPS_SECURITY_REPORT.md`

See `references/report-template.md`.
