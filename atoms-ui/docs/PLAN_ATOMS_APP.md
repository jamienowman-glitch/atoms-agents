# Atomic Plan: Atoms App Setup

**Objective**: Initialize the Console Shell (`atoms-app`).

## Phase 1: Skeleton
- [ ] **Initialize**: Create `package.json`, `tsconfig.json`.
- [ ] **Dependencies**: Install `next`, `react`, `react-dom`.
- [ ] **Config**: Setup `next.config.mjs` (ESM) to allow transpiling `atoms-ui`.

## Phase 2: The Forge Route
- [ ] **Create `src/app/forge/page.tsx`**:
    -   Import `atoms-ui/canvases/forge/ForgeCanvas`.
    -   Wrap in `ToolControlProvider`.

## Phase 3: Verification
- [ ] **Build**: Run `npm run dev`.
- [ ] **Check**: Visit `localhost:3001/forge`.
