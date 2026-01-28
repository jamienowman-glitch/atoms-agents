---
name: muscle-video-video_planet_surface_renderer
description: Generate glowing planetary surface frames plus lighting/curvature metadata for preview pipelines.
metadata:
  type: mcp
  entrypoint: src/muscle/video/video_planet_surface_renderer/mcp.py
  pricing: "compute-seconds"
  auto_wrapped: true
---
# Usage
### Endpoint
```
POST /muscle/video/video_planet_surface_renderer/render
```
Send a JSON body that includes:
* `surface_params`: e.g. `{ "radius": 2000, "glow_strength": 0.9, "atmosphere": 0.4, "emissive_variation": 0.6 }`.
* `duration_ms`: total duration in milliseconds.
* Optional `frame_rate` override (defaults to 24 fps).

### Response
Coding agents receive:
* `frames`: ordered list of metadata dictionaries. Each entry contains `frame_index`, `timestamp_ms`, `lighting`, `curvature`, `sample_chunk`, and a `media_uri`.
* `metadata`: echoes the requested parameters plus `atlas_hash` for cache validation.
* Every `media_uri` follows: `media_v2://planet_surface/<slug>/frame_<NNNN>`, ensuring compatibility with downstream media_v2 consumption.

### Example Request
```
{
  "surface_params": { "slug": "luminous", "glow_strength": 0.95 },
  "duration_ms": 2000
}
```

### Example Response Fragment
```
{
  "frames": [
    {
      "frame_index": 0,
      "media_uri": "media_v2://planet_surface/abcd1234/frame_0000",
      "lighting": { "sun_angle": 1.0, "emissive": 0.9 },
      "curvature": { "radius": 2000.0, "surface_variance": 1.1 }
    }
  ],
  "metadata": { "atlas_hash": "..." }
}
```

### Notes
* The `surface_params` hash is used to keep a deterministic `atlas_hash` and slug.
* This muscle is intended to feed preview and timeline muscles that animate camera runs across the glowing surface.
