# Lens Graph Node Pack Contract (v1)

**Status:** ACTIVE
**Scope:** `atoms_factory` -> `atoms/aitom_family/`

## 1. Required Atoms
The following atoms MUST exist and adhere to the strict `SCHEMA` + `View` pattern.

| Atom ID | Display Name | Role | Icon Requirement |
| :--- | :--- | :--- | :--- |
| `connector_node` | Connector | Integration Point | Platform Logo (e.g. YouTube, TikTok) via Badge or Icon |
| `agent_node` | Agent | worker | `AssetRegistry.icons.northstar_agent` |
| `framework_node` | Framework | Container / Squad | Dynamic / Nested indication |
| `lens_header_node` | Lens Header | Section Title | No Icon; purely typographical |
| `blackboard_node` | Blackboard | Shared State | Database / Storage Icon |

## 2. Token Requirements
All nodes must expose the following tokens in `exposed_tokens/schema.ts`.

### 2.1 Standard Meta
```typescript
meta: {
    atom_kind: string; // matches folder name
    version: string;   // semver
}
```

### 2.2 Shared Content Slots
| Key | Type | Description |
| :--- | :--- | :--- |
| `name` | string | The primary label of the node (Node Name). |
| `kind` | string | Subtitle or variant (e.g. "YouTube", "Chat Worker"). |
| `status` | enum? | Operational state (Idle, Running, Error). |

### 2.3 Visual Tokens
| Key | CSS Property | Default |
| :--- | :--- | :--- |
| `background_color` | `background` | `#FFFFFF` (Light) / `#1E1E1E` (Dark) |
| `accent_color` | `border-color` | Dependent on node type (Blue=Agent, Green=connector) |

## 3. Behavior Contract

### 3.1 Inspector Binding
All atoms MUST allow their `content` tokens to be edited via the Inspector.
- **Mechanism:** `View.tsx` must render `props.name` if present, falling back to `SCHEMA.content.name.content`.
- **Validation:** Visual regression test should prove changing "Name" in Inspector updates the Node.

### 3.2 Port Presence
Nodes (except Headers) act as flow graph nodes.
- **Rendering:** `LensGraphView` handles port rendering (in/out dots).
- **Contract:** Atoms do not render their own ports, but must respect the bounding box expectations of the Canvas (e.g. 200px width).

## 4. Icon Asset Policy
**ABSOLUTE RULE:** Do not inline SVGs efficiently in `View.tsx`.
1.  Save icon to `apps/workbench/src/assets/{NAME}.{ext}`.
2.  Register in `apps/workbench/src/logic/AssetRegistry.ts`.
3.  Import in `exposed_tokens/schema.ts`.
4.  Use `SCHEMA.content.icon.src` in `View.tsx`.
