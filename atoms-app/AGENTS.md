# AGENTS.md — Atoms App (The Frontend)

## Active Initiatives: MAYBES & HAZE
- **MAYBES**: Note-taking city canvas where ToolPill/ToolPop create nodes (text/audio/image). Nodes can be forwarded to Harness flows. Data stored in Supabase registry; media stored in S3 with URI refs; tenant-compute first.
- **HAZE**: Nexus Explorer planetary canvas (first-person on curved surface). Client device CPU/GPU for interactive render; server render only for export/offline. Uses HAZE muscles (surface renderer, runner, preview, optional contours) and registers via Supabase.


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

> **Execution**: Use the `canvas-contract-builder` skill to scaffold from JSON Contract (no "Forge" naming).
> **Reference**: `atoms-ui/.agent/skills/canvas-contract-builder/SKILL.md`

## 🔁 REALTIME CONSUMPTION CONTRACT (V1)
**Canonical Doc:** `docs/plans/2026-01-27_realtime-collab-contract-and-atomic-task-plan.md`
**Alignment Retrofit:** `docs/plans/2026-01-28_realtime-retrofit-alignment.md`

`atoms-app` is a **surface/console consumer**:
*   Use the shared `CanvasTransport` from `atoms-ui` (no bespoke transport here).
*   Do not add new backend routes for canvases/harnesses; consume `atoms-core` only.
*   Prefer cheap state/tokens; request visual/audio/video sidecars only when needed (and permissioned).

## 🗺️ The Registry Map
- **Supabase**: `public.spaces`, `public.surfaces`, `public.pricing` (The Single Source of Truth).
- **Core**: `atoms-core` (The Schema Definitions).

### System Identities (God Mode Access)
| Identity | Email | Purpose |
| :--- | :--- | :--- |
| **The Architect** | `jamienowman@gmail.com` | Human Super-Admin |
| **The Agent** | `aissistant@squared-agents.app` | Automated Testing & Agentic Operations |
| **The System** | `system@atoms-fam.app` | Internal Background Processes |

## 🟢 Verified Registries (Live in DB)
1.  **SURFACES** (`public.surfaces`): The Apps (AGNˣ, MC²).
2.  **CANVASES** (`public.canvases`): The Tools (Multi21).
3.  **MUSCLES** (`public.muscles`): The Engines.
4.  **FONTS** (`public.font_families`): Typography.
5.  **INFRA** (`public.infrastructure`): AWS/GCP Resources.
6.  **COGS** (`public.tiers`): Pricing & Credits.
7.  **UI ATOMS** (`public.ui_atoms`): Design System Components.

## 🛡️ Security Model (God vs Tenant)
*   **God (You)**: Full Read/Write via Service Key. Access via `/god` routes.
*   **Tenant (User)**:
    *   **Can Read**: Public Tiers, Public Surfaces.
    *   **Cannot Read**: Infra Configs, Other Users' Data.
    *   **Isolation**: Enforced by RLS (`auth.uid()`).

## 🛑 CODEBASE LAWS (STRICT)
1.  **NO DEEP NESTING**: Do not bury modules (e.g. `src/utils/helpers/formatter.ts` is BAD). Flatten it to `src/formatters.ts`.
2.  **THE VAULT LAW (No .env)**: 
    *   **FORBIDDEN**: `.env` files via `process.env`.
    *   **REQUIRED**: Use `lib/vault.ts` (or equivalent loader) which calls `atoms-core` Vault API.
    *   **Reason**: Cloud Agents have no file access. They must use the API.

## 🔐 Connector Factory Laws (UI/Engines)
* **God Config Name (Locked):** `Connector Factory — God Config` (log this exact name in all layers).
* **UX Law (God Config):** Use existing config style but avoid nested cards/boxes. Flat sections with collapsible headers; mobile-first usability.
* **Firearms Only Gate:** No danger levels, risk scores, allow-lists, or parallel gating fields. Safety is **only** `requires_firearm` + `firearm_type_id`.
* **Naming Engine Rule (Locked):** `formatProviderKey(platformName, rule)` is pure; basic slugify → uppercase → underscores; apply `rule` as a token template (e.g., `PROVIDER_{PLATFORM}_KEY`).
* **Engine Location (Locked):** place engines in `atoms-app/src/lib/engines/`.
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
