# Atomic Plan: Multi21 Migration

**Objective:** Lift `Multi21` from `agentflow` to `atoms-ui/canvases/multi21`.

## Phase 1: Setup & Definition
- [ ] **Create Directory Structure**: `packages/atoms-ui/canvases/multi21/{blocks,types}`.
- [ ] **Lift Tool Registry**: Copy `agentflow/lib/multi21/tool-registry.ts` to `atoms-ui/canvases/multi21/tool-registry.ts`.
- [ ] **Lift Types**: Extract interfaces from `Multi21.tsx` and `Multi21Designer.tsx` into `types.ts`.

## Phase 2: The Blocks (Leaf Nodes)
- [ ] **Lift ConnectedBlock**: Move `ConnectedBlock.tsx` and its children (`NodeViews`) to `blocks/`.
- [ ] **Lift Leaf Components**: Move `VideoThumb`, `Multi21_Text`, `Multi21_CTA` etc.
- [ ] **Refactor Imports**: Update internal imports to relative paths.

## Phase 3: The Renderer (Stateless)
- [ ] **Lift Multi21.tsx**: Move to `atoms-ui/canvases/multi21/Multi21Renderer.tsx`.
- [ ] **Refactor Props**: Ensure it accepts the "Hydrated" props from the specific tool keys.

## Phase 4: The Canvas (Stateful)
- [ ] **Lift Multi21Designer.tsx**: Move to `atoms-ui/canvases/multi21/Multi21Canvas.tsx`.
- [ ] **Strip Shell**: Remove `<BottomControlsPanel>`, `<HiddenAttributionFields>`, and `<DesktopPanelSystem>`.
- [ ] **Wire Harness**:
    -   Replace `useToolControl` import to `@/harness/ToolControlProvider`.
    -   Ensure `useToolState` hooks match the registry keys.

## Phase 5: Wiring & Verification
- [ ] **Export**: Update `atoms-ui/index.ts` to export `Multi21Canvas`.
- [ ] **Update Demo**: Modify `app/harness-demo/page.tsx` to import the *Real* `Multi21Canvas` instead of the placeholder.
- [ ] **Verify**:
    -   Launch Demo (`npm run dev`).
    -   Test Sliders (Harness) -> Grid (Canvas).
    -   Test Drag & Drop.

## Phase 6 (Future): Stigma
- [ ] Duplicate structure for `stigma`.
