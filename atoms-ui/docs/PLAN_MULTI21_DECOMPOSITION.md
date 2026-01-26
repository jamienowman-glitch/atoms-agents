# Atomic Plan: Multi21 Decomposition

**Objective**: Break `Multi21.tsx` into constituent Atoms and Engines.

## Phase 1: Logic Extraction (The Engines)
- [ ] **Create `useVarioEngine.ts`**:
    -   Extract the logic from `Multi21.tsx` (lines 242-288).
    -   Export a hook/function that returns `{ style, className }`.
- [ ] **Create `useFeedMapper.ts`**:
    -   Extract the `useMemo` feed logic (lines 197-229).
    -   Ensure it returns `Multi21Item[]`.

## Phase 2: The Atom (The Tile)
- [ ] **Create `Multi21_Tile.tsx`**:
    -   Extract the massive `.map` render return (lines 601-732).
    -   Define strict `Multi21TileProps`.
    -   Replace `item.variant` logic with simple props.

## Phase 3: The Molecule (The Grid)
- [ ] **Create `Multi21_Grid.tsx`**:
    -   This replaces the "Shell" of `Multi21.tsx`.
    -   It accepts `items: Multi21Item[]`.
    -   It maps items to `<Multi21_Tile />`.
    -   It sets the CSS Grid variables on the container.

## Phase 4: Wiring
- [ ] **Update `ConnectedBlock.tsx`**:
    -   Import `Multi21_Grid`, `useFeedMapper`, `useVarioEngine`.
    -   Compose them together.
    -   This effectively deletes the old `Multi21.tsx`.

## Phase 5: Verification
- [ ] **Verify**:
    -   Check Grid still renders.
    -   Check Vario fonts still work (Controllers -> Engine -> Atom).
    -   Check Feeds still load.
