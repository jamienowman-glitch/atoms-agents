# AGENTS.md — AgentFlow (SHUTTING DOWN)

## Active Initiatives: MAYBES & HAZE
- **MAYBES**: Note-taking city canvas where ToolPill/ToolPop create nodes (text/audio/image). Nodes can be forwarded to Harness flows. Data stored in Supabase registry; media stored in S3 with URI refs; tenant-compute first.
- **HAZE**: Nexus Explorer planetary canvas (first-person on curved surface). Client device CPU/GPU for interactive render; server render only for export/offline. Uses HAZE muscles (surface renderer, runner, preview, optional contours) and registers via Supabase.


> **🛑 SHUTDOWN NOTICE**: This repository is being dismantled. We are lifting working components into `atoms-*` repositories. DO NOT BUILD NEW FEATURES HERE.

> **The Northstar**: "We are creating Shopify, Klaviyo, Photoshop, CapCut... all run by Agents and Humans on collaborative Canvases."

## 🎨 UI FOUNDRY (V2 STANDARD)
> **The Law**: All new Canvases must use the **V2 Contract** and **Vario Harness**.
> **The 3 Surfaces**:
> 1.  **ChatRail (Left)**: Communication & Stream.
> 2.  **TopPill (Top-Right)**: Global View/Export.
> 3.  **ToolPop (Bottom)**: Contextual "Dynamic Island" with Dual Magnifiers & Sliders.
> **Reference**: `atoms-ui/.agent/skills/canvas-contract-builder/SKILL.md`

## 🛑 THE ATOMIC MANDATE
1.  **Collaborative Core**: The "Canvas" is the shared workspace for Humans and Agents.
2.  **Never Monolith**: Every concern must be its own "Atom" (Table, Component, Service, Site).
3.  **UI Foundry**: We build UI tools here that extend the Console.

## 🏗️ CONTEXT
This repository holds the **Canvas Components**:
-   **Nodes**: The boxes on the graph.
-   **Edges**: The connections.
-   **Lenses**: The different views (Flow, Safety, Tech).
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

