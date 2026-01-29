---
name: muscle-video-animation_kernel
description: Procedural animation engine (Auto-Rig, IK, Motion Planning). Brain Only.
metadata:
  type: mcp
  entrypoint: src/video/animation_kernel/mcp.py
  pricing: "compute-seconds"
  auto_wrapped: true
---
# Usage

Generates animation data (skeletons, poses, clips) based on instructions.
Does NOT render pixels. Returns JSON data to be used by a renderer (e.g. Blender/Three.js).

Inputs:
- AgentAnimInstruction (JSON)

Outputs:
- JSON Data (Skeleton, Pose, or Keyframes)
