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
> This document defines the "Atomic Facade" law: The Graph is invisible; The Canvas is the Product.


# 🔌 THE CONNECTOR FACTORY: Production Line Laws

## Mission
To "print" standardized, safe, and metered connections to the outside world at a rate of Hundreds per Day.

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

## 🛑 THE LAWS
**All Agents & Humans MUST obey the following mandates:**

### 1. The Schema First Law (`manifest.yaml`)
Every connector in `src/{provider_slug}` MUST have a `manifest.yaml`.
*   **Purpose**: It is the Source of Truth for the Auto-Builder.
*   **Content**: Defines Scopes, Firearms, KPIs, and UTMs.
*   **Forbidden**: Do not hardcode these values in Python if they belong in the Manifest.

### 2. The Sentinel Law
*   **Registration**: **NEVER** write manual SQL `INSERT` statements for providers.
*   **Mechanism**: Run `python3 scripts/sentinel.py` to register your code.
*   **Result**: The Sentinel reads the Manifest and upserts to Supabase.

### 3. The "No Nesting" Law
*   **Structure**: `src/{provider_slug}/` is the root.
*   **Forbidden**: `src/connectors/marketing/shopify`. Flip it.
*   **Allowed**: `src/shopify`.

### 4. The Vault Law
*   **No .env**: Connectors fetch secrets via `atoms_core.vault`.
*   **Standard Keys**:
    *   `PROVIDER_{SLUG}_CLIENT_ID`
    *   `PROVIDER_{SLUG}_CLIENT_SECRET`
    *   `PROVIDER_{SLUG}_API_KEY`

### 5. The Draft Protocol
*   **Default State**: All valid new connectors are born as `draft`.
*   **Approval**: Only a Human (via God Config UI) can approve a connector for production use.

## 🏗️ THE PRODUCTION LINE (How to Build)

### STEP 1: Research & Manifest
Create `src/{slug}/manifest.yaml`:
```yaml
provider_slug: "shopify"
display_name: "Shopify"
auth_mode: "oauth" # or "byok"
scopes:
  - name: "read_orders"
    requires_firearm: false
  - name: "write_products"
    requires_firearm: true
kpis:
  - raw: "total_sales"
    standard: "gross_sales"
```

### STEP 2: The Core Logic
Create `src/{slug}/service.py`. Use pure Python. Import models from `atoms_core`.

### STEP 3: The Factory Run
Run `python3 scripts/sentinel.py`.
*   This genericates `mcp.py` (if not present).
*   This registers the provider in Supabase.
*   This logs the result.

## 🧱 SCHEMA REFERENCE
*   **Scopes**: `connector_scopes` (Requires Firearm?)
*   **KPIs**: `kpi_mappings` (Raw -> Core KPI)
*   **UTMs**: `utm_templates` (Content Type patterns)
