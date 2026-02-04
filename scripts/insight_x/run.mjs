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
const metaPath = arg("--meta", null);

if (!inPath) {
  console.error("Usage: node scripts/insight_x/run.mjs --in input/transcript.txt --out output");
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const transcript = fs.readFileSync(inPath, "utf8");

const meta = metaPath && fs.existsSync(metaPath)
  ? JSON.parse(fs.readFileSync(metaPath, "utf8"))
  : {};

const tone = meta.tone ?? "smart, human, slightly opinionated";
const audience = meta.audience ?? "curious builders and operators";
const topic = meta.topic ?? "";

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
  return `You are extracting non-obvious, nuanced insights from a long-form transcript.

Context
- Audience: ${audience}
- Desired tone: ${tone}
${topic ? `- Topic: ${topic}` : ""}

Rules
- Only use what is supported by the transcript. No invented facts.
- Prefer mechanisms, constraints, tradeoffs, and concrete examples.
- Avoid generic advice and platitudes.
- If an insight has a "yes, but" nuance, include it.
- Output JSON only.

Return 5–12 insight candidates as an array. Each item:
{
  "insight": "one-sentence claim",
  "why_it_matters": "one sentence",
  "evidence_quote": "short excerpt",
  "tags": ["..."],
  "novelty": 1-5,
  "usefulness": 1-5
}

Transcript chunk ${idx + 1}/${total}:

${chunk}`;
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

  // OpenAI Responses API: text lives under output[].content[].text
  const parts = [];
  for (const item of json.output ?? []) {
    if (item?.type !== "message") continue;
    for (const c of item.content ?? []) {
      if (c?.type === "output_text" && typeof c.text === "string") parts.push(c.text);
    }
  }
  const text = parts.join("\n").trim();
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

console.log(`Chunks: ${chunks.length} (model: ${model})`);

for (let i = 0; i < chunks.length; i++) {
  console.log(`→ extracting chunk ${i + 1}/${chunks.length}`);
  const p = promptForChunk(chunks[i], i, chunks.length);
  const out = await callOpenAI(p);

  if (!out) {
    // Manual mode
    const promptPath = path.join(outDir, `prompt_chunk_${String(i + 1).padStart(2, "0")}.txt`);
    fs.writeFileSync(promptPath, p);
    continue;
  }

  const parsed = safeJsonParse(out);
  if (Array.isArray(parsed)) {
    candidates.push(...parsed);
  } else {
    // If model wrapped JSON in fences, try to recover.
    const m = out.match(/\[[\s\S]*\]/);
    const recovered = m ? safeJsonParse(m[0]) : null;
    if (Array.isArray(recovered)) candidates.push(...recovered);
  }
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

function normalize(s) {
  return (s || "")
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenSet(s) {
  const stop = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "to",
    "of",
    "in",
    "on",
    "for",
    "with",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "it",
    "that",
    "this",
    "as",
    "at",
    "by",
    "from",
    "we",
    "you",
    "they",
    "i",
  ]);
  return new Set(
    normalize(s)
      .split(" ")
      .filter((t) => t.length > 2 && !stop.has(t))
  );
}

function jaccard(a, b) {
  const A = tokenSet(a);
  const B = tokenSet(b);
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const t of A) if (B.has(t)) inter++;
  const union = A.size + B.size - inter;
  return union ? inter / union : 0;
}

// Dedupe/merge (v2): merge highly similar insight statements
const merged = [];
for (const c of candidates) {
  if (!c?.insight) continue;
  const score = (Number(c.novelty) || 0) + (Number(c.usefulness) || 0);

  let matched = false;
  for (const m of merged) {
    if (jaccard(m.insight, c.insight) >= 0.72) {
      // keep the stronger phrasing / evidence
      const mScore = (Number(m.novelty) || 0) + (Number(m.usefulness) || 0);
      if (score > mScore) {
        Object.assign(m, c);
      } else if (!m.evidence_quote && c.evidence_quote) {
        m.evidence_quote = c.evidence_quote;
      }
      matched = true;
      break;
    }
  }
  if (!matched) merged.push(c);
}

merged.sort((a, b) => (Number(b.novelty) + Number(b.usefulness)) - (Number(a.novelty) + Number(a.usefulness)));

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

const banned = [
  "game-changer",
  "unlock",
  "secrets",
  "10x",
  "crush it",
  "skyrocket",
  "revolutionary",
  "in today's world",
  "delve",
  "as an ai",
];

const xPrompt = `You are a human writer who posts on X.

Audience: ${audience}
Tone: ${tone}

Task: Write 15 X drafts derived from the canonical insights below.

Hard constraints:
- No invented facts. Only what is supported by the insights.
- Avoid these phrases entirely: ${banned.map((x) => `"${x}"`).join(", ")}
- Prefer specifics and mechanisms over abstract advice.
- Use short lines and whitespace.
- Make the hook earn the scroll.

Output format (markdown):

## Singles (6)
### 1
<tweet>

...

## Threads (9)
### 1
1) <hook>
2) <support>
3) <support>
...
(5–8 tweets)

Canonical insights:
${JSON.stringify(top, null, 2)}
`;

const xOut = await callOpenAI(xPrompt);
fs.writeFileSync(path.join(outDir, "x_drafts.md"), xOut ?? "");

console.log(`Wrote ${outDir}/insights.md and ${outDir}/x_drafts.md`);
