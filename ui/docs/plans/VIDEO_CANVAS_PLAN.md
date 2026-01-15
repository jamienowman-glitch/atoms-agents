# Video Canvas Implementation Plan

**Goal**: Implement a mobile-first, muscle-backed Video Canvas in `/labs/video-canvas` without touching existing canvases.
**Principles**: Isolation, Real Engines, Token-Based State, Mobile-First.

---

## 🏗️ Phase 1: Repo & Muscle Discovery
1.  **Inspect UI Structure**: Understand where to place `video-canvas` (likely `packages/ui/src/labs/video-canvas`).
2.  **Engine Connector Check**: Verify if clients for `video_render`, `video_timeline`, `media_v2` exist or need to be created in the UI repo.

## 🧱 Phase 2: Token Model & State (`videoCanvasState`)
1.  **Define Tokens**: Create `videoCanvasTokens.ts` exporting:
    -   `VideoProjectToken`
    -   `VideoSequenceToken`
    -   `VideoTrackToken`
    -   `VideoClipToken`
    -   `VideoSelectionToken`
2.  **State Store**: Create a Zustand or Context store (`VideoCanvasStore`) to manage these tokens and handle `VideoSelectionToken`.
3.  **Engine Mapper**: Utilities to map UI Tokens <-> Engine Schemas.

## 📱 Phase 3: Surfaces & Layout (Mobile First)
1.  **Route Setup**: Register `/labs/video-canvas` in the main router.
2.  **Container**: `VideoCanvasLayout` (Mobile: Preview Top / Timeline Bottom).
    -   `VideoPreviewSurface`
    -   `VideoTimelineSurface`
    -   `VideoToolsSurface` (Floating/Panel)

## 🔌 Phase 4: Muscle Wiring (The "Real" Stuff)
1.  **Upload Tool**:
    -   UI: File Input.
    -   Action: POST to `media_v2`.
    -   Update: Add asset to local library.
2.  **Timeline Logic**:
    -   **Add**: Insert clip at playhead.
    -   **Split**: Calculate time, call `video_timeline` split, update tokens.
    -   **Trim**: Drag handles, update `trimIn/Out`, sync to engine.
    -   **Move**: Drag clip, update `startMs`, sync to engine.
3.  **Speed Tool**:
    -   UI: 0.25x - 2x selector.
    -   Action: Update `VideoClipToken.speed`.
4.  **Export**:
    -   UI: Export Button.
    -   Action: Call `video_render` with project/sequence ID.
    -   Result: Poll/Wait for MP4 link.

## 🧪 Phase 5: Verification
1.  **Smoke Test**: Manual walk-through of the flow.
2.  **Missing Muscle Report**: Create `docs/VIDEO_CANVAS_MISSING_MUSCLE.md` if any engine gaps are blocked.
3.  **Contract**: Publish `docs/VIDEO_CANVAS_CONTRACT.md`.

## Directory Structure (Proposed)
```text
packages/ui/src/
  labs/
    video-canvas/
      components/
        VideoPreview.tsx
        VideoTimeline.tsx
        VideoTools.tsx
      hooks/
        useVideoCanvasStore.ts
      services/
        engineClient.ts
      types/
        videoCanvasTokens.ts
      VideoCanvasPage.tsx
```
