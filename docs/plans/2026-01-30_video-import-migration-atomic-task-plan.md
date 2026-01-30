---
title: Video Import Migration — Atomic Task Plan
date: 2026-01-30
owner: video-import-worker
status: ready
scope: atoms-muscle + atoms-core
---

# Objective
Remove all `engines.*` imports from video muscles by moving implementation into `atoms-core` and keeping `atoms-muscle` wrappers thin.

# Non‑Negotiables
- `atoms-core` = implementation logic.
- `atoms-muscle` = wrappers + MCP only.
- Explicit imports from `atoms-core` only.
- No `northstar-engines` imports.
- Do **not** touch any `video_planet_*` muscles (already hardened).

# Production Files (must fix first)
## video_multicam
- `/Users/jaynowman/dev/atoms-muscle/src/video/video_multicam/service.py`
- `/Users/jaynowman/dev/atoms-muscle/src/video/video_multicam/routes.py`

## video_anonymise
- `/Users/jaynowman/dev/atoms-muscle/src/video/video_anonymise/service.py`
- `/Users/jaynowman/dev/atoms-muscle/src/video/video_anonymise/routes.py`

## video_focus_automation
- `/Users/jaynowman/dev/atoms-muscle/src/video/video_focus_automation/service.py`
- `/Users/jaynowman/dev/atoms-muscle/src/video/video_focus_automation/models.py`

## video_timeline
- `/Users/jaynowman/dev/atoms-muscle/src/video/video_timeline/service.py`
- `/Users/jaynowman/dev/atoms-muscle/src/video/video_timeline/routes.py`

## video_stabilise
- `/Users/jaynowman/dev/atoms-muscle/src/video/video_stabilise/service.py`

## video_visual_meta
- `/Users/jaynowman/dev/atoms-muscle/src/video/video_visual_meta/service.py`
- `/Users/jaynowman/dev/atoms-muscle/src/video/video_visual_meta/backend.py`
- `/Users/jaynowman/dev/atoms-muscle/src/video/video_visual_meta/models.py`
- `/Users/jaynowman/dev/atoms-muscle/src/video/video_visual_meta/routes.py`

## video_regions
- `/Users/jaynowman/dev/atoms-muscle/src/video/video_regions/service.py`
- `/Users/jaynowman/dev/atoms-muscle/src/video/video_regions/backend.py`
- `/Users/jaynowman/dev/atoms-muscle/src/video/video_regions/routes.py`

## video_text
- `/Users/jaynowman/dev/atoms-muscle/src/video/video_text/service.py`
- `/Users/jaynowman/dev/atoms-muscle/src/video/video_text/routes.py`

## video_preview
- `/Users/jaynowman/dev/atoms-muscle/src/video/video_preview/service.py`

## video_captions
- `/Users/jaynowman/dev/atoms-muscle/src/video/video_captions/service.py`
- `/Users/jaynowman/dev/atoms-muscle/src/video/video_captions/routes.py`

## video_presets
- `/Users/jaynowman/dev/atoms-muscle/src/video/video_presets/service.py`
- `/Users/jaynowman/dev/atoms-muscle/src/video/video_presets/models.py`
- `/Users/jaynowman/dev/atoms-muscle/src/video/video_presets/routes.py`

## video_assist
- `/Users/jaynowman/dev/atoms-muscle/src/video/video_assist/service.py`

## video_360
- `/Users/jaynowman/dev/atoms-muscle/src/video/video_360/service.py`
- `/Users/jaynowman/dev/atoms-muscle/src/video/video_360/routes.py`

## video_history
- `/Users/jaynowman/dev/atoms-muscle/src/video/video_history/service.py`

## video_mask
- `/Users/jaynowman/dev/atoms-muscle/src/video/video_mask/service.py`
- `/Users/jaynowman/dev/atoms-muscle/src/video/video_mask/routes.py`

## video_motifs
- `/Users/jaynowman/dev/atoms-muscle/src/video/video_motifs/service.py`

## video_batch_render
- `/Users/jaynowman/dev/atoms-muscle/src/video/video_batch_render/service.py`

## video_edit_templates
- `/Users/jaynowman/dev/atoms-muscle/src/video/video_edit_templates/service.py`
- `/Users/jaynowman/dev/atoms-muscle/src/video/video_edit_templates/registry.py`

## video_render MCP tools
- `/Users/jaynowman/dev/atoms-muscle/src/video/video_render/mcp/server.py`
- `/Users/jaynowman/dev/atoms-muscle/src/video/video_render/mcp/tools.py`

# Tests (fix after production compiles)
Fix imports in **all** files under:
- `/Users/jaynowman/dev/atoms-muscle/src/video/**/tests/**`

Concrete groups:
- `video_multicam/tests/**`
- `video_anonymise/tests/**`
- `video_focus_automation/tests/**`
- `video_timeline/tests/**`
- `video_visual_meta/tests/**`
- `video_regions/tests/**`
- `video_text/tests/**`
- `video_preview/tests/**`
- `video_captions/tests/**`
- `video_presets/tests/**`
- `video_assist/tests/**`
- `video_360/tests/**`
- `video_history/tests/**`
- `video_mask/tests/**`
- `video_motifs/tests/**`
- `video_batch_render/tests/**`
- `video_edit_templates/tests/**`
- `video/core/frame_grab/tests/test_frame_grab.py`

# Required Steps
1) Move implementation into `atoms-core/src/video/<feature>/...`.
2) Update atoms-muscle wrappers to import from `atoms_core.src.video.<feature>`.
3) Keep MCP wrappers intact (no stub logic).
4) Run:
   - `python3 atoms-muscle/scripts/normalize_mcp.py`
   - `python3 atoms-muscle/scripts/batch_prepare_deploy.py --clean-after`

# Report Back
- Files changed (absolute paths)
- New atoms-core module paths
- Confirmation `video_planet_*` untouched
- Pipeline output
- Blockers / missing deps
