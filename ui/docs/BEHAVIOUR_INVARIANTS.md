# Behaviour Invariants
**Goal:** Modularize structure without changing runtime behavior.

## Core Interaction
*   **Drag & Drop**: Reordering sections in the Sidebar must result in a smooth Framer Motion animation and specific `move` ops sent to the kernel.
*   **Selection**: Clicking a component on the canvas OR in the sidebar must highlight both representations (Canvas blue border, Sidebar blue background).
*   **Inline Editing**:
    *   **Single Click**: Selects.
    *   **Double Click**: Enters `contentEditable` mode.
    *   **Blur**: Commits changes via `update` op.
    *   **Enter Key** (Headlines): Helper to blur/commit.
*   **Add Section**: Clicking "+ Rich Text" adds a section AND its default children (Heading + Text) immediately.
*   **Add Block**: Clicking "+ Text" inside a Sidebar section adds a new text block to that specific section.

## Data & Transport
*   **Ops**: Must emit standard `CanvasOp` objects (`add`, `remove`, `update`, `move`).
*   **Optimistic updates**: UI updates immediately (via local kernel application) before network confirmation.
*   **Persistence**: `localStorage` state must be preserved or compatible (though we might clear it if needed, the *mechanism* must remain).

## Visuals
*   **Responsiveness**: Hero banner must behave responsively (padding, width) based on Inspector settings.
*   **Inspector**: Must render the correct controls based on `SCHEMAS` for the selected item.
*   **Agent Simulation**: The "✨ Write Copy" button must trigger the `runScriptedAgent` typing effect.
