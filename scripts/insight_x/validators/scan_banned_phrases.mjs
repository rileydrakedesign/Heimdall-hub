#!/usr/bin/env node

import fs from "node:fs";

function readLines(p) {
  return fs
    .readFileSync(p, "utf8")
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter((x) => x && !x.startsWith("#"));
}

const tabooPath = process.argv[2] ?? "projects/insight-x-pipeline/style/taboo-phrases.txt";
const targetPath = process.argv[3];

if (!targetPath) {
  console.error("Usage: node scripts/insight_x/validators/scan_banned_phrases.mjs <taboo.txt> <file.txt>");
  process.exit(1);
}

const taboo = readLines(tabooPath)
  .filter((x) => !x.toLowerCase().startsWith("category:"))
  .map((x) => x.toLowerCase());

const text = fs.readFileSync(targetPath, "utf8").toLowerCase();

const hits = [];
for (const t of taboo) {
  if (!t || t.length < 2) continue;
  if (text.includes(t)) hits.push(t);
}

if (hits.length) {
  console.log(JSON.stringify({ ok: false, hits }, null, 2));
  process.exit(2);
}

console.log(JSON.stringify({ ok: true, hits: [] }, null, 2));
