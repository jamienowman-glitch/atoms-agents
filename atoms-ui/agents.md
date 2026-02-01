# 🚨 ATOMS-UI AGENTS.MD 🚨

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

### 2. Path Aliases ⚡ IMMUTABLE

**ALWAYS USE ALIASES**:
- `@atoms/*` → `canvases/*/\_atoms/*`
- `@harnesses/*` → `harnesses/*`
- `@canvas/*` → `canvas/*`

**DEPRECATED**: Relative paths (`../`) are forbidden.

### 3. Legacy Code Quarantine ⚡ IMMUTABLE

**QUARANTINED**:
- `canvases/multi21/MultiTile.tsx` ⛔ DO NOT TOUCH
- `canvases/multi21/MultiTile.config.ts` ⛔ DO NOT TOUCH

**ALL NEW TILE WORK**: Use `BaseTile.tsx` (when it exists).

**Reason**: MultiTile is legacy, hard-wired, and unmaintainable.

### 4. Immutable Workflow ⚡ CRITICAL

**IF YOU NEED TO TOUCH A STABLE COMPONENT**:

1. Create a dated backup: `_backups/2026-01-31_component_name/`
2. Work from the backup
3. Get user approval before applying changes to the original

**DIRECT EDITS TO LOCKED ORIGINALS = FORBIDDEN**

---

## 🧬 ATOMIC VISION MANDATE

> **CRITICAL**: Every Agent MUST read the [UI Architecture v2.1 (The Fleet & Factory)](file:///Users/jaynowman/dev/atoms-core/docs/plans/2026-01-30_ui_architecture_v2_1.md) before carrying out ANY work.
> This document defines the \"Atomic Facade\" law: The Graph is invisible; The Canvas is the Product.

## 📜 THE SYSTEM LAWS (JAN 31 UPDATE)

1. **The Harness Law**: All tool logic (magnifiers, sliders, real-time logging) lives in `harnesses/Mother`. The Canvas is dumb; The Harness is the Brain.
2. **The Atom Contract Law**: No UI Atom is built without a corresponding `.contract.ts` file. This file dictates exactly what the sliders in the ToolPop do.
3. **The Skill Protocol**: Every major task (Building Atoms, Grading Color, Connecting Muscles) must refer to its specific `.agent/skills/` document for formatting and logic standards.

---

## 🏛️ THE HIERARCHY OF POWER (v2.1)

**Architecture Law**: The relationship between Surfaces and Spaces is **Dynamic Configuration**, not hard-coded logic.

### 1. The Core Hierarchy

- **Level 1: The Tenant (Wallet)**: The User Identity. Owns Snax.
- **Level 2: The Space (Context)**: The Data Boundary (Nexus + Feeds). Data **NEVER** leaks between Spaces.
  - *Shared Assets*: Nexus (Vector Memory), Feeds (RSS/API), Config (Brand Voice).
- **Level 3: The Surface (Domain)**: The Brand Wrapper & Demographic Interface.
  - *Dynamic Mapping*: A Surface maps to **ONE** Space at a time via `space_surface_mappings`.
  - *Contents*: Flows, Canvases, Projects.
- **Level 4: The Commercial Units**:
  - *AgentFlow*: Unit of Work (Cost per Run).
  - *FlowStack*: Unit of Value (Marketplace Asset).
  - *Firm*: Unit of Scale (Subscription).

---

## GOLDEN UI STATE: CHAT RAIL & POPUPS (LOCKED)

> [!WARNING]
> The following UI behaviors are **PERFECTED**. Do not change them \"incidentally\". If you touch them, you must verify they still work exactly as described.
> **AUDIT REQUIRED**: AFTER EVERY TASK, YOU MUST AUDIT YOUR CHANGES AGAINST THIS CONSTITUTION.

### 1. ChatRail Shell (Nano Mode)

- **Behavior**: In `nano` mode, the Input Box is HIDDEN. The Message Thread is VISIBLE.
- **Height**: Fixed at `128px` (Header + 1 Message Bubble).
- **Reference**: `ChatRailShell.tsx` → `getHeight()`.

### 2. Popups (ToolPop / LogicPop)

- **Positioning**: Fixed at `bottom: 128px` (synchronized with nano rail).
- **Layering**: `z-index: 100` (Tools) sits ON TOP of ChatRail (`z-40`).
- **Layout**:
  - **ToolPop**: Height is `h-auto max-h-[280px]` (Hug content).
  - **LogicPop**: Must have explicit Close ('X') button wired to `onClose` prop.

### 3. Accordion Sync

- **Rule**: Opening tools automatically forces `setChatMode('nano')`.
- **Effect**: Eliminates wasted space by coordinating heights.

### 4. MANDATORY REGRESSION CHECK

**Before finishing any task involving `atoms-ui`, you must verify:**

1. [ ] **Brain Button**: Click Brain in Nano Mode → Does menu appear *over* the rail?
2. [ ] **Close Buttons**: Click 'X' on both menus → Do they close?
3. [ ] **Nano Mode**: Is the Input Box hidden? Is the Message visible?
4. [ ] **Gap Check**: Open Tools → Is there a huge white gap at the bottom? (Should be NO).

---

## The Harness & Canvas Pattern

The `atoms-ui` repository enforces a strict separation between the \"Harness\" (Tooling/Rig) and the \"Canvas\" (Content/State).

### 1. The Harness (`/harnesses`)

The Harness is the container that holds the Canvas. It is responsible for all **Tooling**, **Navigation**, and **Global State**.

- **Definition**: A \"Rig\" that you load different Canvases into.
- **Key Components**:
  - **`TopPill`**: Top navigation bar (Environment, View Mode toggles, Page Drawer).
  - **`ChatRail`**: Collapsible communication rail (Bottom).
  - **`ToolPop`**: The bottom control panel for Canvas Output tools.
  - **`LogicPop`**: The bottom control panel for Agent Brain/Logging tools.
  - **`ToolPill`**: The floating action button (e.g., `+`) for adding elements.

### 2. The Canvas (`/canvas`)

The Canvas is the pure visual representation of the content.

- **Definition**: A render surface for atomic blocks.
- **Rule**: **NO OVERLAYS**. The canvas should never contain UI controls (like sliders or popups) that hide the content. All controls must be lifted to the Harness.

---

## CRITICAL BACKUP INTEGRITY

> [!IMPORTANT]
> **BACKUP PATH**: `atoms-ui/_backups`
> **RULE**: NEVER DELETE FILES IN THIS DIRECTORY.
> These are manual save points requested by the User (e.g. `wysiwyg_2026_01_30_stable`).
> Even if disk space is low, DO NOT DELETE.
> Checking for and restoring from these backups is PERMITTED if the main branch is corrupted.
