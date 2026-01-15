# Video Canvas: Missing Muscle

**Status**: Gaps Identified
**Date**: Jan 12, 2026

The following features are implemented in the UI but lack full confirmation of Engine support.

## 1. Split (Blade Tool)
*   **UI Status**: Implemented. Calculates split points locally.
*   **Engine Gap**: Need to verify if `video_timeline` supports an atomic `split_clip` operation that guarantees frame accuracy, or if we must delete 1 clip and insert 2 new ones (current UI logic).
*   **Action**: Audit `video_timeline` split API.

## 2. Speed (Time Stretch)
*   **UI Status**: Implemented `VideoClipToken.speed`.
*   **Engine Gap**: `video_render` must support time-stretching. If the underlying ffmpeg pipeline doesn't handle `setpts` filter dynamically per clip, the export will ignore speed changes.
*   **Action**: Verify `video_render` pipeline supports variable speed clips.

## 3. Waveforms
*   **UI Status**: Not Implemented.
*   **Engine Gap**: Need a `GET /media/v2/assets/:id/waveform` endpoint to render audio visualization on the timeline.
