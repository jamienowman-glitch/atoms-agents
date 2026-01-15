
# CapCut-Lite UI

A dark, React-based video editor with auto-render capabilities.

## Setup

1. **Start Backend**:
   ```bash
   # From root of northstar-muscle-demos
   python main.py
   ```
   (Example port: 8020)

2. **Start Frontend**:
   ```bash
   cd capcut_demo/ui
   npm install
   npm run dev
   ```
   (Example port: 3002)

## Usage

1. **Open** `http://localhost:3002`.
2. **Upload** a video file (e.g. `examples/dummy.mp4`) using the sidebar "Upload" button.
3. **Select** the uploaded video from the list.
4. **Interact**:
    - **Drag-and-Drop**: Drag clips from the Asset Sidebar directly into the Timeline Track.
    - Drag the **timeline handles** to trim the clip.
    - Change the **Render Profile** dropdown (Social 4:3, YouTube, etc.).
    - Every change triggers an **Auto-Render** (debounced by ~1 second).
    - A spinner will appear over the video player while rendering.
    - Once finished, the new video will play automatically.

## Notes & Limitations

- **Debounce**: Edits are applied 1s after you stop dragging.
- **Backend**: Uses file-system persistence in `data/`.
- **Performance**: Rendering time depends on FFmpeg and your CPU.

## Verification
![Browser Verification](file:///Users/jaynowman/.gemini/antigravity/brain/641235fb-c5d8-4977-8319-76cb5d98e88d/capcut_lite_demo_view_1767184574334.webp)
![Advanced Features Verification](file:///Users/jaynowman/.gemini/antigravity/brain/641235fb-c5d8-4977-8319-76cb5d98e88d/advanced_features_verification_1767185176787.webp)
![Multi-Clip Verification](file:///Users/jaynowman/.gemini/antigravity/brain/641235fb-c5d8-4977-8319-76cb5d98e88d/multiclip_verification_1767209532582.webp)
