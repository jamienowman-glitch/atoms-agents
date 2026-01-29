# Worker B — Press Engine (spawn_site.py) (Atomic Task Plan)

## Role
Platform Engineer (Automation)

## Objective
Implement `spawn_site.py` to clone templates, create GitHub repos, create Cloudflare Pages projects, and inject Vault secrets via API.

## Constraints (Hard Laws)
- No `.env` files. Read secrets from `/Users/jaynowman/northstar-keys/`.
- No `northstar-engines` imports.
- Must fail fast on missing Vault keys.

## Phase 1 — Environment Setup (MANDATORY FIRST STEP)
1) Ensure path exists:
   - `/Users/jaynowman/dev/atoms-site-templates/dev-tools/`
2) Create:
   - `/Users/jaynowman/dev/atoms-site-templates/dev-tools/spawn_site.py`
3) Verify Vault keys exist for:
   - Cloudflare API token
   - Cloudflare account ID
   - GitHub token or `gh` CLI auth
   - Supabase URL + anon/service keys

## Phase 2 — Implementation
1) Inputs:
   - `template_id`
   - `target_site_name`
   - `url_prefix`
   - `root_domain_id`
2) Resolve template path from `public.site_templates`.
3) Clone & eject:
   - Copy template to `../{target_site_name}` (outside monorepo)
   - Remove `node_modules`
   - Remove `.git`
   - Initialize new git repo
   - Rename identifiers (package name, site name, etc.) from SURFACE-template to client name
4) GitHub:
   - Create private repo via `gh` CLI
   - Push main branch
5) Cloudflare Pages:
   - Create Pages project via API
   - Connect to GitHub repo
   - Set build command `npm run pages:build` and output `.vercel/output/static`
6) Vault -> Cloudflare Env Vars:
   - Read Vault files from `/Users/jaynowman/northstar-keys/`
   - Upsert env vars for production + preview via Cloudflare API
7) Output:
   - Project URL, GitHub repo URL, and Pages project ID

## Deliverables
- `spawn_site.py` implemented with full workflow.
- Fail-fast validation for missing Vault keys.
- Clear console output for each step.

## Validation
- Run spawn_site.py against a test template and confirm:
  - Repo created
  - Pages project created
  - Env vars injected
  - Deployment triggered

## Kickoff Prompt (for the Worker)
Role: Platform Engineer
Goal: Build `spawn_site.py` with full clone→repo→cloudflare→secrets flow. Start with environment setup and key checks. Must be Vault-driven (no .env). Provide clear logs and fail fast on missing secrets. Report exact files/paths touched and a dry-run example.
