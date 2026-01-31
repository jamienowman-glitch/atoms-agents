---
name: muscle-construction-boq_quantities
description: Calculate Bill of Quantities (areas, volumes, counts) from a semantic model.
metadata:
  type: mcp
  entrypoint: src/construction/boq_quantities/mcp.py
  pricing: "compute-seconds"
  auto_wrapped: true
---
# Usage
This muscle provides `boq_quantities` capabilities via MCP.

## Inputs
*   `semantic_model_json`: JSON string of the SemanticModel.
*   `calc_version`: Calculation version.
*   `wall_height_mm`: Parameter default.
*   `wall_thickness_mm`: Parameter default.

## Outputs
*   JSON Dictionary containing BoQ response.
