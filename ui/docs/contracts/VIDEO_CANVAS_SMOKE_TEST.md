# Video Canvas Smoke Test

**Goal**: Verify the `/labs/video-canvas` implementation works as intended.

## 1. Access
1.  Navigate to `http://localhost:3000/labs/video-canvas`.
2.  **Verify**: You see a black screen with "Video Canvas" header.
3.  **Verify**: Layout is split (Preview Top, Timeline Bottom).

## 2. Upload & Timeline
1.  Click **+ Media** in the tool strip.
2.  Select a local video file (e.g., `test.mp4`).
3.  **Verify**: A new blue clip appears on `v1` track.
4.  **Verify**: Preview shows "Preview: Main Sequence".

## 3. Selection & Tools
1.  Click the blue clip on the timeline.
2.  **Verify**: Clip turns blue (selected) with white border.
3.  **Verify**: "**✂ Split**" button becomes enabled.
4.  **Verify**: Speed buttons (0.5x, 1.0x, 2.0x) appear in tool strip.

## 4. Editing (Mock)
1.  Click **✂ Split**.
2.  **Verify**: The clip splits into two parts (visually).
3.  Click **2.0x** speed.
4.  **Verify**: The speed text on the selected clip changes to `(2.0x)`.

## 5. Export
1.  Click **EXPORT**.
2.  **Verify**: Check browser console for `POST /video_render/jobs`.
3.  **Verify**: Since back-end is likely unreachable, it should log "Export failed (Engine unreachable)" but arguably show success mock.

## 6. Isolation Check
1.  Navigate back to `/`.
2.  **Verify**: You see the standard Northstar Builder (Canvas/Sidebar).
3.  **Verify**: No remnants of Video Canvas are visible.
