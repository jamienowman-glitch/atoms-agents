# Atoms Factory Reality Map

**Last Updated:** 2026-01-09
**Scope:** `atoms_factory` repo (Key Atoms & Workbench)

## 1. Atom Definition Structure
Atoms in this repo follow a strict directory-based structure: `atoms/aitom_family/{atom_name}/`

| Component | File Path | Purpose |
| :--- | :--- | :--- |
| **Props Interface** | `data_schema/props.ts` | Defines the TypeScript interface for runtime props passed to the View. |
| **Token Schema** | `exposed_tokens/schema.ts` | Defines build-time configuration, default styles, content placeholders, and asset references. |
| **Render View** | `views/View.tsx` | The React component responsible for rendering the atom. Imports `SCHEMA` for defaults. |
| **Inspector Config** | `exposed_tokens/schema.ts` | The `SCHEMA` object implicitly defines what is editable in the inspector (content, style). |

### Example Pattern (`agent_node`)
```typescript
// known reality
export const SCHEMA = {
    meta: { atom_kind: 'agent_node', version: '1.0.0' },
    content: {
        agent_name: { content: 'Agent Name', placeholder: '...' },
        icon: { src: AssetRegistry.icons.northstar_agent }
    },
    style: { ... }
};
```

## 2. Token Exposure Mechanism
Simplicity is the rule. Tokens are exposed by defining them in the `SCHEMA` constant.
- **Controls Generation:** The `TokenEditor` (Inspector) iterates over keys in `SCHEMA.content` and `SCHEMA.style` to generate inputs.
- **Binding:** `View.tsx` reads `SCHEMA.content.x.content` as default, but allows overrides via `props`.

## 3. Icon & Asset Mechanism
Icons are **centralized** and **deterministic**.
- **Registry:** `apps/workbench/src/logic/AssetRegistry.ts`
- **Storage:** `apps/workbench/src/assets/`
- **Reference:** Atoms import `AssetRegistry` and reference `AssetRegistry.icons.{name}`.
- **Constraint:** Atoms do **NOT** have local asset folders. All assets are lifted to the app level registry to ensure deduplication.

## 4. Canvas Rendering System
The "Workbench" application serves as the testbed and renderer.
- **Component:** `apps/workbench/src/components/LensGraphView.tsx`
- **State Logic:** `apps/workbench/src/logic/LensRegistry.ts` (Simple in-memory graph state).
- **Interactions:**
    - **Drag & Drop:** Toolbar items -> Canvas.
    - **Pan & Zoom:** Standard transformation matrix.
    - **Selection:** `selectedNodeId` state drives the Inspector.

## 5. Constraints & Pitfalls
- **No Hot-Swapping:** `AssetRegistry` is a static TS file; adding an icon requires a code change and rebuild.
- **Manual Prop Sync:** `data_schema/props.ts` must manually match the keys expected by `View.tsx`.
- **Builder Coupling:** The Workbench UI (`LensGraphView`) hardcodes imports for specific node views (`AgentNodeView`, etc.). Ideally, this should be a dynamic registry.
