#!/usr/bin/env python3

import argparse
import base64
import json
import os
import re
import sys
import time
from urllib.parse import urlparse

import requests

REDDIT_TOKEN_URL = "https://www.reddit.com/api/v1/access_token"
REDDIT_OAUTH_BASE = "https://oauth.reddit.com"


def _env(name: str, required: bool = True) -> str:
    v = os.environ.get(name)
    if required and not v:
        raise RuntimeError(f"Missing env var: {name}")
    return v or ""


def _reddit_headers(user_agent: str, bearer: str | None = None) -> dict:
    h = {
        "User-Agent": user_agent,
        "Accept": "application/json",
    }
    if bearer:
        h["Authorization"] = f"bearer {bearer}"
    return h


def get_token() -> str:
    client_id = _env("REDDIT_CLIENT_ID")
    client_secret = _env("REDDIT_CLIENT_SECRET")
    username = _env("REDDIT_USERNAME")
    password = _env("REDDIT_PASSWORD")
    user_agent = _env("REDDIT_USER_AGENT")

    auth = requests.auth.HTTPBasicAuth(client_id, client_secret)
    data = {
        "grant_type": "password",
        "username": username,
        "password": password,
    }

    r = requests.post(
        REDDIT_TOKEN_URL,
        auth=auth,
        data=data,
        headers=_reddit_headers(user_agent),
        timeout=30,
    )
    if r.status_code != 200:
        raise RuntimeError(f"Token error {r.status_code}: {r.text[:500]}")
    j = r.json()
    token = j.get("access_token")
    if not token:
        raise RuntimeError(f"Token response missing access_token: {j}")
    return token


def is_fullname(s: str) -> bool:
    return bool(re.match(r"^(t1|t3|t5)_[a-z0-9]+$", s.strip()))


def resolve_parent_to_fullname(parent: str, user_agent: str) -> str:
    parent = parent.strip()
    if is_fullname(parent):
        return parent

    # Accept comment or post URLs
    # Post: /r/<sub>/comments/<postid>/...
    # Comment: .../comments/<postid>/.../<commentid>/
    m_post = re.search(r"/comments/([a-z0-9]+)/", parent)
    if not m_post:
        raise RuntimeError("Could not parse Reddit URL for post/comment id")
    post_id = m_post.group(1)

    # comment id is usually the last non-empty path segment
    path_parts = [p for p in urlparse(parent).path.split("/") if p]
    comment_id = None
    # If URL has .../<commentid>/ it tends to be last segment
    if path_parts:
        last = path_parts[-1]
        if re.match(r"^[a-z0-9]+$", last) and last != post_id:
            comment_id = last

    if comment_id:
        return f"t1_{comment_id}"
    return f"t3_{post_id}"


def oauth_post(path: str, token: str, user_agent: str, data: dict) -> dict:
    url = f"{REDDIT_OAUTH_BASE}{path}"
    r = requests.post(url, headers=_reddit_headers(user_agent, token), data=data, timeout=30)
    # reddit sometimes returns 200 with json errors embedded; still treat non-200 as error
    if r.status_code != 200:
        raise RuntimeError(f"Reddit API error {r.status_code}: {r.text[:500]}")
    # Some endpoints return JSON, others return weird arrays; best-effort
    try:
        return r.json()
    except Exception:
        return {"raw": r.text}


def oauth_get(path: str, token: str, user_agent: str, params: dict | None = None) -> dict:
    url = f"{REDDIT_OAUTH_BASE}{path}"
    r = requests.get(url, headers=_reddit_headers(user_agent, token), params=params, timeout=30)
    if r.status_code != 200:
        raise RuntimeError(f"Reddit API error {r.status_code}: {r.text[:500]}")
    return r.json()


def cmd_submit_post(args) -> dict:
    user_agent = _env("REDDIT_USER_AGENT")
    req = {
        "subreddit": args.subreddit,
        "title": args.title,
        "text": args.text,
        "kind": "self",
        "nsfw": bool(args.nsfw),
        "spoiler": bool(args.spoiler),
    }

    if not args.confirm:
        return {"ok": True, "dry_run": True, "request": req, "result": None}

    token = get_token()
    data = {
        "sr": args.subreddit,
        "kind": "self",
        "title": args.title,
        "text": args.text,
        "nsfw": "true" if args.nsfw else "false",
        "spoiler": "true" if args.spoiler else "false",
        "resubmit": "true" if args.resubmit else "false",
        "api_type": "json",
    }
    result = oauth_post("/api/submit", token, user_agent, data)
    return {"ok": True, "dry_run": False, "request": req, "result": result}


def cmd_comment(args) -> dict:
    user_agent = _env("REDDIT_USER_AGENT")
    parent_fullname = resolve_parent_to_fullname(args.parent, user_agent)
    req = {"parent": parent_fullname, "text": args.text}

    if not args.confirm:
        return {"ok": True, "dry_run": True, "request": req, "result": None}

    token = get_token()
    data = {
        "thing_id": parent_fullname,
        "text": args.text,
        "api_type": "json",
    }
    result = oauth_post("/api/comment", token, user_agent, data)
    return {"ok": True, "dry_run": False, "request": req, "result": result}


def cmd_inbox_unread(args) -> dict:
    user_agent = _env("REDDIT_USER_AGENT")
    token = get_token()
    params = {"limit": args.limit}
    result = oauth_get("/message/unread", token, user_agent, params=params)
    return {"ok": True, "dry_run": False, "request": {"limit": args.limit}, "result": result}


def build_parser():
    p = argparse.ArgumentParser(description="Authenticated Reddit API helper for OpenClaw")
    sub = p.add_subparsers(dest="command", required=True)

    sp = sub.add_parser("submit_post", help="Submit a self post")
    sp.add_argument("--subreddit", required=True)
    sp.add_argument("--title", required=True)
    sp.add_argument("--text", required=True)
    sp.add_argument("--nsfw", action="store_true")
    sp.add_argument("--spoiler", action="store_true")
    sp.add_argument("--resubmit", action="store_true")
    sp.add_argument("--confirm", type=lambda x: str(x).lower() == "true", default=False)
    sp.set_defaults(func=cmd_submit_post)

    cp = sub.add_parser("comment", help="Comment on a post or reply to a comment")
    cp.add_argument("--parent", required=True, help="fullname (t3_/t1_) or reddit URL")
    cp.add_argument("--text", required=True)
    cp.add_argument("--confirm", type=lambda x: str(x).lower() == "true", default=False)
    cp.set_defaults(func=cmd_comment)

    ip = sub.add_parser("inbox_unread", help="Fetch unread inbox items")
    ip.add_argument("--limit", type=int, default=25)
    ip.set_defaults(func=cmd_inbox_unread)

    return p


def main():
    p = build_parser()
    args = p.parse_args()

    try:
        out = args.func(args)
    except Exception as e:
        out = {"ok": False, "error": str(e)}

    json.dump(out, sys.stdout, indent=2)
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()
