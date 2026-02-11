#!/usr/bin/env bash
set -euo pipefail

echo "# VPS_SECURITY_REPORT" 
echo

echo "## Host" 
uname -a || true
cat /etc/os-release 2>/dev/null || true

echo
echo "## Listening ports (ss -lntp)" 
ss -lntp || true

echo
echo "## Tailscale status" 
tailscale status 2>/dev/null || true

echo
echo "## OpenClaw security audit" 
openclaw security audit --deep 2>/dev/null || true

echo
echo "## OpenClaw status" 
openclaw status 2>/dev/null || true

echo
echo "## SSHD effective config (may require sudo)" 
sshd -T 2>/dev/null | egrep -i 'passwordauthentication|permitrootlogin|pubkeyauthentication|kbdinteractiveauthentication|port|loglevel|x11forwarding|allowusers|allowgroups' || true

echo
echo "## Firewall (ufw)" 
ufw status verbose 2>/dev/null || true
