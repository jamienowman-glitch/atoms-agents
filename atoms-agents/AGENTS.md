# AGENTS.md

## Active Initiatives: MAYBES & HAZE
- **MAYBES**: Note-taking city canvas where ToolPill/ToolPop create nodes (text/audio/image). Nodes can be forwarded to Harness flows. Data stored in Supabase registry; media stored in S3 with URI refs; tenant-compute first.
- **HAZE**: Nexus Explorer planetary canvas (first-person on curved surface). Client device CPU/GPU for interactive render; server render only for export/offline. Uses HAZE muscles (surface renderer, runner, preview, optional contours) and registers via Supabase.


## Vault Law
This repository (`atoms-agents`) serves as the strict contract boundary for Agent Definitions and Runtime execution. It is the single source of truth for Agent Identity, Reasoning Profiles, and Capability Licensing.

## Cards Only
All entities in this registry must be defined as **Atomic Cards** (YAML files with a `card_type`).
*   Agents are compositions of other cards (Models, Personas, Tasks, Reasoning Profiles).
*   No monolithic configuration files are allowed.
*   Logic resides in the Runtime, State resides in the Cards.

## Repo Boundary
`atoms-agents` is a self-contained unit comprising:
1.  **Registry**: The database of atomic cards.
2.  **Runtime**: The execution engine (adapters, providers, modes).
3.  **Workbench**: The API surface for interacting with agents.

This repository consumes `atoms-core` (if applicable) but maintains strict separation from `northstar-engines` (stateful OS) and `agentflow` (UI).
## Tenant/Surface/Space Law
- Tenant is the billing unit. Snax wallets are tenant-scoped and spendable across all surfaces/spaces.
- Surface is the configuration layer for tenants. Data isolation is per-surface unless explicitly shared.
- Space is shared context across one or more surfaces; only surfaces explicitly mapped to a space share performance/nexus data.
- Do not hardcode surface names in schemas or code; treat surfaces/spaces as registry/config data.

## 🏭 MUSCLE FACTORY STANDARD (2026)
- **Path law:** muscles live in `atoms-muscle/src/{category}/{name}` (no `src/muscle`).
- **Wrapper law:** every muscle must include a complete `mcp.py` (no stubs).
- **Skill law:** every muscle must include `SKILL.md` using the global template and **unique** content (no placeholders).
- **Imports:** `atoms-muscle` is runtime/service; `atoms-core` is library. Use explicit `from atoms_core.src.<domain> ...` imports only.
- **No northstar-engines.**
- **Tenant compute first:** interactive render runs on device; server CPU fallback **only** for explicit export/offline.
- **Automation steps:**
  - After creating/updating a muscle, run `python3 atoms-muscle/scripts/normalize_mcp.py`.
  - Before deploy/hand-off, run `python3 atoms-muscle/scripts/batch_prepare_deploy.py --clean-after`.

