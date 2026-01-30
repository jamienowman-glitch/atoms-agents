---
title: Construction Import Migration — Atomic Task Plan
date: 2026-01-30
owner: construction-import-worker
status: ready
scope: atoms-muscle + atoms-core
---

# Objective
Remove all `engines.*` imports from construction muscles by moving implementation into `atoms-core` and keeping `atoms-muscle` wrappers thin.

# Non‑Negotiables
- `atoms-core` = implementation logic.
- `atoms-muscle` = wrappers + MCP only.
- Explicit imports from `atoms-core` only.
- No `northstar-engines` imports.

# Production Files (must fix first)
## boq_quantities
- `/Users/jaynowman/dev/atoms-muscle/src/construction/boq_quantities/routes.py`

## boq_costing
- `/Users/jaynowman/dev/atoms-muscle/src/construction/boq_costing/routes.py`

# Tests (fix after production compiles)
Fix imports in **all** files under:
- `/Users/jaynowman/dev/atoms-muscle/src/construction/**/tests/**`

Concrete list:
- `/Users/jaynowman/dev/atoms-muscle/src/construction/boq_quantities/tests/test_quantities_wall_deductions.py`
- `/Users/jaynowman/dev/atoms-muscle/src/construction/boq_quantities/tests/test_service_registration_boq.py`
- `/Users/jaynowman/dev/atoms-muscle/src/construction/boq_quantities/tests/test_quantities_determinism.py`
- `/Users/jaynowman/dev/atoms-muscle/src/construction/boq_quantities/tests/test_quantities_dxf.py`
- `/Users/jaynowman/dev/atoms-muscle/src/construction/boq_costing/tests/test_costing_overrides.py`
- `/Users/jaynowman/dev/atoms-muscle/src/construction/boq_costing/tests/test_costing_defaults.py`
- `/Users/jaynowman/dev/atoms-muscle/src/construction/boq_costing/tests/test_service_registration_cost.py`
- `/Users/jaynowman/dev/atoms-muscle/src/construction/boq_costing/tests/test_costing_currency.py`

# Required Steps
1) Move implementation into `atoms-core/src/construction/<feature>/...`.
2) Update atoms-muscle wrappers to import from `atoms_core.src.construction.<feature>`.
3) Keep MCP wrappers intact (no stub logic).
4) Run:
   - `python3 atoms-muscle/scripts/normalize_mcp.py`
   - `python3 atoms-muscle/scripts/batch_prepare_deploy.py --clean-after`

# Report Back
- Files changed (absolute paths)
- New atoms-core module paths
- Pipeline output
- Blockers / missing deps
