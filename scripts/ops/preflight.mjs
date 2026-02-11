#!/usr/bin/env node
/**
 * Preflight quality gates.
 *
 * Usage:
 *  node preflight.mjs artifact --path <file>
 *  node preflight.mjs build --repo <path> [--lines 80]
 *  node preflight.mjs security
 */

import fs from 'fs/promises';
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

const cmd = process.argv[2];

async function sh(command, cwd) {
  try {
    const { stdout, stderr } = await exec(command, { cwd, maxBuffer: 30 * 1024 * 1024 });
    return { ok: true, stdout, stderr };
  } catch (e) {
    return { ok: false, stdout: e.stdout || '', stderr: e.stderr || String(e) };
  }
}

async function artifactGate() {
  const p = arg('path');
  if (!p) throw new Error('missing --path');
  const st = await fs.stat(p);
  if (!st.isFile()) throw new Error('not a file');
  return { ok: true, kind: 'artifact', path: p, bytes: st.size };
}

async function buildGate() {
  const repo = arg('repo', process.cwd());
  const lines = Number(arg('lines', '80'));
  const res = await sh('npm run build', repo);
  const tail = (res.stdout + '\n' + res.stderr).split('\n').slice(-lines).join('\n');
  return { ok: res.ok, kind: 'build', repo, tail };
}

async function securityGate() {
  const ss = await sh('ss -lntp', '/home/claw/clawd');
  const ts = await sh('tailscale status 2>/dev/null || true', '/home/claw/clawd');
  const oc = await sh('openclaw security audit --deep 2>/dev/null || true', '/home/claw/clawd');

  return {
    ok: ss.ok,
    kind: 'security',
    evidence: {
      listeners: ss.stdout,
      tailscale: ts.stdout,
      openclawAudit: oc.stdout,
    },
    note: 'To identify unknown listeners by process owner, sudo may be required.'
  };
}

async function main() {
  let out;
  if (cmd === 'artifact') out = await artifactGate();
  else if (cmd === 'build') out = await buildGate();
  else if (cmd === 'security') out = await securityGate();
  else throw new Error('unknown command');

  console.log(JSON.stringify(out, null, 2));
  process.exit(out.ok ? 0 : 2);
}

main().catch((e) => {
  console.error(String(e));
  process.exit(1);
});
