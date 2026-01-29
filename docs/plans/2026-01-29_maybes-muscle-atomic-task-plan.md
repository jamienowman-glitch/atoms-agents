---
title: MAYBES Muscles — Atomic Task Plan (Non‑3D)
date: 2026-01-29
owner: maybes-muscle-agent
status: draft
scope: atoms-muscle + atoms-core (read-only for integration targets)
---

# Goal
Provide MAYBES‑related muscle support **only where needed** for UI workflows (audio processing, media registration). Do **not** touch HAZE or 3D muscles.

# Non‑Negotiables
- Path: `atoms-muscle/src/{category}/{name}` (no `src/muscle`).
- MCP wrapper must be complete (no stubs).
- Each muscle must include a `SKILL.md` in the same folder.
- Tenant compute first (interactive render stays on device).
- No local fallback in production.
- No `northstar-engines` imports; explicit imports from `atoms-core` only.

# Required Reads
1. `/Users/jaynowman/dev/AGENTS.md`
2. `/Users/jaynowman/dev/atoms-muscle/AGENTS.md`
3. `/Users/jaynowman/dev/atoms-muscle/.agent/skills/create-muscle/SKILL.md`
4. `/Users/jaynowman/dev/atoms-muscle/.agent/skills/supabase-connect/SKILL.md`

# Scope (only if missing or inadequate)
## MAYBES Support Muscles
1. `audio_capture_normalize` (normalize audio blobs for waveform + playback)
2. `media_v2` (ensure upload/register path is reliable for Maybes assets)

# Atomic Tasks

## A. Recon
1. Verify if `audio_capture_normalize` already exists in `atoms-muscle/src/audio`.
2. If it exists, assess if it meets current standards (MCP wrapper + SKILL + real asset output).

## B. audio_capture_normalize (if missing or insufficient)
1. Implement service to normalize uploaded audio blobs (sample rate, duration, waveform ready).
2. Output must register the processed asset via `media_v2` (real URIs, no placeholders).
3. Ensure MCP wrapper is complete and `SKILL.md` includes schema + sample requests.

## C. media_v2
1. Confirm upload/register is production‑ready and signed.
2. Ensure media entries can be read by UI.

## D. Pipeline Steps (mandatory)
1. After modifications, run `normalize_mcp.py`.
2. Before handoff, run `batch_prepare_deploy.py --clean-after`.

# Done Definition
- MAYBES support muscles exist and produce real media_v2 assets.
- MCP wrappers + SKILL.md updated and validated.
- Pipeline steps completed.
