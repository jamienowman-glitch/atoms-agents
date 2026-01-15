# Northstar Muscle Inventory & Gaps

**Status**: Deep Reckoning
**Focus**: Video, Audio, CAD, 3D, Illustrator, Photoshop.
**Ignored**: BBK.

---

## 1. The Strong Muscle 💪
These engines are rigorously implemented and ready for heavy lifting.

### 🎥 Video
**Status**: ✅ **Complete**
-   **Core**: `engines/video_render`, `engines/video_timeline`
-   **Features**: `video_multicam` (13 items), `video_mask`, `video_captions`, `video_stabilise`, `video_360`, `video_slowmo`.
-   **Verdict**: Production-grade video pipeline.

### 🎵 Audio
**Status**: ✅ **Complete**
-   **Core**: `engines/audio_service`, `engines/audio_core`
-   **Features**: `audio_separation` (stems), `audio_voice_enhance`, `audio_harmony`, `audio_fx_chain`, `audio_mix_buses`.
-   **Verdict**: Full DAW capabilities (VST-like chains, mixing).

### 🏗️ 3D & CAD
**Status**: ✅ **Complete**
-   **Core**: `engines/scene_engine` (120+ files), `engines/solid_kernel`.
-   **Features**:
    -   **Parametric Sketching**: `engines/scene_engine/sketch` (Constraint solver).
    -   **B-Rep Solids**: `engines/solid_kernel` (Boolean ops, extrusions).
    -   **Scene Graph**: `engines/scene_engine/core` (Hierarchy, transforms).
    -   **BOM/Costing**: `engines/muscle/boq_costing`, `engines/muscle/boq_quantities`.
-   **Verdict**: A serious CAD kernel capable of parametric modeling.

---

## 2. The Gaps (Weak Muscle) 🥀
These engines are skeletal or missing, despite being critical for the "Adobe Killer" vision.

### 🎨 Illustrator Style (Vector Design)
**Status**: ⚠️ **Partial / Fragmented**
-   **Constraint Solver**: ✅ `engines/scene_engine/sketch` exists.
-   **Typography**: ⚠️ `engines/typography_core` exists but looks thin.
-   **Design System**: ❌ `engines/design` is almost empty.
-   **Gap**: We have the *math* (solver), but not the *art* (brushes, complex strokes, vector effects). It's a CAD sketcher, not yet an Illustrator replacement.

### 🖼️ Photoshop Style (Raster Editing)
**Status**: ❌ **Major Gap**
-   **Image Core**: `engines/image_core` is currently empty.
-   **Media V2**: `engines/media_v2` is currently empty.
-   **Missing**:
    -   **Layer Compositing**: No engine for blending modes, masking, adjustment layers.
    -   **Pixel Manipulation**: No filters (blur, sharpen, curves) engine found.
    -   **In-painting/Out-painting**: No dedicated AI image editing pipeline found (standard diffusers might be hidden in `connectors`).
-   **Verdict**: We have **NO Photoshop Muscle**.

### 💅 Style & Theme
**Status**: ⚠️ **Weak**
-   **Scene Style**: `engines/scene_engine/style/theme.py` exists but is basic.
-   **Gap**: No centralized "Style Engine" that can apply a visual language (Bauhaus, Cyberpunk) across Audio, Video, and UI simultaneously.

---

## 3. The "To-Build" List
To complete the suite:
1.  **Pixel Muscle**: Build `engines/muscle/pixel_engine` (Rust/OpenCV/PIL based compositing).
2.  **Vector Art Muscle**: Extend `sketch` into `vector_art_engine` (Brushes, SVG effects).
3.  **Style Harmonizer**: A meta-engine ensuring the Video Cuts match the Music Beat and the Font Choice.
