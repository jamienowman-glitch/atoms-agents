# UI Status Audit & Recovery Plan (Feb 1)

**Status**: 50% Complete ("The Steel is up, but the wiring is bad")

## 🚨 The Issue
While `ToolPill` dynamically pulls **Atoms** from the Registry, it still relies on **Hardcoded Logic** for **Categories**.

**Evidence (`ToolPill.tsx`):**
```typescript
// ❌ HARDCODED
if (catKey === 'copy') { Icon = CopyIcon; label = 'Copy'; }
if (catKey === 'media') { Icon = ImageIcon; label = 'Media'; }
```
**Impact:** If we add a new category (e.g., `motion`), `ToolPill` doesn't know what Icon or Label to use, defaulting to "Misc". This violates the "Zero-Touch" requirement.

---

## 🛠️ The Fix Plan: "Registry-First Architecture"

We must move the **Category Definitions** (Icons & Labels) out of the UI and into the Registry.

### Step 1: Upgrade Registry (`registry.ts` → `registry.tsx`)
We need to rename the file to `.tsx` so it can export React Components (Icons).
Then, we define the Categories explicitly.

```typescript
// canvases/multi21/registry.tsx

// 1. Move Icons Here
import { CopyIcon, ImageIcon, FeedsIcon, CTAIcon, MotionIcon } from '@assets/icons';

// 2. Define Categories (The Truth)
export const CATEGORY_REGISTRY = {
    copy: { id: 'copy', label: 'Copy', icon: CopyIcon },
    media: { id: 'media', label: 'Media', icon: ImageIcon },
    motion: { id: 'motion', label: 'Motion', icon: MotionIcon }, // ✅ New!
    // ...
};

// 3. Register Atoms (as before)
export const AVAILABLE_ATOMS = [ ... ];
```

### Step 2: Lobotomize ToolPill (`ToolPill.tsx`)
Remove all `if/else` mapping logic. The `ToolPill` becomes a dumb renderer.

```typescript
// ❌ REMOVE THIS:
// const getDynamicCategories = () => { ... if (cat === 'copy') ... }

// ✅ REPLACE WITH:
import { CATEGORY_REGISTRY, AVAILABLE_ATOMS } from '...registry';

// Render Loop
Object.values(CATEGORY_REGISTRY).map(cat => (
   <button icon={cat.icon} label={cat.label} />
))
```

### Step 3: Verify
- Add `motion` category to Registry.
- Verify "running man" icon appears in `ToolPill` **without editing ToolPill.tsx**.

---

## ⏱️ Execution Order
1.  **Rename Registry**: `registry.ts` → `registry.tsx`.
2.  **Migrate Icons**: Move SVGs from `ToolPill.tsx` to `registry.tsx` (or `icons.tsx`).
3.  **Define Hierarchy**: Export `CATEGORY_REGISTRY`.
4.  **Rewrite ToolPill**: Delete the hardcoded mapping function.
