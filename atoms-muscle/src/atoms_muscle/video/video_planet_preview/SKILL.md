---
name: muscle-video-video_planet_preview
description: Orchestrate the surface renderer + runner automation into a preview plan with optional CPU fallback.
metadata:
  type: mcp
  entrypoint: src/video/video_planet_preview/mcp.py
  pricing: "compute-seconds"
  auto_wrapped: true
---
# Usage
### Endpoint
```
POST /muscle/video/video_planet_preview/run_preview
```
This MCP endpoint accepts run automation data plus device hints and returns a `preview_plan` that drives both WebGL and CPU renderers.

### Inputs
* `run_metadata`: output from `video_planet_runner`, including `keyframes` and `run_duration_ms`.
* `resolution`: `{ "width": 1280, "height": 720 }` (defaults to 1920×1080).
* `device_capability`: `"gpu"` or `"cpu"` (case-insensitive). GPU devices keep strategy as `webgl`, while CPU-only flows switch to `cpu-fallback`.
* `strategy`: Optional override; `webgl` enables live frame streaming, `cpu-fallback` triggers proxy generation.
* `duration_ms`: total duration for timeline syncing (used for front-end pacing).

### Response
* `preview_plan.strategy`: either `webgl` or `cpu-fallback`.
* `preview_plan.assets`: includes `surface_render` and `lighting_gel` URIs streamed via `media_v2` plus either `gpu_proxy` hints or `proxy_video` metadata that references `video_render`.
* `preview_plan.timeline`: first few normal samples plus keyframe_count so UI can pre-warm.
* `preview_plan.actions`: action tokens targeting `video_timeline` and `video_focus_automation`, making the muscle consumable directly by the front end.

### Sample Request/Response (for frontend verification)
```
POST /muscle/video/video_planet_preview/run_preview
{
  "run_metadata": {
    "keyframes": [ ... ],
    "run_duration_ms": 60000,
    "frame_rate": 30
  },
  "device_capability": "cpu",
  "strategy": "cpu-fallback"
}
```

```
{
  "preview_plan": {
    "strategy": "cpu-fallback",
    "assets": {
      "surface_render": {
        "stream": "media_v2://planet_surface/planet-surface/stream",
        "atlas_hash": "..."
      },
      "proxy_video": {
        "media_uri": "media_v2://planet_surface/planet-surface/proxy_cpu.mp4",
        "renderer": "video_render"
      }
    },
    "timeline": { "keyframe_count": 120, "first_frame_timestamp": 0, "preview_track": [] },
    "actions": [
      { "type": "timeline_sync", "target": "video_timeline", "payload": { ... } },
      { "type": "focus", "target": "video_focus_automation", "payload": { ... } }
    ]
  }
}
```

### Notes
* The plan preloads `media_v2` textures so mobile (vertical) and desktop (horizontal) clients can swap the stream based on `device_capability`.
* If a GPU device is detected, the surface stream hits WebGL-ready `media_v2` textures; otherwise, `video_render` proxies can be triggered via the `proxy_video` entry.
