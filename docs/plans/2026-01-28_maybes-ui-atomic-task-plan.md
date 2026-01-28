---
title: MAYBES Note Canvas — UI/Harness Atomic Task Plan
date: 2026-01-28
owner: ui-canvas-agent
status: draft
scope: atoms-ui + atoms-app
---

# Goal
Build the MAYBES note‑taking canvas as a **ToolPill‑first** experience using the existing Harness, with client‑device rendering and DB‑first persistence.

# Non‑Negotiables (repo laws)
- **Only modify** `/Users/jaynowman/dev/atoms-ui/**` and `/Users/jaynowman/dev/atoms-app/**` (if needed for registry wiring).
- **Do not modify** `agentflow` — copy‑only if referencing legacy examples.
- **Tenant compute first**: interactive rendering must use **client device CPU/GPU**; server render only for explicit export/offline.
- **No .env**; use Vault + `atoms-core` gateway for data.
- **No new backend routes in UI**; use `CanvasTransport` / `atoms-core` APIs.

# Required Reads (before any edits)
1. `/Users/jaynowman/dev/AGENTS.md`
2. `/Users/jaynowman/dev/atoms-ui/agents.md`
3. `/Users/jaynowman/dev/atoms-core/AGENTS.md`
4. `/Users/jaynowman/dev/atoms-ui/.agent/skills/canvas-contract-builder/SKILL.md`
5. `/Users/jaynowman/dev/atoms-ui/.agent/skills/realtime-harness/SKILL.md`
6. `/Users/jaynowman/dev/docs/plans/2026-01-27_realtime-collab-contract-and-atomic-task-plan.md`

# Production Definition (non‑negotiable)
- Client device is the default compute target (CPU/GPU).
- UI state is **not** source‑of‑truth; DB registry is.
- Camera capture is **stubbed/disabled** until explicitly enabled.
- Every interaction must be compatible with ToolPill/ToolPop & Harness rules.

# Atomic Tasks

## A. Dependency Recon & Additions (atoms-ui)
1. Verify current dependencies in `atoms-ui/package.json` for:
   - `reactflow` + `@reactflow/node-resizer`
   - `zustand` (if needed for canvas state)
   - `@tiptap/*` (editor)
   - `wavesurfer.js` (audio waveform)
   - `tsparticles` (weather particles)
   - `idb-keyval` (IndexedDB cache)
   - `uuid`
2. Add missing deps to **atoms-ui** (not agentflow). Keep versions pinned.
3. Import `reactflow/dist/style.css` within the MAYBES canvas (scoped).
4. Re‑read `/Users/jaynowman/dev/atoms-ui/agents.md` and the **canvas‑contract‑builder** skill before section B.

## B. Create MAYBES Canvas Skeleton (atoms-ui)
1. Create `atoms-ui/canvases/maybes/` with:
   - `index.ts`
   - `MaybesCanvas.tsx`
   - `blocks/ConnectedMaybes.tsx`
   - `blocks/molecules/MaybesCity.tsx`
   - `blocks/atoms/MaybesNode.tsx`
2. Define node types:
   - `building_text`
   - `building_audio`
   - `building_image` (camera stub)
3. Wire `ToolHarness` and `ToolControlProvider` to the canvas.
4. Ensure the harness is using **CanvasTransport** for SSE/WS (no local transport).

## C. ToolPill‑First Controller (ToolPill + ToolPop)
1. Implement a **MAYBES ToolPill** controller that:
   - Toggles expanded menu (ToolPop‑style panel).
   - Modes: `TEXT`, `VOICE`, `CAMERA (disabled)`.
   - Emits creation actions (centered in viewport).
2. Decide strategy:
   - **Preferred:** make ToolPill configurable by registry + canvas scope.
   - **Fallback:** create a `MaybesToolPill` inside the MAYBES canvas, hide global ToolPill for this canvas.
3. Ensure camera mode is **disabled** with tooltip (“Coming Soon”).
4. Re‑read `/Users/jaynowman/dev/atoms-ui/.agent/skills/realtime-harness/SKILL.md` before section D.

## D. React Flow City Canvas
1. Render ReactFlow with:
   - Infinite pan/zoom.
   - Hidden default grid (custom background styling).
   - Node types mapped to custom components.
2. Nodes spawn at viewport center on ToolPill actions.
3. Animate node “drop” with Framer Motion.

## E. Node Implementations
1. `building_text`: Tiptap editor (minimal toolbar).
2. `building_audio`: MediaRecorder or `react-use-audio-recorder` + WaveSurfer.
3. `building_image`: placeholder UI + disabled action.
4. Each node exposes a **Forward** control:
   - On click: open flow picker modal (stub OK).
   - Emit `transport.sendCommand` with JSON payload.

## F. Weather + Time Layer
1. Add background gradient logic based on time + weather.
2. Use `navigator.geolocation` (permissioned) + Open‑Meteo fetch.
3. Render particles for rain/snow (tsparticles), **device‑CPU/GPU only**.
4. Provide safe fallback gradient when weather data is unavailable.

## G. Persistence + Sync
1. Load initial nodes from atoms‑core via `CanvasTransport` or registry client.
2. Cache locally in IndexedDB for offline only (not source‑of‑truth).
3. Sync changes back to atoms‑core on:
   - Node create/update/archive
   - Audio upload completion
4. Ensure tenant and surface scoping is preserved in all payloads.
5. Validate SSE (downstream) + WS (upstream) event flow through `CanvasTransport`.

## H. Registry + Contract
1. Add MAYBES canvas contract JSON (ToolPill/ToolPop bindings).
2. Register the canvas in Supabase via the canonical atoms‑core flow.
3. Ensure the contract explicitly maps ToolPill modes and ToolPop states to tool IDs.

## I. Validation
1. Smoke test: ToolPill creates text + audio nodes.
2. ReactFlow pan/zoom works on mobile.
3. Forward button emits payload via transport.
4. Camera button is disabled and safe.

# Done Definition
- MAYBES canvas exists under `atoms-ui/canvases/maybes`.
- ToolPill is the primary input controller (no floating buttons).
- Nodes are persisted via atoms‑core; local cache is non‑authoritative.
- Weather background renders and degrades gracefully.
