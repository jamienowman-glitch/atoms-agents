# Atomic Task Plan: The Export Muscle (Universal Format Engine)

> **Objective**: Build a single, stateless Muscle (`muscle_export_universal`) that accepts a Canvas JSON and outputs 16+ standard file formats.
> **Standard**: Must follow `Universal Export Protocol v1.0`.

## 📦 Phase 1: The Skeleton & Protocol
**Goal**: Create the container and the interface.
- [ ] **Scaffold**: Run `create-muscle` skill to generate `src/atoms_muscle/export/universal`.
- [ ] **Dependencies**: Add `Pillow` (Images), `reportlab` (PDF), `python-pptx` (PPTX), `openpyxl` (XLS), `python-docx` (DOC), `pandas` (CSV), `dicttoxml` (XML).
- [ ] **The Protocol**: Implement `ExportJob` Pydantic model in `models.py` matching the `Universal Export Protocol`.
- [ ] **The Router**: Create `service.py` with a `switch` statement on `target_format`.

## 🎨 Phase 2: The Visual Engine (Images & PDF)
**Goal**: High-fidelity visual exports.
- [ ] **PNG (Transparent)**: Implement `ImageEngine`. Use Pillow. Ensure `RGBA` mode is preserved.
- [ ] **JPEG**: Implement `ImageEngine`. Flatten alpha to White/Black (configurable). High quality.
- [ ] **PDF (Multi-Page)**: Implement `PdfEngine`.
    *   **Logic**: If Canvas has "Scenes" or "Slides", map 1 Scene = 1 Page.
    *   **Vector Support**: Try to draw primitives as vectors, not just dumping a PNG into a PDF.
- [ ] **SVG (Bonus)**: Pure vector export.

## 💼 Phase 3: The Office & Data Engine
**Goal**: Editable documents for business.
- [ ] **PPTX (PowerPoint)**: Implement `OfficeEngine`.
    *   **Logic**: Map Canvas Background -> Slide Master. Map Text Atoms -> TextBoxes.
- [ ] **DOC (Word)**: Implement `OfficeEngine`. Linearize the canvas content (Top -> Bottom).
- [ ] **XLS/CSV (Data)**: Implement `DataEngine`.
    *   **Logic**: Extract "Table Atoms" or just dump the Atom Properties list if no tables exist.

## 📝 Phase 4: The Text Engine (Structured & Flat)
**Goal**: Clean text exports for coding and processing.
- [ ] **XML**: Implement `TextEngine`.
    *   **Logic**: Serialize the Atom Tree into semantic XML nodes (`<text>`, `<image>`).
- [ ] **TXT**: Implement `TextEngine`.
    *   **Logic**: Flatten all text content into a single readable file. Ignore images.
- [ ] **MD (Markdown)**: Implement `TextEngine`.
    *   **Logic**: Convert Text Atoms to Markdown headers (`#`), bullet points (`-`), and links `[]()`.

## 🌐 Phase 5: The Web Engine (Frontend Code)
**Goal**: Ready-to-use web assets.
- [ ] **HTML**: Implement `WebEngine`.
    *   **Logic**: Output a clean `<div>` structure with inline styles or classes.
- [ ] **TSX (React)**: Implement `WebEngine`.
    *   **Logic**: Wrap atoms in functional components (e.g., `<Card title="...">`).
- [ ] **CSS**: Implement `WebEngine`.
    *   **Logic**: Extract all style tokens (colors, fonts, layout) into a `.css` file.
- [ ] **JSON**: Implement `WebEngine`.
    *   **Logic**: Clean dump of the Atom Tree (sanitized for public API usage).

## 🎥 Phase 6: The Video Engine (MP4)
**Goal**: Reuse or bridge existing video capabilities.
- [ ] **Bridge**: Do NOT rewrite ffmpeg logic.
    *   **Logic**: If format is MP4, the Service should internally call the **Video Render Muscle** (if available) or use a lightweight `cv2` frame-stitcher for simple animations.
    *   **Assumption**: For "Pro" video, we use the dedicated `video_render` muscle. This export muscle handles "Simple Slideshows".

## 🚀 Phase 7: The Handshake & Registry
**Goal**: Make it discoverable.
- [ ] **S3 Upload**: Ensure all engines return a local path, and `service.py` handles the uploading to `media_v2` bucket.
- [ ] **Nexus Metadata**: Generate the JSON-LD tags (e.g. `{"page_count": 5}`) for the result.
- [ ] **Manifest**: Update `SKILL.md` (and `agents/registry`) to list:
    *   `['png', 'jpg', 'pdf', 'pptx', 'xlsx', 'csv', 'docx', 'xml', 'txt', 'md', 'html', 'tsx', 'css', 'json', 'mp4']`.

---
**Success Criteria**:
*   A single API call (`/render`) handles all 16 formats.
*   The UI doesn't need to know *how* to write TSX, it just asks for it.
