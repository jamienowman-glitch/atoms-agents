---
title: CAD Import Migration — Atomic Task Plan
date: 2026-01-30
owner: cad-import-worker
status: ready
scope: atoms-muscle + atoms-core
---

# Objective
Remove all `engines.*` imports from CAD muscles by moving implementation into `atoms-core` and keeping `atoms-muscle` wrappers thin.

# Non‑Negotiables
- `atoms-core` = implementation logic.
- `atoms-muscle` = wrappers + MCP only.
- Explicit imports from `atoms-core` only.
- No `northstar-engines` imports.

# Production Files (must fix first)
## cad_semantics
- `/Users/jaynowman/dev/atoms-muscle/src/cad/cad_semantics/routes.py`

## cad_ingest
- `/Users/jaynowman/dev/atoms-muscle/src/cad/cad_ingest/routes.py`

## cad_viewer
- `/Users/jaynowman/dev/atoms-muscle/src/cad/cad_viewer/service.py`

# Tests + MCP tools (fix after production compiles)
## Tests (all under)
- `/Users/jaynowman/dev/atoms-muscle/src/cad/**/tests/**`

Concrete list:
- `/Users/jaynowman/dev/atoms-muscle/src/cad/cad_diff/tests/test_cad_diff.py`
- `/Users/jaynowman/dev/atoms-muscle/src/cad/cad_semantics/tests/test_service_registration.py`
- `/Users/jaynowman/dev/atoms-muscle/src/cad/cad_semantics/tests/test_spatial_graph.py`
- `/Users/jaynowman/dev/atoms-muscle/src/cad/cad_semantics/tests/test_level_detection.py`
- `/Users/jaynowman/dev/atoms-muscle/src/cad/cad_semantics/tests/test_rules_config.py`
- `/Users/jaynowman/dev/atoms-muscle/src/cad/cad_semantics/tests/test_semantics.py`
- `/Users/jaynowman/dev/atoms-muscle/src/cad/cad_ingest/tests/test_topology_heal.py`
- `/Users/jaynowman/dev/atoms-muscle/src/cad/cad_ingest/tests/test_service.py`
- `/Users/jaynowman/dev/atoms-muscle/src/cad/cad_ingest/tests/test_ingest_ifc_lite.py`
- `/Users/jaynowman/dev/atoms-muscle/src/cad/cad_ingest/tests/test_routes.py`
- `/Users/jaynowman/dev/atoms-muscle/src/cad/cad_ingest/tests/test_ingest_dxf.py`
- `/Users/jaynowman/dev/atoms-muscle/src/cad/cad_viewer/tests/test_overlay_view.py`
- `/Users/jaynowman/dev/atoms-muscle/src/cad/cad_viewer/tests/test_gantt_view.py`

## MCP tools
- `/Users/jaynowman/dev/atoms-muscle/src/cad/cad_viewer/mcp/server.py`
- `/Users/jaynowman/dev/atoms-muscle/src/cad/cad_viewer/mcp/tools.py`

# Required Steps
1) Move implementation into `atoms-core/src/cad/<feature>/...`.
2) Update atoms-muscle wrappers to import from `atoms_core.src.cad.<feature>`.
3) Keep MCP wrappers intact (no stub logic).
4) Run:
   - `python3 atoms-muscle/scripts/normalize_mcp.py`
   - `python3 atoms-muscle/scripts/batch_prepare_deploy.py --clean-after`

# Report Back
- Files changed (absolute paths)
- New atoms-core module paths
- Pipeline output
- Blockers / missing deps
