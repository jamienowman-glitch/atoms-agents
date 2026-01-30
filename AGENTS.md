
## Active Initiatives: MAYBES & HAZE
- **MAYBES**: Note-taking city canvas where ToolPill/ToolPop create nodes (text/audio/image). Nodes can be forwarded to Harness flows. Data stored in Supabase registry; media stored in S3 with URI refs; tenant-compute first.
- **HAZE**: Nexus Explorer planetary canvas (first-person on curved surface). Client device CPU/GPU for interactive render; server render only for export/offline. Uses HAZE muscles (surface renderer, runner, preview, optional contours) and registers via Supabase.

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
