---
name: muscle-video-video_planet_surface_renderer
description: Generate glowing planetary surface frames plus lighting/curvature metadata for preview pipelines.
metadata:
  type: mcp
  entrypoint: src/video/video_planet_surface_renderer/mcp.py
  pricing: "compute-seconds"
  auto_wrapped: true
---
# Planet Surface Renderer

## Capability
Generates glowing planetary hemisphere frames with per-frame lighting and curvature metadata. Supports both tenant-compute-first (interactive) and server-side preview/export paths.

## Usage

### Endpoint
```
POST /muscle/video/video_planet_surface_renderer/render
```

### Request Schema
```json
{
  "surface_params": {
    "slug": "string (optional)",
    "radius": "number (default: 3390.0)",
    "glow_strength": "number (default: 0.8)",
    "atmosphere": "number (default: 0.3)",
    "emissive_variation": "number (default: 0.5)"
  },
  "duration_ms": "number (required)",
  "frame_rate": "number (optional, default: 24)",
  "tenant_id": "string (optional - triggers real asset generation)",
  "env": "string (optional, default: 'prod')",
  "user_id": "string (optional)"
}
```

### Response Schema
```json
{
  "frames": [
    {
      "timestamp_ms": "number",
      "media_uri": "string (media_v2://asset/{id} for real assets)",
      "lighting": {
        "sun_angle": "number",
        "emissive": "number",
        "bloom": "number"
      },
      "curvature": {
        "radius": "number",
        "surface_variance": "number"
      },
      "sample_chunk": "array<number>"
    }
  ],
  "metadata": {
    "surface_params": "object",
    "duration_ms": "number",
    "frame_rate": "number",
    "atlas_hash": "string",
    "slug": "string"
  }
}
```

### Compute Strategy
- **Interactive (default)**: Placeholder URIs for client-side WebGL rendering
- **Preview/Export**: Real PNG frames uploaded to S3 and registered in media_v2 (requires `tenant_id`)

### Example Request (Interactive)
```json
{
  "surface_params": { "slug": "luminous", "glow_strength": 0.95 },
  "duration_ms": 2000
}
```

### Example Request (Preview/Export)
```json
{
  "surface_params": { "slug": "luminous", "glow_strength": 0.95 },
  "duration_ms": 2000,
  "tenant_id": "tenant_abc123",
  "env": "prod",
  "user_id": "user_xyz789"
}
```

### Notes
- The `surface_params` hash generates a deterministic `atlas_hash` and slug
- Real asset generation (S3 upload + media_v2 registration) only occurs when `tenant_id` is provided
- Interactive rendering stays on device; server render is explicit preview/export only
- Each frame is registered as a separate media_v2 asset with full metadata

