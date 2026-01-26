# Tech Spec: Multi21 Decomposition

## Objective
Decouple the "Tiled Block" from the heavy "Engines" (Feed Logic, Typography Logic) currently collapsed inside `Multi21.tsx`. The goal is to have pure, dumb UI Atoms and separate, testable Engine logic.

## 1. The Separation
We will explode `Multi21.tsx` into four distinct layers:

### A. The Global Engines (`atoms-ui/hooks`)
1.  **`useVarioEngine.ts`**:
    -   *Level*: **Package Global** (Harness Level).
    -   *Input*: Font family index, weight, width, slant, casual, etc.
    -   *Output*: CSS `font-variation-settings` string and resolved font-family name.
    -   *Reason*: **Universal Typography**. All Canvases (Multi21, Stigma) MUST use the exact same logic.

### B. The Canvas Logic (`canvases/multi21/logic`)
1.  **`useFeedMapper.ts`**:
    -   *Input*: `feedSource`, `feedLimit`.
    -   *Output*: Normalized `Multi21Item[]`.
    -   *Note*: Placeholder for future Backend Feed System.

### C. The Atom (`Multi21_Tile.tsx`)
A single, pure UI component.
-   **`Multi21_Tile.tsx`**:
    -   Renders **ONE** card.
    -   Props: `image`, `title`, `meta`, `badge`, `variant`.
    -   *Dumb*: Does not know about feeds or grids. It just renders what it's given.

### C. The Molecule (`Multi21_Grid.tsx`)
The Grid Container.
-   **`Multi21_Grid.tsx`**:
    -   Renders the `<div>` with `display: grid`.
    -   Accepts `items[]` (already mapped).
    -   Loops over items and renders `<Multi21_Tile />`.
    -   Handles CSS Grid Variables (Columns, Gaps).

### D. The Controller (`ConnectedGrid.tsx`)
The specific implementation that wires it all together.
-   **`ConnectedGrid.tsx`** (formerly `ConnectedBlock` logic for media):
    -   Calls `useToolState` (Harness).
    -   Calls `useFeedMapper` (Data).
    -   Calls `useVarioEngine` (Styles).
    -   Passes final data to `<Multi21_Grid />`.

## 2. Directory Structure
```text
atoms-ui/canvases/multi21/
├── blocks/
│   ├── atoms/
│   │   ├── Multi21_Tile.tsx      # [NEW] Pure Tile Component
│   │   ├── Multi21_CTA.tsx       # Pure CTA
│   │   └── ...
│   ├── molecules/
│   │   └── Multi21_Grid.tsx      # [NEW] Pure Grid Container (No Feed Logic)
│   └── logic/
│       ├── useVarioEngine.ts     # [NEW] Typography Logic
│       └── useFeedMapper.ts      # [NEW] Data Logic
└── ...
```

## 3. Benefits
-   **Atomic**: `Multi21_Tile` can be used anywhere, even outside a grid (e.g. in a spotlight).
-   **Clean**: No "Giant Component" doing data fetching + styling + rendering.
-   **Testable**: You can unit test `useVarioEngine` without rendering React components.
