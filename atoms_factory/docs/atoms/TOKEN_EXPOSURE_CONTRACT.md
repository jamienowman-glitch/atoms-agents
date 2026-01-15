# Token Exposure Contract

**Authority**: Atoms Factory & Workbench Inspector

## 1. Schema Structure (`schema.ts`)

Every atom exports a `SCHEMA` object defining allowed properties.
Structure must be flat-ish, grouped by standard categories.

```typescript
export const SCHEMA = {
    meta: { atom_kind: '...', version: '1.0.0' },
    content: { ... },    // Text, Images
    typography: { ... }, // Fonts, Sizes
    color: { ... },      // Backgrounds, Borders
    layout: { ... },     // Flex/Grid props
    // ...
};
```

## 2. Standard Token Types

The Workbench Inspector allows specific controls. Agents must use these types in `SCHEMA` (implied or explicit):

| Field Type | UI Control | Example Value |
| :--- | :--- | :--- |
| `text` | Text Input | `"Click me"` |
| `color` | Color Picker | `"#FF0000"` or `"rgba(...)"` |
| `number` | Stepper / Slider | `16` |
| `select` | Dropdown | `"solid"` (requires `options` list in schema metadata ideally, or inferred) |
| `boolean` | Toggle | `true` |
| `measurement` | Unit Input | `"16px"`, `"1.5rem"` |

## 3. Option Sources (Selects)

For fields requiring dropdowns (e.g., `font_family`, `border_style`), the options are:

*   **Static**: Defined in `SCHEMA` constraints (not fully implemented yet, need `options: []`).
*   **System**: (Future) Fonts, Shadows provided by Registry.

## 4. Defaults (`default.ts`)

Every atom must export `DEFAULTS` matching the `SCHEMA` shape.
This is the "Initial State" when dragging an atom onto the canvas.

## 5. Persistence (Current vs Future)

*   **Current**: `JSON Export` (Offline). State is transient in React.
*   **Future**: `routed_store`. The schema and instance data will be saved to a backend.
    *   `Schema` -> `ComponentRegistry`
    *   `Instance` -> `SceneStore` / `ContentStore`
