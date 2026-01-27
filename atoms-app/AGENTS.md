# AGENTS.md — Atoms App (The Frontend)

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

> **Execution**: Use the `canvas-forge` skill to scaffold from JSON Contract.
> **Reference**: `atoms-ui/.agent/skills/canvas-forge/SKILL.md`

## 🔁 REALTIME CONSUMPTION CONTRACT (V1)
**Canonical Doc:** `docs/plans/2026-01-27_realtime-collab-contract-and-atomic-task-plan.md`

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
