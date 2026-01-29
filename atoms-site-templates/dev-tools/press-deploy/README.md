# Press Deploy (Bookmark)

This folder contains the reusable deploy script + SKILL for shipping standalone customer sites to Cloudflare Pages.

## Files
- `deploy_site.py` — generic deploy script
- `SKILL.md` — usage + Vault requirements

## Required Vault Files
- `cloudflare-mcp-api-token.txt`
- `cloudflare-account-id.txt`
- `supabase-url.txt`
- `supabase-anon-key.txt` or `supabase_publishable_api.txt`
- `stripe-publishable-key.txt`
- `stripe-secret-key.txt`

## Example
```bash
python3 /Users/jaynowman/dev/atoms-site-templates/dev-tools/press-deploy/deploy_site.py \
  --repo-path /Users/jaynowman/sites/atoms-fam \
  --repo-name atoms-fam \
  --repo-owner jamienowman-glitch \
  --domain squared-agents.app \
  --zone-id bb02c99af8626966742f30210a89ce73
```
