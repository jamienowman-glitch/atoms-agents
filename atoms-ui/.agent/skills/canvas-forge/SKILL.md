---
name: canvas-forge
description: Generates the specialized boilerplate for a new Agentic Canvas based on a "Canvas Contract".
version: 1.0.0
---

# Canvas Forge Skill

This skill allows an Agent to function as a "Canvas Factory". It takes a structured definition (Contract) and outputs the necessary file structure following the `atoms-ui/agents.md` Law.

## usage
To use this skill, provide a `CanvasContract` JSON object.

## format
The `CanvasContract` schema:
```json
{
  "name": "VideoTimeline", // PascalCase
  "description": "A non-linear video editing timeline.",
  "tools": {
    "magnifier_left": { "label": "Zoom", "id": "zoom_level", "type": "slider" },
    "magnifier_right": { "label": "Export", "id": "export_fmt", "type": "select" }
  },
  "atom": {
    "name": "Clip",
    "props": [
      { "name": "startTime", "type": "number" },
      { "name": "duration", "type": "number" },
      { "name": "color", "type": "string" }
    ]
  },
  "molecule": {
    "name": "TimelineGrid",
    "layout": "flex-row" // or "grid"
  }
}
```

## instructions
When invoked with a Contract, you must generate the following artifacts. Do not ask for clarification, just build them.

### 1. The Atom (`atoms/{AtomName}.tsx`)
Generate a pure React component.
-   Use `interface {AtomName}Props`.
-   Include `useVarioEngine` support by default (even if not explicitly requested, standardise it).
-   Render a placeholder UI based on the props.

### 2. The Molecule (`molecules/{MoleculeName}.tsx`)
Generate the Container.
-   Accept `items: {AtomName}Props[]`.
-   Map over items and render the Atom.
-   Inject standard CSS variables (`--style-bg`, `--style-accent`) into the container `style`.

### 3. The Controller (`blocks/Connected{Name}.tsx`)
Generate the Harness Controller.
-   **Imports**: Must import `useToolControl` from harness.
-   **Strict Layout**:
    -   Must place GLOBAL tools (Settings, Zoom) in `<ToolPill />` (Top/Right) or `<TopPill />`.
    -   Must place CONTEXT tools (Selection actions) in `<ToolPop />` (Bottom).
    -   Must place CHAT in `<ChatRail />` (Left).
-   **Transport**: Ensure any event handlers (onClick, onDrag) use `transport.sendCommand` via the Context, NOT local state or raw fetch.
-   **State**: Setup `useToolState` for standard Vario axes (weight, width, slant).

### 4. Persistence (The Registry)
The contract is the Source of Truth.
-   **Save**: Using `northstar-engines`, write the JSON Contract to `atoms-registry/canvases/{name}.yaml`.
-   **Load**: The Forge reads this YAML to re-hydrate the Form.


### 4. The Entry (`{Name}Canvas.tsx`)
Generate the main Canvas wrapper.
-   Should be a Client Component.
-   Wraps the Controller.

## example operation

**User**: "Forge a 'Gantt' canvas with a 'Task' atom."

**Agent Action**:
1.  **Contract**: `atoms-registry/canvases/gantt.yaml`
    ```yaml
    name: Gantt
    description: Project timeline view.
    tools:
      zoom: { id: zoom, type: slider }
    atom:
      name: Task
      props: [{name: start, type: number}, {name: duration, type: number}]
    molecule:
      name: GanttGrid
      layout: flex-row
    ```
2.  **Generate**:
    -   `atoms-ui/canvases/gantt/GanttCanvas.tsx`
    -   `atoms-ui/canvases/gantt/blocks/ConnectedGantt.tsx` (With `useToolState('zoom')`)
    -   `atoms-ui/canvases/gantt/molecules/GanttGrid.tsx`
    -   `atoms-ui/canvases/gantt/atoms/TaskTile.tsx`

