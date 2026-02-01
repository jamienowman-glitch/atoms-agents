# 🚨 ATOMS-MUSCLE AGENTS.MD 🚨

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
> **PATH LAW**: Use `atoms_core.config.aliases.resolve_path()` to locate repos. NEVER hardcode paths.
> **SYNC LAW**: Register tools via `python3 atoms-muscle/scripts/sync_muscles.py`.
> **VAULT LAW**: Load secrets via `atoms_core.config.naming`. NO `.env`.

# 🚨 ATOMIC VISION MANDATE 🚨
> **CRITICAL**: Every Agent MUST read the [UI Architecture v2.1 (The Fleet & Factory)](file:///Users/jaynowman/dev/atoms-core/docs/plans/2026-01-30_ui_architecture_v2_1.md) before carrying out ANY work.
> This document defines the "Atomic Facade" law: The Graph is invisible; The Canvas is the Product.


# 🏋️ THE MUSCLE FACTORY: Production Line Standard

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

> **Mission**: Build 100+ GPU-Accelerated Tools (Muscles) for Nexus and External Sale.

## 🛑 THE LAW
**All Muscles MUST obey the following mandates:**
1.  **Location**: All Muscles must live in `src/{category}/{name}`.
2.  **Components**: All Muscles must have `mcp.py`, `SKILL.md`, and `service.py` and the MCP wrapper must be complete (no stub `service.run(...)`).
3.  **Automation**: Use `scripts/factory.py` and `scripts/sentinel.py` for all new work.
4.  **Tenant Compute First (Production)**: Default interactive paths to **client device CPU/GPU**. Server render is **only** for explicit export/offline requests. **No local fallbacks** in production.
5.  **Service vs Library**: `atoms-muscle` is the **runtime/service**. Shared logic lives in `atoms-core` and must be imported explicitly.
6.  **Namespace Rule**: **Never** merge namespaces at runtime. Import from `atoms-core` explicitly (e.g., `from atoms_core.src.audio.models import ...`).
7.  **No northstar imports**: `northstar-engines` is deprecated. Do not import it anywhere in new work.
8.  **Rescue Protocol**: Port dependency logic from `northstar-engines` into `atoms-core` first. `atoms-muscle` must never import `northstar-engines`.
9.  **Slice Rule**: Deployment slices must include required `atoms-core` modules; muscles are not standalone without atoms-core.
10. **Vault Law**: **No .env files**. Secrets must be loaded via `atoms_core.config.naming.get_secret_name(TENANT, PROVIDER, FIELD)`.
    - **NEVER** hardcode `DEFAULT_CLOUDFLARE_KEY`. Always import the naming engine.
    - **NEVER** use `os.getenv`.

## 🏗️ THE PRODUCTION LINE
Any Agent building a Muscle MUST follow this exact sequence:

### STEP 1: THE CORE LOGIC (Python)
Create the implementation in `src/{category}/{name}/service.py`.
*   **Style**: Pure Python. Class-based.
*   **Deps**: Import `ffmpeg`, `torch`, `numpy` etc. locally.
*   **Imports**: Use explicit imports from `atoms-core` for shared logic/models.

### STEP 2: THE MCP WRAPPER (mcp.py)
You MUST wrap the logic using FastMCP in `src/{category}/{name}/mcp.py`.
*   Use `scripts/factory.py` to auto-generate this if possible.
*   Ensure it imports `service.py`.
*   **No stubs:** wrapper must call real service logic and return clean JSON errors.

### STEP 3: THE SKILL PACKAGING (SKILL.md)
You MUST create a `SKILL.md` file in `src/{category}/{name}/SKILL.md`.
This allows Codex/Agents to "install" this muscle as a capability.

**Format**:
```markdown
---
name: muscle-{category}-{name}
description: [Short description]
metadata:
  type: mcp
  entrypoint: src/{category}/{name}/mcp.py
  pricing: "compute-seconds"
  auto_wrapped: true
---
# Usage
...
```

### STEP 4: THE REGISTRY
Run the sync script to register new muscles:
```bash
python3 scripts/sync_muscles.py
```

## 🔧 MUSCLE CREATION WORKFLOW (COMPLETE)

> **For detailed step-by-step instructions**, see the [Muscle Creation Walkthrough](file:///Users/jaynowman/.gemini/antigravity/brain/4fa0cb4c-7682-47d1-8dca-d34f79000638/muscle_creation_walkthrough.md) and the [`create-muscle` skill](.agent/skills/create-muscle/SKILL.md).

### Quick Command Sequence:
```bash
# 1. Scaffold
python3 scripts/scaffold_muscle.py --name my_muscle --category audio --description "Short description"

# 2. Implement (edit src/{category}/{name}/service.py manually)

# 3. Normalize MCP wrapper
python3 scripts/normalize_mcp.py

# 4. Document (edit src/{category}/{name}/SKILL.md manually with detailed info)

# 5. Sync to registry
python3 scripts/sync_muscles.py

# 6. Package for deployment
python3 scripts/batch_prepare_deploy.py --clean-after
```

### Key Rules:
- **Deterministic steps** (scripts): Scaffolding, Normalization, Sync, Deployment Prep
- **Creative steps** (agent work): Planning, Implementation, Documentation
- **Multi-pass development**: Document progress in muscle-level `AGENTS.md`
- **Status tracking**: `dev` → `prod` when MCP + SKILL are complete

## 🔧 MUSCLE HARDENING WORKFLOW (UPGRADING EXISTING MUSCLES)

> **For surgical upgrades** (e.g., 1080p → 4K, CPU → GPU), see the [`harden-muscle` skill](.agent/skills/harden-muscle/SKILL.md).

### When to Harden (Not Create):
- Muscle already exists (scaffolding done)
- You need to improve the core implementation
- Examples: Add 4K support, enable GPU, add error handling

### Quick Hardening Sequence:
```bash
# 1. Locate muscle
cd src/{category}/{name}

# 2. Edit service.py ONLY (implement upgrade)
# Example: Add 4K resolution support

# 3. Update muscle-level AGENTS.md (track the pass)
# Example: Mark "Pass 2: 4K Support [x] Complete"

# 4. Test locally (verify backward compatibility)

# 5. Update SKILL.md ONLY IF schema/capabilities changed
# Example: Add new "resolution" parameter to schema

# 6. Re-sync ONLY IF you updated SKILL.md
python3 scripts/sync_muscles.py
```

### The Golden Rule of Hardening:
**Edit ONLY `service.py` and muscle-level `AGENTS.md`.** Do NOT touch `mcp.py`, root `AGENTS.md`, or re-run scaffold scripts.

## 📋 STANDARD FOLDER STRUCTURE
```text
atoms-muscle/
├── src/
│   ├── video/
│   │   ├── render/                 # <--- Subfolder per Muscle
│   │   │   ├── service.py          # Implementation
│   │   │   ├── mcp.py              # MCP Wrapper
│   │   │   └── SKILL.md            # Agent Definition
│   ├── audio/
│   ├── image/
│   ├── cad/
│   ├── text/
│   ├── media/
│   ├── timeline/
│   ├── construction/
│   └── main.py                     # The API Gateway (Legacy/Optional)
├── scripts/
│   ├── factory.py
│   ├── sentinel.py
│   └── sync_muscles.py
```

## 🔌 SUPABASE CONNECTION PROTOCOL

Before running `scripts/sync_muscles.py` or any Supabase registry update, complete the `supabase-connect` skill:
1. **Read the skill** at `atoms-muscle/.agent/skills/supabase-connect/SKILL.md`. It explains how to pull Vault secrets and how Supabase is wired through `atoms-core`.
2. **Reference the OS docs** in `atoms-core/AGENTS.md` and `atoms-core/docs/PRODUCTION_CHECKLIST.md` for Vault + Supabase guardrails.
3. **Load vault secrets** from `/Users/jaynowman/northstar-keys/` (`supabase-url.txt`, `supabase-service-key.txt`, etc.) via the Vault loader—never use `.env` or plain environment variables.
4. **Start the Sentinel**, let it generate `mcp.py`/`SKILL.md`, then run `python3 scripts/sync_muscles.py` against the Supabase URL/service key taught by the skill.
5. **Document results** (success/failure, connection errors, registry updates) so future agents can pick up where you left off.

## Tenant/Surface/Space Law
- Tenant is the billing unit. Snax wallets are tenant-scoped and spendable across all surfaces/spaces.
- Surface is the configuration layer for tenants. Data isolation is per-surface unless explicitly shared.
- Space is shared context across one or more surfaces; only surfaces explicitly mapped to a space share performance/nexus data.
- Do not hardcode surface names in schemas or code; treat surfaces/spaces as registry/config data.

## 🏭 MUSCLE FACTORY STANDARD (2026)
- **Path law:** muscles live in `atoms-muscle/src/{category}/{name}` (no `src`).
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

1. Agent requests a Firearms License (e.g., `AD_SPEND_EXECUTE`).
2. Human provides code: `FIREARMS: 847291 AD_SPEND_EXECUTE`
3. Agent calls `/api/firearms/verify`.
4. System issues 15-minute JWT ticket.
5. **No code = No access.**

Gateway: `atoms_core.connectors.registry.validate_firearms_ticket(ticket, license)`


