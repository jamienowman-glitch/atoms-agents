#!/usr/bin/env python3
"""
Press Deploy (Bookmark Script)

Generic deploy helper for standalone sites:
- Git repo creation (gh CLI)
- Cloudflare Pages project creation
- Env var injection from Vault
- Custom domain attach + DNS CNAME

No .env files. Reads from /Users/jaynowman/northstar-keys/.
"""

from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Any
import urllib.request
import urllib.error

VAULT_DIR = Path("/Users/jaynowman/northstar-keys")


def read_vault(name: str) -> str:
    path = VAULT_DIR / name
    if not path.exists():
        raise FileNotFoundError(f"Missing vault file: {path}")
    value = path.read_text().strip()
    if not value:
        raise ValueError(f"Vault file empty: {path}")
    return value


def cf_request(method: str, url: str, token: str, payload: dict | None = None) -> dict:
    data = None
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        method=method,
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        try:
            return json.loads(body)
        except Exception:
            return {"errors": [{"message": body}]}


def ensure_repo(path: Path, repo_name: str, private: bool = True) -> None:
    if not path.exists():
        raise FileNotFoundError(f"Repo path not found: {path}")
    subprocess.check_call(["git", "-C", str(path), "init"])
    subprocess.check_call(["git", "-C", str(path), "add", "."])
    subprocess.check_call(["git", "-C", str(path), "commit", "-m", "Initial site"])
    cmd = [
        "gh",
        "repo",
        "create",
        repo_name,
        "--private" if private else "--public",
        "--source",
        str(path),
        "--remote",
        "origin",
        "--push",
    ]
    subprocess.check_call(cmd)


def create_pages_project(account_id: str, token: str, repo_owner: str, repo_name: str) -> None:
    base = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/pages/projects"
    project_name = repo_name

    result = cf_request("GET", f"{base}/{project_name}", token)
    if result.get("result"):
        return

    payload = {
        "name": project_name,
        "production_branch": "main",
        "source": {
            "type": "github",
            "config": {
                "owner": repo_owner,
                "repo_name": repo_name,
                "production_branch": "main",
                "pr_comments_enabled": False,
                "deployments_enabled": True,
            },
        },
        "build_config": {
            "build_command": "npm run pages:build",
            "destination_dir": ".vercel/output/static",
            "root_dir": "/",
        },
    }
    result = cf_request("POST", base, token, payload)
    if result.get("errors"):
        raise RuntimeError(result["errors"])


def set_pages_env(account_id: str, token: str, project: str) -> None:
    base = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/pages/projects/{project}"

    supabase_url = read_vault("supabase-url.txt")
    supabase_anon = (VAULT_DIR / "supabase-anon-key.txt").read_text().strip() if (VAULT_DIR / "supabase-anon-key.txt").exists() else read_vault("supabase_publishable_api.txt")
    stripe_pub = read_vault("stripe-publishable-key.txt")
    stripe_secret = read_vault("stripe-secret-key.txt")

    env_vars = {
        "SUPABASE_URL": {"type": "plain_text", "value": supabase_url},
        "SUPABASE_ANON_KEY": {"type": "plain_text", "value": supabase_anon},
        "STRIPE_PUBLISHABLE_KEY": {"type": "plain_text", "value": stripe_pub},
        "STRIPE_SECRET_KEY": {"type": "plain_text", "value": stripe_secret},
    }

    payload = {
        "deployment_configs": {
            "production": {"env_vars": env_vars},
            "preview": {"env_vars": env_vars},
        }
    }
    result = cf_request("PATCH", base, token, payload)
    if result.get("errors"):
        raise RuntimeError(result["errors"])


def attach_domain(account_id: str, token: str, project: str, domain: str) -> None:
    base = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/pages/projects/{project}/domains"
    result = cf_request("POST", base, token, {"name": domain})
    if result.get("errors"):
        # Ignore if already exists
        messages = [e.get("message", "") for e in result.get("errors", [])]
        if not any("already exists" in m.lower() for m in messages):
            raise RuntimeError(result["errors"])


def ensure_cname(token: str, zone_id: str, name: str, target: str, proxied: bool = True) -> None:
    query = f"https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records?type=CNAME&name={name}"
    result = cf_request("GET", query, token)
    existing = result.get("result") or []

    payload = {"type": "CNAME", "name": name, "content": target, "ttl": 1, "proxied": proxied}
    if existing:
        record_id = existing[0]["id"]
        result = cf_request("PUT", f"https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records/{record_id}", token, payload)
    else:
        result = cf_request("POST", f"https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records", token, payload)

    if result.get("errors"):
        raise RuntimeError(result["errors"])


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo-path", required=True, help="Absolute path to site repo")
    parser.add_argument("--repo-name", required=True, help="GitHub repo name")
    parser.add_argument("--repo-owner", required=True, help="GitHub owner/org")
    parser.add_argument("--domain", required=True, help="Custom domain")
    parser.add_argument("--zone-id", required=True, help="Cloudflare zone ID")
    parser.add_argument("--pages-domain", default=None, help="pages.dev hostname (defaults to <repo>.pages.dev)")
    args = parser.parse_args()

    repo_path = Path(args.repo_path)

    token = read_vault("cloudflare-mcp-api-token.txt")
    account_id = read_vault("cloudflare-account-id.txt")

    ensure_repo(repo_path, args.repo_name)
    create_pages_project(account_id, token, args.repo_owner, args.repo_name)
    set_pages_env(account_id, token, args.repo_name)
    attach_domain(account_id, token, args.repo_name, args.domain)

    pages_target = args.pages_domain or f"{args.repo_name}.pages.dev"
    ensure_cname(token, args.zone_id, args.domain, pages_target)

    print("Deploy complete. Check Pages deploy status in Cloudflare.")


if __name__ == "__main__":
    main()
