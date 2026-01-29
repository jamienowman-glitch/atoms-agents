# AGENTS.md — Atoms Tuning (The Lab)

## Active Initiatives: MAYBES & HAZE
- **MAYBES**: Note-taking city canvas where ToolPill/ToolPop create nodes (text/audio/image). Nodes can be forwarded to Harness flows. Data stored in Supabase registry; media stored in S3 with URI refs; tenant-compute first.
- **HAZE**: Nexus Explorer planetary canvas (first-person on curved surface). Client device CPU/GPU for interactive render; server render only for export/offline. Uses HAZE muscles (surface renderer, runner, preview, optional contours) and registers via Supabase.


> **The Northstar**: "We are creating Shopify, Klaviyo, Photoshop, CapCut... all run by Agents and Humans on collaborative Canvases."

## 🗺️ Strategic Infrastructure (V2 VISION)
> **The Hierarchy**: Tenant (Org) -> Space (Context) -> Surface (Flow).
> **The 4 Spaces**: `Health`, `Marketing`, `Quantum`, `Tuning`.

*   **Space**: The Shared Nexus (Memory & Config). Multiple Surfaces share ONE Space.
*   **Surface**: The Flow Container (Not an App). It runs on a Domain (URL).
*   **Tenant**: The Billing Unit.

## 🎨 UI FOUNDRY (V2 STANDARD)
> **The Law**: All new Canvases must use the **V2 Contract** and **Vario Harness**.
> **The 3 Surfaces**:
> 1.  **ChatRail (Left)**: Communication & Stream.
> 2.  **TopPill (Top-Right)**: Global View/Export.
> 3.  **ToolPop (Bottom)**: Contextual "Dynamic Island" with Dual Magnifiers & Sliders.

## 🛑 THE ATOMIC MANDATE
1.  **Metric Driven**: We do not guess. We measure.
2.  **Registry First**: Optimization results update the Registry configuration.
3.  **Atomic Scope**: We verify one atom at a time.

## 🏗️ CONTEXT
This repository holds the **Evaluation & Tuning** scripts:
-   **Datasets**: Golden sets for testing.
-   **Evals**: LLM-as-a-Judge scripts.
## Tenant/Surface/Space Law
- Tenant is the billing unit. Snax wallets are tenant-scoped and spendable across all surfaces/spaces.
- Surface is the configuration layer for tenants. Data isolation is per-surface unless explicitly shared.
- Space is shared context across one or more surfaces; only surfaces explicitly mapped to a space share performance/nexus data.
- Do not hardcode surface names in schemas or code; treat surfaces/spaces as registry/config data.

## 🏭 MUSCLE FACTORY STANDARD (2026)
- **Path law:** muscles live in `atoms-muscle/src/{category}/{name}` (no legacy nesting).
- **Wrapper law:** every muscle must include a complete `mcp.py` (no stubs).
- **Skill law:** every muscle must include `SKILL.md` using the global template and **unique** content (no placeholders).
- **Imports:** `atoms-muscle` is runtime/service; `atoms-core` is library. Use explicit `from atoms_core.src.<domain> ...` imports only.
- **No northstar-engines.**
- **Tenant compute first:** interactive render runs on device; server CPU fallback **only** for explicit export/offline.
- **Automation steps:**
  - After creating/updating a muscle, run `python3 atoms-muscle/scripts/normalize_mcp.py`.
  - Before deploy/hand-off, run `python3 atoms-muscle/scripts/batch_prepare_deploy.py --clean-after`.

