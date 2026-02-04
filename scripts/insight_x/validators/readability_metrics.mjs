#!/usr/bin/env node

import fs from "node:fs";

const targetPath = process.argv[2];
if (!targetPath) {
  console.error("Usage: node scripts/insight_x/validators/readability_metrics.mjs <file.txt>");
  process.exit(1);
}

const text = fs.readFileSync(targetPath, "utf8");

const sentences = text
  .replace(/\n+/g, " ")
  .split(/[.!?]+/)
  .map((s) => s.trim())
  .filter(Boolean);

const words = text
  .replace(/[^A-Za-z0-9'\s]/g, " ")
  .split(/\s+/)
  .map((w) => w.trim())
  .filter(Boolean);

function syllables(word) {
  // crude heuristic
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  const m = w.match(/[aeiouy]+/g);
  const c = m ? m.length : 1;
  return Math.max(1, c);
}

let syl = 0;
for (const w of words) syl += syllables(w);

const W = words.length || 1;
const S = sentences.length || 1;

const avgWordsPerSentence = W / S;
const avgSyllablesPerWord = syl / W;

// Flesch reading ease
const flesch = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;

console.log(
  JSON.stringify(
    {
      sentences: S,
      words: W,
      avgWordsPerSentence: Number(avgWordsPerSentence.toFixed(2)),
      fleschReadingEase: Number(flesch.toFixed(2)),
    },
    null,
    2
  )
);
