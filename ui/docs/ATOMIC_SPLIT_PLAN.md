# Atomic Split Plan
**Target:** Modularize `northstar-canvas-ui` without behavior change.

## 1. New Package Structure

We will create the following packages in `packages/`:

### `builder-core`
*   **Purpose**: Central state machine interaction, Op emission, Selection state.
*   **Contents**:
    *   `useBuilderState` hook (extracted from `App.tsx` loop/state).
    *   `BuilderContext` (optional, for passing down dispatchers).
*   **Dependencies**: `canvas-kernel`, `contracts`, `transport`.

### `builder-registry` (Model & Schemas)
*   **Purpose**: Defines WHAT blocks exist and their data shape.
*   **Contents**:
    *   `SCHEMAS` (from `ui-atoms/schemas.ts`).
    *   `SECTION_TEMPLATES`.
    *   `AtomRegistry` (the map of type -> React Component).
*   **Dependencies**: `contracts`, `ui-atoms` (initially, then consumes them).

### `builder-layout`
*   **Purpose**: Managing structure, reordering, and the Sidebar UI.
*   **Contents**:
    *   `Sidebar` component (moved from `apps/studio/components`).
    *   `reorder` logic (extracted from `App.tsx::handleReorder`).
    *   `layout` components (`HeroSection`, `TextSection` - purely structural parts).
*   **Dependencies**: `builder-core`, `builder-registry`.

### `builder-copy`
*   **Purpose**: Text Editing experience.
*   **Contents**:
    *   `HeadlineBlock` component (with `contentEditable`).
    *   `TextBlock` component.
    *   `ButtonBlock` (label editing).
*   **Dependencies**: `builder-core` (for updates).

### `builder-theme`
*   **Purpose**: Color / Visual logic.
*   **Contents**:
    *   Styles helper (extracted from components if possible, or just the components that are purely visual like `ImageBlock`?).
    *   *Note*: For now, `ImageBlock` and visual styles might stay in `builder-registry` or `ui-atoms` if purely display, but `Inspector` belongs here or in its own.

### `builder-inspector`
*   **Purpose**: The Right-hand settings panel.
*   **Contents**:
    *   `Inspector` component (from `apps/studio/components`).
*   **Dependencies**: `builder-registry` (reads schemas), `builder-core` (dispatch updates).

## 2. Migration Step-by-Step

### Step 1: `builder-registry`
*   Create `packages/builder-registry`.
*   Move `packages/ui-atoms/src/schemas.ts` -> `packages/builder-registry/src/schemas.ts`.
*   Establish exports.

### Step 2: `builder-copy` & `builder-layout` (Split `ui-atoms`)
*   Create `packages/builder-copy`.
*   Move `HeadlineBlock`, `TextBlock` from `ui-atoms` to `builder-copy`.
*   Create `packages/builder-layout`.
*   Move `HeroSection`, `TextSection` from `ui-atoms` to `builder-layout`.
*   Move `Sidebar` from `apps/studio` to `builder-layout`.
*   *Legacy `ui-atoms` remains as a barrel re-exporting these for backward compat if needed, or we switch `projections` to use the registry.*

### Step 3: `builder-inspector`
*   Create `packages/builder-inspector`.
*   Move `apps/studio/src/components/Inspector.tsx` to `packages/builder-inspector/src/index.tsx`.

### Step 4: `builder-core` (The Brain)
*   Create `packages/builder-core`.
*   Extract the state logic from `App.tsx` into `useBuilderEngine`:
    *   `kernel`, `transport`, `state`, `handleOp` -> `packages/builder-core/src/engine.ts`.

### Step 5: `apps/studio` (The Shell)
*   Update `App.tsx` to:
    *   Import `useBuilderEngine` from `builder-core`.
    *   Import `Sidebar` from `builder-layout`.
    *   Import `Inspector` from `builder-inspector`.
    *   Import `CanvasView` from `projections` (which now imports from `builder-registry`).

## 3. Strict Safety Checks ("The NO BEHAVIOUR CHANGE Rule")
*   **Invariant**: We will COPY code, not rewrite it.
*   **Imports**: We will strictly fix import paths.
*   **Logic**: `handleReorder` logic must remain exactly:
    ```typescript
    newOrderIds.forEach((id, index) => {
        const currentAtom = state.atoms[id];
        const currentIndex = state.rootAtomIds.indexOf(id);
        if (currentIndex !== index) { ... emit move ... }
    });
    ```
    This function will move to `builder-layout` or `builder-core` but MUST NOT CHANGE.

## 4. Verification
*   Run `BASELINE_DEMO_STEPS.md` after every single package extraction.
