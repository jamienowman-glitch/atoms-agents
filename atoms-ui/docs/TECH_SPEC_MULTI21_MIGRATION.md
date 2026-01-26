# Tech Spec: Multi21 Migration to Atoms-UI

## Objective
Migrate the `Multi21` canvas and its dependencies from `agentflow` to the standalone `atoms-ui` repository. The goal is to separate the *Canvas* (the content being edited) from the *Harness* (the tools editing it), relying on the new `ToolHarness` architecture.

## Architecture

### 1. The Separation
In `agentflow`, `Multi21Designer` was a "Monolith" that rendered the Canvas AND the Controls (BottomControls, TopControls).
In `atoms-ui`, we split this:
-   **Harness (`ToolHarness.tsx`)**: Renders `TopPill`, `ToolPill`, `ToolPop`, `ChatRail`.
-   **Canvas (`Multi21Designer.tsx`)**: Renders *only* the editable grid/preview area.

### 2. Directory Structure (`atoms-ui`)
```text
/canvases/
  └── multi21/
      ├── index.ts                 # Exports Multi21Canvas
      ├── Multi21Canvas.tsx        # The new "Designer" (Client Component)
      ├── Multi21Renderer.tsx      # The stateless Renderer (was Multi21.tsx)
      ├── tool-registry.ts         # The Tool Definition (Lifted)
      ├── types.ts                 # Types (Block, Multi21Item, etc)
      └── blocks/                  # Sub-components
          ├── ConnectedBlock.tsx
          ├── SortableBlockWrapper.tsx
          ├── VideoThumb.tsx
          └── ... (Leaf blocks)
```

### 3. Tool Mapping & Hydration
The `Multi21Canvas` will no longer manage its own "Tool State" for things like grid columns or typography. Instead, it will consume them from the `ToolControlContext`.

**Data Flow:**
1.  `ToolHarness` provides `ToolControlContext`.
2.  `ToolPop` (in Harness) updates keys like `multi21.designer:global:grid.cols`.
3.  `Multi21Canvas` uses `useToolState` to subscribe to `multi21.designer:global:grid.cols`.
4.  `Multi21Canvas` passes these values to `Multi21Renderer`.

**Key Map (Preserved):**
The keys from `tool-registry.ts` are preserved exactly to maintain compatibility.
-   `grid.cols_desktop`
-   `grid.gap_x_desktop`
-   `typo.font_family`
-   etc.

### 4. Component Refactoring & Lifting
**The Atoms (UI Muscles)**
We will meticulously lift these components to `atoms-ui/canvases/multi21/blocks/atoms/`. They will be refactored to be pure presentation components, receiving hydration from the `ConnectedBlock` wrapper.

-   **`Multi21_Grid.tsx` (The Tiled Block)**:
    -   *Role*: The core Grid Engine. Renders the dynamic grid of items (cards).
    -   *Logic*: Handles CSS Grid vars, Typography Engine (Vario), and Feed Mapping.
    -   *Props*: `items`, `gridCols`, `gap`, `variant`.
    -   *Path*: `atoms-ui/canvases/multi21/blocks/atoms/Multi21_Grid.tsx` (Refactored from `Multi21.tsx`).

-   **`Multi21_CTA.tsx`**:
    -   *Role*: The Action Button.
    -   *Props*: `label`, `href`, `variant` (solid/outline/ghost/atomic), `size`.
    -   *Hydration*: Receives style props (color, border) from the Harness (via parent).
    -   *Path*: `atoms-ui/canvases/multi21/blocks/atoms/Multi21_CTA.tsx`

-   **`Multi21_Copy.tsx`**:
    -   *Role*: The Rich Text block (Heading/Body mix).
    -   *Props*: `text`, `level`, `stylePreset` (jumbo, headline, subtitle, etc).
    -   *Features*: "Vario Engine" typography logic (Variable Fonts).
    -   *Path*: `atoms-ui/canvases/multi21/blocks/atoms/Multi21_Copy.tsx`

-   **`Multi21_Text.tsx`**:
    -   *Role*: Compound Text Block (Headline + Subhead + Body).
    -   *Props*: `headline`, `subhead`, `body`.
    -   *Path*: `atoms-ui/canvases/multi21/blocks/atoms/Multi21_Text.tsx`

-   **`Multi21_Header.tsx`**:
    -   *Role*: The Navigation / Brand Header.
    -   *Props*: `layout` (logo_center/split), `trustSignal`, `contactPriority`.
    -   *Path*: `atoms-ui/canvases/multi21/blocks/atoms/Multi21_Header.tsx`

-   **`Multi21_Row.tsx`**:
    -   *Role*: Layout Container (1-3 Columns).
    -   *Features*: Recursive DnD zones.
    -   *Path*: `atoms-ui/canvases/multi21/blocks/modifiers/Multi21_Row.tsx`

**The Wrappers**
-   **`ConnectedBlock.tsx`**:
    -   *Role*: The "Traffic Controller". It sits between the generic `Block` data and the specific `Multi21_*` atom.
    -   *Responsibility*: It `useToolState` for specific block settings (like `style.bg`) and passes them as *props* to the Atom. This is the **Hydration Point**.
    -   *Path*: `atoms-ui/canvases/multi21/blocks/ConnectedBlock.tsx`

-   **`Multi21Designer` (Original)**:
    -   *Remove*: `BottomControlsPanel` (Handled by Harness `ToolPop`).
    -   *Remove*: `DesktopPanelSystem` (Handled by Harness `ToolPill` - conceptually).
    -   *Remove*: `HiddenAttributionFields` (Unless critical, but likely Harness responsibility).
    -   *Keep*: `DndContext`, `SortableContext`, `Block` logic.
    -   *Update*: Imports to point to `@/harness/ToolControlContext`.

## Dependencies to Lift
-   `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` (Already in package.json?).
-   `framer-motion` (If used).
-   `lucide-react` (If used).

## Verification Strategy
1.  **Ghost Test**: Run `atoms-ui` demo page.
2.  **Tool Check**: Adjust "Grid Columns" in `ToolPop` (Harness). verify `Multi21Canvas` grid changes.
3.  **Drag Check**: Verify DnD still works inside the canvas frame.
