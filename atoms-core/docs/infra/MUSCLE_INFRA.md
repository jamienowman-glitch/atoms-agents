# 🏋️ Muscle Infrastructure: The "Hybrid Edge"

> **Strategy**: "Preview Locally. Render Globally. Pay Zero."

## 1. Where does Muscle Run?

We employ a **Hybrid Architecture** to balance cost and power.

### A. The Client (The "Free" GPU)
*   **Where**: The User's Browser (WebGPU / WASM).
*   **What**: Real-time Previews, lightweight edits, timeline scrubbing.
*   **Cost**: **$0.00**. Uses the user's MacBook/Phone battery.
*   **Tech**: `ffmpeg.wasm`, WebGL Shaders.

### B. The Cloud (The "Heavy" Cannon)
*   **Where**: **Google Cloud Run** (Serverless Containers).
*   **What**: Final 4K Export, Long-form Transcriptions, Heavy ML (Training).
*   **Cost**: Scaled. $0 when idle. Pay-per-second when rendering.
*   **Tech**: `atoms-muscle` Docker Container (Python, FFmpeg, Torch).

---

## 2. The "Sellable" Asset (MCP)
Every Muscle is designed to be **sold** as a standalone tool.

### The Protocol
To sell a Muscle, it must be wrapped as a **Model Context Protocol (MCP)** server.
1.  **Raw Logic**: The Python Class (`src/video/slowmo/service.py`).
2.  **The Wrapper**: The MCP Server (`src/video/slowmo/mcp.py`).
3.  **The Manifest**: `SKILL.md` defining the selling points and endpoints.

### ⚠️ Current Status: AUDIT FAILED
**Critical Gap Identified**:
*   We scanned **74 Muscles** in the repo.
*   **Result**: Most are "Raw Logic" only. They lack the `SKILL.md` and MCP wrappers required for sale.
*   **Action Required**: We must run a "Wrapping Pass" to auto-generate the MCP interop layer for all 74 muscles.

---

## 3. Infrastructure Location
*   **Repo**: `atoms-muscle`
*   **Registry**: `public.muscles` (Supabase)
*   **Deploy Target**: `gcr.io/northstar-prod/atoms-muscle`

---

## 4. Cost Optimization Strategy
How do we keep the backend free/cheap?
1.  **Don't Upload Garbage**: Analyze keyframes on the *Client* (Edge) before uploading the full video.
2.  **CPU First**: Cloud Run CPU limits are generous. heavily optimized FFmpeg CPU presets (Ultrafast) are often "Good Enough" and much cheaper than GPU.
3.  **BYO-Key**: For massive tasks (Training), we ask the Tenant to provide their own Modal/Replicate key.
