---
name: muscle-cad-cad_viewer
description: Generate view-models (Gantt, Overlay) from CAD/Plan/Cost data.
metadata:
  type: mcp
  entrypoint: src/cad/cad_viewer/mcp.py
  pricing: "compute-seconds"
  auto_wrapped: true
---
# Usage
This muscle provides `cad_viewer` capabilities via MCP.

## Inputs
*   `project_id`: Project identifier.
*   `cost_model_id`: Cost model identifier.

## Outputs
*   JSON Dictionary containing Gantt or Overlay view data.
