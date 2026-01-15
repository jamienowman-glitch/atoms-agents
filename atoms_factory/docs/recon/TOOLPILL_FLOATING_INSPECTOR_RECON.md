# Recon: FloatingInspector (Toolpill)

**Context**: Reusable "Toolpill" component reference model.
**Source Repo**: `atoms_factory`
**Location**: `apps/workbench/src/components/FloatingInspector.tsx`

---

## 1. Where it is

*   **Component Source**: [`apps/workbench/src/components/FloatingInspector.tsx`](../apps/workbench/src/components/FloatingInspector.tsx)
*   **Styling**:
    *   **Inline Styles**: Most layout, positioning, and animations are handled via dynamic inline styles within the component (specifically the `getExpandOrigin` function).
    *   **External CSS**: [`apps/workbench/src/workbench.css`](../apps/workbench/src/workbench.css)
        *   `.mobile-inspector-host`: Controls visibility (media queries).
        *   `.mobile-inspector-header`: Target for drag interactions.

## 2. How it is mounted

*   **Parent**: Mounted in **`App.tsx`** (Line 220) inside a wrapper container.
    ```tsx
    // App.tsx
    <div className="mobile-inspector-host">
      <FloatingInspector
        canvasId={CANVAS_ID}
        elementId={selectedAtomId}
      />
    </div>
    ```
*   **Rendering Logic**:
    *   It is **always rendered** in the React tree.
    *   Visibility/Display is toggled via CSS Media Queries in `workbench.css`:
        *   **Desktop (>768px)**: `display: none`
        *   **Mobile (<=768px)**: `display: block`
*   **Props**:
    *   `canvasId` (string): Passed to child `TokenEditor` for API fetching.
    *   `elementId` (string): The currently selected Atom ID.

## 3. State + Behavior

### Core State
*   `isExpanded` (boolean): Tracks open/closed toggle.
*   `position` ({x, y}): Tracks the `{ left, top }` coordinates. Defaults to bottom-left (`20, window.innerHeight - 80`).
*   `isDragging` (ref): boolean flag for active drag sessions.

### Interaction Mechanics
*   **Expand**: Tap (`onClick`) on the minimized "Gear" icon.
*   **Collapse**: Tap (`onClick`) on the "Close" (×) button in the header.
*   **Drag**:
    *   **Minimized**: Draggable anywhere on the element.
    *   **Expanded**: Draggable **ONLY** via the Header (`.mobile-inspector-header`). Uses `e.target.closest(...)` check.
*   **Positioning**:
    *   Uses `position: fixed` with explicit `left`/`top` styles.
    *   **Minimized**: 48x48px pill, centered on coordinate (`translate(-50%, -50%)`).
    *   **Expanded ("Sausage")**:
        *   Width: `320px` (max `90vw`).
        *   Height: Auto (max `250px`).
        *   Centered horizontally relative to the drag coordinate (`translate(-50%, -20px)`).

### Animation
*   **Implementation**: CSS Transitions via inline style.
*   **Transition Rule**: `transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1)`.
*   **Drag Optimization**: Transition is set to `'none'` specifically when `isDragging.current` is true to ensure 1:1 follow performance.

## 4. Dependency Graph

### Direct Imports
*   **`TokenEditor`**: The content payload. Imported from `./TokenEditor`.
*   **React**: `useState`, `useRef`, `useEffect`.

### Data Requirements
The `FloatingInspector` is a **shell**. It does not manage data itself. It passes `canvasId` and `elementId` to the `TokenEditor`, which is responsible for data fetching.

*   **`TokenEditor` Dependencies** (Implicit Requirement):
    *   `TokenApi` (`client/api.ts`): Fetches the Catalog and sets Token values.
    *   `CanvasApi`: Fetches snapshots for optimistic updates.
    *   `buildTree` (`client/utils`): transforms flat catalog to tree.

## 5. "Icons Underneath"

Current icons are **text/emoji placeholders**.

*   **Minimized Icon**:
    *   **Definition**: `<div style={{ fontSize: 24 }}>⚙️</div>`
    *   **Behavior**: Toggles `isExpanded(true)`.
*   **Drag Grip**:
    *   **Definition**: `<span style={{ fontSize: 12, opacity: 0.5 }}>:::</span>`
    *   **Role**: Visual indicator for the draggable header area.
*   **Close Button**:
    *   **Definition**: `<button> × </button>` (Text "times" symbol).
    *   **Behavior**: Toggles `isExpanded(false)`.

## 6. Transplant Requirements

To move this behavior to `northstar-ui` (or another repo), you need:

1.  **The Shell (`FloatingInspector.tsx`)**:
    *   Can be copied almost 1:1.
    *   **Rewrite Risk**: The `TokenEditor` import is tight coupling. You will likely want to replace `<TokenEditor />` with the new Multi-21 tool payload or a `children` prop/slot.

2.  **Styles**:
    *   Copy the `.mobile-inspector-header` class style or move to inline/CSS-in-JS.
    *   Replicate the media query logic if you want the same desktop/mobile split.

3.  **No External Libs needed**: logic is pure React + DOM events.
