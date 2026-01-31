---
name: muscle-knowledge-search_assistant
description: RAG assistant for semantic search across Nexus domains with Haze logging.
metadata:
  type: mcp
  entrypoint: src/knowledge/search_assistant/mcp.py
  pricing: "compute-seconds"
  auto_wrapped: true
---
# Nexus Search Assistant
## Capability
Performs semantic search (RAG) on the Nexus memory spine, supporting both single-domain isolation and "God Mode" (multi-domain) recall. Automatically emits `nexus.search_hit` events to power the Haze Planet Heatmap.
## When to use
When an Agent needs to recall information from the Nexus (long-term memory) or when a user performs a search query in the UI.
## Schema
- `input_path` (str): The search query text.
- `tenant_id` (str): The tenant ID (Required).
- `domain` (str): The specific domain to search (e.g., "sales", "engineering").
- `domains` (List[str]): List of domains for "God Mode" search.
- `limit` (int): Max results to return (default: 5).
- `run_id`, `project_id`, `surface_id`: Context for event logging.
## Cost
Standard Snax compute rate.
## Brain/Brawn
Brain. Returns semantic hits.
## Fun Check
Who produced "Int'l Players Anthem (I Choose You)"? (Answer: DJ Paul & Juicy J)
