#!/usr/bin/env node
/**
 * Prod wiring audit (lightweight, deterministic).
 * Generates:
 *  - stdout JSON summary
 *  - AUDIT_REPORT.md
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

const repo = arg('repo', process.cwd());
const out = arg('out', path.join(repo, 'AUDIT_REPORT.md'));

async function sh(cmd) {
  const { stdout, stderr } = await exec(cmd, { cwd: repo, maxBuffer: 10 * 1024 * 1024 });
  return { stdout, stderr };
}

function mdEscape(s) {
  return String(s).replace(/\r/g, '');
}

async function main() {
  const report = [];
  const findings = { critical: [], high: [], medium: [], low: [] };

  report.push(`# AUDIT_REPORT\n`);
  report.push(`- repo: ${repo}`);

  // Gates
  report.push(`\n## Gates`);

  // We do not auto-run npm ci here because it can take time and is user-context dependent.
  // This script focuses on *wiring*; the agent should run gates explicitly.
  report.push(`- deps install: (run manually)\n- build: (run manually)\n- typecheck: (run manually)\n- lint: (run manually)`);

  // Data tables referenced
  report.push(`\n## Data sources (tables referenced in code)`);
  const rg1 = await sh(`rg -No "from\\(\\\"[a-zA-Z0-9_]+\\\"\\)" src scripts 2>/dev/null || true`);
  const rg2 = await sh(`rg -No "from\\('\\s*[a-zA-Z0-9_]+\\s*'\\)" src scripts 2>/dev/null || true`);

  const tables = new Set();
  for (const line of (rg1.stdout + '\n' + rg2.stdout).split('\n')) {
    const m1 = line.match(/from\(\"([a-zA-Z0-9_]+)\"\)/);
    const m2 = line.match(/from\('([a-zA-Z0-9_]+)'\)/);
    if (m1?.[1]) tables.add(m1[1]);
    if (m2?.[1]) tables.add(m2[1]);
  }
  const list = Array.from(tables).sort();
  report.push(list.length ? list.map((t) => `- ${t}`).join('\n') : '- (none found)');

  // Migrations create/alter summary
  report.push(`\n## Migrations coverage`);
  const creates = await sh(`rg -n "CREATE TABLE" supabase/migrations 2>/dev/null || true`);
  const alters = await sh(`rg -n "ALTER TABLE" supabase/migrations 2>/dev/null || true`);
  report.push(`- CREATE TABLE lines: ${creates.stdout.trim() ? creates.stdout.trim().split('\n').length : 0}`);
  report.push(`- ALTER TABLE lines: ${alters.stdout.trim() ? alters.stdout.trim().split('\n').length : 0}`);

  // Heuristic: if table referenced but never mentioned in migrations, flag high.
  const migText = (creates.stdout + '\n' + alters.stdout).toLowerCase();
  for (const t of list) {
    if (!migText.includes(t.toLowerCase())) {
      findings.high.push(`table referenced but not mentioned in migrations: ${t}`);
    }
  }

  // Auth scoping heuristic
  report.push(`\n## Auth scoping heuristic`);
  const scoping = await sh(`rg -n "eq\\(\\\"user_id\\\",\\s*user\\.id\\\)" src/app/api 2>/dev/null || true`);
  report.push(`- ".eq(\"user_id\", user.id)" occurrences: ${scoping.stdout.trim() ? scoping.stdout.trim().split('\n').length : 0}`);

  report.push(`\n## Findings (ranked)`);
  for (const level of ['critical','high','medium','low']) {
    report.push(`\n### ${level[0].toUpperCase() + level.slice(1)}`);
    const items = findings[level];
    report.push(items.length ? items.map((x) => `- ${mdEscape(x)}`).join('\n') : '- (none)');
  }

  await fs.writeFile(out, report.join('\n') + '\n', 'utf8');

  const summary = { repo, out, tables: list, findings };
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
