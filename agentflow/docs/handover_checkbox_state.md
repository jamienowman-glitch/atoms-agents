# Handover: Checkbox State & "Click Button" Issues

## Context
The user reports that the "Tile Elements" checkboxes (Title, Meta, Badge, CTA, Arrow) in the `BottomControlsPanel` are difficult to use or "don't work". They explicitly requested a separate agent to focus on this "Click Button" problem.

## System Architecture

### 1. State Management (`ToolControlContext`)
-   **Hook**: `useToolState<T>({ target, defaultValue })`
-   **Target**: `{ surfaceId, entityId, toolId }`
-   **Key Generation**: `${surfaceId}:${scope}:${entityId}:${toolId}`
-   **Update Logic**: Updates a central flat `Record<string, any>`.

### 2. Component Structure
-   **`BottomControlsPanel`** (Controller): Renders the checkboxes.
    -   *Recent Fix*: `scope` object `{ surfaceId: 'multi21.designer', entityId: activeBlockId }` is now **memoized** to prevent reference instability.
    -   *UI*: Uses `div` based "fake checkboxes" with `onClick` handlers to avoid native input quirks.
-   **`ConnectedBlock`** (Consumer): Wraps the block.
    -   Reads the same state using the same `toolId` and `entityId`.
    -   Passes values as props to `Multi21`.
-   **`Multi21`** (Renderer): Receives booleans (e.g., `tileShowTitle`) and conditionally renders DOM elements.

## The Problem
"Buttons don't work" or "reset immediately".

### Potential Causes

1.  **Reference Instability (Addressed?)**:
    -   We fixed the `scope` recreation in `BottomControlsPanel`.
    -   We fixed the `setter` reference in `ToolControlContext`.
    -   *Check*: Does `ConnectedBlock` also need `scope` memoization? It re-defines `scope` on every render. If `useToolState` dependency array relies on `target` object equality, this causes effect/subscription thrashing.
    -   *Note*: `ToolControlContext` relies on `keyOf` string generation, so object reference *shouldn't* matter for the key, but might trigger internal effect cleanup re-runs.

2.  **Event Bubbling**:
    -   The UI behaves like a "background click" triggers a deselection or close event?
    -   The checkboxes are inside the Panel `div`.
    -   We added `e.stopPropagation()` (or checks) to some elements, but maybe not all.

3.  **Race Conditions**:
    -   If the "click" sets state -> Context Updates -> Parent Re-renders -> Props flow down...
    -   Is there a "Blur" listener somewhere closing the panel or resetting selection when we click inside the component?

## Recommended Investigation Steps for Next Agent

1.  **Audit `ConnectedBlock.tsx`**:
    -   Wrap the `scope` definition in `useMemo`.
    -   `const scope = useMemo(() => ({ surfaceId: 'multi21.designer', entityId: id }), [id]);`

2.  **Audit `ToolControlContext.tsx` Dependencies**:
    -   Check `useToolStateHook`. Does it depend on `[target]`? If `target` is a new object every time, `useToolState` might be re-subscribing 60fps.

3.  **Input vs Div**:
    -   We switched to `div onClick`. Verify `pointer-events` on the icon/SVG inside the button don't block the click. (We added `pointer-events-none` to the SVG, which is good).

4.  **Mobile Touch**:
    -   On mobile, `onClick` can have a 300ms delay or conflict with `onTouch`.
    -   Consider `onPointerUp` or FastClick handling if it feels "sluggish".

## Location of Key Files
-   **Controller**: `components/multi21/BottomControlsPanel.tsx`
-   **Consumer**: `components/multi21/ConnectedBlock.tsx`
-   **State**: `context/ToolControlContext.tsx`
