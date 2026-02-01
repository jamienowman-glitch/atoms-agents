# PROMPT: Build the "Universal Export Muscle"

**Role**: You are the **Muscle Architect**.
**Task**: Build the `muscle_export_universal` service in `atoms-muscle`.

## 🚨 CONTEXT & MANDATES
1.  **Protocol Law**: You MUST follow the **Universal Export Protocol** (see `docs/plans/2026-02-01_universal_export_protocol.md`).
    *   **Input**: `ExportJob` JSON (Canvas State, Format, Params).
    *   **Output**: `ExportResult` JSON (S3 URI, Metadata). No Bytes transfer.
2.  **Packaging Law**: You MUST use the `create-muscle` skill structure.
    *   Docker-ready.
    *   Stateless.
    *   `SKILL.md` must advertise capabilities.

## 📝 THE SPECIFICATION

**Supported Formats (Must Implement):**
1.  **PNG**: STRICT REQUIREMENT: Preserve Transparency (Alpha Channel).
2.  **PDF**: STRICT REQUIREMENT: Support Multi-Page (Scene-based pagination).
3.  **JPEG**: High-quality compressed.
4.  **MP4**: Simple slideshow render (or bridge to video_render).
5.  **PPTX**: Native PowerPoint generation (Editable Text/Shapes preferred).
6.  **XLSX / CSV**: Data export of the canvas atoms.
7.  **DOCX**: Linearized document export.
8.  **XML**: Semantic structure of the Atom Tree.
9.  **TXT**: Plain text dump of content (no images).
10. **MD**: Markdown export (Headers, Links, Lists).
11. **HTML**: Semantic HTML5 structure (Divs, Articles).
12. **TSX**: React Functional Component generation.
13. **CSS**: Extracted style sheet.
14. **JSON**: Clean data dump of the Atom Tree.

**Recommended Additions (Implement if easy):**
15. **SVG**: For designers (Vector preservation).
16. **GIF**: For social sharing (Looping animations).

## 🛠️ IMPLEMENTATION HINTS
*   **Library Stack**:
    *   Images: `Pillow` (PIL).
    *   PDF: `reportlab` or `weasyprint`.
    *   Office: `python-pptx`, `python-docx`, `openpyxl`.
    *   Text/Data: `dicttoxml` (XML), `pandas` (CSV/XLS), Native String IO (TXT/MD).
    *   Video: `ffmpeg-python` or `opencv`.
    *   Web: Native templating (Jinja2 or string f-strings) for HTML/TSX/CSS.
*   **The "Router"**:
    *   Your main `service.py` should be a clean switch statement: `get_engine(format).render(canvas)`.
*   **The "Canvas Parsing"**:
    *   Don't just take a screenshot. **Parse the JSON**.
    *   If the user asks for TSX, try to generate **Valid React Code**, not just a string of HTML.

## 🏃♂️ IMMEDIATE ACTION (Start Here)
1.  Read `docs/plans/2026-02-01_export_muscle_atomic_task_plan.md`.
2.  View `atoms-muscle/src/atoms_muscle/video/video_render/service.py` (for reference on S3/Auth patterns only).
3.  Scaffold `src/atoms_muscle/export/universal`.
4.  Begin implementation of Phase 1 (Skeleton).
