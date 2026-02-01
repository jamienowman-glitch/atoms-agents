# 🚨 ATOMS-UI CONSTITUTION (AGENTS.MD) 🚨

> **PROTOCOL 0: THE PRODUCTION LINE IS LOCKED**  
> **NICKOS MANDATE**: The core wiring of this system is **GOLDEN**.  
> **DO NOT TOUCH** the Harness, the Canvas, or the Registry logic without explicit user permission.  
> We build **ON TOP** of this foundation, not inside it.

---

## 🏗️ ARCHITECTURE OVERVIEW

### 1. The Harness (The Brain)
- **Location**: `/harnesses`
- **Role**: Holds the global state, tooling, navigation, and logic.
- **Components**: `TopPill` (Nav), `ChatRail` (Comms), `ToolPop` (Controls).
- **Rule**: The Harness is **smart**. It knows about users, projects, and modes.

### 2. The Canvas (The Product)
- **Location**: `/canvas`
- **Role**: Pure visual representation of data.
- **Rule**: The Canvas is **dumb**. It just renders blocks. No sliders, no popups.

### 3. The Registry (The Truth)
- **Location**: `canvases/multi21/registry.ts`
- **Role**: Central lookup for all Available Atoms.
- **Mechanism**: `ToolPill` reads this file to dynamically generate the "Add Atom" menu.

---

## 🛠️ EXTENSION PROTOCOLS (HOW TO ADD THINGS)

### Protocol 1: Adding a New UI Atom
> "I want to add a new 'Pricing Table' block."

1. **Read the Skill**: [Wysiwyg Extension Skill](file:///Users/jaynowman/dev/atoms-ui/.agent/skills/wysiwyg-extension/SKILL.md)
2. **Create Component**: `canvases/multi21/_atoms/PricingAtom.tsx`
3. **Create Contract**: `canvases/multi21/_atoms/PricingAtom.contract.ts` (Defines sliders/inputs)
4. **Register It**: Add to `canvases/multi21/registry.ts`
   - *Result*: It automatically appears in `ToolPill`.
   - *Result*: Its controls automatically appear in `ToolPopGeneric`.

### Protocol 2: Adding a New Canvas
> "I want to add a 'Slide Deck' editor."

1. **Read the Skill**: [Wysiwyg Extension Skill](file:///Users/jaynowman/dev/atoms-ui/.agent/skills/wysiwyg-extension/SKILL.md)
2. **Create Canvas**: `canvas/deck/DeckCanvas.tsx`
3. **Load in Harness**: Create a new page route (e.g., `app/deck/page.tsx`) that loads the **EXISTING** `WysiwygBuilderHarness` (or reuse components).
4. **Rule**: Reuse `ToolPop`, `TopPill`, and `ChatRail`. Do not reinvent the wheel.

### Protocol 3: Adding a New Harness
> "I want to build a Video Editor that works completely differently."

1. **Parallel Directory**: Must be created at the **SAME LEVEL** as `wysiwyg-builder`.
   - ✅ `harnesses/video-editor`
   - ❌ `harnesses/wysiwyg-builder/video`
2. **Scaffold**:
   - `harnesses/video-editor/VideoEditorHarness.tsx`
   - `harnesses/video-editor/shells/...` (Reuse Mother components where possible).
3. **Route**: Connect via `app/video/page.tsx`.

---

## 🔒 LOCKED COMPONENTS (DO NOT TOUCH)

The following files are the **Structural Steel** of the system. Editing them risks collapsing the Production Line.

### Harness (The Brain)
- `harnesses/wysiwyg-builder/WysiwygBuilderHarness.tsx` ⛔ LOCKED
- `harnesses/wysiwyg-builder/shells/TopPill.tsx` ⛔ LOCKED
- `harnesses/wysiwyg-builder/shells/ChatRailShell.tsx` ⛔ LOCKED
- `harnesses/Mother/tool-areas/ToolPop/ToolPopGeneric.tsx` ⛔ LOCKED
- `harnesses/Mother/tool-areas/ToolPill/ToolPill.tsx` ⛔ LOCKED

### Canvas (The Product)
- `canvas/wysiwyg/WysiwygCanvas.tsx` ⛔ LOCKED
- `canvases/multi21/registry.ts` ⛔ LOCKED (Only append new imports)

### Legacy Quarantine
- `canvases/multi21/MultiTile.tsx` ⛔ DO NOT TOUCH

---

## 📜 DEVELOPMENT RULES

1. **Contract-Driven API**: Never manually wire a specific slider to a specific prop in React. Define it in the `.contract.ts` file.
2. **Variable Fonts Only**: `Roboto Flex` is the only allowed font. Use `axisWeight`, `axisSlant`, `axisWidth`.
3. **Path Aliases**: Always use `@atoms/`, `@harnesses/`, `@canvas/`. No relative paths (`../../`).
4. **Backup First**: If you MUST touch a locked file (with permission), backup to `_backups/` first.

> **FINAL WARNING**: If you break the `ToolPill` or `ToolPop`, you halt the entire factory. tread carefully.
