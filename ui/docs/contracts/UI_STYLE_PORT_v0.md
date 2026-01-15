# UI Style Port Contract v0

**Source of Truth**: `agentflow` (mockup/dev repo)
**Target**: `ui/apps/studio` (northstar-ui)

## absolutes
1.  **No Local State**: Logic flow must use Engines Catalog/Feeds. No mock items.
2.  **Exact Match**: Styling must reproduce the "Designer" look found in `agentflow`.

## Style System ("The Designer Look")

### Buttons & Controls
- **Shape**: "Square-ish" but not sharp. Use `rounded` (4px).
- **Typography**: `text-xs`, `font-semibold`, `uppercase` (for labels) or `capitalize` (for options).
- **Size**: `px-2 py-1` (Compact).
- **Colors (Light)**:
    - Background: `bg-neutral-100` (Container/Group).
    - Item (Inactive): `text-neutral-500`.
    - Item (Active): `bg-white text-neutral-900 shadow-sm`.
    - Hover: `hover:text-neutral-700`.
- **Colors (Dark)**:
    - Background: `dark:bg-neutral-800`.
    - Item (Inactive): `dark:text-neutral-500`.
    - Item (Active): `dark:bg-neutral-700 dark:text-neutral-100`.

### Containers (ChatRail/Toolpop)
- **Background**: `bg-white` / `dark:bg-neutral-900`.
- **Border**: `border-neutral-200` / `dark:border-neutral-800`.
- **Radius**: Large containers `rounded-xl` or `rounded-2xl` (12px-16px).
- **Shadow**: `shadow-md` or `shadow-2xl`.

### Typography
- **Family**: `Roboto Flex` (`var(--font-roboto-flex)`).
- **Base**: `text-sm` or `text-xs` for tools.

## Implementation Strategy
1.  **UI Kit**: Create `src/ui_kit/button.css` implementing `.sq-btn` class abstraction of the above Tailwind rules.
2.  **Porting**:
    - `ChatRail`: Replace `.ChatRail-control-btn` with `.sq-btn` (or `.sq-icon-btn` with same dims).
    - `Toolpop`: Replace inline styles with `.sq-btn`.
    - `Multi21`: Ensure it matches `Multi21Designer.tsx` rendering.
