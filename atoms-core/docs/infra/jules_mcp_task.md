# 🤖 JULES TASK PROTOCOL: The MCP Factory

> **Mission**: Wrap 74 Raw Python Muscles into Sellable MCP Servers.
> **Context**: We have a repo `atoms-muscle` full of raw logic (`service.py`). We need to expose them as MCP Tools so other agents can hire them.

## 1. The Strategy: "Hybrid Edge" (CapCut Architecture)

**We do NOT process heavy video in the browser.**
*   **Browser (PWA)**: Uses `ffmpeg.wasm` + WebGL for *editing* (cuts, filters, scrubbing) and *previews*. This is free and local.
*   **Cloud Run (Muscle)**: We send the "Project JSON" (Edit Decision List) to the cloud for the final **4K Export** or for heavy AI (Whisper/Object Detection).
*   **Why**: Browser tabs crash if you try to render 4K video.

---

## 2. THE PROMPT (Copy-Paste to Jules)

**"Jules, you are the Factory Foreman. Run the Automation Script."**

### Step 1: Install Dependencies
Ensure `mcp` is in `pyproject.toml`.

### Step 2: Run The Factory
We have created an **Automation Script** to do the heavy lifting.
1.  Navigate to `atoms-muscle/scripts/`.
2.  Run `python3 factory.py`.
3.  **Result**: This will scan all 74 muscles and generate:
    *   `mcp.py` (The FastMCP Wrapper)
    *   `SKILL.md` (The Registry Manifest)

### Step 3: Verify & Refine
The factory uses templates. Your job is to:
1.  **Review** the generated `mcp.py` files.
2.  **Fix Imports**: Ensure `from .service import ServiceName` matches the actual class name in `service.py`.
3.  **Test**: Try running `python mcp.py` for a few key muscles (Video/Audio).

### Step 4: Register
Once wrapped, run the Registry Sync in `atoms-core`:
```bash
python3 ../atoms-core/scripts/sync_muscles.py
```
This will pull the new `SKILL.md` data into Supabase automatically.

---

## 3. Architecture Clarification (CapCut Style)

**"How do we achieve CapCut Quality?"**

We generally follow the **Tott / CapCut Web** architecture:
1.  **Preview (Local)**: The user's browser runs `ffmpeg.wasm` and WebGL shaders. This is "Free Compute".
2.  **Proxy (Local)**: We generate low-res proxies locally for fast scrubbing.
3.  **Export (Cloud)**: When the user hits "Export 4K", we send the *JSON State* (The Edit Decision List) to `atoms-muscle` on Cloud Run.
4.  **Render (Cloud)**: The Muscle pulls the high-res files from S3, applies the edits (FFmpeg/GPU), and uploads the result.

**Constraint**:
*   **Do NOT** run Heavy ML (OpenCLIP, Whisper) in the browser. It kills the battery/tab. Send those to Muscle immediately.
*   **Do** run Cuts, Trims, and Color Correction in the browser.

---

## 4. Execution List
Target Areas (Priority):
1.  `src/video/*` (21 Muscles) -> **Critical for AfterTime**.
2.  `src/audio/*` (64 Muscles) -> **Critical for Voice**.
3.  `src/vision/*` (1 Muscle) -> **Critical for Nexus**.

**Jules, execute.**
