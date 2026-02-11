#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';

function arg(name, def = null) {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx === -1) return def;
  const v = process.argv[idx + 1];
  if (!v || v.startsWith('--')) return true;
  return v;
}

const targetPath = arg('path');
const tabooPath = arg('taboo');

if (!targetPath || !tabooPath) {
  console.error('Usage: node scan_banned_phrases.mjs --path <file|dir> --taboo <taboo.txt>');
  process.exit(1);
}

const tabooRaw = await fs.readFile(tabooPath, 'utf8');
const taboo = tabooRaw
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith('#') && !l.startsWith('Category:') && !l.startsWith('- '))

// Parse lines like "- phrase"
const taboo2 = tabooRaw
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter((l) => l.startsWith('- '))
  .map((l) => l.slice(2).trim());

const phrases = Array.from(new Set([...taboo2])).filter(Boolean);

async function listFiles(p) {
  const st = await fs.stat(p);
  if (st.isFile()) return [p];
  const out = [];
  const entries = await fs.readdir(p);
  for (const e of entries) {
    const full = path.join(p, e);
    const st2 = await fs.stat(full);
    if (st2.isDirectory()) out.push(...(await listFiles(full)));
    else out.push(full);
  }
  return out;
}

const files = await listFiles(targetPath);
const violations = [];

for (const f of files) {
  if (!/\.(ts|tsx|js|mjs|md|txt)$/i.test(f)) continue;
  const txt = await fs.readFile(f, 'utf8');
  const lower = txt.toLowerCase();
  for (const ph of phrases) {
    const needle = ph.toLowerCase();
    if (!needle) continue;
    if (lower.includes(needle)) {
      violations.push({ file: f, phrase: ph });
    }
  }
}

console.log(JSON.stringify({ filesScanned: files.length, phrases: phrases.length, violations }, null, 2));
if (violations.length) process.exit(2);
