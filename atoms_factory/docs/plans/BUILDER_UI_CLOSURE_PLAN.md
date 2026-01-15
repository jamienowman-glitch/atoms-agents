# Builder UI Closure Plan (Atoms Factory)

Plan to finalize the Mobile Builder UI, focusing on the Inspector, Selection state, and the new Multi-21 atom.

## Sequencing (Sprints)

### Sprint 1: The Core Plumbing
**Focus**: Selection & Controls.
- **Goal**: User can select an element and see the *correct* controls in the Inspector.
- **Tasks**:
    1.  **Selection State**: Wire `useSelection()` to the Canvas and Inspector.
    2.  **Schema-Driven Inspector**: Implement the `ControlFactory` that uses `CONTROL_TYPE_MAPPING.md` to render sliders/toggles from the Token Contract.
    3.  **Inline Text Edit**: Double-click text to edit `content.text`.

### Sprint 2: The Multi-21 Experience
**Focus**: Multi-21 Atom & Feed Picker.
- **Goal**: Drag Multi-21 -> Pick Feed -> See Tiles.
- **Tasks**:
    1.  **Multi-21 Scaffold**: Create `atoms/aitom_family/multi21` (fresh).
    2.  **Feed Picker UI**: Dropdown in Inspector calling `GET /feeds/summary`.
    3.  **Create Feed Flow**: "New Feed" button -> Modal -> Post to Engines.
    4.  **Renderer**: Implement grid/tile logic using `grid.*` and `tile.*` tokens.

### Sprint 3: Polish & Tests
**Focus**: Smoke Tests & Mobile Refinement.
- **Goal**: It feels like a native app.
- **Tasks**:
    1.  **Mobile Smoke**: Playwright test for "Add Block -> Edit -> Save".
    2.  **Validation Feedback**: improved error states for invalid inputs.

## Out of Scope
- **Drag & Drop Reordering**: (If not already core).
- **Theme/Style Packs**: (Separate task).

## Definition of Done
- Inspector creates correct widgets for all Token types.
- Multi-21 renders correct column count/gap per breakpoint.
- Feed selection updates the preview immediately (or via SSE).
