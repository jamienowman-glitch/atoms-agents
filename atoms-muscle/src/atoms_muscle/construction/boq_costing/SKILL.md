---
name: muscle-construction-boq_costing
description: Generate cost estimates from Bill of Quantities using rate catalogs.
metadata:
  type: mcp
  entrypoint: src/construction/boq_costing/mcp.py
  pricing: "compute-seconds"
  auto_wrapped: true
---
# Usage
This muscle provides `boq_costing` capabilities via MCP.

## Inputs
*   `boq_model_json`: JSON string of the BoQModel.
*   `currency`: Target currency (USD, GBP, EUR, etc.).
*   `markup_pct`: Markup percentage.
*   `tax_pct`: Tax percentage.

## Outputs
*   JSON Dictionary containing Cost response.
