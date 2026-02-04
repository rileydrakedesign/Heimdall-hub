#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

function arg(name, def = null) {
  const i = process.argv.indexOf(name);
  if (i === -1) return def;
  return process.argv[i + 1] ?? def;
}

const inPath = arg("--in");
const outDir = arg("--out", "output/insight_x_sectioned");
const model = arg("--model", "gpt-4o-mini");
const metaPath = arg("--meta", null);

if (!inPath) {
  console.error("Usage: node scripts/insight_x/v2/sectioned.mjs --in input/transcript.txt --meta input/meta.json --out output/dir");
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const transcriptRaw = fs.readFileSync(inPath, "utf8");

const meta = metaPath && fs.existsSync(metaPath)
  ? JSON.parse(fs.readFileSync(metaPath, "utf8"))
  : {};

const tone = meta.tone ?? "clear, human, nuanced, slightly opinionated";
const audience = meta.audience ?? "curious builders and operators";

function cleanLine(s) {
  return String(s)
    .replace(/\\+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isSpeakerLine(line) {
  return /^(Lex Fridman|Sebastian Raschka|Nathan Lambert)\b/.test(line);
}

function isTimestampLine(line) {
  return /^\(\d\d:\d\d:\d\d\)$/.test(line);
}

function looksLikeSectionTitle(line) {
  // Tight heuristic: headings are usually short and contain punctuation (':' or '?')
  // or are a Title Case phrase.
  if (!line) return false;
  if (isSpeakerLine(line) || isTimestampLine(line)) return false;
  if (/^\*?HYPERLINK\b/i.test(line)) return false;
  if (/^https?:\/\//.test(line)) return false;
  if (line.length > 70) return false;

  // Must look like an actual heading, not normal sentence.
  const hasHeadingPunct = /[:?]/.test(line);
  const isTitleish = /^[A-Z][A-Za-z0-9,'"()\-–— ]+$/.test(line) && !/[.!]$/.test(line);
  return hasHeadingPunct || isTitleish;
}

function splitSections(text) {
  const lines = text.split(/\n/).map(cleanLine);

  const sections = [];
  let current = { title: "Introduction", lines: [] };

  for (let i = 0; i < lines.length; i++) {
    const prev = lines[i - 1] ?? "";
    const line = lines[i];
    const next = lines[i + 1] ?? "";
    const next2 = lines[i + 2] ?? "";

    // Headings in this transcript tend to be isolated on their own line
    // between blank lines, then followed by a speaker.
    const headingBoundary = !prev && line && !next;
    const followedBySpeaker = isSpeakerLine(next2) || isSpeakerLine(lines[i + 3] ?? "");

    if (headingBoundary && looksLikeSectionTitle(line) && followedBySpeaker) {
      if (current.lines.length) sections.push(current);
      current = { title: line, lines: [] };
      continue;
    }

    current.lines.push(line);
  }

  if (current.lines.length) sections.push(current);

  return sections
    .map((s) => ({ title: s.title, text: s.lines.filter(Boolean).join("\n") }))
    .filter((s) => s.text.length > 2000);
}

const sections = splitSections(transcriptRaw);
console.log(`Sections detected: ${sections.length}`);

if (process.argv.includes("--count-sections")) {
  for (let i = 0; i < Math.min(20, sections.length); i++) {
    console.log(`${String(i + 1).padStart(2, "0")}: ${sections[i].title}`);
  }
  process.exit(0);
}

function chunkText(text, maxChars = 12000, overlap = 1200) {
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

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function callOpenAI(prompt, { label = "" } = {}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not set");

  const maxAttempts = 6;
  let attempt = 0;

  while (true) {
    attempt++;
    try {
      const res = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          input: prompt,
          temperature: 0.35,
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        const retryable = [408, 429, 500, 502, 503, 504].includes(res.status);
        if (retryable && attempt < maxAttempts) {
          const backoff = Math.min(60000, 1000 * 2 ** (attempt - 1));
          console.log(`OpenAI ${res.status} (${label}) attempt ${attempt}/${maxAttempts} → retry in ${backoff}ms`);
          await sleep(backoff);
          continue;
        }
        throw new Error(`OpenAI error ${res.status}: ${txt}`);
      }

      const json = await res.json();
      const parts = [];
      for (const item of json.output ?? []) {
        if (item?.type !== "message") continue;
        for (const c of item.content ?? []) {
          if (c?.type === "output_text" && typeof c.text === "string") parts.push(c.text);
        }
      }
      return parts.join("\n").trim();
    } catch (err) {
      const msg = String(err?.message ?? err);
      const retryable = /timeout|ECONNRESET|ETIMEDOUT|ENOTFOUND|upstream connect error/i.test(msg);
      if (retryable && attempt < maxAttempts) {
        const backoff = Math.min(60000, 1000 * 2 ** (attempt - 1));
        console.log(`OpenAI network error (${label}) attempt ${attempt}/${maxAttempts} → retry in ${backoff}ms`);
        await sleep(backoff);
        continue;
      }
      throw err;
    }
  }
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function recoverJsonArray(text) {
  const direct = safeJsonParse(text);
  if (Array.isArray(direct)) return direct;
  const m = text.match(/\[[\s\S]*\]/);
  if (!m) return null;
  const recovered = safeJsonParse(m[0]);
  return Array.isArray(recovered) ? recovered : null;
}

function insightPrompt({ sectionTitle, chunk, idx, total }) {
  return `You are extracting non-obvious, nuanced insights from a transcript.

Audience: ${audience}
Tone: ${tone}
Section: ${sectionTitle}

Rules:
- Only use what is supported by the transcript. No invented facts.
- Prefer mechanisms, constraints, numbers, examples, and tradeoffs.
- Avoid generic advice.
- Capture nuance ("yes, but") when present.
- Output JSON only.

Return 6–14 insight candidates as an array. Each item:
{
  "insight": "one-sentence claim",
  "why_it_matters": "one sentence",
  "evidence_quote": "short excerpt (keep as-is)",
  "evidence_timestamp": "(hh:mm:ss) if present in chunk, else null",
  "tags": ["..."],
  "novelty": 1-5,
  "usefulness": 1-5
}

Chunk ${idx + 1}/${total}:

${chunk}`;
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
  const stop = new Set(["the","a","an","and","or","but","to","of","in","on","for","with","is","are","was","were","be","been","it","that","this","as","at","by","from","we","you","they","i"]);
  return new Set(normalize(s).split(" ").filter((t) => t.length > 2 && !stop.has(t)));
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

function mergeInsights(candidates) {
  const merged = [];
  for (const c of candidates) {
    if (!c?.insight || !c?.evidence_quote) continue;
    const score = (Number(c.novelty) || 0) + (Number(c.usefulness) || 0);
    let matched = false;
    for (const m of merged) {
      if (jaccard(m.insight, c.insight) >= 0.72) {
        const mScore = (Number(m.novelty) || 0) + (Number(m.usefulness) || 0);
        if (score > mScore) Object.assign(m, c);
        matched = true;
        break;
      }
    }
    if (!matched) merged.push(c);
  }
  merged.sort((a, b) => (Number(b.novelty) + Number(b.usefulness)) - (Number(a.novelty) + Number(a.usefulness)));
  return merged;
}

function sectionSummaryPrompt(sectionTitle, insights) {
  return `Write a concise section summary for a long transcript.

Audience: ${audience}
Tone: ${tone}
Section: ${sectionTitle}

Use ONLY the insights below.

Output markdown with:
- 3–6 bullet summary
- 5–10 key insights (each: claim + why it matters + short quote)

Insights JSON:
${JSON.stringify(insights, null, 2)}
`;
}

function xFromSectionPrompt(sectionTitle, insights) {
  const banned = ["game-changer","unlock","secrets","10x","crush it","skyrocket","revolutionary","in today's world","delve","as an ai"];
  return `You are a human writer posting on X.

Audience: ${audience}
Tone: ${tone}
Section: ${sectionTitle}

Task: Create X drafts derived ONLY from the insights.

Hard constraints:
- No invented facts.
- Avoid these phrases: ${banned.map((x)=>`"${x}"`).join(", ")}
- Use short lines and whitespace.
- Be specific and nuanced.

Output markdown:
## Singles (3)
### 1
...

## Threads (2)
### 1
1) ...
(5–8 tweets)

Insights JSON:
${JSON.stringify(insights, null, 2)}
`;
}

// Main run
const outIndex = [];

for (let s = 0; s < sections.length; s++) {
  const section = sections[s];
  const sectionSlug = String(s + 1).padStart(2, "0");

  const sectionDir = path.join(outDir, `section_${sectionSlug}`);
  const doneMarker = path.join(sectionDir, ".done");
  if (fs.existsSync(doneMarker)) {
    // resume support
    outIndex.push({
      section: sectionSlug,
      title: section.title,
      outputs: {
        summary: `section_${sectionSlug}/summary.md`,
        x: `section_${sectionSlug}/x_drafts.md`,
      },
    });
    continue;
  }

  console.log(`\n=== Section ${sectionSlug}/${sections.length}: ${section.title}`);

  const chunks = chunkText(section.text);
  console.log(`chunks: ${chunks.length}`);

  const candidates = [];
  for (let i = 0; i < chunks.length; i++) {
    console.log(`→ extract ${i + 1}/${chunks.length}`);
    const prompt = insightPrompt({ sectionTitle: section.title, chunk: chunks[i], idx: i, total: chunks.length });
    const text = await callOpenAI(prompt, { label: `sec${sectionSlug}-extract${i + 1}` });
    const arr = recoverJsonArray(text);
    if (Array.isArray(arr)) candidates.push(...arr);
  }

  const merged = mergeInsights(candidates);
  const top = merged.slice(0, 14);

  const summaryMd = await callOpenAI(sectionSummaryPrompt(section.title, top), { label: `sec${sectionSlug}-summary` });
  const xMd = await callOpenAI(xFromSectionPrompt(section.title, top), { label: `sec${sectionSlug}-x` });

  fs.mkdirSync(sectionDir, { recursive: true });

  fs.writeFileSync(path.join(sectionDir, "section.txt"), section.text);
  fs.writeFileSync(path.join(sectionDir, "insights.json"), JSON.stringify(top, null, 2));
  fs.writeFileSync(path.join(sectionDir, "summary.md"), summaryMd);
  fs.writeFileSync(path.join(sectionDir, "x_drafts.md"), xMd);
  fs.writeFileSync(doneMarker, new Date().toISOString());

  outIndex.push({
    section: sectionSlug,
    title: section.title,
    outputs: {
      summary: `section_${sectionSlug}/summary.md`,
      x: `section_${sectionSlug}/x_drafts.md`,
    },
  });
}

const indexMd = `# Sectioned Output\n\nGenerated from: ${path.basename(inPath)}\n\n## Sections\n\n${outIndex
  .map(
    (s) => `- **${s.section} — ${s.title}**\n  - Summary: ${s.outputs.summary}\n  - X drafts: ${s.outputs.x}`
  )
  .join("\n\n")}\n`;

fs.writeFileSync(path.join(outDir, "INDEX.md"), indexMd);
console.log(`\nDone. Wrote ${outDir}/INDEX.md + per-section outputs.`);
