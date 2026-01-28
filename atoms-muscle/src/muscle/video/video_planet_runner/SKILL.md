---
name: muscle-video-video_planet_runner
description: Simulate a grounded FPS run around the planet with normals preserved for automation.
metadata:
  type: mcp
  entrypoint: src/muscle/video/video_planet_runner/mcp.py
  pricing: "compute-seconds"
  auto_wrapped: true
---
# Usage
### Endpoint
```
POST /muscle/video/video_planet_runner/run_plan
```
This MCP endpoint proxies to `simulate_run`; call it with `run_duration_ms`, an optional `speed_profile`, and initial heading/origin.

### Inputs
* `run_duration_ms` (e.g. 60000 for a 60-second loop).
* `speed_profile`: list of `{ "time": 0, "speed": 6 }` entries that can describe accelerations. The service clamps every keyframe to the spherical surface by projecting into the current normal.
* `heading`: initial direction in degrees; the runner slowly curves via a subtle sinusoidal heading drift to mimic human pacing.

### Outputs
* `keyframes`: each entry contains `timestamp_ms`, `position`, `normal`, `forward`, `speed`, and `heading_deg`.
* Every `normal` vector points toward the sphere center, and `forward` lies tangent to the surface, making this data safe for `video_timeline` automation or `video_focus_automation` requests.
* `metadata` returns the profile used so downstream muscles can verify consistency.

### Sample Response Fragment
```
{
  "keyframes": [
    {
      "timestamp_ms": 0,
      "position": { "x": 3385.2, "y": 12.5, "z": 125.9 },
      "normal": { "x": 0.999, "y": 0.003, "z": 0.037 },
      "forward": { "x": -0.035, "y": 0.0, "z": 0.999 },
      "speed": 6.0,
      "heading_deg": 1.1
    }
  ],
  "metadata": {
    "run_duration_ms": 60000,
    "frame_rate": 30,
    "speed_profile": [ { "time": 0, "speed": 6 } ]
  }
}
```

### Notes
* `video_planet_preview` can chain `run_plan` outputs by rehydrating the returned keyframes into its timeline tracker.
* Normals validation can be repeated by verifying that every `(normal.x, normal.y, normal.z)` vector has unit length and points toward the planetary center.
