# ⚖️ THE ALIAS LAW (LOCATION INDEPENDENCE)
**UNBREAKABLE RULE**: All imports MUST use Absolute Aliases.
- **FYI: THE GLOBAL LIFT IS COMPLETE.** Do not repeat. This is a law for NEW files only.
- **FYI: THE GLOBAL LIFT IS COMPLETE.** Do not repeat. This is a law for NEW files only.
- **Relative paths (../ or ./) are strictly FORBIDDEN.**
- **Automatic Registration**: Every new file MUST be registered in the Supabase Phonebook (public.registry_components).
- **Enforcement**: This system achieved 100% "Global Lift" coverage on 2026-02-01. Any agent breaking this rule restores "Import Gravity" and violates architectural integrity.

**How to Import:**
- UI: Use @atoms/*, @canvases/*, @canvases-shared/*, @ui-types/*, @harnesses/*, @harnesses-shared/*, @lib/*, @hooks/*, @components/*, @god/*.
- Core/Muscle/Agents: Use atoms_core.*, atoms_muscle.*, atoms_agents.*.

---
## 📦 EXPORT MUSCLE PIVOT (2026-02-01) - "UNIVERSAL FORMATS"
> **MASTER PLAN**: `docs/plans/2026-02-01_export_muscle_atomic_task_plan.md`
> **PROTOCOL**: `docs/plans/2026-02-01_universal_export_protocol.md`
> **Mandate**: Unified Export Engine for 16 formats (PDF, PPTX, HTML, MP4, etc).

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
> **PATH LAW**: Use `atoms_core.config.aliases.resolve_path()` to locate repos. NEVER hardcode paths.
> **SYNC LAW**: Register tools via `python3 atoms-muscle/scripts/sync_muscles.py`.
> **VAULT LAW**: Load secrets via `atoms_core.config.naming`. NO `.env`.

# 🚨 ATOMIC VISION MANDATE 🚨
> **CRITICAL**: Every Agent MUST read the [UI Architecture v2.1 (The Fleet & Factory)](file:///Users/jaynowman/dev/atoms-core/docs/plans/2026-01-30_ui_architecture_v2_1.md) before carrying out ANY work.
> This document defines the "Atomic Facade" law: The Graph is invisible; The Canvas is the Product.


# 🚨 ATOMS-APP AGENTS.MD 🚨

## 🛒 MARKETPLACE PIVOT (2026-02-01) - "AGENT-GAINS"
> **MASTER EXECUTION PLAN**: `docs/plans/2026-02-01_marketplace_pivot_master_plan.md`
> **The Strategy**:
> 1.  **Payout Engine**: `docs/plans/2026-02-01_marketplace_payout_engine_plan.md` (Crypto Payouts).
> 2.  **Economic Model**: `docs/plans/2026-02-01_marketplace_economic_model.md` (Dynamic Floor vs Fixed Peg).
> 3.  **Trust Anchor**: `docs/plans/2026-02-01_marketplace_trust_strategy.md` (The Merkle Man).

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

## 🧷 EVENT SPINE V2 CONTRACT (SUPABASE‑FIRST)
**Canonical Doc:** `docs/plans/2026-01-29_event-spine-v2-contract.md`

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

## 📍 CONFIG & OBSERVABILITY LOCATIONS (LOCKED)
All new config/observability UI must live under:
* `/Users/jaynowman/dev/atoms-app/src/app/dashboard/observability`
* `/Users/jaynowman/dev/atoms-app/src/app/dashboard/tuning`
* `/Users/jaynowman/dev/atoms-app/src/app/dashboard/pricing`
Do not create parallel config areas under `/god` for new work.

## 💳 SNAX + PRICING + DISCOUNTS (UI)
- **Pricing + Exchange UI:** `atoms-app/src/app/dashboard/pricing/` (pricing table + `system_config` edit).
- **Discount Policy UI:** same area (`/dashboard/pricing`), per‑surface policy editor.
- **Contract:** `docs/contracts/discount-engine-contract.md`.
- **UI Spec:** `docs/plans/2026-01-30_snax-pricing-discount-ui-spec.md`.
- **Plan:** `docs/plans/2026-01-30_snax-pricing-discount-atomic-task-plan.md`.
- **Rules:** no PII in discount tables; enforce KPI ceilings/floors; tenant‑scoped with per‑surface config.

## 🔐 Connector Factory Laws (UI/Engines)
* **God Config Name (Locked):** `Connector Factory — God Config` (log this exact name in all layers).
* **UX Law (God Config):** Use existing config style but avoid nested cards/boxes. Flat sections with collapsible headers; mobile-first usability.
* **Firearms Only Gate:** No danger levels, risk scores, allow-lists, or parallel gating fields. Safety is **only** `requires_firearm` + `firearm_type_id`.
* **Firearms Handling (Locked):** Agents must leave `requires_firearm=false` and `firearm_type_id` empty in drafts. Only humans set firearms in the UI.
* **Draft-Only Rule:** Connector contracts remain `draft` until a human explicitly approves in the UI.
* **Naming Engine Rule (Locked):** `formatProviderKey(platformName, rule)` is pure; basic slugify → uppercase → underscores; apply `rule` as a token template (e.g., `PROVIDER_{PLATFORM}_KEY`).
* **Engine Location (Locked):** place engines in `atoms-app/src/lib/engines/`.

## 🏛️ GOD CONFIG STANDARD (NEW)
> **Goal**: Make configs readable for The Boss (Humans).
> **Skill**: `atoms-app/.agent/skills/create-god-config/SKILL.md`.
> **The Law**:
> 1.  **No Nesting**: All configs live in `src/app/_flat_config/{slug}/`.
> 2.  **Humans First**: Every config MUST have a `humans.md` explaining it simply.
> 3.  **Readability**: No tech jargon in the `humans.md`.

## 🌐 WEBSITE PRINTING PRESS (APP)
- The Press UI lives in `atoms-app` and triggers deploys; **sites themselves are separate repos**.
- Do not embed marketing sites inside the monorepo or `atoms-app`.
- Templates are sourced from `/Users/jaynowman/dev/atoms-site-templates/`.
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

---

## 🔌 THE CONNECTOR LAW (IMMUTABLE)
> **ANY reference to an external API key, secret, or credential MUST use the Connector Backbone.**

### The Naming Law
Keys are named: `PROVIDER_{SLUG}_{FIELD}`. Example: `PROVIDER_SOLANA_API_KEY`.
**Agent Code MUST call**: `atoms_core.connectors.registry.get_canonical_key_name(platform)`

### The De-duplication Check
Call `atoms_core.connectors.registry.check_key_exists(platform)` before creating key references.

### The Firearms Gate
Scopes marked `requires_firearm` need a TOTP ticket from a Human.
See: `atoms_core/connectors/registry.py` -> `validate_firearms_ticket()`

