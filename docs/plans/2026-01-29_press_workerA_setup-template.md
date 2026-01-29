# Worker A — Setup & Template Upgrade (Atomic Task Plan)

## Role
Foundation Engineer (Template/Infra)

## Objective
Create the new template hierarchy, move the template, and upgrade SURFACE-template to the Golden Standard.

## Constraints (Hard Laws)
- No `.env` files. Secrets must be read from `/Users/jaynowman/northstar-keys/` via Vault loaders or file read.
- No `northstar-engines` imports.
- Must keep `atoms-core` as library and `atoms-muscle` as runtime only.
- Use explicit `from atoms_core.src.<domain> ...` imports only (no namespace merge).

## Phase 1 — Environment Setup (MANDATORY FIRST STEP)
1) Create folder hierarchy:
   - `/Users/jaynowman/dev/atoms-site-templates/dev-tools/agent-gains`
   - `/Users/jaynowman/dev/atoms-site-templates/saas-templates/SURFACE-template`
   - `/Users/jaynowman/dev/atoms-site-templates/ecom-site-templates/shopify-templates`
   - `/Users/jaynowman/dev/atoms-site-templates/ecom-site-templates/wix-templates`
   - `/Users/jaynowman/dev/atoms-site-templates/event-site-templates`

2) Move template:
   - Move `/Users/jaynowman/dev/microsite-template` -> `/Users/jaynowman/dev/atoms-site-templates/saas-templates/SURFACE-template`

3) Migration generation + execution (no manual SQL paste):
   - Create a migration SQL file for:
     - `public.site_templates`
     - `public.owned_domains`
     - `public.typography_presets`
   - Execute via existing migration runner or provide a migration runner script and run it.

## Phase 2 — Golden Standard Template
1) Install Supabase auth deps:
   - Add `@supabase/ssr` to template deps.
2) Add routing + SEO:
   - Add `/Users/jaynowman/dev/atoms-site-templates/saas-templates/SURFACE-template/src/app/sitemap.ts`
   - Add `/Users/jaynowman/dev/atoms-site-templates/saas-templates/SURFACE-template/src/middleware.ts`
3) Auth gate:
   - Middleware should enforce auth for protected routes.
4) Snax Balance UI:
   - Add Snax balance component wired to Supabase (read-only view OK if server wiring not yet added).
5) Secrets strategy:
   - Primary: `process.env` (Cloudflare-ready)
   - Fallback: Vault (`/Users/jaynowman/northstar-keys/`)

## Deliverables
- Folder hierarchy exists.
- Template moved and renamed as required.
- Migration executed and tables exist.
- SURFACE-template upgraded (Supabase Auth + sitemap + middleware + Snax UI).

## Validation
- Run build in `/Users/jaynowman/dev/atoms-site-templates/saas-templates/SURFACE-template`.
- Confirm sitemap route resolves.
- Confirm middleware runs for protected routes.

## Kickoff Prompt (for the Worker)
Role: Foundation Engineer
Goal: Execute the Setup & Template Upgrade plan precisely. Begin with the Environment Setup shell commands. Then migrate Supabase tables via runner (no manual paste). Finish with Golden Standard upgrades (Supabase auth, sitemap, middleware, Snax UI) and secrets fallback to Vault. Report exact paths modified and proof of migration execution.
