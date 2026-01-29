# Atoms-Fam Standalone Deploy Log
Date: 2026-01-29

## Goal
Move the marketing site to a standalone repo and deploy to Cloudflare Pages at `squared-agents.app`.

## Paths
- Source: `/Users/jaynowman/dev/atoms-site`
- Standalone repo: `/Users/jaynowman/sites/atoms-fam`
- Pages project: `atoms-fam`
- Custom domain: `squared-agents.app`

## Steps Executed (Chronological)
1) **Moved site to standalone path**
   - `mv /Users/jaynowman/dev/atoms-site /Users/jaynowman/sites/atoms-fam`

2) **Made standalone-safe edits**
   - Disabled `atoms-ui` demo import:
     - `/Users/jaynowman/sites/atoms-fam/src/app/demo/contract-builder/page.tsx`
   - Vault helper prefers host env vars first, then Vault fallback:
     - `/Users/jaynowman/sites/atoms-fam/src/lib/vault.ts`

3) **Initialized Git repo + commit**
   - `git init`, `git add .`, `git commit -m "Initial atoms-fam site"`

4) **Created GitHub repo + pushed**
   - Repo: `jamienowman-glitch/atoms-fam` (private)

5) **Created Cloudflare Pages project**
   - Build command: `npm run pages:build`
   - Output dir: `.vercel/output/static`

6) **Injected env vars from Vault** (prod + preview)
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`

7) **Attached custom domain**
   - `squared-agents.app`

8) **Set DNS CNAME**
   - `squared-agents.app -> atoms-fam.pages.dev`

9) **Triggered deploy**
   - Empty commit `Trigger Pages deploy`
   - Push to `main`

10) **Observed build failure**
   - Error: `Module not found: Can't resolve '../../lib/vault'` in API routes

11) **Fixed import paths**
   - `/Users/jaynowman/sites/atoms-fam/src/app/api/checkout/route.ts` -> `../../../lib/vault`
   - `/Users/jaynowman/sites/atoms-fam/src/app/api/config/stripe/route.ts` -> `../../../../../lib/vault`
   - Commit: `Fix vault import paths` and push

## Current Status
- **Domain**: `squared-agents.app` is **active** in Pages.
- **Latest deployment**: build currently **active** (as of last check).
- **Last known failure**: missing `vault` import paths (fixed and pushed).

## Verification Commands
- Cloudflare Pages deployment status:
  - `GET /accounts/{account_id}/pages/projects/atoms-fam/deployments`
- Cloudflare Pages domain status:
  - `GET /accounts/{account_id}/pages/projects/atoms-fam/domains`

## Next Check
- Re-poll Pages deployment until `latest_stage.status` is `success`.

## Follow-up: 2026-01-29 (late)
- Verified custom domain status: `squared-agents.app` **active** in Pages.
- Deployment failed due to wrong vault import path in `src/app/api/config/stripe/route.ts`.
- Fixed import to `../../../../lib/vault`, committed and pushed.
- New deploy started (build active).
- Added DNS CNAME for `www.squared-agents.app -> atoms-fam.pages.dev`.
