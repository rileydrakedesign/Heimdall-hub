#!/usr/bin/env node
/**
 * Schema guardian: extract tables referenced in code and compare to Supabase migrations.
 */

import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';

function arg(name, def = null) {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx === -1) return def;
  const v = process.argv[idx + 1];
  if (!v || v.startsWith('--')) return true;
  return v;
}

const repo = arg('repo', process.cwd());
const out = arg('out', path.join(repo, 'SCHEMA_GUARDIAN_REPORT.md'));

function sh(cmd) {
  try {
    return execSync(cmd, { cwd: repo, stdio: ['ignore','pipe','pipe'] }).toString('utf8');
  } catch {
    return '';
  }
}

function uniqSorted(arr) {
  return Array.from(new Set(arr)).sort();
}

const rg1 = sh(`rg -No "from\\(\\\"[a-zA-Z0-9_]+\\\"\\)" src scripts 2>/dev/null || true`);
const rg2 = sh(`rg -No "from\\('\\s*[a-zA-Z0-9_]+\\s*'\\)" src scripts 2>/dev/null || true`);

const tables = [];
for (const line of (rg1 + '\n' + rg2).split('\n')) {
  const m1 = line.match(/from\(\"([a-zA-Z0-9_]+)\"\)/);
  const m2 = line.match(/from\('([a-zA-Z0-9_]+)'\)/);
  if (m1?.[1]) tables.push(m1[1]);
  if (m2?.[1]) tables.push(m2[1]);
}

const referenced = uniqSorted(tables);

const creates = sh(`rg -n "create table" supabase/migrations -S 2>/dev/null || true`);
const alters = sh(`rg -n "alter table" supabase/migrations -S 2>/dev/null || true`);
const createLower = creates.toLowerCase();
const alterLower = alters.toLowerCase();

const created = [];
const mentioned = new Set();

for (const t of referenced) {
  if (createLower.includes(`table if not exists public.${t}`) || createLower.includes(`table if not exists ${t}`) || createLower.includes(`create table if not exists public.${t}`)) {
    created.push(t);
  }
  if (createLower.includes(t.toLowerCase()) || alterLower.includes(t.toLowerCase())) {
    mentioned.add(t);
  }
}

const missingMention = referenced.filter((t) => !mentioned.has(t));

const md = [];
md.push('# SCHEMA_GUARDIAN_REPORT');
md.push('');
md.push(`- repo: ${repo}`);
md.push('');
md.push('## Tables referenced in code');
md.push(referenced.map((t) => `- ${t}`).join('\n') || '- (none)');
md.push('');
md.push('## Tables mentioned in migrations');
md.push(Array.from(mentioned).sort().map((t) => `- ${t}`).join('\n') || '- (none)');
md.push('');
md.push('## Gaps');
md.push(missingMention.length ? missingMention.map((t) => `- referenced but not present in migrations text: ${t}`).join('\n') : '- (none)');
md.push('');
md.push('## Next actions');
md.push('1) Add CREATE TABLE + RLS migrations for missing tables.');
md.push('2) Add policies for user-scoped tables (auth.uid() = user_id).');

await fs.writeFile(out, md.join('\n') + '\n', 'utf8');

console.log(JSON.stringify({ repo, out, referenced, missingMention }, null, 2));
if (missingMention.length) process.exit(2);
