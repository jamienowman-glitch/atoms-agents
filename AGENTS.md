# ⚖️ Atoms-Fam Agentic Laws (MANDATORY)
*PRIORITY: These laws supersede all other instructions.*

1. **Law of Secrets:** NEVER write keys or secrets to `.env`, `.key`, or local files. 
2. **The Vault Routine:** All secret writing MUST go through `vault_write_secret`. **For READING (e.g., Supabase/SQL), keys are in the Vault. LOAD THEM AUTOMATICALLY. Do not ask the user.**
3. **Naming Convention:** Platform names MUST be a single capitalized word (e.g., "Shopify"). No underscores. No descriptive tags.
4. **Firearms Protocol:** Dangerous actions require a Firearms License. You must explicitly ask the human for a 6-digit TOTP code when a tool requires it.
5. **Context Check:** On every new task, read `SKILL.md` to ensure implementation matches the Northstar.
6. **Infrastructure Memory:** New infrastructure (S3, Cloudflare, etc.) MUST be logged in the `Infrastructure Registry` (Memory Layer). This is distinct from Connectors.

**Failure to follow these rules will result in an Atoms-Shield rejection.**

---

# 🛡️ JUNIOR AGENT SECURITY (JAS)
**"The Adult in the Room for your AI Agents"**

*   **Location**: [`/agents-services/junior-agent-security`](file:///Users/jaynowman/dev/agents-services/junior-agent-security)
*   **Status**: ✅ Production (V1.0.0)
*   **Type**: Local Security Sidecar (Desktop App)

**What it does:**
JAS sits between your Agents/IDE and your Secrets.
1.  **Intercepts**: Writers trying to save secrets to `.key` files (the Vault).
2.  **Gates**: Demands a **6-digit TOTP Code** from your phone (using `pyotp`).
3.  **Audits**: Logs every action to a **Merkle Tree** (SHA-256 chain) for immutable accountability.

**How to use:**
*   **Desktop App**: Double-click `JuniorAgentSecurity.app` (Dashboard at http://localhost:9090).
*   **MCP Server**: Configure your IDE to run the bundled binary (`mcp-serve` mode).
*   **Cost**: **$0.00**. Runs on Localhost + SQLite.

---

# 🚨 ATOMS-UI PROJECT STATUS: JAN 31 (PRODUCTION-READY) 🚨

## 🛒 MARKETPLACE PIVOT (2026-02-01) - "AGENT-GAINS"
> **MASTER EXECUTION PLAN**: `docs/plans/2026-02-01_marketplace_pivot_master_plan.md`
> **The Strategy**:
> 1.  **Payout Engine**: `docs/plans/2026-02-01_marketplace_payout_engine_plan.md` (Crypto Payouts).
> 2.  **Economic Model**: `docs/plans/2026-02-01_marketplace_economic_model.md` (Dynamic Floor vs Fixed Peg).
> 3.  **Trust Anchor**: `docs/plans/2026-02-01_marketplace_trust_strategy.md` (The Merkle Man).

> **⚠️ CRITICAL WARNING ⚠️**  
> **THE WYSIWYG CANVAS AND HARNESS ARE NOW PRODUCTION-READY AND LOCKED.**  
> **DO NOT TOUCH THESE FILES WITHOUT EXPLICIT USER PERMISSION.**  
> **IF YOU NEED TO EXTEND THE SYSTEM, READ THE SKILL DOCUMENTATION BELOW.**

---

## 🔒 LOCKED COMPONENTS (DO NOT EDIT)

### Golden UI State - Contract-Driven Architecture

We have successfully moved from hard-wired UI to a **Contract-Driven Discovery** model:
- **The Mother Harness is the Brain**
- **The Canvas is the Product**

**Status**: ✅ **PRODUCTION-READY** — All features tested and verified

### Protected Files

**Harness (The Brain)**:
- `harnesses/wysiwyg-builder/WysiwygBuilderHarness.tsx` ⛔ LOCKED
- `harnesses/wysiwyg-builder/shells/TopPill.tsx` ⛔ LOCKED  
- `harnesses/wysiwyg-builder/shells/ChatRailShell.tsx` ⛔ LOCKED
- `harnesses/Mother/tool-areas/ToolPop/ToolPopGeneric.tsx` ⛔ LOCKED

**Canvas (The Product)**:
- `canvas/wysiwyg/WysiwygCanvas.tsx` ⛔ LOCKED
- `canvas/wysiwyg/ToolPill.tsx` ⛔ LOCKED
- `canvas/wysiwyg/LogicPop.tsx` ⛔ LOCKED

### Verified Features

1. ✅ **ToolPop Visibility**: Z-index stacking (Tools: 100, Chat: 40) — Tools sit perfectly above Nano-Rail
2. ✅ **Synchronized Accordion**: Opening tools auto-shrinks chat to nano (128px), maximizing canvas space
3. ✅ **ToolPill Evolution**: Vertical→Horizontal lozenge (Copy/Image/Feeds/CTA categories)
4. ✅ **Typography Trait Inheritance**: New copy blocks inherit weight/slant from last edited block
5. ✅ **Motion Axis Labels**: "Bulk Up"/"Slim Down" (wght), "Stand Up"/"Lean Back" (slnt)
6. ✅ **Project Context Drawer**: TopPill right-side drawer with Project/Page selectors and SEO metadata

---

## 🛠️ HOW TO EXTEND THE SYSTEM

**IF YOU NEED TO CREATE NEW ATOMS OR CANVASES, READ THIS SKILL:**

📖 **[Extension Skill](file:///Users/jaynowman/dev/atoms-ui/.agent/skills/wysiwyg-extension/SKILL.md)**

This skill teaches you:
- How to create a new atom with a contract
- How to plug a new atom into the ToolPill
- How to create a new canvas type  
- How to plug a new canvas into the Mother Harness
- **What NOT to touch** in the stable system

---

## 📜 DEVELOPMENT RULES (MANDATORY)

### 1. Contract-Driven Development ⚡ IMMUTABLE

**NO MANUAL CONNECTIONS**: Do not wire a slider to an atom prop manually.

**THE ONLY WAY**: Update the `.contract.ts` file and let the `ToolPopGeneric` handle it programmatically.

**Example**:
```typescript
// ❌ WRONG: Manual wiring in component
<Slider onChange={(val) => setImageOffset(val)} />

// ✅ RIGHT: Define in contract
{
  id: 'layout.image_offset',
  type: 'slider',
  label: 'Image Offset',
  targetVar: 'layout.image_offset',
  min: 0,
  max: 100
}
```

---

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

## 🏁 OVERNIGHT BUILD LAWS (2026-01-31)
**Master Scorecard**: [Overnight Agent Checklist](file:///Users/jaynowman/dev/docs/checklists/2026-01-31_overnight_agent_checklist.md)

### 1. The Financial & Control Law
**Canonical Doc**: [Financial & Control Layer Plan](file:///Users/jaynowman/dev/docs/plans/2026-01-31_finance_control_layer_plan.md)
*   **Efficiency Oracle**: `snax_rate` is dynamic (Target Profit).
*   **Dual Rails**: Payments via Stripe (Fiat) AND Helius (Crypto) are treated as equal peers.
*   **God Controls**: User must be able to override the Peg via `TreasuryDashboard`.

### 2. The Legacy Quarantine Law
**Canonical Doc**: [Legacy Migration Plan](file:///Users/jaynowman/dev/docs/plans/2026-01-31_legacy_migration_plan.md)
*   **Status**: `northstar-engines` is moved to `_legacy/`.
*   **Mandate**: **NEVER** import from `northstar-engines`. If you find a broken import in `atoms-core`, you must **PORT** the logic to `atoms-muscle` first.

### 3. The RAG Assistant Law
**Canonical Doc**: [Agent RAG Assistant Plan](file:///Users/jaynowman/dev/docs/plans/2026-01-31_agent_rag_assistant_plan.md)
*   **Mandate**: All Agents must use `atoms-muscle/src/knowledge/search_assistant` for RAG.
*   **Why**: It automatically handles the `nexus.search_hit` logging required for the Haze Heatmap.

### 4. The Muscle Factory Skill Law
**CRITICAL**: Every Agent building a muscle MUST read `atoms-muscle/.agent/skills/create-muscle/SKILL.md` first.
*   No Stubs.
*   MCP Wrapper required.
*   SKILL.md required.

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
    4.  **Trust Layer**: "The Merkle Man" (Blockchain Audit) implementation `docs/plans/future_merkle_man_plan.md`.
    5.  **Drift Policy**: **ZERO DRIFT** allowed during Phase 1.

## 🏛️ GOD CONFIG STANDARD (NEW)
> **Goal**: Make configs readable for The Boss (Humans).
> **Skill**: `atoms-app/.agent/skills/create-god-config/SKILL.md`.
> **The Law**:
> 1.  **No Nesting**: All configs live in `atoms-app/src/app/_flat_config/{slug}/`.
> 2.  **Humans First**: Every config MUST have a `humans.md` explaining it simply.
> 3.  **Readability**: No tech jargon in the `humans.md`.

## 🔮 FUTURE ROADMAP (DO NOT IMPLEMENT YET)
- **The Merkle Man**: `docs/plans/future_merkle_man_plan.md` (Blockchain audit layer).
