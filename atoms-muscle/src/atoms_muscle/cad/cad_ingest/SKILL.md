---
name: muscle-cad-cad_ingest
description: Ingest DXF or IFC-lite files, normalize geometry, and heal topology.
metadata:
  type: mcp
  entrypoint: src/cad/cad_ingest/mcp.py
  pricing: "compute-seconds"
  auto_wrapped: true
---
# Usage
This muscle provides `cad_ingest` capabilities via MCP.

## Inputs
*   `input_path`: Path to the local file (DXF or IFC-lite).
*   `tolerance`: Healing tolerance (default 0.001).
*   `unit_hint`: Optional unit override (mm, cm, m, ft, in).
*   `snap_to_grid`: Boolean to enable grid snapping.
*   `grid_size`: Grid size (default 0.001).

## Outputs
*   JSON Dictionary containing ingest response (counts, bbox, etc.).
