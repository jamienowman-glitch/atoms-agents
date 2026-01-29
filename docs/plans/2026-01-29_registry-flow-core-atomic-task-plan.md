---
title: Registry Flow (DB-First) — Core/Vault Write Path Atomic Task Plan
date: 2026-01-29
owner: core-registry-worker
status: draft
scope: atoms-core + atoms-app (Supabase)
---

# Goal
Ensure MAYBES + HAZE registry entries are **written to Supabase via Vault** and **not** via legacy file registries. Provide a canonical, repeatable registration path.

# Non‑Negotiables
- **Vault-only** for Supabase write access.
- **No northstar-engines** imports.
- **No file registry** creation.
- **Do not touch public.muscles**.

# Required Reads
1. `/Users/jaynowman/dev/AGENTS.md`
2. `/Users/jaynowman/dev/atoms-core/AGENTS.md`
3. `/Users/jaynowman/dev/atoms-ui/agents.md`
4. `/Users/jaynowman/dev/docs/plans/2026-01-29_registry-flow-db-first-tech-spec.md`

# Atomic Tasks

## A. Registry Write Path Decision
1. Confirm write path: **atoms-core admin API** vs **direct Supabase (Vault)**.
2. Record decision in the tech spec file under “Decision Log”.

## B. Vault‑Backed Registration Script
1. Add a **single** script under `atoms-core/scripts/` to register canvases + ui_atoms.
2. Script must:
   - Load Vault secrets (`supabase-url.txt`, `supabase-service-key.txt`).
   - Upsert into `public.canvases` and `public.ui_atoms`.
   - Accept input contract JSONs for MAYBES + HAZE.
3. Log stdout with success/failure + inserted keys.

## C. Canonical Entries (MAYBES + HAZE)
1. Upsert `canvas.maybes` using `atoms-ui/canvases/maybes/contract.json`.
2. Upsert `canvas.haze` using `atoms-ui/canvases/haze/contract.json`.
3. Upsert `node.maybes.note` into `public.ui_atoms` with proper props schema.

## D. RLS Review (Read Only)
1. Confirm RLS exists for `public.canvases` + `public.ui_atoms` (read for authenticated).
2. If missing, add **a new migration** (do not edit old migrations).

## E. Validation
1. Run script in **staging** and **production** environments.
2. Confirm rows exist via Supabase UI or direct select.
3. Document results in the tech spec.

# Done Definition
- Vault-based registry script exists and is reusable.
- MAYBES + HAZE canvases and node are present in Supabase.
- RLS is in place for read.
- No file registry dependencies remain.
