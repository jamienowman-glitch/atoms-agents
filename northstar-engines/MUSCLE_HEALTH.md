# MUSCLE HEALTH REPORT

## Overview
This report documents the health status of the core media engines ("Muscle") following a strict hardening phase.

## Engine Inventory

| Engine Name | Status | Type | Notes |
| :--- | :--- | :--- | :--- |
| **video_render** | **Ready (Hardened)** | Core | Production ready. Robust FFmpeg process handling, sanitized inputs, optimized O(1) audio ducking. |
| **video_timeline** | **Ready** | Core | Solid Pydantic models (v2), typed repository pattern. |
| **audio_core** | **Beta** | Pipeline | Dev orchestrator. Hardened with auto-resampling normalization to prevent downstream crashes. |
| **audio_resample** | **Ready** | Utility | Safe wrappers around ffmpeg/rubberband. |

## Critical Fixes Applied

### 1. Audio Ducking Optimization (Video Render)
*   **Issue:** The previous implementation chained `N` volume filters for `N` speech segments, causing O(N) filter graph complexity which could crash FFmpeg on long timelines.
*   **Fix:** Refactored to generate a single mathematical expression using chained `min()` calls. Complexity is now O(1) (one filter per track).

### 2. FFmpeg Process Safety (Video Render & Audio Core)
*   **Issue:** Potential for zombie processes or unhandled errors if FFmpeg hung or returned non-zero exit codes.
*   **Fix:** Enforced `check=True` and strict timeout handling in `ffmpeg_runner.py`. Added defensive resampling in `audio_core` to normalize inputs to 16kHz before processing.

### 3. Security Sanitization (Video Render)
*   **Issue:** Caption style parameters were susceptible to injection attacks via the `force_style` FFmpeg parameter.
*   **Fix:** Added strict sanitization to strip dangerous characters (`'`, `:`, `,`) from user-provided style inputs.

## Recommendations
*   **audio_core**: Should eventually move from a script-like runner to a proper `Service` class pattern like `video_render`.
*   **Integration Tests**: Run the full `test_audit_upgrade.py` suite in CI/CD to prevent regression of these hardening measures.
