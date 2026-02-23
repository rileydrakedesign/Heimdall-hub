#!/usr/bin/env python3
"""Reddit thread extraction with 2 tiers:

Tier 1: Reddit `.json` endpoint (structured post + comment tree)
Tier 2: `old.reddit.com` HTML (best-effort post + visible comments)

This script is designed to be used by an OpenClaw agent as a deterministic helper.
It intentionally does NOT bypass bot protections or CAPTCHAs.

Usage:
  reddit_extract.py <thread_url> [--tier json|html|auto] [--format json]

Output:
  JSON to stdout.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
from dataclasses import dataclass
from html import unescape
from html.parser import HTMLParser
from typing import Any, Dict, List, Optional, Tuple

import requests

UA = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)


def _norm_thread_url(url: str) -> str:
    url = url.strip()
    url = re.sub(r"\?.*$", "", url)
    url = re.sub(r"#.*$", "", url)
    # normalize to https://www.reddit.com
    url = url.replace("http://", "https://")
    if url.startswith("https://old.reddit.com"):
        url = url.replace("https://old.reddit.com", "https://www.reddit.com")
    if url.startswith("https://reddit.com"):
        url = url.replace("https://reddit.com", "https://www.reddit.com")
    return url


def _to_json_url(thread_url: str) -> str:
    thread_url = _norm_thread_url(thread_url)
    if thread_url.endswith("/"):
        return thread_url[:-1] + ".json"
    return thread_url + ".json"


def _to_old_url(thread_url: str) -> str:
    thread_url = _norm_thread_url(thread_url)
    return thread_url.replace("https://www.reddit.com", "https://old.reddit.com")


def _http_get(url: str) -> requests.Response:
    r = requests.get(
        url,
        headers={"User-Agent": UA, "Accept": "text/html,application/json"},
        timeout=30,
    )
    return r


def _strip_tags(html: str) -> str:
    html = re.sub(r"<script[\s\S]*?</script>", "", html, flags=re.I)
    html = re.sub(r"<style[\s\S]*?</style>", "", html, flags=re.I)
    text = re.sub(r"<br\s*/?>", "\n", html, flags=re.I)
    text = re.sub(r"</p\s*>", "\n\n", text, flags=re.I)
    text = re.sub(r"<[^>]+>", "", text)
    text = unescape(text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def _safe_int(v: Any) -> Optional[int]:
    try:
        if v is None:
            return None
        return int(v)
    except Exception:
        return None


def extract_json(thread_url: str) -> Dict[str, Any]:
    url = _to_json_url(thread_url)
    r = _http_get(url)
    if r.status_code != 200:
        raise RuntimeError(f"json http {r.status_code}")

    data = r.json()
    if not isinstance(data, list) or len(data) < 2:
        raise RuntimeError("unexpected json shape")

    post_listing = data[0]
    comments_listing = data[1]

    post_child = (post_listing.get("data") or {}).get("children") or []
    post = (post_child[0].get("data") if post_child else {}) if isinstance(post_child, list) else {}

    def walk(children: List[Dict[str, Any]], depth: int = 0) -> List[Dict[str, Any]]:
        out: List[Dict[str, Any]] = []
        for ch in children:
            kind = ch.get("kind")
            cd = ch.get("data") or {}
            if kind == "t1":
                out.append(
                    {
                        "id": cd.get("id"),
                        "author": cd.get("author"),
                        "body": cd.get("body") or "",
                        "score": _safe_int(cd.get("score")),
                        "created_utc": cd.get("created_utc"),
                        "permalink": cd.get("permalink"),
                        "depth": depth,
                        "parent_id": cd.get("parent_id"),
                        "link_id": cd.get("link_id"),
                    }
                )
                replies = cd.get("replies")
                if isinstance(replies, dict):
                    rep_children = (replies.get("data") or {}).get("children") or []
                    if isinstance(rep_children, list) and rep_children:
                        out.extend(walk(rep_children, depth + 1))
            elif kind == "more":
                # Placeholder for collapsed/extra comments.
                out.append(
                    {
                        "kind": "more",
                        "count": _safe_int(cd.get("count")),
                        "parent_id": cd.get("parent_id"),
                        "children": cd.get("children") or [],
                        "depth": depth,
                    }
                )
        return out

    comment_children = (comments_listing.get("data") or {}).get("children") or []
    comments_flat = walk(comment_children, 0) if isinstance(comment_children, list) else []

    more_placeholders = [c for c in comments_flat if c.get("kind") == "more"]

    return {
        "tier": "json",
        "source_url": thread_url,
        "json_url": url,
        "post": {
            "id": post.get("id"),
            "title": post.get("title"),
            "author": post.get("author"),
            "selftext": post.get("selftext") or "",
            "created_utc": post.get("created_utc"),
            "subreddit": post.get("subreddit"),
            "permalink": post.get("permalink"),
            "score": _safe_int(post.get("score")),
        },
        "comments": comments_flat,
        "partial": True if more_placeholders else False,
        "notes": (
            f"Contains {len(more_placeholders)} 'more' placeholders; thread may be partial"
            if more_placeholders
            else None
        ),
    }


class _OldRedditParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_md = 0
        self.in_title = 0
        self.cur: List[str] = []
        self.blocks: List[str] = []
        self.title: str = ""

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "div" and attrs.get("class") == "md":
            self.in_md += 1
            self.cur = []
        if tag == "a" and attrs.get("class") == "title":
            self.in_title += 1
            self.cur = []
        if tag == "br" and (self.in_md or self.in_title):
            self.cur.append("\n")

    def handle_endtag(self, tag):
        if tag == "div" and self.in_md:
            self.in_md -= 1
            if not self.in_md:
                txt = "".join(self.cur).strip()
                if txt:
                    self.blocks.append(txt)
                self.cur = []
        if tag == "a" and self.in_title:
            self.in_title -= 1
            if not self.in_title:
                txt = "".join(self.cur).strip()
                if txt and not self.title:
                    self.title = txt
                self.cur = []

    def handle_data(self, data):
        if self.in_md or self.in_title:
            self.cur.append(data)


def extract_old_html(thread_url: str) -> Dict[str, Any]:
    url = _to_old_url(thread_url)
    r = _http_get(url)
    if r.status_code != 200:
        raise RuntimeError(f"html http {r.status_code}")

    p = _OldRedditParser()
    p.feed(r.text)

    # Heuristic: first md block is often post body; remaining are comments.
    post_text = p.blocks[0] if p.blocks else ""
    comments = p.blocks[1:] if len(p.blocks) > 1 else []

    return {
        "tier": "html",
        "source_url": thread_url,
        "html_url": url,
        "post": {
            "title": p.title,
            "text": post_text,
        },
        "comments": [{"body": c} for c in comments[:200]],
        "partial": True,  # HTML parse is inherently partial
        "notes": "HTML extraction is best-effort; deep threads/pagination may be incomplete",
    }


def extract_auto(thread_url: str) -> Dict[str, Any]:
    try:
        return extract_json(thread_url)
    except Exception as e1:
        try:
            out = extract_old_html(thread_url)
            out["notes"] = f"Tier1 failed: {e1}; used old reddit HTML"
            return out
        except Exception as e2:
            raise RuntimeError(f"Tier1 failed: {e1}; Tier2 failed: {e2}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("url")
    ap.add_argument("--tier", choices=["auto", "json", "html"], default="auto")
    ap.add_argument("--format", choices=["json"], default="json")
    args = ap.parse_args()

    url = args.url
    try:
        if args.tier == "json":
            out = extract_json(url)
        elif args.tier == "html":
            out = extract_old_html(url)
        else:
            out = extract_auto(url)
        sys.stdout.write(json.dumps(out, ensure_ascii=False, indent=2))
        sys.stdout.write("\n")
    except Exception as e:
        err = {
            "ok": False,
            "source_url": url,
            "tier": args.tier,
            "error": str(e),
        }
        sys.stdout.write(json.dumps(err, ensure_ascii=False, indent=2))
        sys.stdout.write("\n")
        sys.exit(2)


if __name__ == "__main__":
    main()
