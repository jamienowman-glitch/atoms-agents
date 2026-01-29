---
name: muscle-cad-cad_semantics
description: Classify CAD entities into semantic elements (walls, doors, etc.) and build spatial graph.
metadata:
  type: mcp
  entrypoint: src/cad/cad_semantics/mcp.py
  pricing: "compute-seconds"
  auto_wrapped: true
---
# Usage
This muscle provides `cad_semantics` capabilities via MCP.

## Inputs
*   `input_path`: Path to the local CAD file.
*   `rule_version`: Rule version (default 1.0.0).

## Outputs
*   JSON Dictionary containing semantic analysis results (counts, level summary, etc.).
