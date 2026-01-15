# Video Canvas: Muscle Catalog & UX Contract

**Goal**: Inventory all relevant muscle engines and define their "Real World Editor" usage.
**Principle**: No "weird shit". Map every engine to standard UI patterns found in tools like Premiere, Resolve, or CapCut.

---

## 1. Video Enhancements (Clip Level)
These engines process specific clips.
**UI Pattern**: Select Clip -> Inspector -> "Video" Tab -> Effect Toggle/Settings.

| Engine | Feature Name | UX Flow | Token Data |
| :--- | :--- | :--- | :--- |
| `video_stabilise` | **Stabilize** | Toggle "Stabilize". Slider for "Smoothness" (0-100). | `clip.effects = [{ type: 'stabilize', strength: 0.8 }]` |
| `video_slowmo` | **Optical Flow** | Speed Change < 1.0x triggers dropdown: "Frame Sampling" vs "Optical Flow". | `clip.speed_mode = 'optical_flow'` |
| `video_mask` | **Remove Background** | Toggle "Remove Background". Spinner appears while processing mask. | `clip.effects = [{ type: 'mask_bg' }]` |
| `video_focus_automation`| **Auto Focus** | Toggle "Simulate Depth". Pick "Focus Point" on preview. | `clip.effects = [{ type: 'dof', point: [x,y] }]` |
| `video_anonymise` | **Blur Faces** | Toggle "Blur Faces". | `clip.effects = [{ type: 'blur_faces' }]` |
| `video_regions` | **Smart Crop** | Changing Project Aspect Ratio (e.g. 16:9 to 9:16) triggers "Smart Reframe" toast. | `clip.transform = { crop: 'smart', ratio: '9:16' }` |

## 2. Audio Intelligence (Track/Asset Level)
These engines process audio streams.
**UI Pattern**: Right-click Audio Clip -> "Audio Actions" OR Inspector -> "Audio" Tab.

| Engine | Feature Name | UX Flow | Token Data |
| :--- | :--- | :--- | :--- |
| `audio_separation` | **Extract Stems** | Right-click -> "Split into Stems". Replaces 1 clip with 4 tracks (Vocals, Drums, Bass, Other). | *Generates new Assets & Tracks* |
| `audio_voice_enhance` | **Enhance Speech** | Toggle "Enhance Speech" (Adobe Podcast style). Slider for "Mix". | `clip.audio_effects = [{ type: 'voice_enhance', mix: 1.0 }]` |
| `audio_harmony` | **Auto Harmony** | Right-click Vocal Clip -> "Generate Harmony". Creates new track underneath. | *Generates new Assets & Tracks* |
| `audio_normalise` | **Loudness** | Inspector -> Volume -> "Auto Level". | `clip.gain = 'auto'` |
| `audio_semantic_timeline`| **Show Structure** | View Options -> "Show Song Sections" (Bars/Beats/Chorus markers on clip). | *UI Overlay only (Metadata)* |

## 3. Typography & Subtitles (Track Generator)
These engines generate text content.
**UI Pattern**: Timeline Toolbar -> "Text" or "Captions".

| Engine | Feature Name | UX Flow | Token Data |
| :--- | :--- | :--- | :--- |
| `video_captions` | **Auto Captions** | Click "Captions" -> "Create from Audio". Generates a Subtitle Track. | *Generates Sequence of Caption Clips* |
| `video_text` | **Text Overlay** | Drag "Text" tool to Preview. Type text. Inspector for Font/Color. | `clip.type = 'text', clip.content = 'Hello'` |
| `typography_core` | **Text Layout** | *Internal dependency of `video_text`* (Handles wrapping/kerning). | N/A |

## 4. Visual Overlays (Metadata)
**UI Pattern**: View Options -> "Overlays".

| Engine | Feature Name | UX Flow | Token Data |
| :--- | :--- | :--- | :--- |
| `video_visual_meta` | **Telemetry** | Drag "Data Overlay" to track. Link to GPS/Speed source. | `clip.type = 'overlay', clip.source = 'gps'` |
| `cad_viewer` | **CAD Model** | Drag .GLB/.STL to timeline. Renders 3D view. | `clip.type = '3d_model'` |

## 5. Render & Export (Output)
**UI Pattern**: Export Button -> Settings Dialog.

| Engine | Feature Name | UX Flow | Token Data |
| :--- | :--- | :--- | :--- |
| `video_render` | **Export** | The main render engine. | N/A |
| `video_batch_render` | **Queue** | "Add to Queue" instead of "Export Now". | *Job ID* |
| `video_preview` | **Proxies** | Settings -> "Performance" -> "Use Proxies". (Background transcode). | *Local Settings* |

---

## Implementation Priority
1.  **Core** (Done): Timeline, Cut, Upload, Render.
2.  **Tier 1 AI** (High Value): `video_captions`, `video_stabilise`, `audio_voice_enhance`.
3.  **Tier 2 Creative**: `video_mask` (Green Screen), `audio_separation`.
4.  **Tier 3 Utility**: `video_batch_render`, `video_regions`.
