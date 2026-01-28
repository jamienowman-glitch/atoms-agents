---
title: Planetary First-Person Experience
date: 2026-01-28
author: codex
---

# Planetary FPS Muscle Set

This document captures the atomic task breakdown required to deliver the glowing-moon, surface-locked, first-person experience the stakeholder described. Each muscle follows the **atoms-muscle** Build Protocol (implement a focused `service.py`, rely on `scripts/sentinel.py` to generate `mcp.py` and `SKILL.md`, then verify routing/registry) and the `create-muscle` skill requirements.

## Muscle 1: video_planet_surface_renderer
**Purpose:** Generate a smooth, glowing planet surface animation with emissive highlights and a clean space background that can be rendered as video frames or streamed assets.

### Atomic Tasks
1. **Implementation**
   - Create `atoms-muscle/src/muscle/video/video_planet_surface_renderer/service.py`.
   - Implement a class that builds a procedural hemisphere/sphere (Equirectangular sphere sample) and emits per-frame metadata (lighting, curvature) in a format consumable by the preview muscles.
   - Keep the API simple (e.g., `render(surface_params, duration_ms)`) and make it reusable by other agents.
2. **Packaging**
   - Write `atoms-muscle/src/muscle/video/video_planet_surface_renderer/SKILL.md` with the standard frontmatter (`name: muscle-video-video_planet_surface_renderer`, description, metadata pointing to the `mcp` entrypoint).
   - Document POST `/muscle/video/video_planet_surface_renderer/render` usage inside the Skill instructions so Codex agents can consume it via MCP.
3. **Automation**
   - Ensure `scripts/sentinel.py` is running so it auto-generates `mcp.py` plus the Skill manifest when `service.py` is saved.
   - After sentinel runs, verify `mcp.py` exposes the expected tool method and that Supabase/registry reflects the new endpoint.
4. **Verification**
   - Add a smoke test (or doc snippet) proving the renderer takes texture parameters and outputs valid media URIs via `media_v2`.
   - Check the generated Skill is discoverable (e.g., list in UI or `scripts/factory.py` log).

## Muscle 2: video_planet_runner
**Purpose:** Keep the first-person camera grounded to the sphere, allow continuous running around the globe, and emit automation data (position, camera orientation) for the consuming preview layer.

### Atomic Tasks
1. **Implementation**
   - Place an FPS controller within `atoms-muscle/src/muscle/video/video_planet_runner/service.py`.
   - The service should expose a method like `simulate_run(run_duration_ms, speed_profile)` that returns `Keyframe` sequences or parameter automations aligning the camera to the planet's normal at each step.
   - Integrate gravity/raycast logic that keeps the “feet” down by clamping movement to the spherical surface.
2. **Packaging**
   - Add `SKILL.md` (`muscle-video-video_planet_runner`) describing how to request a 60-second run with curvature metadata.
   - Reference the generated automation data format expected by `video_timeline` or `video_focus_automation` in the Skill instructions.
3. **Automation**
   - Save the service to trigger Sentinel; verify `mcp.py` includes `run_plan` and `render_run`.
   - Confirm MCP registration and the new tool appear on the dashboard.
4. **Verification**
   - Draft a simple unit test that validates the returned keyframes maintain consistent normals (each keyframe points toward sphere center).
   - Document how to consume the automation data to instantiate a timeline track.

## Muscle 3: video_planet_preview
**Purpose:** Surface the render and run automation inside a Web App (mobile+desktop) with a fallback for CPU-only rendering and optional GPU acceleration.

### Atomic Tasks
1. **Implementation**
   - Build `service.py` under `atoms-muscle/src/muscle/video/video_planet_preview/` that orchestrates frame serving:
     * Accepts parameters for resolution, device capability (CPU vs GPU), and run metadata.
     * Streams assets via `media_v2` and optionally uses `video_render` to generate proxies when WebGL isn’t available.
     * Outputs a metadata bundle (`preview_plan`) referencing the glowing sphere render, timeline, and action tokens for the front end.
2. **Packaging**
   - Create `SKILL.md` (`muscle-video-video_planet_preview`) describing how to request either a real-time WebGL-friendly plan or a fallback video sequence, including the fields `strategy` (RTX/CPU) and `duration_ms`.
3. **Automation**
   - Run the sentinel after saving to generate MCP wrappers automatically.
   - Validate that the new tool registers via Supabase and that the preview plan is queryable by other agents.
4. **Verification**
   - Provide a sample request/response within the Skill for front-end testers.
   - Ensure `video_preview` can consume `run_plan` outputs and the `media_v2` assets are preloaded for both mobile and desktop contexts.

## Cross-Cutting Tasks

1. **Asset Catalog**
   - Document the starfield/space skybox under `media_v2` skill or create a dedicated `media_planet_assets` muscle if needed; include steps for registering textures via `media_v2`.
2. **Deliverable Coordination**
   - Link the new muscles so that `video_planet_preview` consumes both the surface renderer and the runner via MCP calls.
   - Keep detailed notes in `atoms-muscle/docs/muscle-tech-specs/planetary-fps-spec.md` for traceability.

This spec follows the Muscle Factory doctrine: implement clean `service.py`, rely on Sentinel for packaging, verify the MCP registration, and keep each muscle atomic so future agents can build/test them without context bleed. Let me know if you’d like this spec split into individual task cards (one file per muscle) or exported to the Dashboard plan format.
## Implementation Log (January 28, 2026)
1. **video_planet_surface_renderer** – Completed implementation in `src/muscle/video/video_planet_surface_renderer/service.py` with hemisphere sampling, `render(...)` metadata, `media_v2` URIs, and a `run` shim for MCP compatibility. Auto-generated `mcp.py` and `SKILL.md` via `scripts/factory.py`, then hand-tweaked the Skill instructions to explain `POST /muscle/video/video_planet_surface_renderer/render` and `media_v2` results.
2. **video_planet_runner** – Added `src/muscle/video/video_planet_runner/service.py` that simulates spherical FPS runs, clamps positions to the normals, and emits keyframes plus metadata. Confirmed `mcp.py`/`SKILL.md` exist and documented how the `run_plan` output can feed `video_timeline`/`video_focus_automation`.
3. **video_planet_preview** – Built `src/muscle/video/video_planet_preview/service.py` to orchestrate the renderer + runner outputs, stream assets via `media_v2`, provide GPU/CPU strategies, and emit action tokens for preview clients. Generated wrappers and expanded the Skill with request/response snippets for front-end verification.
4. **Registry sync (Supabase)** – Ran `scripts/sync_muscles.py` (with `NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder`) to honor the automation checklist; the tool reported `[Errno 61] Connection refused` for every muscle because the Supabase server at `http://127.0.0.1:54321` is not running locally. Once the registry is reachable, add the new muscles to the inventory JSON so the sync process can register these endpoints.
