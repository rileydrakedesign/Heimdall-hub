#!/usr/bin/env node
/**
 * Ops runner: run daily/weekly checks, update memory/ops-state.json,
 * and return a short human summary only when something regresses.
 */

import fs from 'fs/promises';
import crypto from 'crypto';
import { exec as _exec } from 'child_process';
import { promisify } from 'util';

const exec = promisify(_exec);

function arg(name, def = null) {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx === -1) return def;
  const v = process.argv[idx + 1];
  if (!v || v.startsWith('--')) return true;
  return v;
}

const mode = arg('mode', 'daily'); // daily|weekly
const statePath = '/home/claw/clawd/memory/ops-state.json';

async function sh(cmd, cwd) {
  try {
    const { stdout, stderr } = await exec(cmd, { cwd, maxBuffer: 20 * 1024 * 1024 });
    return { ok: true, stdout, stderr };
  } catch (e) {
    return { ok: false, stdout: e.stdout || '', stderr: e.stderr || String(e) };
  }
}

function nowIso() {
  return new Date().toISOString();
}

function hash(obj) {
  return crypto.createHash('sha256').update(JSON.stringify(obj)).digest('hex').slice(0, 16);
}

async function loadState() {
  const raw = await fs.readFile(statePath, 'utf8');
  return JSON.parse(raw);
}

async function saveState(state) {
  await fs.writeFile(statePath, JSON.stringify(state, null, 2) + '\n', 'utf8');
}

function diffFindings(prev, next) {
  const prevH = hash(prev);
  const nextH = hash(next);
  return { changed: prevH !== nextH, prevH, nextH };
}

async function main() {
  const state = await loadState();
  const notes = [];
  const alerts = [];

  if (mode === 'daily') {
    const repoKey = 'ContentAutomationPlatform';
    const repo = state.repos[repoKey];
    const repoPath = repo.path;

    // run repo health script
    const res = await sh(`/home/claw/clawd/scripts/ops/run_repo_health.sh ${repoPath}`, repoPath);
    if (!res.ok) {
      alerts.push(`repo health failed (${repoKey}): build/typecheck/audits did not complete`);
      notes.push(res.stderr.slice(0, 600));
    } else {
      repo.last.buildOkAt = nowIso();
      repo.last.typecheckOkAt = nowIso();
    }

    // capture audit deltas (best-effort)
    const prod = await sh('cat /tmp/prod_wiring.json', repoPath);
    const schema = await sh('cat /tmp/schema_guardian.json', repoPath);
    const prompt = await sh('cat /tmp/prompt_wiring.json', repoPath);

    const prevSnapshot = {
      prodWiring: repo.lastFindings.prodWiring,
      schemaGuardian: repo.lastFindings.schemaGuardian,
      promptQa: repo.lastFindings.promptQa,
    };

    const nextSnapshot = {
      prodWiring: prod.ok ? JSON.parse(prod.stdout).findings : prevSnapshot.prodWiring,
      schemaGuardian: schema.ok ? JSON.parse(schema.stdout) : prevSnapshot.schemaGuardian,
      promptQa: prompt.ok ? JSON.parse(prompt.stdout) : prevSnapshot.promptQa,
    };

    const d = diffFindings(prevSnapshot, nextSnapshot);
    repo.lastFindings.prodWiring = nextSnapshot.prodWiring;
    repo.lastFindings.schemaGuardian = { missingMention: nextSnapshot.schemaGuardian.missingMention || [] };
    repo.lastFindings.promptQa = nextSnapshot.promptQa;

    if (d.changed) {
      // only alert if new high/critical exists
      const highCount = (nextSnapshot.prodWiring?.high || []).length;
      const criticalCount = (nextSnapshot.prodWiring?.critical || []).length;
      if (criticalCount > 0 || highCount > 0) {
        alerts.push(`repo wiring drift detected (${repoKey}): ${criticalCount} critical, ${highCount} high`);
      }
    }

    repo.last.prodWiringAuditOkAt = nowIso();
    repo.last.schemaGuardianOkAt = nowIso();
    repo.last.promptQaOkAt = nowIso();
  }

  if (mode === 'weekly') {
    const res = await sh('/home/claw/clawd/scripts/ops/run_vps_security_snapshot.sh', '/home/claw/clawd');
    if (!res.ok) {
      alerts.push('vps security snapshot failed');
      notes.push(res.stderr.slice(0, 600));
    } else {
      state.vps.last.securitySnapshotOkAt = nowIso();
    }

    // fingerprint listeners for regression detection
    const ss = await sh('ss -lntp', '/home/claw/clawd');
    if (ss.ok) {
      const fp = hash(ss.stdout.split('\n').filter(Boolean));
      if (state.vps.last.listenersFingerprint && state.vps.last.listenersFingerprint !== fp) {
        alerts.push('vps listeners changed since last snapshot (new/removed open ports)');
      }
      state.vps.last.listenersFingerprint = fp;
    }

    const ts = await sh("tailscale status 2>/dev/null | head -n 5 || true", '/home/claw/clawd');
    if (ts.ok) {
      const m = ts.stdout.match(/(\d+\.\d+\.\d+\.\d+)/);
      if (m?.[1]) state.vps.last.tailscaleIp = m[1];
    }
  }

  // persist state
  await saveState(state);

  const digest = { mode, alerts, notes };
  const digestHash = hash(digest);

  const shouldNotify = alerts.length > 0;
  if (shouldNotify) {
    // Print a short message for cron delivery.
    console.log(`OPS ALERT (${mode})\n- ${alerts.join('\n- ')}${notes.length ? `\n\nnotes:\n${notes.join('\n')}` : ''}`);
    return;
  }

  // No alert => silent
  console.log('NO_ALERT');
}

main().catch((e) => {
  console.error('OPS_RUNNER_FAILED');
  console.error(String(e));
  process.exit(1);
});
