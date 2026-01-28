---
title: HAZE Nexus Explorer — Muscle Track Atomic Task Plan
date: 2026-01-28
owner: muscle-agent
status: draft
scope: atoms-muscle
---

# Goal
Finish and harden the HAZE/Nexus Explorer muscles in `atoms-muscle`, following the Muscle Factory protocol and Supabase registration workflow.

# Non‑Negotiables (from repo laws)
- **Only modify** `/Users/jaynowman/dev/atoms-muscle/**`.
- **Do not** touch `northstar-engines` or delete existing files.
- Follow the **create-muscle** skill and **Supabase connection skill**.
- Use **sentinel** for `mcp.py`/`SKILL.md` generation and **sync_muscles.py** for registry.

# Required Reads (before any edits)
1. `/Users/jaynowman/dev/atoms-muscle/AGENTS.md`
2. `/Users/jaynowman/dev/atoms-muscle/.agent/skills/create-muscle/SKILL.md`
3. `/Users/jaynowman/dev/atoms-muscle/.agent/skills/supabase-connect/SKILL.md`
4. `/Users/jaynowman/dev/atoms-muscle/docs/muscle-tech-specs/planetary-fps-spec.md`

# Production Definition (non‑negotiable)
- **No local fallbacks in production paths.** Any fallback described below must be a **production‑grade** path (e.g., CPU proxy render, alternate storage region), not a dev stub.
- **Tenant compute first.** Default to **client device CPU/GPU** for interactive rendering; server render only on explicit export/offline requests.
- **All outputs must be registered in Supabase**, **twice**: once to **staging** and once to **production**.
- **All muscles must be MCP‑wrapped** via `sentinel.py` with correct `mcp.py` + `SKILL.md`.
- **Inputs must be validated**, errors must be actionable, and outputs must be deterministic for the same inputs.

# Muscles In Scope (current)
1. `video_planet_surface_renderer`
2. `video_planet_runner`
3. `video_planet_preview`

# Optional Add‑On (only if needed)
4. `video_planet_contours` — takes data usage metrics and emits contour line geometry/metadata.

# Dependent Muscles (must be production‑ready)
These already exist but must be validated for production readiness because the HAZE pipeline depends on them:
1. `media_v2` (asset registration + storage)
2. `video_render` (CPU fallback/proxy generation)
3. `video_timeline` (accepts automation payloads)
4. `video_focus_automation` (focus/automation hooks)

# Atomic Tasks

## A. Preflight & Environment
1. Confirm `atoms-muscle/scripts/sentinel.py` is available and runnable.
2. Confirm Supabase vault files exist at `/Users/jaynowman/northstar-keys/`:
   - `supabase-url.txt` + `supabase-service-key.txt` (staging)
   - `supabase-url-prod.txt` + `supabase-service-key-prod.txt` (production)
3. Ensure Supabase endpoint is reachable before registry sync (avoid `connection refused`).
4. Re‑read `/Users/jaynowman/dev/atoms-muscle/AGENTS.md` and both Skills **before** each muscle implementation block (B, C, D, E).

## B. Muscle 1 — `video_planet_surface_renderer`
1. Implement `service.py` class with production validation:
   - Deterministic surface generation (smooth sphere + emissive glow metadata).
   - Inputs: base color, glow intensity, duration, fps.
   - Outputs: media_v2 URIs + metadata.
2. Add explicit error handling for invalid inputs and storage failures.
3. Save file, let `sentinel.py` generate `mcp.py` + `SKILL.md`.
4. Validate `SKILL.md` contains correct endpoint usage and sample request.
5. Verify media_v2 registration logic works against production storage (smoke run).
6. Write a minimal deterministic test case (same inputs → same output metadata).

## C. Muscle 2 — `video_planet_runner`
1. Implement `service.py` with production validation:
   - Ground‑locked movement (normal aligns to sphere center).
   - Run path generation for 60s default.
   - Output: keyframes/automation for camera position + forward vectors.
2. Add explicit error handling for invalid params and out‑of‑bounds paths.
3. Save file, let sentinel generate wrappers.
4. Update skill usage so consumers can pipe into `video_timeline` / `video_focus_automation`.
5. Validate output is normalized and consistent.
6. Write a minimal deterministic test case.

## D. Muscle 3 — `video_planet_preview`
1. Implement `service.py` to orchestrate (production‑grade):
   - `surface_renderer` + `runner` usage.
   - Media streaming via `media_v2`.
   - **Tenant‑compute strategy metadata** (client render default, server render only when explicitly requested).
   - GPU vs CPU strategy metadata (production CPU proxy path for export/offline only).
2. Add explicit error handling for missing assets and downstream failures.
3. Save file, let sentinel generate wrappers.
4. Provide a sample request/response inside `SKILL.md`.
5. Validate preview plan links to assets and automation tokens.
6. Write a minimal integration test that exercises renderer + runner + preview.

## E. Optional — `video_planet_contours` (if data‑terrain is needed now)
1. Implement a service that accepts usage intensity metrics and returns contour line metadata.
2. Integrate with `video_planet_surface_renderer` as optional overlay input.
3. Generate skill/wrapper via sentinel.

## E2. Production Hardening (existing muscles)
### `media_v2`
1. Confirm storage backend config for production (S3/GCS); no placeholder URIs.
2. Enforce signed/secure URIs and TTL handling per policy.
3. Add a minimal smoke test for asset registration to ensure URIs resolve.
4. Validate service fails fast with actionable errors when storage is missing.

### `video_render`
1. Ensure the FastAPI routes parse correctly (no syntax errors).
2. Confirm FFmpeg detection is stable and errors are surfaced cleanly.
3. Implement a **production CPU proxy** path (small frame render + upload) **only for explicit export/offline requests**.
4. Add a minimal smoke test for proxy render.

### `video_timeline`
1. Confirm keyframe schema compatibility with runner output (`position`, `normal`, `forward`).
2. Add an adapter in the preview muscle or runner muscle that maps to the expected `ParameterAutomation` keys.
3. Add a schema validation test for automation payloads.

### `video_focus_automation`
1. Verify the “focus” action token in preview can be consumed without missing artifacts.
2. Add a **production‑safe no‑op mode** for HAZE (used only when optional meta not present).
3. Add a minimal smoke test for the focus token path.

## F. Registry & Sync
1. Start `python3 scripts/sentinel.py`.
2. Run `python3 scripts/sync_muscles.py` **after** generation for **staging**.
3. Run `python3 scripts/sync_muscles.py` again for **production** (using prod vault keys).
4. If Supabase fails, record error + missing dependency in the log.

## G. Report & Handoff
1. Update `docs/muscle-tech-specs/planetary-fps-spec.md` with completion notes.
2. Provide a short summary:
   - Which muscles completed
   - Generated files (service/mcp/skill)
   - Registry sync status

# Done Definition
- All 3 muscles exist with working `service.py`, auto‑generated `mcp.py` and `SKILL.md`.
- Supabase registry updated for **staging and production** (or a clear failure report with remediation steps).
- Example request/response documented in Skills.
- Minimal tests exist for each muscle and dependent hardening path.
