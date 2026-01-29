---
name: muscle-video-video_render
description: Generates a render plan (FFmpeg command) for video composition. Brain Only.
metadata:
  type: mcp
  entrypoint: src/muscle/video/video_render/mcp.py
  pricing: "compute-seconds"
  auto_wrapped: true
---
# Usage

This tool generates a "Render Plan" which includes a CLI command (e.g. FFmpeg) to be executed by the user (Brawn).
It does not perform the rendering on the server.

Inputs:
- RenderRequest (JSON)

Outputs:
- RenderResult (JSON) containing `plan_preview` with `steps` (commands).
