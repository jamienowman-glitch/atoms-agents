---
title: HAZE Muscles — Atomic Task Plan (New Standard)
date: 2026-01-29
owner: haze-muscle-agent
status: draft
scope: atoms-muscle
---

# Goal
Make the HAZE muscle chain production‑ready and compliant with the new standard.

# Non‑Negotiables
- Path: `atoms-muscle/src/{category}/{name}` (no `src/muscle`).
- MCP wrapper must be complete (no stubs).
- Each muscle must include a `SKILL.md` in the same folder.
- Tenant compute first (interactive render stays on device).
- No local fallback in production; CPU proxy only for explicit export/offline.
- No `northstar-engines` imports; explicit imports from `atoms-core` only.

# Required Reads
1. `/Users/jaynowman/dev/AGENTS.md`
2. `/Users/jaynowman/dev/atoms-muscle/AGENTS.md`
3. `/Users/jaynowman/dev/atoms-muscle/.agent/skills/create-muscle/SKILL.md`
4. `/Users/jaynowman/dev/atoms-muscle/.agent/skills/supabase-connect/SKILL.md`

# Scope
## Build Targets
1. `video_planet_surface_renderer`
2. `video_planet_runner`
3. `video_planet_preview`

## Dependencies to Harden
1. `media_v2`
2. `video_render`
3. `video_timeline`
4. `video_focus_automation`

# Atomic Tasks

## A. Preflight
1. Confirm current locations for each target muscle are under `atoms-muscle/src/{category}/{name}`.
2. Re-read AGENTS + create-muscle skill before touching any service.

## B. video_planet_surface_renderer
1. Ensure `service.py` emits **real** `media_v2` assets (frames/textures registered), not placeholder URIs.
2. Output must include deterministic metadata per frame.
3. Update/verify MCP wrapper is complete.
4. Update/verify `SKILL.md` input/output schema and example requests.

## C. video_planet_runner
1. Ensure `service.py` outputs deterministic, normalized keyframes aligned with timeline schema.
2. Validate keyframe normalization and unit vectors.
3. Update/verify MCP wrapper + `SKILL.md` schema.

## D. video_planet_preview
1. Orchestrate surface + runner and return preview plan referencing **real** media_v2 assets.
2. Ensure strategy is tenant‑compute first; CPU proxy only for export/offline.
3. Update/verify MCP wrapper + `SKILL.md` schema.

## E. Dependencies Hardening
### media_v2
1. Confirm real upload/register with signed, validated assets.
2. No placeholder URIs.

### video_render
1. CPU proxy path only for explicit export/offline.
2. Ensure it produces real assets for media_v2 registration.

### video_timeline
1. Ensure automation schema matches runner output (camera/heading/etc).

### video_focus_automation
1. Implement no‑op fallback when metadata is missing.

## F. Pipeline Steps (mandatory)
1. After modifications, run `normalize_mcp.py`.
2. Before handoff, run `batch_prepare_deploy.py --clean-after`.

# Done Definition
- All three HAZE muscles emit real media_v2 assets and return valid preview plans.
- Dependencies are production‑ready for the HAZE chain.
- MCP wrappers + SKILL.md updated and validated.
- Pipeline steps completed.
