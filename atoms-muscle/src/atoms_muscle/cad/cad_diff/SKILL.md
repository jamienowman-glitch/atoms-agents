---
name: muscle-cad-cad_diff
description: Compare versions of CAD, BoQ, Cost, and Plan artifacts to assess impact.
metadata:
  type: mcp
  entrypoint: src/cad/cad_diff/mcp.py
  pricing: "compute-seconds"
  auto_wrapped: true
---
# Usage
This muscle provides `cad_diff` capabilities via MCP.

## Inputs
*   `old_semantics_json`, `new_semantics_json`: JSON strings of SemanticModels.
*   `old_boq_json`, `new_boq_json`: JSON strings of BoQModels.
*   `old_plan_json`, `new_plan_json`: JSON strings of PlanOfWork.

## Outputs
*   JSON Dictionary containing diff report (added, removed, modified elements/items).
