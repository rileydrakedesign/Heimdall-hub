#!/usr/bin/env node
import { execSync } from 'child_process';

function arg(name, def = null) {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx === -1) return def;
  const v = process.argv[idx + 1];
  if (!v || v.startsWith('--')) return true;
  return v;
}

const repo = arg('repo', process.cwd());

function sh(cmd) {
  try {
    return execSync(cmd, { cwd: repo, stdio: ['ignore','pipe','pipe'] }).toString('utf8');
  } catch (e) {
    return '';
  }
}

// Heuristic checks (repo-specific wiring differs)
const assembler = sh("rg -n \"assemblePrompt\" src/lib/openai/prompts/prompt-assembler.ts 2>/dev/null || true");
const hasPost = sh("rg -n \"POST_SYSTEM_PROMPT\" src/lib/openai/prompts -S 2>/dev/null || true");
const baseSelect = sh("rg -n \"mode === 'post'\" src/lib/openai/prompts/prompt-assembler.ts -S 2>/dev/null || true");

const ok = Boolean(assembler.trim()) && Boolean(hasPost.trim()) && Boolean(baseSelect.trim());

console.log(JSON.stringify({ repo, ok, signals: { hasAssembler: Boolean(assembler.trim()), hasPostPrompt: Boolean(hasPost.trim()), baseSelect: Boolean(baseSelect.trim()) } }, null, 2));
if (!ok) process.exit(2);
