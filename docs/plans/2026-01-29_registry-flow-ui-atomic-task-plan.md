---
title: Registry Flow (DB-First) — UI Read Path Atomic Task Plan
date: 2026-01-29
owner: ui-registry-worker
status: draft
scope: atoms-ui + atoms-app
---

# Goal
Ensure UI surfaces (MAYBES + HAZE) read **only** from Supabase-backed registries so dropdowns and contracts are populated correctly.

# Non‑Negotiables
- **DB-first registry** only (no file/YAML registry).
- **No new backend routes** in UI.
- **Use canonical registry client** (or update it to point to atoms-core APIs).

# Required Reads
1. `/Users/jaynowman/dev/AGENTS.md`
2. `/Users/jaynowman/dev/atoms-ui/agents.md`
3. `/Users/jaynowman/dev/docs/plans/2026-01-29_registry-flow-db-first-tech-spec.md`
4. `/Users/jaynowman/dev/atoms-ui/harness/registry/client.ts`

# Atomic Tasks

## A. Registry Read Path Audit
1. Identify all UI surfaces that read registry entries:
   - Workbench UI
   - Contract Builder
   - God Mode config pages
2. Confirm they all route through **one** registry client.

## B. Registry Client Alignment
1. Update `atoms-ui/harness/registry/client.ts` if needed to match canonical endpoint.
2. Ensure the client supports namespaces:
   - `canvases`
   - `ui_atoms`
   - `muscles` (read only)

## C. MAYBES + HAZE Contract Wiring
1. Ensure UI contract JSON for MAYBES + HAZE is registered in DB and fetchable.
2. Confirm contract builder and UI config pages load the correct entries (no blank dropdowns).

## D. Remove Legacy References
1. Find any code path still reading from file registries or deprecated endpoints.
2. Remove/disable those paths (do not delete quarantined docs).

## E. Validation
1. Local smoke: dropdowns show `canvas.maybes`, `canvas.haze`, and `node.maybes.note`.
2. Confirm contract builder can load and save to DB registry.

# Done Definition
- UI uses DB-only registry via canonical client.
- MAYBES + HAZE entries appear in all dropdowns.
- No legacy registry paths are active in UI.
