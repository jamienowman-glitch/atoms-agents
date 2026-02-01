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

# AGENTS.md
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

## 🧷 EVENT SPINE V2 CONTRACT (SUPABASE‑FIRST)
**Canonical Doc:** `docs/plans/2026-01-29_event-spine-v2-contract.md`

## 🧷 TUNING ARCHITECTURE (DECOUPLED)
- `atoms-tuning` is external and produces adapters (LoRA/other).
- `atoms-agents` stores **adapter references only** (IDs/URIs).
- No adapter binaries live in this repo.
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

---

## 🔫 TOTP FIREARMS LICENSING (IMMUTABLE)
> Agents CANNOT self-approve dangerous actions. A HUMAN must provide a 6-digit Authenticator code.

### How It Works
1. Agent requests a Firearms License (e.g., `AD_SPEND_EXECUTE`).
2. Human opens Authenticator app and provides code: `FIREARMS: 847291 AD_SPEND_EXECUTE`
3. Agent calls `/api/firearms/verify` with the code.
4. System validates TOTP and issues a 15-minute JWT ticket.
5. Agent uses ticket for protected scope calls.
6. **No code = No access. Agents CANNOT bypass this.**

### Gateway
`atoms_core.connectors.registry.validate_firearms_ticket(ticket, required_license)`

