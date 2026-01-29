---
name: press-deploy
description: Deploy a standalone site repo to Cloudflare Pages with Vault-based secrets and DNS attach.
metadata:
  type: automation
  entrypoint: atoms-site-templates/dev-tools/press-deploy/deploy_site.py
  requires:
    - gh
    - cloudflare api token
    - vault files
---

# Tool Name
Press Deploy

## Capability
Creates a standalone site repo, configures Cloudflare Pages, injects Vault secrets, and attaches a custom domain.

## When to use
- When spinning up a new customer website repo outside the monorepo.
- When re-deploying a standalone site with Pages + DNS.

## Schema
**Input (CLI args):**
```json
{
  "repo_path": "/absolute/path/to/site",
  "repo_name": "atoms-fam",
  "repo_owner": "your-github-user",
  "domain": "example.com",
  "zone_id": "cloudflare-zone-id",
  "pages_domain": "atoms-fam.pages.dev" 
}
```

**Output:**
- Cloudflare Pages project created/updated
- Env vars injected
- DNS CNAME set
- Custom domain attached

## Cost
Base Snax price: 0 (internal ops)

## Brain/Brawn
Runs locally via CLI; uses Vault secrets in `/Users/jaynowman/northstar-keys/`.

## Vault Files Required
- `cloudflare-mcp-api-token.txt`
- `cloudflare-account-id.txt`
- `supabase-url.txt`
- `supabase-anon-key.txt` or `supabase_publishable_api.txt`
- `stripe-publishable-key.txt`
- `stripe-secret-key.txt`

## Usage
```bash
python3 /Users/jaynowman/dev/atoms-site-templates/dev-tools/press-deploy/deploy_site.py \
  --repo-path /Users/jaynowman/sites/atoms-fam \
  --repo-name atoms-fam \
  --repo-owner jamienowman-glitch \
  --domain squared-agents.app \
  --zone-id bb02c99af8626966742f30210a89ce73
```
