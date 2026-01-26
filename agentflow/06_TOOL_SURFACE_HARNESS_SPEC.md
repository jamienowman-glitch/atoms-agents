# Tool Surface Architecture & Harness Strategy
**Status:** DRAFT
**Context:** Multi21 / Mapper Refactor

## Executive Summary
We are performing a **"Lift & Shift"** operation on our core UI surfaces. The goal is to take our existing, high-fidelity UI components ("The Surfaces") and decouple them from hardcoded global state. Instead, they must remain **internally untouched** but be mounted within a **"Harness"** that provides context-aware state (Canvas-level or Atom-level) via standard providers.

---

## 1. The Three Surfaces (The "What")
These are the visual controllers of the application. They are presentational powerhouses that must be preserved.

### A. TopPill (The Navigator)
*   **Component:** `WorkbenchHeader.tsx`
*   **Source:** `components/workbench/WorkbenchHeader.tsx`
*   **Map Preview:** `PreviewTopPill.tsx`
*   **Function:** Controls **Global Context**.
    *   Navigation (Home, Settings)
    *   Project Selection
    *   Export Actions
    *   View Modes (Mobile/Desktop)
*   **Harness Requirement:** Must connect to the **Root Canvas Scope**.

### B. ToolPill (The Injector)
*   **Component:** `FloatingControlsDock.tsx` (re-exported `WorkbenchDock`)
*   **Source:** `components/workbench/WorkbenchDock.tsx`
*   **Map Preview:** `PreviewToolPill.tsx`
*   **Function:** Controls **Injections & Resources**.
    *   Draggable sources (YouTube, Products, Text)
    *   Global palette/clipboard
*   **Harness Requirement:** Must provide the drag-and-drop sources relevant to the active **Canvas Type**.

### C. ToolPop (The Mutator)
*   **Component:** `BottomControlsPanel.tsx`
*   **Source:** `app/nx-marketing-agents/core/multi21/BottomControlsPanel.tsx`
*   **Map Preview:** `PreviewToolPop.tsx`
*   **Function:** Controls **Selection Context**.
    *   **Context Aware:** Changes entirely based on what is selected (Text = Fonts/Align, Image = Filters/Crop).
    *   **Dual Magnifiers:** Left Side (= Context/Category), Right Side (= Specific Tools).
*   **Harness Requirement:** This is the most complex. It must dynamically repoint its internal state hooks to the **Selected Atom ID**.
    *   **Standardized Modules:** The following controls must remain consistent across Canvases:
        *   **ColorRibbon:** The unified palette/picker.
        *   **TypeSettings:** Standard font-size/weight/line-height controls.
        *   **VariableFonts:** The axis sliders for variable typography.

### D. ChatRail (The Coordinator)
*   **Component:** `ChatRailShell.tsx`
*   **Source:** `components/chat/ChatRailShell.tsx`
*   **Function:** Controls **Conversation Context**.
    *   **Modes:** Nano (Hidden), Micro (Ticker), Standard (Half), Full (Immersive).
    *   **Context Pills:** Displays active context (e.g., "Designing: Homepage").
    *   **Input/Output:** Main interface for AgentFax communication.
*   **Harness Requirement:** Must connect to the **Global Message Stream** but be aware of the active **Canvas Topic**. It sits *above* the Z-index of other tools.

### E. InfoCard (The Inspector)
*   **Component:** `Multi21Back.tsx`
*   **Source:** `app/nx-marketing-agents/core/multi21/Multi21Back.tsx`
*   **Function:** Visual "Flip Side" of an Atom for Metadata.
    *   **SEO Schema:** JSON-LD preview and keyword config.
    *   **UTM Builder:** Source/Medium/Campaign tagging for links.
*   **Harness Requirement:** Must bind to the **Atom's Metadata** (not just visual state). Changes here propagate to the `flipSide` config in the Mapper.

### F. Ephemeral Surfaces (The "Things You Click On")
These appear contextually on interaction (popovers/sidebars) and must likewise be harnessed.

**1. GraphTokenEditor (The Brain)**
*   **Component:** `GraphTokenEditor.tsx`
*   **Function:** Debugger view for Node Memory & Edge Blackboard.
*   **Harness Requirement:** Must read from `ConsoleContext` (`whiteboardWrites`, `blackboardWrites`) for the specific **Node ID** or **Edge ID** being inspected. It provides "Function Calling" visibility.

---

## 2. The Harness Strategy (The "How")
We do **not** rewrite the components to accept 50 different props. We wrap them.

### Concept: The `ToolControlProvider` Harness
The components currently consume `useToolState()`. Our harness strategy manipulates the *scope* of that hook contextually.

#### Current State (Hardcoded)
The components often point to hardcoded scopes like `surfaceId: 'multi21.designer'`.

#### The Fix: Dynamic Scoping
We wrap the surfaces in a harness that intercepts `useToolState` calls or provides a configured Context.

```tsx
// The Harness Wrapper
<ToolHarness
    surfaceId={activeCanvasId}  // e.g., "canvas_123"
    scope={selectedAtomId ? "atom" : "global"} // e.g., "atom"
    entityId={selectedAtomId}   // e.g., "text_block_4"
>
    {/* The Surface is "Lifted" here without code changes */}
    <BottomControlsPanel /> 
</ToolHarness>
```

### The Rules of Engagement
1.  **Do Not Touch Internal Logic:** If `BottomControlsPanel` calculates a slider value, let it. do not rewrite the math.
2.  **Inject State via Context:** If the component asks for `toolId: 'grid.cols'`, the Harness ensures it reads/writes to `canvas_123:atom:text_block_4:grid.cols`.
3.  **Preserve Aesthetics:** The CSS/Tailwind classes are "Golden". Do not alter the visual implementation.

---

## 3. Implementation Checklist for Developer

- [ ] **TopPill:** Ensure it reads Project Name/Status from the active Project Context.
- [ ] **ToolPill:** Ensure "Drag Sources" are populated from the Registry, not hardcoded arrays.
- [ ] **ToolPop:**
    - [ ] Identify the `activeBlockType` prop.
    - [ ] Ensure the Harness passes the correct `activeBlockId` so the internal `useToolState` hooks bind to the correct Atom.
- [ ] **ChatRail:**
    - [ ] Ensure `ContextPills` read from the active Canvas metadata.
    - [ ] Verify Z-Index layering (must be `z-50` above ToolPop `z-40`).
- [ ] **Verify:** Click an Atom -> ToolPop values update to match that Atom -> Change a value -> Atom updates.

**Succinctly:** We are building a "Universal Remote" (The Harness) that can control any TV (Atom) by pointing the existing Buttons (Surfaces) at the right signal receiver.
