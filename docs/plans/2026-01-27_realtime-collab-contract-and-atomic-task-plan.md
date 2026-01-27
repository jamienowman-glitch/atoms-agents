# Realtime + Collaborative Canvas — Contract (V1) & Atomic Task Plan

**Date:** 2026-01-27  
**Primary Homes:** `atoms-core`, `atoms-ui`, `atoms-app`  
**Later Home:** `atoms-agents` (agent runtime lift)

## Canonical Paths (use these exact paths; do not “nest” new repos)
- Repo root (your “/dev”): `/Users/jaynowman/dev`
- This contract (read first): `/Users/jaynowman/dev/docs/plans/2026-01-27_realtime-collab-contract-and-atomic-task-plan.md`
- Realtime harness skill (must read if editing harness/canvas): `/Users/jaynowman/dev/atoms-ui/.agent/skills/realtime-harness/SKILL.md`
- Shared transport implementation (single source of truth): `/Users/jaynowman/dev/atoms-ui/harness/transport/index.ts`

This is intentionally **high-level and enforceable**. It defines the contract that prevents:
- “monoatomic canvases” (canvas owns execution/realtime/logging)
- new ad-hoc routes/transports per canvas
- expensive “vision everywhere” (no permissioning)
- local-only persistence that breaks cloud workers

---

## 0) Vocabulary (Use These Words Precisely)

### Graph (Runtime Truth)
The canonical run model: nodes/edges + run state + events.

### Harness (UI Frame)
The fixed UI shell holding tool surfaces (ChatRail / TopPill / ToolPop / etc).  
Harnesses are **few** (target 2–4 templates), stable, reusable across canvases.

### Canvas (UI Cartridge)
A mountable cartridge that renders a view and emits commands.  
**Canvas is not the product.** A Flow uses multiple canvases.

### Tokens (Shared State Controls)
Typed values representing UI controls + shared state. Token visibility is governed by TokenLens.

### “DOM” vs State Model
We **do not stream browser DOM/HTML**.  
We stream a **canonical state model** (e.g. `CanvasState` / `BlockTree` / `TokenCatalog`) as JSON + patches.

### Media Sidecars
References to heavy assets (image/video/audio) stored in object storage (S3). **No inline bytes.**

---

## 1) Core Contract (Non‑Negotiable)

### 1.1 Canonical Ownership (One Home Per Concern)
- `atoms-core` owns: identity/tenancy, realtime gateway (SSE/WS), command ingestion, artifact presign, and the “event sink” interface.
- `atoms-ui` owns: harness templates, tool surfaces, canvases, and the single shared `CanvasTransport` client.
- `atoms-app` owns: surface sites + console UX (mounts harness/canvas combos). **No bespoke transport logic.**
- `atoms-agents` (later) owns: agent runtime + runtime lenses + mirror subscriber.

### 1.2 Canvas Cannot Own Execution (Anti‑Monolith Rule)
Canvas code MUST NOT implement:
- orchestration/execution
- persistence (DB writes as a “source of truth”)
- logging/audit sinks
- realtime servers/endpoints

Canvas code MAY:
- render projections of state
- emit typed commands to `atoms-core`
- request media sidecars on-demand **if permitted**

### 1.3 Realtime Transport (Truth vs Ephemeral)
- **SSE = downstream truth** for everything (state patches, token patches, logs, chat tokens, snapshot refs).
- **WS = upstream ephemeral only** (presence/cursors/gestures). Optional.
- Chat “speed” can be: HTTP/WS upstream + SSE downstream tokens. Do not require WS for token streaming.

### 1.4 No Browser DOM Streaming
**Forbidden:** sending HTML/DOM diffs as the “truth”.

**Allowed:** streaming your own stable state model:
- `token_patch` (small, cheap; ideal for planning canvases)
- `state_patch` (structured document model / block tree patches)
- optional `snapshot_created` events containing **sidecar references**

### 1.5 Vision/Audio/Video Contract (Sidecar‑Only)
- Heavy assets live in **S3** (or other object store), referenced by:
  - `artifact_id` and/or `uri` (e.g. `s3://bucket/key`)
  - metadata (mime, size, checksum, frame range, timestamps)
- Vision is **permissioned**:
  - default agents do **not** receive/resolve sidecars
  - “director”/visual agents may request sidecars on-demand
- No base64 blobs in events. Ever.

### 1.6 Identity & Routing (Required Fields Everywhere)
Every realtime connection and command MUST be scoped by:
- `tenant_id`
- `mode`
- `project_id`
- `surface_id`
- `app_id`
- plus run/canvas correlation (`run_id`, `canvas_id`) where relevant

### 1.7 Minimum Event Types (V1)
Downstream (SSE) should support at least:
- `CANVAS_READY` (tool manifest + canvas type)
- `token_patch` (small state changes)
- `state_patch` (block/document changes)
- `canvas_commit` (authoritative committed ops / revisions)
- `snapshot_created` (sidecar references only)
- `chat_token` (streamed model tokens)
- `log_line` (developer logs, sanitized)

Upstream (HTTP/WS) should support at least:
- `command` (typed command envelope; idempotent)
- `gesture` (ephemeral cursor/presence; WS optional)
- `chat_send` (send a message; transport can be HTTP or WS)

### 1.8 Lens Semantics (Stop the Naming Confusion)
There are **three** different “lens” concepts:
- **Runtime Lenses (atoms-agents):** permissions/policy/projections applied to the graph/run (TokenLens, ContextLens, etc.)
- **UI Lens Slots (atoms-ui):** harness surfaces like “Context panel / Token inspector”; these are UI regions, not runtime policy.
- **CanvasLens (atoms-ui):** selects which canvas cartridge is active (view routing), based on run state.

Use naming to keep them separate:
- `TokenLens` / `ContextLens` = runtime policy (agents)
- `ContextPanel` / `TokenPanel` = UI slots (harness)
- `CanvasLens` = UI view selector (router)

### 1.9 Storage Contract (No “Temporary on Disk”)
- Registries/auth/config: **Supabase** (source of truth).
- Heavy media: **S3** (source of truth).
- Embeddings/Nexus: **LanceDB** on S3 (Nexus lives in `atoms-core`).
- Realtime durability (event spine + replay): **Cosmos** (append-only) — must be wired in `atoms-core` (no filesystem dependency for prod flows).

---

## 2) Atomic Task Plan (Hand‑Off to Cloud Worker)

Each task is designed to be assignable to one worker and produces a concrete artifact.

### ATOMS-RT-00 — Publish the Contract Everywhere
- **Repo(s):** root + `atoms-core` + `atoms-ui` + `atoms-app`
- **Do:** Add a short “Realtime + Collaborative Canvas Contract (V1)” section that links here (use absolute path).
  - Edit: `/Users/jaynowman/dev/AGENTS.md`
  - Edit: `/Users/jaynowman/dev/atoms-core/AGENTS.md`
  - Edit: `/Users/jaynowman/dev/atoms-ui/agents.md`
  - Edit: `/Users/jaynowman/dev/atoms-app/AGENTS.md`
- **DoD:** A worker who only opens a subrepo still sees the rules + link.

### ATOMS-RT-01 — One Canonical `CanvasTransport` (Stop Duplicates)
- **Repo:** `atoms-ui`
- **Do:** Make the shared transport the only supported one:
  - Canonical implementation: `/Users/jaynowman/dev/atoms-ui/harness/transport/index.ts`
  - Any other transport implementations must be removed from use (do not create new transports under other folders).
- **DoD:** `atoms-app` imports transport from `atoms-ui` (not copy/paste). No second transport implementation remains “active”.

### ATOMS-RT-02 — `atoms-core` Realtime Gateway (SSE Truth)
- **Repo:** `atoms-core`
- **Do:** Implement canonical SSE endpoints:
  - canvas stream (per canvas/run)
  - unified timeline (optional but recommended)
  - resume via `Last-Event-ID`
- **DoD:** UI and agents can reconnect and resume deterministically.

### ATOMS-RT-03 — `atoms-core` WS Ephemeral Channel + Ticketing
- **Repo:** `atoms-core`
- **Do:** Implement a single WS endpoint for gestures/presence with a ticket handshake.
- **DoD:** No ad-hoc WS paths per canvas; client path is stable across harnesses/canvases.

### ATOMS-RT-04 — Semantic State Model + Patch Ops
- **Repo(s):** `atoms-core` (server contract) + `atoms-ui` (client)
- **Do:** Define `CanvasState` (or `BlockTree`) and patch operations (`state_patch`, `token_patch`).
- **DoD:** Planning canvases can run with **tokens/state only** (no vision cost).

### ATOMS-RT-05 — Media Sidecar Pipeline (On‑Demand Vision)
- **Repo(s):** `atoms-core` + `atoms-ui`
- **Do:** Presign upload to S3 + emit `snapshot_created` with sidecar refs (artifact_id/uri).
- **DoD:** Vision agents can request/resolve sidecars; others do not receive them by default.

### ATOMS-RT-06 — Permissioning (TokenLens + Vision Access)
- **Repo(s):** `atoms-core` (enforcement) + `atoms-ui` (UI gating) + `atoms-agents` (later)
- **Do:** Implement actor-scoped allowlists for:
  - token read/write
  - sidecar access
- **DoD:** “Director” agent can see visuals; planner agent cannot.

### ATOMS-RT-07 — Harness Templates + Canvas Plugin Contract
- **Repo:** `atoms-ui`
- **Do:** Provide a small set of harness templates + a strict canvas plugin interface.
  - **Guardrail:** harness/canvas work must follow `/Users/jaynowman/dev/atoms-ui/.agent/skills/realtime-harness/SKILL.md`
- **DoD:** Adding a new canvas never requires inventing new tool surfaces or routes.

### ATOMS-RT-08 — `atoms-app` Console V0 (Run One Flow)
- **Repo:** `atoms-app`
- **Do:** Minimal console that:
  - loads one flow
  - mounts harness + at least **two** canvases
  - shows realtime stream + agents acting on shared state
- **DoD:** Demo proves canvases are an atomic part of a larger flow.

### ATOMS-RT-09 — Cosmos Durability (No Local FS in “Real” Modes)
- **Repo:** `atoms-core`
- **Do:** Wire Cosmos-backed persistence for event spine / replay and any durable run state needed.
- **DoD:** System works when deployed; no “it only works on my disk” behavior.

### ATOMS-RT-10 — Contract Smoke Tests
- **Repo(s):** `atoms-core` + `atoms-ui`
- **Do:** Add minimal tests that verify:
  - SSE resume works
  - events contain required IDs
  - sidecars are refs only (no bytes)
  - permissioning blocks vision where required
- **DoD:** CI fails fast when someone breaks the contract.

---

## 3) Reality Check (What Already Exists)

### Nexus (exists in `atoms-core`)
- `atoms-core/src/nexus/*` implements LanceDB-backed memory (and docs exist under `atoms-core/docs/infra/NEXUS_ARCHITECTURE.md`).

### S3 (exists in `atoms-core`)
- Presign/upload plumbing exists under `atoms-core/src/storage/*` and Nexus routes.

### Cosmos (not yet in `atoms-core`)
- Cosmos wiring must be implemented in `atoms-core` for durability. Do not rely on filesystem persistence for production modes.

---

## 4) Out of Scope (Do Later)
- Full logging/audit taxonomy and dashboards (keep the sink interface stable now).
- `atoms-tuning` consumers (start once event contract is stable).
- Multi-site “surface template” publishing automation.
