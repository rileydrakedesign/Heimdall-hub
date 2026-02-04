#!/usr/bin/env node

import fs from "node:fs";

// Minimal v1 fact preservation check.
// Expects a JSON file containing an array of required substrings to preserve.
// This is intentionally strict and mechanical.

const factsPath = process.argv[2];
const textPath = process.argv[3];

if (!factsPath || !textPath) {
  console.error("Usage: node scripts/insight_x/validators/fact_preservation_check.mjs facts.json output.txt");
  process.exit(1);
}

const facts = JSON.parse(fs.readFileSync(factsPath, "utf8"));
const text = fs.readFileSync(textPath, "utf8");

if (!Array.isArray(facts)) {
  console.error("facts.json must be an array of strings");
  process.exit(1);
}

const missing = [];
for (const f of facts) {
  if (!f) continue;
  if (!text.includes(f)) missing.push(f);
}

if (missing.length) {
  console.log(JSON.stringify({ ok: false, missing }, null, 2));
  process.exit(2);
}

console.log(JSON.stringify({ ok: true, missing: [] }, null, 2));
