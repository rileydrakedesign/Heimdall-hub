#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

function arg(name, def = null) {
  const i = process.argv.indexOf(name);
  if (i === -1) return def;
  return process.argv[i + 1] ?? def;
}

const inPath = arg("--in");
const outDir = arg("--out", "output");
const model = arg("--model", "gpt-4o-mini");

if (!inPath) {
  console.error("Usage: node scripts/insight_x/run.mjs --in input/transcript.txt --out output");
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const transcript = fs.readFileSync(inPath, "utf8");

function chunkText(text, maxChars = 9000, overlap = 800) {
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    const end = Math.min(text.length, i + maxChars);
    chunks.push(text.slice(i, end));
    if (end === text.length) break;
    i = Math.max(0, end - overlap);
  }
  return chunks;
}

const chunks = chunkText(transcript);

function promptForChunk(chunk, idx, total) {
  return `You are extracting non-obvious, nuanced insights from a podcast transcript.\n\nRules:\n- Only use what is supported by the transcript. No invented facts.\n- Prefer mechanisms, constraints, tradeoffs, and examples.\n- Avoid generic advice.\n- Output JSON only.\n\nReturn 5-12 insight candidates as an array. Each item:\n{\n  "insight": "...",\n  "why_it_matters": "...",\n  "evidence_quote": "short excerpt",\n  "tags": ["..."],\n  "novelty": 1-5,\n  "usefulness": 1-5\n}\n\nTranscript chunk ${idx + 1}/${total}:\n\n${chunk}`;
}

async function callOpenAI(prompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      input: prompt,
      temperature: 0.4,
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${txt}`);
  }
  const json = await res.json();
  const text = json.output_text ?? "";
  return text;
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

let candidates = [];

for (let i = 0; i < chunks.length; i++) {
  const p = promptForChunk(chunks[i], i, chunks.length);
  const out = await callOpenAI(p);

  if (!out) {
    // Manual mode
    const promptPath = path.join(outDir, `prompt_chunk_${String(i + 1).padStart(2, "0")}.txt`);
    fs.writeFileSync(promptPath, p);
    continue;
  }

  const parsed = safeJsonParse(out);
  if (Array.isArray(parsed)) candidates.push(...parsed);
}

// If no API key, stop after writing prompts.
if (!process.env.OPENAI_API_KEY) {
  fs.writeFileSync(
    path.join(outDir, "README.txt"),
    `OPENAI_API_KEY not set. Generated ${chunks.length} prompt files in ${outDir}/.\n\nNext steps:\n1) Feed each prompt_chunk_*.txt to Heimdall (or an LLM)\n2) Save each JSON array output\n3) Then we will run the synthesis step (next script)\n`
  );
  console.log(`Manual mode: wrote ${chunks.length} prompts to ${outDir}/`);
  process.exit(0);
}

// Simple dedupe + rank (v1)
const seen = new Set();
const merged = [];
for (const c of candidates) {
  const key = (c.insight || "").toLowerCase().trim();
  if (!key || seen.has(key)) continue;
  seen.add(key);
  merged.push(c);
}

merged.sort((a, b) => (b.novelty + b.usefulness) - (a.novelty + a.usefulness));

const top = merged.slice(0, 12);

const insightsMd = `# Insight Brief\n\n## TL;DR\n${top
  .slice(0, 5)
  .map((x) => `- ${x.insight}`)
  .join("\n")}\n\n## Key insights\n${top
  .map(
    (x, n) =>
      `### ${n + 1}. ${x.insight}\n\n**Why it matters:** ${x.why_it_matters}\n\n> ${x.evidence_quote}\n\nTags: ${(x.tags || []).join(", ") || "—"}\n`
  )
  .join("\n")}\n`;

fs.writeFileSync(path.join(outDir, "insights.md"), insightsMd);

const xPrompt = `Using the following canonical insights, write 15 X drafts.\n\nConstraints:\n- Sound human, specific, nuanced.\n- No generic hype.\n- Strong hook. Short lines.\n- Mix: singles + 5-8 tweet threads.\n- Ground every post in the insights; do not invent.\n\nReturn markdown with sections: Singles, Threads.\n\nINSIGHTS:\n${JSON.stringify(top, null, 2)}`;

const xOut = await callOpenAI(xPrompt);
fs.writeFileSync(path.join(outDir, "x_drafts.md"), xOut ?? "");

console.log(`Wrote ${outDir}/insights.md and ${outDir}/x_drafts.md`);
