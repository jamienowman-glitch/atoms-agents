# 🏗️ Atoms Infrastructure Report

| Meta | Details |
| :--- | :--- |
| **Date** | 2026-02-01 |
| **Strategy** | "Free Tier Mesh" (Zero Fixed Costs) |
| **Status** | 🟢 Audited & Verified |

## 🗺️ Repository Overview

| Repo Name | 🧠 What It Does | 🔌 Current Infra | 💡 Suggested Infra (Free/Cheap) |
| :--- | :--- | :--- | :--- |
| **`atoms-app`** | **The Brain.** <br>Main Next.js Application. Contains the Dashboard, God Configs, and Orchestrator. | **Supabase** (DB/Auth) <br> **Vercel** (Frontend) | **Vercel** (Hobby Tier - Free). <br>It's static/edge optimized. Keep it here. |
| **`atoms-ui`** | **The Skin.** <br>Component System, Canvases, Harnesses. Shared React library. | **None** (Library) | **None** (Build Artifact). <br>Consumed by `atoms-app`. Storybook can host on Vercel/Cloudflare. |
| **`atoms-core`** | **The Logic.** <br>Shared Python Library. Pydantic models, DB wrappers, Utils. | **None** (Library) | **None** (Python Package). <br>Imported by `atoms-muscle` and `atoms-agents`. |
| **`atoms-muscle`** | **The Brawn.** <br>Heavy Compute & MCP Servers (Audio, Video, GPU tasks). | **Local** (Docker) | **Oracle Cloud** (ARM/GPU Free Tier) or **Fly.io**. <br>Dockerize strictly. Run as stateless containers. |
| **`atoms-agents`** | **The Workforce.** <br>Agent Manifests, Personas, Graph Definitions. | **Git** (Config as Code) | **Supabase** (Registry Sync). <br>The "Active" agents live in the DB, source matches Git. |
| **`atoms-connectors`** | **The Plugs.** <br>Integration Schemas & API Logic (Shopify, Linear, etc.). | **None** (Library) | **None** (Library). <br>Imported by Muscle/Agents to talk to outside world. |
| **`atoms-tuning`** | **The Gym.** <br>Fine-tuning scripts, datasets, and training jobs. | **Local Scripts** | **Modal / RunPod / Oracle**. <br>Batch jobs only. Spin up, train, spin down. Pay per second. |
| **`atoms-site-templates`** | **The Printing Press.** <br>Templates for marketing sites (derived from `atoms-ui`). | **GitHub** | **Cloudflare Pages**. <br>Unlimited free static sites for marketing pages. |

### 🆕 New Service Added

| Repo Name | 🧠 What It Does | 🔌 Current Infra | 💡 Suggested Infra |
| :--- | :--- | :--- | :--- |
| **`junior-agent-security`** | **The Sheriff.** <br>Local Security Sidecar. Gates secrets with TOTP. | **Localhost** (SQLite) | **Local Binary** (Homebrew). <br>Runs on developer machine. **Cost: $0.** |

---

## 🔗 The Architecture Map

1.  **Vercel (`atoms-app`)** talks to **Supabase** to get User/Data.
2.  **Vercel** talks to **Oracle (`atoms-muscle`)** via MCP/HTTP to do heavy work (transcription, rendering).
3.  **Local Dev (`atoms-agent`)** talks to **Localhost (`junior-agent-security`)** to get permission to write to Vault.
4.  **Cloudflare** hosts the output of the **Printing Press** (Marketing Sites).

---

## 💰 Commercial & Operations
Detailed operational logic for monetization and service status.

| Component | Implementation Details |
| :--- | :--- |
| **SNAX** | Logged in `public.snax_ledger` (Postgres table). |
| **SNAX Ledger** | Postgres Table with RLS. Tracks `Wallet ID`, `Tenant ID`, `Delta`, `Reason`. |
| **Monetization** | **Snax Token**. Pricing Configs in `atoms-app/src/_flat_config/god_config_pricing`. Usage metered via `gate_chain`. |
| **God Mode** | Log in via **Supabase Auth**. Access `/_flat_config/god_...` pages. Protected by `is_super_admin` checks. |
| **Service Status** | **Active**: Core, App, Muscle. **Offline**: Tuning (Batch). **Beta**: Security (Local). |

---

## 📡 Feeds & Media Architecture
How content flows into the system and how agents consume it.

| Component | Implementation Details |
| :--- | :--- |
| **FEEDS (Content)** | YouTube Videos, Products (Shopify - inferred), System Events. |
| **FEEDS (Population)** | System-level "Feed Engines" generate items. `EventSpine` distributes them. |
| **Media Consumption** | Agents receive `media_v2` URIs (S3 references). They don't download bytes; they pass URIs to Muscles. |
| **Media Transmission** | TTS/STT muscles (e.g., `audio_capture_normalize`) upload to `media_v2` and return a URI to the Agent. |

---

## 👁️ Vision Strategy (Model Agnostic)

> [!IMPORTANT]
> **Architecture Law**: The System is **Model Agnostic**.
> We do NOT hardcode "Molmo" or "Gemini". We use **Capability Bindings**.
> *   **The Sidecar**: Carries Video, Audio, OR Images (via `mime_type` + S3 URI).
> *   **The Routing**: The Agent Manifest requests a capability (e.g., `cap.vision.cuts`), and the Registry routes it to the best available model.

### The Capability Vanguards (Current Examples)
*These are just the current implementations. They can be swapped tomorrow.*

| Capability Needed | Current Best Model (The "Vanguard") | Why? |
| :--- | :--- | :--- |
| **Spatial / Cuts** | **Molmo 2** (`molmo-2-free`) | Excellent at spatial pointing ("Where is the cat?"). Good for `Timecode In:Out` logic. |
| **Vibe / Temporal** | **Gemini 2.0** (`gemini-2.0-pro`) | Best "Video Native" understanding. Good for "Is this on beat?" or "What is the mood?". |
| **Logic / Code** | **Claude 3.5** (`sonnet`) | Best at reasoning and JSON structure. |
| **Fallback** | **OpenAI** (`gpt-4o`) | General purpose backup. |

### 🚨 What We Have vs. What We Need (Gap Analysis)

| Area | 🟢 What We Eat (Have) | 🔴 What We Need (Build) |
| :--- | :--- | :--- |
| **Transport** | **MediaSidecar Contract**. <br>Code exists in `contracts.ts`. Supports `uri`, `mime_type` (Audio/Video/Image). | **Multi-Modal Support**. <br>The *Contract* supports it, but the UI code only really handles Video right now. Needs Audio/Image wiring. |
| **Routing** | **Registry Bindings**. <br>`atoms-agents` can conceptually swap `binding.gemini_video` to `binding.gpt5_video` instantly. | **Dynamic Selection**. <br>Ensuring the UI sends the right *Context* so the backend *knows* to switch models based on task (Vibe vs Cut). |
| **The "Director"** | **Video Player**. <br>`<video>` tag plays S3 files. | **The "Director's Eye"**. <br>The Canvas needs logic to *serialize* the visible timeline state (which clips are effective?) into a `MediaPayload` to send to the Agent. |

---

## 🏋️ Video Muscle Inventory (The Editor Toolkit)
These are the specialized engines available for the Video Editor Canvas.

| Muscle Name | Directory Path | 🔥 Capabilities | Status |
| :--- | :--- | :--- | :--- |
| **AirCanvas** | `src/video/air_canvas` | **"The Light Board"**. Tracks hand color (Orange) to draw lines in space. Uses P-Control & Velocity Thresholds. | ✅ **Active** |
| **MultiCam** | `src/video/video_multicam` | **"The Editor Brain"**. Logic for syncing multiple tracks, calculating offsets, and ensuring audio alignment. | ✅ **Active** |
| **Video Render** | `src/video/video_render` | **"The Exporter"**. Takes a timeline JSON and burns it to a single MP4. Matches `ffmpeg` exact specs. | ✅ **Active** |
| **SlowMo** | `src/video/video_slowmo` | **"The Time Warp"**. Uses Optical Flow (`minterpolate`) to generate buttery smooth slow motion from 30fps → 60/120fps. | 🛠️ **Utility** (Raw Code) |
| **360 Video** | `src/video/video_360` | **"The Sphere"**. Projects Equirectangular 360° video onto Flat surfaces. Used for Haze Planet. | ✅ **Active** |
| **Batch Render** | `src/video/video_batch_render` | **"The Factory"**. Queues multiple render jobs for bulk processing. | ✅ **Active** |

---

## 🕹️ UI Wiring Map (Strict ToolPill Protocol)

> [!WARNING]
> **PROTOCOL LAW**: Do not edit `ToolPill.tsx`. Do not edit `ToolPop.tsx`.
> All Buttons must be defined in the **Canvas Contract (`.contract.ts`)**.
> The `ToolPill` component is **LOCKED (Production)**. It generically renders whatever tools the Contract defines.

### 🔌 The Mapping: Muscle → Contract → Button

This map defines how we expose the Muscles to the User without breaking the Locked UI Protocol.

| Muscle Service | Feature Name | Can we build a Button? | 📝 The Implementation Plan (in `contract.ts`) |
| :--- | :--- | :--- | :--- |
| **AirCanvas** | **"Magic Draw"** | ✅ Yes | Add tool: `{ id: "magic_draw", icon: "pencil_sparkle", type: "toggle", action: "enable_air_canvas" }` |
| **SlowMo** | **"Slo-Mo"** | ✅ Yes | Add tool: `{ id: "slomo_clip", icon: "rabbit_turtle", type: "trigger", action: "apply_slomo", context: "selected_clip" }` |
| **Video Render** | **"Export"** | ✅ Yes | Add tool: `{ id: "export_mp4", icon: "film_reel", type: "panel_pop", panel_id: "export_settings" }` |
| **MultiCam** | **"Sync Audio"** | ✅ Yes | Add tool: `{ id: "auto_sync", icon: "wave_sync", type: "trigger", action: "multicam_align" }` |
| **Timeline** | **"Split Clip"** | ✅ Yes | Add tool: `{ id: "split_razor", icon: "razor", type: "trigger", action: "split_clip_at_playhead" }` |

> **Implementation Note**: When we build the Canvas, we will edit **`[CanvasName].contract.ts`** and populate the `tools` array with these JSON objects. `atoms-ui` will automatically render the buttons in the ToolPill.

### 🚨 Critical Gap Analysis (Rendering Logic)

I have audited `ToolPopGeneric.tsx` and `ToolPill.tsx`. These critical gaps must be fixed to support the Buttons above.

| Component | The Gap | The Fix Required (Authorized Edit) |
| :--- | :--- | :--- |
| **`ToolPopGeneric.tsx`** | **Missing Action Renderers**. <br>It currently only supports `slider`, `toggle`, `select`, `joystick`. <br>It **ignores** `trigger` (Action Button) and `panel_pop` (Modal). | **Add `trigger` case**: Render a clickable button that fires `onToolUpdate(action, true)`. <br>**Add `panel_pop` case**: Render a button that opens a sub-modal. |
| **`ToolPill.tsx`** | **Hardcoded Config**. <br>It uses a static `CATEGORY_CONFIG` object inside the file. It does **not** read capabilities or contracts. | **Refactor**: Make `ToolPill` accept a `customTools` prop that injects atoms defined in the Contract. |

---

## 🎞️ Video Transport & DRM Policy
How "Moving Video" is delivered without heavy protocols.

| Component | Implementation Details |
| :--- | :--- |
| **Video Sidecar** | **Strict S3 References**. `atoms-ui` receives `{ sidecar: { uri: "s3://..." }}`. It NEVER receives video bytes over the socket. |
| **Video Transport** | **Standard HTTP Streaming**. The Canvas uses `<video src="...">` to play files directly from S3. No special sockets for pixels. |
| **Realtime Role** | **Control Plane Only**. WS/SSE carries **Timecode**, **Play/Pause State**, and **Seek Position**. It does NOT carry video frames. |
| **DRM Policy** | **NO DRM**. Zero usage of Widevine/FairPlay/EME. All assets are raw MP4/HLS. Verified by code audit. |
| **Sync Logic** | **Backend-Calculated**. `atoms-muscle/video/video_multicam` determines timecode offsets. The UI just strictly follows the clock. |

---

## 📦 Muscle Packaging & Isolation

This section details how `atoms-muscle` is packaged to ensure it runs independently without dragging the entire monorepo.

| Strategy | Implementation |
| :--- | :--- |
| **Format** | **Docker Container** (`python:3.11-slim`). Single, stateless artifact. |
| **Tooling** | **`uv`** (by Astral). High-performance replacement for pip/poetry. Installs dependencies in milliseconds. |
| **Dependency Isolation** | **Strict**. The `Dockerfile` copies `pyproject.toml` and runs `uv sync --frozen`. It ONLY installs the exact packages listed in `atoms-muscle/pyproject.toml` (e.g., `torch`, `ffmpeg-python`, `mcp`). It blindly ignores `atoms-ui`, `atoms-agents`, or any other repo folder. |
| **Code Isolation** | **Explicit Copy**. The build command `COPY src/ .` strictly copies the `/src` folder of `atoms-muscle`. It does **not** copy the parent directory. This guarantees that the container is lightweight and contains zero unrelated code. |
| **System Libs** | **Minimal**. Installs `ffmpeg`, `libsm6` (OpenCV req), `libxext6`. No GUI, no development tools. |

---

## 🕷️ Systematic Audit & Gaps (Automated)

> [!INFO]
> Generated by **`_scripts/audit_crawl_v2.py`** on Feb 1.
> [View Full Raw Report](file:///Users/jaynowman/dev/docs/repo_deep_scan.md)

### 🚨 Critical Configuration Gaps
The V2 Deep Scan revealed several "Hidden" dependencies that were not previously documented.

> [!WARNING]
> **1. Crypto & Payments** (Found in `atoms-muscle` & `atoms-app`)
> *   **Secret:** `SOLANA_PRIVATE_KEY` (Direct private key usage detected).
> *   **Service:** `stripe` (Found in `atoms-core`).
> *   **Token:** `Snax` (Internal currency logic found in 92 files).

> [!WARNING]
> **2. Domain & DNS Management** (Found in `atoms-muscle`)
> *   **Providers:** `NAMECHEAP_API_KEY`, `CLOUDFLARE_API_TOKEN`.
> *   **Usage:** Automated domain registration/DNS management detected in `muscle` scripts.

> [!IMPORTANT]
> **3. AI & Model Swarm** (Found in `atoms-agents`)
> *   **Undocumented Providers:** `DEEPSEEK_API_KEY`, `MISTRAL_API_KEY`, `NVIDIA_API_KEY`, `JULES_API_KEY`, `COMET_API_KEY`.
> *   **Analysis:** The system is prepared for a "Model Swarm" architecture, not just Bedrock/OpenAI.

> [!CAUTION]
> **4. Obscure Config Keys** (Found in `atoms-app`)
> *   **Keys:** `5IDG2W`, `JID6H5`, `VIDUI11`, `X8VIDO8`, `E7GPH2WIDGE`.
> *   **Flag:** These appear to be proprietary or encoded configuration keys (possibly for digital signage/kiosk modes).

### 🗣️ Voice & Listening (TTS / STT)

> [!NOTE]
> **Status:** Backend Ready, Frontend Missing.

1.  **Speaking (TTS - Text to Speech)**
    *   **Engine:** **ElevenLabs**.
    *   **Integration:** `atoms-agents` has an `ElevenLabsProvider` (`atoms-agents/runtime/providers/elevenlabs.py`).
    *   **Status:** ✅ **Implemented** in backend.

2.  **Listening (STT - Speech to Text)**
    *   **Engine:** **Faster-Whisper**.
    *   **Location:** `atoms-muscle/src/atoms_muscle/audio/transcriber.py`.
    *   **Status:** ✅ **Implemented** in backend.

3.  **Client-Side Capture (MISSING)**
    *   **Impact:** The "Listen" button in the UI is currently fake.
    *   **Gap:** ❌ No `getUserMedia` or `MediaRecorder` logic exists in `atoms-ui`.

---

## 🕵️‍♀️ Deep Reconnaissance Inventory (Updated)

### Realtime & Event System
| Component | Implementation Details |
| :--- | :--- |
| **Realtime Transport** | **Custom SSE + Websocket**. NOT Supabase Realtime. |
| **Client Implementation** | `atoms-ui/harnesses/Mother/logic/transport/index.ts`. Implementation of `EventSource` (Truth) and `WebSocket` (Ephemeral). |
| **Server Implementation** | `atoms-core/src/atoms_core/realtime`. Files `sse.py` and `ws.py` define the endpoints. |
| **Endpoints** | `/sse/chat/{thread_id}` (Downstream Truth) and `/ws/chat/{thread_id}` (Upstream Gestures/Cursors). |

### Agents, Models & Memory
| Component | Implementation Details |
| :--- | :--- |
| **Model Providers** | **AWS Bedrock**, **OpenAI**, **Mistral**, **DeepSeek**, **Nvidia**, **Jules**, **Groq**. |
| **Agent Loading** | Loaded from `atoms-agents/registry` (YAML/JSON Manifests) into `supa_agents` table. |
| **WHITEBOARD** | **Global Context**. Shared across Agent Run. Persists for lifecycle. |
| **BLACKBOARD** | **Local Context**. Scoped to the Edge (Connection between two nodes). Handover memory. |
| **Memory Infra** | **Memory Gateway** (`atoms-agents`). Backed by **Redis** (Hot) or **Postgres** (Cold). |

### Infrastructure & Cloud
| Component | Implementation Details |
| :--- | :--- |
| **AWS** | `boto3` client used heavily. Found in **15 files**. <br>**Services**: `Secrets Manager` (Vault backup), `Bedrock Runtime` (Model Inference), `STS` (Auth), `S3` (Media Storage). |
| **Heavy Media Files** | **AWS S3**. Path structure: `tenants/{tenant_id}/{env}/media_v2/{asset_id}/`. |
| **Tenant Security** | **Supabase Auth** (GoTrue). Found in **35 files**. |

### UI & Canvases
| Component | Implementation Details |
| :--- | :--- |
| **Harnesses** | **Mother**, **Flow**, **Wysiwyg-Builder**. |
| **Canvases** | `Haze`, `Maybes`, `Multi21`, `Spatial`, `Taskforce`, `Viddy`, `Words`, `Contract Builder`. |
| **HAZE** | **Planetary Explorer**. Backend: `video_planet_*` muscles. |
| **MAYBES** | **Note-Taking City**. Backend: `maybes` service. **Voice Note** feature is partially built (Backend ready, UI Microphone capture missing). |
