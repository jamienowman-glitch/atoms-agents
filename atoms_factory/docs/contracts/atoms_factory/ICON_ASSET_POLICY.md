# Icon Asset Policy

**Authority:** Atoms Factory
**Scope:** All Icon Assets used in Atoms

## 1. Storage Location
All icon assets (PNG, JPG, SVG) MUST be stored in:
`apps/workbench/src/assets/`

**Naming Convention:**
`UPPER_SNAKE_CASE_COLOR.ext`
Example: `AGENT_STREETWEAR_BLACK.png`

## 2. Registration
All icons must be registered in the singleton `AssetRegistry`.
**File:** `apps/workbench/src/logic/AssetRegistry.ts`

```typescript
import MyIcon from '../assets/MY_ICON.png';

export const AssetRegistry = {
    icons: {
        my_icon_key: MyIcon
    }
};
```

## 3. Reference in Atoms
Atoms must NEVER import from `../assets` directly.
Atoms must ALWAYS import `AssetRegistry`.

**Correct:**
```typescript
import { AssetRegistry } from '../../../../apps/workbench/src/logic/AssetRegistry';
// ...
src: AssetRegistry.icons.my_icon_key
```

**Incorrect:**
```typescript
import MyIcon from '../../assets/MY_ICON.png'; // FORBIDDEN
```

## 4. Rationale
1.  **Deduplication:** Prevents multiple atoms from bundling the same image file.
2.  **Swapability:** Allows global theme replacement by changing the Registry mapping.
3.  **Refactoring:** Moving an asset only requires updating the Registry, not 50 atoms.
