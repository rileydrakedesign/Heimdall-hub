#!/usr/bin/env node
/*
  Minimal Morning Brief generator (static-first).
  - Reads config from ../data/briefs.yaml
  - Fetches RSS (news + arXiv) and market quotes (stooq CSV)
  - Adds ops snapshot from projects/tasks YAML
  - Writes Markdown to ../projects/daily-debrief/runs/YYYY-MM-DD.md

  Usage:
    node web/scripts/generate-brief.mjs --profile default-morning
*/

import fs from "node:fs";
import path from "node:path";

import yaml from "js-yaml";

const argv = process.argv.slice(2);
const profileId = getArg("--profile") ?? "default-morning";

const repoRoot = path.resolve(process.cwd(), "..");
const cfgPath = path.join(repoRoot, "data", "briefs.yaml");
const runsDir = path.join(repoRoot, "projects", "daily-debrief", "runs");

function getArg(flag) {
  const i = argv.indexOf(flag);
  if (i === -1) return null;
  return argv[i + 1] ?? null;
}

function isoDateUTC(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

function safeMkdir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function truncate(str, max = 160) {
  if (!str) return "";
  const s = String(str).replace(/\s+/g, " ").trim();
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + "…";
}

function mdLink(text, url) {
  if (!url) return text;
  return `[${text}](${url})`;
}

async function fetchText(url, timeoutMs = 12000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: {
        // Some publishers (e.g., FT) block non-browser UAs.
        "user-agent": "Mozilla/5.0 (compatible; HeimdallHubBriefGenerator/1.0)",
        accept: "application/rss+xml,application/xml,text/xml;q=0.9,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.9",
      },
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    return await res.text();
  } finally {
    clearTimeout(t);
  }
}

// Extremely small RSS-ish parser: pulls <item><title>, <link>, <description>
function parseRssItems(xml, limit = 10) {
  const items = [];
  const itemMatches = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];
  for (const itemXml of itemMatches.slice(0, limit)) {
    const title = (itemXml.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i)?.[1] ??
      itemXml.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ??
      "")
      .replace(/<[^>]+>/g, "")
      .trim();

    // RSS link variants
    const link =
      itemXml.match(/<link>([\s\S]*?)<\/link>/i)?.[1]?.trim() ??
      itemXml.match(/<link[^>]*href="([^"]+)"[^>]*\/>/i)?.[1]?.trim() ??
      "";

    const descRaw =
      itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i)?.[1] ??
      itemXml.match(/<description>([\s\S]*?)<\/description>/i)?.[1] ??
      "";

    const description = descRaw.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

    if (title) items.push({ title, link, description });
  }
  return items;
}

async function loadConfig() {
  const raw = fs.readFileSync(cfgPath, "utf8");
  const parsed = yaml.load(raw);
  if (!parsed || typeof parsed !== "object") throw new Error("Invalid briefs.yaml");
  return parsed;
}

function getSource(cfg, id) {
  return (cfg.sources ?? []).find((s) => s.id === id);
}

async function section_news(cfg, section) {
  const src = getSource(cfg, section.sources_ref);
  if (!src || src.kind !== "rss") {
    return [`- (No RSS sources configured for ${section.sources_ref})`];
  }

  const feeds = src.feeds ?? [];
  const bullets = [];
  for (const feed of feeds) {
    if (feed?.enabled === false) continue;
    if (!feed?.url || String(feed.url).includes("example.com")) {
      bullets.push(`- (Placeholder feed: ${feed?.name ?? "(unnamed)"})`);
      continue;
    }
    try {
      const xml = await fetchText(feed.url);
      const perFeed = Math.max(3, Math.ceil(section.max_bullets / Math.max(1, feeds.length)));
      const items = parseRssItems(xml, perFeed);
      for (const it of items) {
        const summary = truncate(it.description, 220);
        const head = `${feed.name ? `**${feed.name}**: ` : ""}${mdLink(truncate(it.title, 140), it.link)}`;
        bullets.push(`- ${head}${summary ? ` — ${summary}` : ""}`);
        if (bullets.length >= section.max_bullets) break;
      }
    } catch (e) {
      bullets.push(`- (Failed to load ${feed.name ?? feed.url}: ${String(e.message ?? e)})`);
    }
    if (bullets.length >= section.max_bullets) break;
  }
  return bullets.slice(0, section.max_bullets);
}

function googleNewsRssUrl(query) {
  // Free, lightweight headline feed; good enough for v1 catalysts.
  const q = encodeURIComponent(query);
  return `https://news.google.com/rss/search?q=${q}%20when:1d&hl=en-US&gl=US&ceid=US:en`;
}

async function stooqQuote(ticker) {
  // Stooq expects e.g. aapl.us for US equities
  const sym = `${ticker}`.toLowerCase().includes(".") ? `${ticker}`.toLowerCase() : `${ticker}`.toLowerCase() + ".us";
  const url = `https://stooq.com/q/l/?s=${encodeURIComponent(sym)}&i=d`;
  const csv = await fetchText(url);
  const lines = csv.trim().split(/\r?\n/).filter(Boolean);
  if (!lines.length) throw new Error("No data");

  // Stooq sometimes returns with headers, sometimes as a single data line.
  let row;
  if (lines[0].toLowerCase().includes("symbol") && lines.length >= 2) {
    const headers = lines[0].split(",");
    const values = lines[1].split(",");
    row = Object.fromEntries(headers.map((h, i) => [h, values[i]]));
  } else {
    const values = lines[0].split(",");
    // Symbol,Date,Time,Open,High,Low,Close,Volume
    row = {
      Symbol: values[0],
      Date: values[1],
      Time: values[2],
      Open: values[3],
      High: values[4],
      Low: values[5],
      Close: values[6],
      Volume: values[7],
    };
  }

  const close = Number(row.Close);
  const open = Number(row.Open);
  const chg = Number.isFinite(close) && Number.isFinite(open) ? close - open : NaN;
  const chgPct = Number.isFinite(chg) && Number.isFinite(open) && open !== 0 ? (chg / open) * 100 : NaN;
  return { sym, close, open, chg, chgPct, date: row.Date };
}

async function section_markets(cfg, section) {
  const src = getSource(cfg, section.sources_ref);
  if (!src || src.kind !== "markets") {
    return [`- (No markets source configured for ${section.sources_ref})`];
  }

  // v1 support: watchlist quotes OR "top_movers" mode.
  const mode = src.mode ?? "watchlist";
  if (mode === "top_movers") {
    const universe = src.top_movers?.universe?.tickers ?? [];
    const limit = Math.min(src.top_movers?.limit ?? 10, section.max_bullets);
    if (!universe.length) {
      return ["- (No top_movers.universe.tickers configured)"];
    }

    const quotes = [];
    for (const t of universe.slice(0, 80)) {
      try {
        const q = await stooqQuote(t);
        if (!Number.isFinite(q.chgPct)) continue;
        quotes.push({ t, close: q.close, chgPct: q.chgPct });
      } catch {
        // ignore
      }
    }

    quotes.sort((a, b) => Math.abs(b.chgPct) - Math.abs(a.chgPct));
    const top = quotes.slice(0, limit);
    if (!top.length) return ["- (No quotes available to compute movers)"];

    const bullets = [];
    for (const q of top) {
      const move = `${q.chgPct >= 0 ? "+" : ""}${q.chgPct.toFixed(2)}%`;
      let catalyst = "";
      try {
        const xml = await fetchText(googleNewsRssUrl(`${q.t} stock why move`), 10000);
        const items = parseRssItems(xml, 1);
        if (items[0]?.title) catalyst = truncate(items[0].title, 140);
      } catch {
        // ignore
      }
      bullets.push(
        `- **${q.t}**: ${Number.isFinite(q.close) ? q.close.toFixed(2) : "—"} (${move})${catalyst ? ` — catalyst: ${catalyst}` : ""}`
      );
    }

    bullets.push(`- Bird’s-eye: movers computed from a liquid universe (not market-wide). We’ll refine as you add sectors/watchlists.`);
    return bullets.slice(0, section.max_bullets);
  }

  const tickers = src.watchlist?.tickers ?? [];
  if (!tickers.length) return ["- (No watchlist tickers configured)"];

  const bullets = [];
  for (const t of tickers.slice(0, section.max_bullets)) {
    try {
      const q = await stooqQuote(t);
      const move = Number.isFinite(q.chgPct) ? `${q.chgPct >= 0 ? "+" : ""}${q.chgPct.toFixed(2)}%` : "—";
      bullets.push(`- **${t}**: ${Number.isFinite(q.close) ? q.close.toFixed(2) : "—"} (${move})`);
    } catch (e) {
      bullets.push(`- **${t}**: (quote unavailable)`);
    }
  }

  bullets.push(`- Note: "why"/catalysts not yet implemented — will add news-to-mover linkage once sources are tuned.`);
  return bullets.slice(0, section.max_bullets);
}

async function section_ai(cfg, section) {
  const src = getSource(cfg, section.sources_ref);
  if (!src || src.kind !== "ai") {
    return [`- (No AI source configured for ${section.sources_ref})`];
  }

  const bullets = [];

  // 1) RSS AI/product/news (optional)
  const rssFeeds = src.rss?.feeds ?? [];
  for (const feed of rssFeeds) {
    if (!feed?.url) continue;
    try {
      const xml = await fetchText(feed.url);
      const items = parseRssItems(xml, 8);
      for (const it of items) {
        const summary = truncate(it.description, 220);
        bullets.push(`- ${feed.name ? `**${feed.name}**: ` : ""}${mdLink(truncate(it.title, 140), it.link)}${summary ? ` — ${summary}` : ""}`);
        if (bullets.length >= section.max_bullets) return bullets;
      }
    } catch {
      // ignore
    }
  }

  // 2) arXiv RSS (filtered)
  const cats = src.arxiv?.categories ?? [];
  const keywords = (src.arxiv?.keywords ?? []).map((k) => String(k).toLowerCase());
  if (!cats.length && !bullets.length) return ["- (No AI sources configured yet)"];

  for (const cat of cats) {
    try {
      const url = `https://export.arxiv.org/rss/${encodeURIComponent(cat)}`;
      const xml = await fetchText(url);
      const items = parseRssItems(xml, 25);
      for (const it of items) {
        const hay = `${it.title} ${it.description}`.toLowerCase();
        if (keywords.length && !keywords.some((k) => hay.includes(k))) continue;
        bullets.push(`- ${mdLink(truncate(it.title, 140), it.link)} (${cat})`);
        if (bullets.length >= section.max_bullets) break;
      }
    } catch {
      bullets.push(`- (Failed to load arXiv ${cat})`);
    }
    if (bullets.length >= section.max_bullets) break;
  }

  if (!bullets.length) bullets.push("- (No matching items yet — adjust AI RSS/keywords/categories in data/briefs.yaml)");
  return bullets.slice(0, section.max_bullets);
}

function loadYamlFile(relPath) {
  const p = path.join(repoRoot, relPath);
  if (!fs.existsSync(p)) return null;
  const raw = fs.readFileSync(p, "utf8");
  return yaml.load(raw);
}

function section_ops(cfg, section) {
  const src = getSource(cfg, section.sources_ref);
  const bullets = [];

  // Projects snapshot
  const projectsFile = loadYamlFile("data/projects.yaml");
  const projects = projectsFile?.projects ?? [];
  const active = projects.filter((p) => p.status === "active");
  const urgent = active
    .slice()
    .sort((a, b) => {
      const prRank = { urgent: 0, high: 1, medium: 2, low: 3 };
      return (prRank[a.priority] ?? 9) - (prRank[b.priority] ?? 9);
    })
    .slice(0, 5);

  bullets.push(`- Active projects: **${active.length}** (top priorities below)`);
  for (const p of urgent) {
    bullets.push(`- ${p.name}: ${truncate(p.next_action, 120)}`);
    if (bullets.length >= section.max_bullets) break;
  }

  // Tasks snapshot
  const tasksFile = loadYamlFile("data/tasks.yaml");
  const tasks = tasksFile?.tasks ?? [];
  const blocked = tasks.filter((t) => t.status === "blocked");
  if (blocked.length && bullets.length < section.max_bullets) {
    bullets.push(`- Blocked tasks: **${blocked.length}**`);
  }

  return bullets.slice(0, section.max_bullets);
}

function section_exec_placeholder() {
  return [
    "- (Exec summary not yet synthesized — will be generated from section highlights once sources are tuned.)",
  ];
}

async function generate() {
  const cfg = await loadConfig();
  const profile = (cfg.briefs ?? []).find((b) => b.id === profileId);
  if (!profile) throw new Error(`Unknown brief profile: ${profileId}`);

  const now = new Date();
  const date = isoDateUTC(now);
  const title = `Morning Brief — ${date} — ${profile.name}`;

  const lines = [];
  lines.push(`# ${title}`);
  lines.push("");
  lines.push(`Generated: ${now.toISOString()}`);
  lines.push("");

  for (const section of profile.sections ?? []) {
    if (section.enabled === false) continue;
    lines.push(`## ${section.title}`);

    let bullets = [];
    try {
      if (section.kind === "summary") bullets = section_exec_placeholder();
      else if (section.kind === "news") bullets = await section_news(cfg, section);
      else if (section.kind === "markets") bullets = await section_markets(cfg, section);
      else if (section.kind === "ai") bullets = await section_ai(cfg, section);
      else if (section.kind === "ops") bullets = section_ops(cfg, section);
      else bullets = [`- (Section kind not implemented: ${section.kind})`];
    } catch (e) {
      bullets = [`- (Failed to render section: ${String(e.message ?? e)})`];
    }

    for (const b of bullets) lines.push(b);
    lines.push("");
  }

  safeMkdir(runsDir);
  const outPath = path.join(runsDir, `${date}.md`);
  fs.writeFileSync(outPath, lines.join("\n"), "utf8");

  process.stdout.write(`Wrote ${path.relative(repoRoot, outPath)}\n`);
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
