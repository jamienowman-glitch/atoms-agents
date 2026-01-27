---
name: canvas-contract-builder
description: Defines the Canvas Contract schema and how to generate a new Agentic Canvas from it (no "Forge" naming).
version: 1.0.0
---

# Canvas Contract Builder Skill

This skill allows an Agent to function as a **Canvas Contract Builder**. It takes a structured definition (Contract) and outputs the necessary file structure following the `atoms-ui/agents.md` Law.

## usage
To use this skill, provide a `CanvasContract` JSON object.

## format
The `CanvasContract` schema (V2.1 VARIO STANDARD — backward compatible with 2.0.0):
```json
{
  "contract_version": "2.1.0",
  "meta": {
    "name": "Infinite Whiteboard",
    "description": "A free-form Vario canvas with dual-magnifier control."
  },
  "viewport": {
    "type": "infinite", // or "fixed"
    "preset": "1080x1080", // if fixed
    "bg_color": "#f5f5f5"
  },
  "harness": {
    "top_pill": {
      "left": ["space_switcher", "surface_switcher", "chat_toggle"],
      "right": ["view_mode", "export", "settings"],
      "left_locked": true
    },
    "chat_rail": {
      "enabled": true,
      "position": "left",
      "width": 320
    },
    "tool_pop": {
      "enabled": true,
      "position": "bottom",
      "magnifiers": {
        "left": { "type": "category_selector", "default": "layout" },
        "right": { "type": "tool_selector", "default": "density" }
      },
      "left_categories": [
        { "id": "context_atom", "label": "Contextual Atom", "locked": true, "ui_atom_ref": "ui_atom.example" },
        { "id": "layout", "label": "Layout" },
        { "id": "font", "label": "Font" },
        { "id": "type", "label": "Type" },
        { "id": "color", "label": "Color" }
      ],
      "right_controls_by_category": {
        "layout": [
          { "name": "grid.cols", "control_type": "slider", "min": 1, "max": 12, "step": 1, "token": "grid.cols" }
        ],
        "font": [
          { "name": "typo.size", "control_type": "slider", "min": 8, "max": 120, "step": 1, "token": "typo.size" }
        ],
        "type": [
          { "name": "typo.tracking", "control_type": "slider", "min": -4, "max": 10, "step": 0.1, "token": "typo.tracking" }
        ],
        "color": [
          { "name": "style.opacity", "control_type": "slider", "min": 0, "max": 100, "step": 1, "token": "style.opacity" }
        ]
      },
      "settings_notes": ""
    },
    "tool_pill": {
      "enabled": true,
      "long_press_map": {
        "text": ["jumbo", "headline", "quote"]
      }
    },
    "atom_flip": {
      "enabled": false,
      "notes": ""
    }
  },
  "atoms": [
    {
      "name": "Tile",
      "props": {
        "title": { "type": "string", "default": "Untitled" },
        "variant": { "type": "select", "options": ["generic", "product", "video"] }
      },
      "vario": {
        "axes": ["weight", "width", "slant", "casual"],
        "mappings": {
          "weight": "font-variation-settings: 'wght' var(--v-weight)",
          "width": "font-variation-settings: 'wdth' var(--v-width)"
        }
      }
    }
  ]
}
```

## instructions
When invoked with a Contract, you must generate the following artifacts.

### 1. The Atom (`atoms/{AtomName}.tsx`)
-   **Vario-First**: Must accept CSS variables for axes defined in `vario.mappings`.
-   **Props**: Standard React props based on the `props` definition.

### 2. The Molecule (`molecules/{MoleculeName}.tsx`)
-   **Layout**: Respect `grid.cols` and `grid.gap` from the `ToolControlContext`.

### 3. The Controller (`blocks/Connected{Name}.tsx`)
-   **Hook Wiring**: You MUST use `useToolState` to bind the UI to the Harness.
-   **Control Mapping**: Map tool IDs using `harness.tool_pop.right_controls_by_category` tokens.
-   **Magnifier logic**: Ensure `activeMode` (Left Magnifier) switches the `activeTool` (Right Magnifier).

### 4. The Entry (`{Name}Canvas.tsx`)
-   **Viewport**: If `viewport.type === 'infinite'`, wrap in `<InfiniteCanvas>`. If `fixed`, wrap in `<FixedFrame>`.
-   **Harness**: Inject `<ToolPop>`, `<ChatRail>`, and `<TopPill>` as defined in the contract.
