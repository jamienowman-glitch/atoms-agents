---
title: Registry Flow (DB-First via Vault) — MAYBES + HAZE Tech Spec
date: 2026-01-29
owner: core-ui-foundation
status: draft
scope: atoms-core + atoms-app + atoms-ui
---

# Goal
Unify registry flow so **all** MAYBES + HAZE registry data is **DB-first** in Supabase, written via Vault-backed scripts or atoms-core admin APIs, and **read** by UI via a single canonical path. Eliminate legacy file-registry paths to prevent empty dropdowns / drift.

# Non‑Negotiables
- **DB-first registry**: Supabase is the source of truth. No file registries.
- **Vault-only**: any registry write uses Vault secrets at `/Users/jaynowman/northstar-keys/`.
- **No northstar-engines**: do not depend on legacy engines or YAML registries.
- **Tenant compute first**: UI uses client CPU/GPU; backend registry is metadata only.

# Canonical Registry Tables (Supabase)
These are authoritative for MAYBES + HAZE:
- **public.canvases** — Canvas entries (e.g., `canvas.maybes`, `canvas.haze`).
- **public.ui_atoms** — Node/atom entries (e.g., `node.maybes.note`).
- **public.muscles** — Muscle entries (owned by muscle sync pipeline; do not touch here).

# Registry Flow (Write Path)
1. **Admin registration** is performed via **Vault-backed script** or **atoms-core admin API**.
2. **No SQL seeding** unless explicitly approved for bootstrap.
3. **Vault source**:
   - `supabase-url.txt`
   - `supabase-service-key.txt`

# Registry Flow (Read Path)
- UI reads via **atoms-core registry endpoints** (preferred) or direct Supabase read (if no core API exists).
- Contract Builder saves to **Supabase** (not files).

# Required Entries (MAYBES + HAZE)
## Canvases (public.canvases)
- `canvas.maybes` — MAYBES Note Canvas (ToolPill-first)
- `canvas.haze` — HAZE Nexus Explorer

## UI Atoms (public.ui_atoms)
- `node.maybes.note` — note node (text/audio/image)

# Source Files / Context
- `atoms-app/supabase/migrations/20260127190000_create_ui_atoms_table.sql`
- `atoms-app/supabase/migrations/20260129000000_init_maybes.sql`
- `atoms-ui/canvases/maybes/contract.json`
- `atoms-ui/canvases/haze/contract.json`
- `atoms-ui/harness/registry/client.ts`

# Decision Log
- **No more registry YAML** (`atoms-registry`) — deprecated/quarantined.
- **Writes are Vault-only**, and **read path must be DB-first** to avoid empty dropdowns.

# Open Questions (resolve before implementation)
1. Do we want **registry writes** performed via atoms-core **admin API** or **direct Supabase** using Vault keys?
2. Should initial data for canvases/nodes be inserted via **script** or **migration**?
3. Confirm namespace keys: `canvas.maybes`, `canvas.haze`, `node.maybes.note`.
