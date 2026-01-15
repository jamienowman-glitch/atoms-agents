# HANDOVER: Multi-21 Porting

**Status**: implementation Complete. Verification Interrupted.

## 1. How to Test
1.  Run `npm run dev` in `northstar-ui`.
2.  Open Builder (http://localhost:3000).
3.  Insert a "Feed" block (or "Multi-21").
4.  **Expected**:
    -   If backend is running: You see square/video tiles fetched from `/feeds`.
    -   If backend is off: You see `⚠️ Feed Unavailable` (Red box). **NO MOCKS**.
5.  **Controls**:
    -   Click the block.
    -   Use the "Desktop Span" / "Mobile Span" sliders.
    -   Toggle "Variant" (Generic/Product/KPI/Text).

## 2. Component Locations (New)
-   **Renderer**: `packages/ui-atoms/src/components/Multi21/Multi21Renderer.tsx`
    -   *Source*: Ported from `agentflow/Multi21.tsx`.
    -   *Styling*: Uses `aspect-video` (default), `rounded` (4px/8px), `group-hover` effects.
-   **Controls**: `packages/ui-atoms/src/components/Multi21/Multi21Controls.tsx`
    -   *Source*: Ported from `agentflow/Multi21Block.tsx`.
    -   *Styling*: Uses `ui_kit` (`.sq-btn`, native inputs).
-   **Container**: `packages/ui-atoms/src/components/Multi21FeedBlock.tsx`
    -   *Logic*: Wires Renderer + Controls. Fetches data. Handles errors.

## 3. Wiring Status
-   **Tokens**: Wired to `properties['tile.cols_desktop']`, `['tile.variant']`, etc.
-   **Data**: Uses `fetch('/feeds/...')`.
    -   *Gap*: Not yet using a formal `FeedClient` from context (hardcoded fetch for now).
-   **Events**: `onUpdateToken` flows from Controls -> Container -> Prop.

## 4. Risks / Known Breakpoints
-   **Backend Dependency**: Because we strictly removed mocks, if the Engines API is down or CORS fails, the block looks broken (red error). This is intentional but jarring for pure UI devs.
-   **CSS Vars**: The grid relies on CSS variables `var(--cols-desktop)` injected via style props. Ensure strict CSP doesn't block inline styles.

## 5. Instructions for Next Agent
-   [ ] **Load This Version First**: Do not revert to `ui-atoms` vOld. This is the visual source of truth.
-   [ ] **Confirm Visuals**: Check the "Beautiful Squares" and slider feel against /dev before touching logic.
-   [ ] **Token Safety**: Do NOT rename `tile.cols_desktop` etc. These are standard.
-   [ ] **No Registries**: Do not add a `feed_registry.ts` or local JSON. Fix the `fetch` to use the Agent Driver client if needed.
-   [ ] **Do Not Restyle**: The CSS in `Multi21Renderer` is a direct port. Don't "fix" it unless it's broken.
