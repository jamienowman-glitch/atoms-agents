---
title: Audio Import Migration — Atomic Task Plan
date: 2026-01-30
owner: audio-import-worker
status: ready
scope: atoms-muscle + atoms-core
---

# Objective
Remove all `engines.*` imports from audio muscles by moving implementation into `atoms-core` and keeping `atoms-muscle` wrappers thin.

# Non‑Negotiables
- `atoms-core` = implementation logic.
- `atoms-muscle` = wrappers + MCP only.
- Explicit imports from `atoms-core` only.
- No `northstar-engines` imports.

# Production Files (must fix first)
## audio_resample
- `/Users/jaynowman/dev/atoms-muscle/src/audio/audio_resample/service.py`

## audio_service
- `/Users/jaynowman/dev/atoms-muscle/src/audio/audio_service/service.py`

## audio_separation
- `/Users/jaynowman/dev/atoms-muscle/src/audio/audio_separation/service.py`

## rootsmanuva_engine
- `/Users/jaynowman/dev/atoms-muscle/src/audio/rootsmanuva_engine/service.py`
- `/Users/jaynowman/dev/atoms-muscle/src/audio/rootsmanuva_engine/__init__.py`

## audio_voice_phrases
- `/Users/jaynowman/dev/atoms-muscle/src/audio/audio_voice_phrases/service.py`

## audio_loops
- `/Users/jaynowman/dev/atoms-muscle/src/audio/audio_loops/service.py`

## audio_semantic_timeline
- `/Users/jaynowman/dev/atoms-muscle/src/audio/audio_semantic_timeline/service.py`

## audio_macro_engine
- `/Users/jaynowman/dev/atoms-muscle/src/audio/audio_macro_engine/service.py`

## audio_normalise
- `/Users/jaynowman/dev/atoms-muscle/src/audio/audio_normalise/service.py`

## audio_fx_chain
- `/Users/jaynowman/dev/atoms-muscle/src/audio/audio_fx_chain/service.py`

## sample_pack_engine
- `/Users/jaynowman/dev/atoms-muscle/src/audio/sample_pack_engine/service.py`

## audio_voice_enhance
- `/Users/jaynowman/dev/atoms-muscle/src/audio/audio_voice_enhance/service.py`

## audio_hits
- `/Users/jaynowman/dev/atoms-muscle/src/audio/audio_hits/service.py`

# Tests (fix after production compiles)
Fix imports in **all** files under:
- `/Users/jaynowman/dev/atoms-muscle/src/audio/**/tests/**`

Concrete groups:
- `audio_render/tests/**`
- `audio_resample/tests/**`
- `audio_service/tests/**`
- `rootsmanuva_engine/tests/**`
- `audio_voice_phrases/tests/**`
- `audio_field_to_samples/tests/**`
- `audio_loops/tests/**`
- `audio_mix_snapshot/tests/**`
- `audio_semantic_timeline/tests/**`
- `audio_arrangement_engine/tests/**`
- `audio_macro_engine/tests/**`
- `audio_performance_capture/tests/**`
- `audio_structure_engine/tests/**`
- `audio_pattern_engine/tests/**`
- `audio_harmony/tests/**`
- `audio_normalise/tests/**`
- `audio_mix_buses/tests/**`
- `audio_groove/tests/**`
- `audio_fx_chain/tests/**`
- `audio_sample_library/tests/**`
- `sample_pack_engine/tests/**`
- `audio_voice_enhance/tests/**`
- `audio_hits/tests/**`
- `audio_timeline/tests/**`
- `audio_to_video_origin/tests/**`

# Required Steps
1) Move implementation into `atoms-core/src/audio/<feature>/...`.
2) Update atoms-muscle wrappers to import from `atoms_core.src.audio.<feature>`.
3) Keep MCP wrappers intact (no stub logic).
4) Run:
   - `python3 atoms-muscle/scripts/normalize_mcp.py`
   - `python3 atoms-muscle/scripts/batch_prepare_deploy.py --clean-after`

# Report Back
- Files changed (absolute paths)
- New atoms-core module paths
- Pipeline output
- Blockers / missing deps
