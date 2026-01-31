# 🚨 ATOMIC VISION MANDATE 🚨
> **CRITICAL**: Every Agent MUST read the [UI Architecture v2.1 (The Fleet & Factory)](file:///Users/jaynowman/dev/atoms-core/docs/plans/2026-01-30_ui_architecture_v2_1.md) before carrying out ANY work.
> This document defines the "Atomic Facade" law: The Graph is invisible; The Canvas is the Product.

# 🚨 ATOMIC VISION MANDATE 🚨
> **CRITICAL**: Every Agent MUST read the [UI Architecture v2.1 (The Fleet & Factory)](file:///Users/jaynowman/dev/atoms-core/docs/plans/2026-01-30_ui_architecture_v2_1.md) before carrying out ANY work.
> This document defines the "Atomic Facade" law: The Graph is invisible; The Canvas is the Product.



## Available Skills
- **atom-production-line** (`atoms-ui/.agent/skills/atom-production-line/SKILL.md`): Automated factory process for building and registering new UI Atoms (Hero, Product Card, etc.) into the Supabase Registry.

## Active Initiatives: MAYBES & HAZE
- **MAYBES**: Note-taking city canvas where ToolPill/ToolPop create nodes (text/audio/image). Nodes can be forwarded to Harness flows. Data stored in Supabase registry; media stored in S3 with URI refs; tenant-compute first.
- **HAZE**: Nexus Explorer planetary canvas (first-person on curved surface). Client device CPU/GPU for interactive render; server render only for export/offline. Uses HAZE muscles (surface renderer, runner, preview, optional contours) and registers via Supabase.

## 🏛️ THE HIERARCHY OF POWER (v2.1)
**Architecture Law**: The relationship between Surfaces and Spaces is **Dynamic Configuration**, not hard-coded logic.

### 1. The Core Hierarchy
*   **Level 1: The Tenant (Wallet)**: The User Identity. Owns Snax.
*   **Level 2: The Space (Context)**: The Data Boundary (Nexus + Feeds). Data **NEVER** leaks between Spaces.
    *   *Shared Assets*: Nexus (Vector Memory), Feeds (RSS/API), Config (Brand Voice).
*   **Level 3: The Surface (Domain)**: The Brand Wrapper & Demographic Interface.
    *   *Dynamic Mapping*: A Surface maps to **ONE** Space at a time via `space_surface_mappings`.
    *   *Contents*: Flows, Canvases, Projects.
*   **Level 4: The Commercial Units**:
    *   *AgentFlow*: Unit of Work (Cost per Run).
    *   *FlowStack*: Unit of Value (Marketplace Asset).
    *   *Firm*: Unit of Scale (Subscription).

### 2. The Data Contract
*   **Feed Contract**: Feeds live in the **Space**. Surfaces read from their mapped Space.
*   **Co-Founder View**: Aggregates Space-level data (Feeds + Nexus) for active BI.
*   **God Mode Injection**: Auto-creates "Self-Feeds" (YouTube) on onboarding.

## Muscle Build Law (Global)
- **Location:** All new muscles must live in `atoms-muscle/src/{category}/{name}` (no legacy nesting).
- **MCP:** Every muscle must include a complete `mcp.py` wrapper (no stub `service.run(...)`).

## Muscle Architecture Law (Global)
- **Service vs Library:** `atoms-core` is the shared **library** (pure logic/models). `atoms-muscle` is the **runtime/service** (MCP wrappers, API routes, billing decorators).
- **Namespace Rule:** **Never** merge namespaces at runtime. `atoms-muscle` must import explicitly from `atoms-core` (e.g., `from atoms_core.src.audio.models import ...`).
- **No northstar imports:** `northstar-engines` is deprecated. Do not import it anywhere in new work.
- **Rescue Protocol:** Port dependency logic from `northstar-engines` into `atoms-core` first. `atoms-muscle` must never import `northstar-engines`.
- **Slice Rule:** Deployment slices include the required `atoms-core` library modules; muscles are **not** standalone without atoms-core.
- **Vault Secret Mount Rule:** No `.env` files. Secrets are read from `/Users/jaynowman/northstar-keys/` via Vault loaders.

## 🧷 Event Spine V2 Contract (Supabase‑First)
**Canonical Doc:** `docs/plans/2026-01-29_event-spine-v2-contract.md`
**Scope:** Replay filters support `run_id`, `node_id`, `canvas_id`, `agent_id` (single or multi).  
**Ordering:** `normalized_timestamp` then `sequence_id`.  
**Context:** `context_scope` is explicit (`whiteboard` / `blackboard`).  
**Artifacts:** URIs in payloads + `event_spine_v2_artifacts` join.

## Website Printing Press (Global)
- **Templates Live In Monorepo:** Source of truth at `/Users/jaynowman/dev/atoms-site-templates/`.
- **Live Sites Are Separate Repos:** Customer sites are created outside `/Users/jaynowman/dev/` (e.g., `/Users/jaynowman/sites/<site>`).
- **Deploy Path:** Use Press tooling to clone templates, create a new repo, and deploy via Cloudflare Pages.
- **No Shared Monorepo Deploys:** Do not deploy customer sites from the monorepo.

## Connector Factory Laws (Global)
- **God Config Name (Locked):** `Connector Factory — God Config` (log this exact name in all layers).
- **UX Law (God Config):** Use the existing config style but avoid nested cards/boxes. Prefer flat sections with collapsible headers and mobile-first usability.
- **Firearms Only Gate:** No danger levels, risk scores, allow-lists, or parallel gating fields. Safety is **only** `requires_firearm` + `firearm_type_id`.
- **Firearms Handling (Locked):** Agents must leave `requires_firearm=false` and `firearm_type_id` empty in drafts. Only humans set firearms in the UI.
- **Draft-Only Rule:** Connector contracts remain `draft` until a human explicitly approves in the UI.
- **UTM Templates Schema (Locked):** `utm_templates` must include `template_id`, `provider_slug` (indexed), `content_type_slug`, `static_params` (jsonb), `allowed_variables` (jsonb array), `pattern_structure`, `is_approved` (default false). Builder must drop empty variables cleanly (no double underscores).
- **Metric Mappings Schema (Locked):** `metric_mappings` must exist with `mapping_id`, `provider_slug` (indexed), `raw_metric_name`, `standard_metric_slug`, `aggregation_method` (sum/avg/max), `is_approved` (default false).
- **Firearms Licenses Registry (Locked):** `firearms_licenses` registry table with `license_key` (pk), `category`, `description`. Seed initial licenses for Financial, Communication, System/Founder.
- **Naming Engine Rule (Locked):** `formatProviderKey(platformName, rule)` is pure; basic slugify → uppercase → underscores; apply `rule` as a token template (e.g., `PROVIDER_{PLATFORM}_KEY`).
- **Core KPIs Schema (Locked):** `core_kpis.missing_components` is jsonb array of strings; `core_kpis.metadata` is jsonb (store and do not drop).

## 📍 CONFIG & OBSERVABILITY LOCATIONS (APP)
All new config/observability UI must live under:
* `/Users/jaynowman/dev/atoms-app/src/app/dashboard/observability`
* `/Users/jaynowman/dev/atoms-app/src/app/dashboard/tuning`
* `/Users/jaynowman/dev/atoms-app/src/app/dashboard/pricing`

## Tenant/Surface/Space Law
- Tenant is the billing unit. Snax wallets are tenant-scoped and spendable across all surfaces/spaces.
- Surface is the configuration layer for tenants. Data isolation is per-surface unless explicitly shared.
- Space is shared context across one or more surfaces; only surfaces explicitly mapped to a space share performance/nexus data.
- Do not hardcode surface names in schemas or code; treat surfaces/spaces as registry/config data.

## 💳 SNAX + PRICING + DISCOUNTS (PRODUCTION)
- **Snax Schema:** `atoms-core/sql/015_snax_auth_patch.sql` (tenants, wallets, ledger, pricing, system_config, api_keys).
- **Discount Schema:** `atoms-core/sql/016_discount_engine.sql` (policy, codes, redemptions, KPI snapshots).
- **Contract:** `docs/contracts/discount-engine-contract.md`.
- **Plan:** `docs/plans/2026-01-30_snax-pricing-discount-atomic-task-plan.md`.
- **UI Spec:** `docs/plans/2026-01-30_snax-pricing-discount-ui-spec.md`.
- **Pricing UI (new location):** `atoms-app/src/app/dashboard/pricing/` (pricing + exchange + crypto bonus + discount policy).
- **Rules:** tenant‑scoped, surface‑configured, no PII in discount tables, KPI ceilings/floors enforced.

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

## Atoms UI - Architectural Standards (Harness & Canvas)
The `atoms-ui` repository enforces a strict separation between the "Harness" (Tooling/Rig) and the "Canvas" (Content/State).

### 1. The Harness (`/harnesses`)
The Harness is the container that holds the Canvas. It is responsible for all **Tooling**, **Navigation**, and **Global State**.
*   **Definition**: A "Rig" that you load different Canvases into.
*   **Key Components**:
    *   **`TopPill`**: Top navigation bar (Environment, View Mode toggles).
    *   **`ChatRail`**: Collapsible communication rail (Bottom/Left).
    *   **`ToolPop`**: The bottom panel that extends from the ChatRail (Magnifiers, Grid Sliders).
    *   **`ToolPill`**: The floating action button (e.g., `+`) for adding elements.

### 2. The Canvas (`/canvas`)
The Canvas is the pure visual representation of the content.
*   **Definition**: A render surface for atomic blocks.
*   **Rule**: **NO OVERLAYS**. The canvas should never contain UI controls (like sliders or popups) that hide the content. All controls must be lifted to the Harness.
*   **Components**:
    *   `WysiwygCanvas`: Renders `MultiTile` blocks.
    *   `MultiTile`: The atomic unit of content.

### 3. Nomenclature (Strict)
*   **`ToolPop`**: BOTTOM PANEL (Controls).
*   **`ToolPill`**: FLOATING BUTTON (Add).
*   **`ContextPill`**: **DELETED/BANNED**. Do not use floating context lozenges that obscure content.

#### The Suffix Law
To maintain continuity across different canvases (Web, Seb, Deck), all Harness UI components must follow this naming pattern. Do **not** invent new suffixes.
1.  **`*TopPill`**: Any top navigation bar (e.g., `DesktopTopPill`, `MobileTopPill`). default: `TopPill`.
2.  **`*ToolPop`**: Any bottom control panel (e.g., `WysiwygToolPop`, `GraphToolPop`). default: `ToolPop`.
3.  **`*ToolPill`**: Any floating action button (e.g., `WebToolPill`, `EmailToolPill`). default: `ToolPill`.

### 6. The "Mother Harness" Strategy
We are currently building the **Central Mother Harness**.
*   **Status**: **ACTIVE DEVELOPMENT**. Do not fork yet.
*   **Rule**: All improvements (branding, controls, inputs) must happen on the `WysiwygBuilderHarness` (the current proxy for Mother) until the User declares it "Golden".
*   **Evolution**:
    1.  **Phase 1 (Current)**: Build ONE perfect Harness.
    2.  **Phase 2**: Lock it.
    3.  **Phase 3**: Fork/Inherit for specialized needs (Video, CAD, Freeform).
    4.  **Drift Policy**: **ZERO DRIFT** allowed during Phase 1.
