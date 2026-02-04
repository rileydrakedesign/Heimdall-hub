#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function arg(name, def = null) {
  const i = process.argv.indexOf(name);
  if (i === -1) return def;
  return process.argv[i + 1] ?? def;
}

const runDir = arg("--run", "projects/insight-x-pipeline/runs/2026-02-04_1556Z");
const start = Number(arg("--start", "4"));
const end = Number(arg("--end", "23"));
const model = arg("--model", "gpt-4o-mini");
const mode = arg("--mode", "one"); // one | all

const tabooPath = "projects/insight-x-pipeline/style/taboo-phrases.txt";
const section01Style = path.join(runDir, "section_01", "posts_final.txt");

function readTaboo() {
  const raw = fs.readFileSync(tabooPath, "utf8");
  return raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.toLowerCase().startsWith("category:") && !l.startsWith("#"));
}

async function callOpenAI(prompt, { label = "" } = {}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not set");

  const maxAttempts = 6;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
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
          console.log(`OpenAI ${res.status} ${label} attempt ${attempt}/${maxAttempts} retry in ${backoff}ms`);
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
        console.log(`OpenAI network ${label} attempt ${attempt}/${maxAttempts} retry in ${backoff}ms`);
        await sleep(backoff);
        continue;
      }
      throw err;
    }
  }
  throw new Error("OpenAI failed after retries");
}

function scanBanned(text) {
  const taboo = readTaboo().map((x) => x.toLowerCase());
  const low = text.toLowerCase();
  const hits = taboo.filter((t) => t && low.includes(t));
  return hits;
}

function hasEmDash(text) {
  return text.includes("—") || text.includes("–");
}

function hasAsterisks(text) {
  return text.includes("*");
}

function looksLikeMarkdown(text) {
  // lightweight: headings or fenced blocks
  return /(^|\n)#{1,6}\s/.test(text) || /```/.test(text);
}

function ensureNoSemicolons(text) {
  return text.includes(";");
}

async function writeSectionPosts(sectionNum) {
  const slug = String(sectionNum).padStart(2, "0");
  const sectionDir = path.join(runDir, `section_${slug}`);
  const insightsPath = path.join(sectionDir, "insights.json");
  const sectionPath = path.join(sectionDir, "section.txt");
  const outPath = path.join(sectionDir, "posts_final.txt");

  if (!fs.existsSync(insightsPath) || !fs.existsSync(sectionPath)) {
    throw new Error(`Missing inputs for section_${slug}`);
  }

  if (fs.existsSync(outPath)) return { skipped: true, outPath };

  const insights = JSON.parse(fs.readFileSync(insightsPath, "utf8"));
  const sectionText = fs.readFileSync(sectionPath, "utf8");
  const style = fs.existsSync(section01Style) ? fs.readFileSync(section01Style, "utf8") : "";

  const top = (Array.isArray(insights) ? insights : [])
    .filter((x) => x && x.insight && x.evidence_quote)
    .sort((a, b) => (Number(b.novelty) + Number(b.usefulness)) - (Number(a.novelty) + Number(a.usefulness)))
    .slice(0, 10);

  const taboo = readTaboo();

  const prompt = [
    "You are writing X posts.",
    "You must match the style of the example baseline provided.",
    "Output plain text only.",
    "No markdown.",
    "No asterisks.",
    "No hashtags.",
    "No semicolons.",
    "No em dashes.",
    "Use short paragraphs and bullet list techniques like •, -, >, 1/.",
    "Use clear, simple language.",
    "Use active voice.",
    "Address the reader with you and your.",
    "Avoid fluff.",
    "Do not use rhetorical questions.",
    "Do not use metaphors or cliches.",
    "Do not use these banned words or phrases:",
    taboo.map((t) => `- ${t}`).join("\n"),
    "",
    `Section ${slug} source excerpt. Use this to add detail beyond the insight bullet. Stay faithful:`,
    sectionText.slice(0, 12000),
    "",
    "Candidate insights with timestamps. Pick 5 and write 5 posts, one per chosen insight. Make posts longer and informative.",
    JSON.stringify(top, null, 2),
    "",
    "Baseline style to match:",
    style,
    "",
    "Return exactly 5 posts.",
    "Format:",
    "Post 1\n\n<text>\n\nPost 2...",
  ].join("\n");

  let out = await callOpenAI(prompt, { label: `sec${slug}` });

  // Normalize quotes and remove fences if any
  out = out.replace(/```[\s\S]*?```/g, (m) => m.replace(/```/g, ""));

  const hits = scanBanned(out);
  if (hits.length) throw new Error(`Banned phrase hit: ${hits.slice(0, 5).join(", ")}`);
  if (hasEmDash(out)) throw new Error("Found em dash");
  if (ensureNoSemicolons(out)) throw new Error("Found semicolon");
  if (hasAsterisks(out)) throw new Error("Found asterisk");
  if (looksLikeMarkdown(out)) throw new Error("Looks like markdown");

  fs.writeFileSync(outPath, out + "\n", "utf8");
  return { skipped: false, outPath };
}

function gitCommitPush(msg, filePath) {
  execSync(`git add ${JSON.stringify(filePath)}`);
  execSync(`git commit -m ${JSON.stringify(msg)}`);
  execSync(`GIT_SSH_COMMAND='ssh -i /home/claw/.ssh/id_ed25519_github -o IdentitiesOnly=yes' git push`, {
    stdio: "inherit",
  });
}

function nextSection() {
  for (let i = start; i <= end; i++) {
    const slug = String(i).padStart(2, "0");
    const p = path.join(runDir, `section_${slug}`, "posts_final.txt");
    if (!fs.existsSync(p)) return i;
  }
  return null;
}

async function main() {
  if (mode === "one") {
    const s = nextSection();
    if (!s) {
      console.log("ALL_DONE");
      return;
    }
    const { outPath } = await writeSectionPosts(s);
    gitCommitPush(`Finalize section ${String(s).padStart(2, "0")} posts`, outPath);
    console.log(`SECTION_DONE ${String(s).padStart(2, "0")}`);
    return;
  }

  for (let i = start; i <= end; i++) {
    const slug = String(i).padStart(2, "0");
    const outPath = path.join(runDir, `section_${slug}`, "posts_final.txt");
    if (fs.existsSync(outPath)) continue;
    const res = await writeSectionPosts(i);
    gitCommitPush(`Finalize section ${slug} posts`, res.outPath);
    console.log(`SECTION_DONE ${slug}`);
  }
  console.log("ALL_DONE");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
