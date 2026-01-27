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
The `CanvasContract` schema (V2 VARIO STANDARD):
```json
{
  "contract_version": "2.0.0",
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
      "left": ["surface_switcher", "chat_toggle"],
      "right": ["view_mode", "export", "settings"]
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
        "left": { "type": "category_selector", "default": "layout" }, // The "Wheel"
        "right": { "type": "tool_selector", "default": "density" }    // The "Sub-wheel"
      },
      "sliders": {
        "layout": ["grid.cols", "grid.gap", "grid.radius"],
        "font": ["typo.size", "typo.weight", "typo.width"],
        "type": ["typo.tracking", "typo.leading"],
        "color": ["style.opacity", "style.blur"]
      }
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
-   **Slider Mapping**: Map the specific tool IDs (e.g., `typo.weight`) defined in `harness.tool_pop.sliders`.
-   **Magnifier logic**: Ensure `activeMode` (Left Magnifier) switches the `activeTool` (Right Magnifier).

### 4. The Entry (`{Name}Canvas.tsx`)
-   **Viewport**: If `viewport.type === 'infinite'`, wrap in `<InfiniteCanvas>`. If `fixed`, wrap in `<FixedFrame>`.
-   **Harness**: Inject `<ToolPop>`, `<ChatRail>`, and `<TopPill>` as defined in the contract.


