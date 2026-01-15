# Builder Atoms, Tokens, Registry & Canvas v1

> **Authority**: This document is the SINGLE SOURCE OF TRUTH for the Builder UI architecture.
> **Date**: 2026-01-10
> **Scope**: Northstar UI (Builder)

## 1. Core Concepts

### 1.1 Atoms vs. Tools vs. Tokens
*   **Atom**: A node in the Canvas document (e.g., `text-block`, `hero-section`). It has a stable ID, a `type` (kind), and `properties` (Tokens).
*   **Token**: A discrete, editable unit of state within an Atom (e.g., `content.text`, `style.padding`, `details.show_author`).
    *   **NO Permissions**: Tokens describe *state*, not who can edit it.
*   **Tool**: A UI affordance (icon/button) in the requested registry that *invokes* an action (insert atom, open panel, run agent).
*   **Canvas Element**: The rendered React component corresponding to an Atom.

### 1.2 Session State vs. Document State
*   **Document State** (Canvas): Persistent. Synced via Engines. Defined by `atoms` + `connections`.
*   **Session State** (UI): Ephemeral.
    *   *Examples*: `selectedAtomId`, `chatRailMode`, `toolDrawerOpen`, `toolpopContext`.
    *   This state drives the UI but is NOT stored in the Canvas document.

## 2. Registry & Catalog (The Truth)

The UI **MUST NOT** contain local registry files (`tool_registry.json`).
It **MUST** consume the live Engines catalog via HTTP.

### 2.1 Endpoint
`GET /ui/catalog?surface=builder&viewport=mobile&context=<atom_kind|null>`

### 2.2 Response Model
The Registry determines:
1.  **ChatRail Tools**: Which icons appear in the bottom rail (Scales, Night, Alarm, etc.).
2.  **Toolpop Actions**: Which buttons appear in the specific context (e.g., when `hero-section` is selected).
3.  **Toolpill Insertables**: What atoms can be dragged onto the canvas.
4.  **Atom Manifests**: The schema for each atom type (used to render Token Editors).

## 3. Tool Surfaces & Plumbing

### 3.1 ChatRail
*   **Role**: Omnipresent agent connection & tool dock.
*   **Modes**: `Nano` (passive) <-> `Full` (active chat).
*   **Drawer**: Clicking a tool icon opens a "Drawer" docked to the rail, collapsing the rail to `Nano`.

### 3.2 Toolpill
*   **Role**: Mobile-first "palette" for inserting new atoms.
*   **Behavior**:
    *   Fixed `bottom-left` (collapsed).
    *   Expands to "sausage" on tap.
    *   Draggable container.
    *   **Insert**: Dragging an item emits `insert.request`.

### 3.3 Toolpop
*   **Role**: Contextual quick actions (Pop-up toolbar).
*   **Location**: Inside the ChatRail Tool Drawer.
*   **Context**: Updates based on `selectedAtomKind`.

## 4. Builder Atoms Implementation (P0)

Atoms are "Real" React components in `packages/ui-atoms`. They consume Tokens.

| Atom Kind | Key Features | Token Binding |
| :--- | :--- | :--- |
| **Multi-21 Feed** | Feeds API, SSE updates, Source Selector | `source.kind`, `source.id`, `tile.show_*` |
| **Text** | Inline editing, H-tag modes | `content.text`, `style.typography` |
| **Button** | Label, Href, Variant | `content.label`, `action.href`, `style.variant` |
| **Media** | Filter controls, Autoplay | `src`, `filters.*`, `playback.*` |
| **Guides** | FAQ/Profile toggles | `items` (array), `layout.mode` |
| **Vector** | Path rendering, Stroke controls | `path.d`, `style.strokeWidth` |

## 5. Token Editor & Inputs
The Inspector/Token Editor must map Schema types to specific UI widgets:
*   `number` -> **Slider** (with numeric fallback)
*   `boolean` -> **Toggle** switch
*   `string` (enum) -> **Select** dropdown
*   `color` -> **Color Picker**
*   `string` (free) -> **Input** (Text)
*   `text` (long) -> **Textarea** (Auto-resize)

## 6. Wiring & Data Flow

### 6.1 Catalog Loading
1.  App Init -> `CatalogClient.fetch()`.
2.  Store in `RegistryContext`.
3.  Render `ChatRail`, `Toolpill`, `Toolpop` driven by Registry data.

### 6.2 Selection
1.  User clicks Atom -> `setSelectedId(id)`.
2.  `Toolpop` updates context via Catalog lookup (`context=<atom_kind>`).
3.  Inspector updates with Token Editor for that atom.

### 6.3 Atom Updates
1.  User interacts with Atom (e.g., Inline Text Edit).
2.  Component calls `updateProperty(id, token, value)`.
3.  Op sent to Engines via `CanvasTransport` (`set_token`).

### 6.4 Feeds (Multi-21)
1.  Component mounts.
2.  Fetch `GET /feeds/{kind}/{id}/items`.
3.  Subscribe to SSE for updates.
4.  Render tiles.
