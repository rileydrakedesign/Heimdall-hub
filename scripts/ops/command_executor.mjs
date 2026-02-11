#!/usr/bin/env node
/**
 * Execute Telegram command palette intents.
 * Prints a human-readable summary + writes reports when applicable.
 *
 * This does NOT send messages externally; the agent decides delivery.
 */

import fs from 'fs/promises';
import path from 'path';
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

async function sh(cmd, cwd) {
  try {
    const { stdout, stderr } = await exec(cmd, { cwd, maxBuffer: 30 * 1024 * 1024 });
    return { ok: true, stdout, stderr };
  } catch (e) {
    return { ok: false, stdout: e.stdout || '', stderr: e.stderr || String(e) };
  }
}

function resolveRepo(name) {
  if (!name) return '/home/claw/clawd/work/ContentAutomationPlatform';
  const n = String(name).toLowerCase();
  if (n.includes('content') || n.includes('cap') || n.includes('agent')) return '/home/claw/clawd/work/ContentAutomationPlatform';
  return '/home/claw/clawd/work/ContentAutomationPlatform';
}

async function main() {
  const input = arg('text');
  if (!input) throw new Error('missing --text "..."');

  const router = await sh(`node /home/claw/clawd/scripts/ops/command_router.mjs ${JSON.stringify(input)}`, '/home/claw/clawd');
  if (!router.ok) {
    console.log('Unknown command. Send: help');
    process.exit(2);
  }

  const parsed = JSON.parse(router.stdout);

  if (parsed.intent === 'help') {
    const txt = await fs.readFile('/home/claw/clawd/playbook/telegram-commands.md', 'utf8');
    console.log(txt.trim());
    return;
  }

  if (parsed.intent === 'status') {
    const st = await fs.readFile('/home/claw/clawd/memory/ops-state.json', 'utf8');
    const s = JSON.parse(st);
    const repo = s.repos?.ContentAutomationPlatform;
    console.log(`ops status\n- repo build ok at: ${repo?.last?.buildOkAt || 'none'}\n- schema guardian at: ${repo?.last?.schemaGuardianOkAt || 'none'}\n- prompt qa at: ${repo?.last?.promptQaOkAt || 'none'}\n- vps snapshot at: ${s.vps?.last?.securitySnapshotOkAt || 'none'}`);
    return;
  }

  if (parsed.intent === 'audit_repo' || parsed.intent === 'ship_report') {
    const repoPath = resolveRepo(parsed.args?.repo);
    const run = await sh(`/home/claw/clawd/scripts/ops/run_repo_health.sh ${repoPath}`, repoPath);

    // Always point to durable artifacts
    const artifacts = [
      path.join(repoPath, 'AUDIT_REPORT.md'),
      path.join(repoPath, 'SCHEMA_GUARDIAN_REPORT.md'),
      path.join(repoPath, 'NPM_AUDIT_REPORT.txt'),
    ];

    console.log(run.ok ? 'repo audit ok' : 'repo audit failed');
    console.log(`repo: ${repoPath}`);
    console.log('artifacts:');
    for (const a of artifacts) console.log(`- ${a}`);

    if (!run.ok) {
      console.log('\nerror tail:');
      console.log((run.stderr || run.stdout).split('\n').slice(-60).join('\n'));
      process.exit(2);
    }
    return;
  }

  if (parsed.intent === 'audit_vps') {
    const run = await sh('/home/claw/clawd/scripts/ops/run_vps_security_snapshot.sh', '/home/claw/clawd');
    if (!run.ok) {
      console.log('vps snapshot failed');
      console.log(run.stderr.slice(0, 800));
      process.exit(2);
    }
    console.log('vps snapshot ok');
    console.log(`report: ${run.stdout.trim()}`);
    return;
  }

  if (parsed.intent === 'await_feedback') {
    console.log('ack: await feedback mode (convention). next message should be approve or tweak: ...');
    return;
  }

  // For screenshots/diagram intents, we only acknowledge. Execution is project-specific.
  if (parsed.intent === 'screenshots' || parsed.intent?.startsWith('diagram_')) {
    console.log(`ack: ${parsed.intent}. scope/topic: ${parsed.args?.scope || parsed.args?.topic || ''}`.trim());
    return;
  }

  console.log('ok');
}

main().catch((e) => {
  console.error(String(e));
  process.exit(1);
});
