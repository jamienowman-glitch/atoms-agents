2026-01-28 — Realtime Retrofit Alignment (Atoms‑Core / Atoms‑UI / Atoms‑App)
============================================================================

Goal
----
Bring the Realtime Nervous System in `atoms-core` fully into alignment with the
Realtime + Collaborative Canvas Contract (V1). This includes **SSE truth**, **WS ephemeral only**,
strict **sidecar refs** for video/image/audio, and a **single canonical stream key**.

Non‑Negotiables
--------------
- **SSE = downstream truth** for state/tokens/logs/chat tokens/snapshot refs.
- **WS = ephemeral only** (presence/cursors/gestures). No chat messages or state commits on WS.
- **No DOM/HTML streaming**; only `token_patch` / `state_patch`.
- **Sidecars are refs only** (S3 `artifact_id`/`uri`/`object_id`). No base64 bytes.
- **No new routes per canvas**.
- **No `.env` files**; use VaultLoader / `atoms-core` config.

Scope (Atoms‑Core)
------------------
Primary files:
- `/Users/jaynowman/dev/atoms-core/src/realtime/contracts.py`
- `/Users/jaynowman/dev/atoms-core/src/realtime/timeline.py`
- `/Users/jaynowman/dev/atoms-core/src/realtime/sse.py`
- `/Users/jaynowman/dev/atoms-core/src/realtime/ws.py`
- `/Users/jaynowman/dev/atoms-core/src/identity/tickets.py`
- `/Users/jaynowman/dev/atoms-core/src/main.py`

Required Alignment Changes (Backend)
------------------------------------
1) **Transport Roles**
   - WS handles only presence/cursor/gesture/ping.
   - All durable events and chat tokens flow via SSE.

2) **Canonical Stream Key**
   - Single rule for stream_id (e.g., `thread_id || canvas_id || run_id`).
   - SSE and WS use the same stream_id.

3) **Identity Hardening**
   - Require ticket or IdentityMiddleware context.
   - Remove query‑param tenant/project fallbacks.

4) **Contracts Completeness**
   - Add `CommandEnvelope` (mutations).
   - Add `EventEnvelope/DatasetEvent` (logging/audit).
   - Add explicit event types for `token_patch`, `state_patch`, `snapshot_created`.

5) **Sidecar Enforcement**
   - Reject media payloads without refs (`artifact_id`/`uri`/`object_id`).
   - Never inline bytes.

6) **Timeline Partitioning**
   - Store must partition by `tenant_id + stream_id`.
   - No global broadcast queue.

Scope (Atoms‑UI / Atoms‑App)
----------------------------
Primary files (UI transport usage):
- `/Users/jaynowman/dev/atoms-ui/**` (shared CanvasTransport only)
- `/Users/jaynowman/dev/atoms-app/**` (consume transport, no bespoke clients)

Required Alignment Changes (UI)
-------------------------------
1) **Single Transport**
   - Use the shared CanvasTransport from `atoms-ui` only.

2) **SSE Truth**
   - UI reads all state, chat tokens, and snapshot refs from SSE.

3) **WS Ephemeral**
   - WS used only for presence/cursors/gestures.

4) **Sidecar Rendering**
   - Image/video/audio resolved via refs only.

Atomic Task List (Backend Worker)
--------------------------------
ATOMS-RT-ALN-01 — Enforce WS role
- Remove message/state commits from WS.

ATOMS-RT-ALN-02 — Canonical stream_id
- Implement a single stream key function used by SSE + WS + Timeline store.

ATOMS-RT-ALN-03 — Harden identity
- Require ticket or IdentityMiddleware context in SSE/WS.

ATOMS-RT-ALN-04 — Contracts
- Add CommandEnvelope + EventEnvelope/DatasetEvent.

ATOMS-RT-ALN-05 — Sidecar guard
- Validate media payload refs only.

ATOMS-RT-ALN-06 — Timeline partitioning
- Partition store by `tenant_id + stream_id`.

Atomic Task List (UI Worker)
----------------------------
ATOMS-RT-UI-01 — Use shared CanvasTransport only
ATOMS-RT-UI-02 — SSE truth wiring
ATOMS-RT-UI-03 — WS presence only
ATOMS-RT-UI-04 — Sidecar rendering by refs

Kickoff — Backend Worker (Realtime Alignment)
---------------------------------------------
Work root: `/Users/jaynowman/dev`
Read first:
- `/Users/jaynowman/dev/docs/plans/2026-01-27_realtime-collab-contract-and-atomic-task-plan.md`
- `/Users/jaynowman/dev/docs/plans/2026-01-28_realtime-retrofit-alignment.md`
- `/Users/jaynowman/dev/atoms-core/AGENTS.md`

Hard guardrails:
- No `.env` files.
- SSE truth; WS ephemeral only.
- Sidecars refs only (no bytes).

Deliverables:
- Enforce WS role (presence/gesture only).
- Canonical stream_id used by SSE/WS/timeline.
- Identity hardened (ticket or middleware only).
- CommandEnvelope + EventEnvelope/DatasetEvent added.
- Sidecar guard enforced.
- Timeline partitioned by tenant + stream_id.

Kickoff — UI Worker (Realtime Alignment)
----------------------------------------
Work root: `/Users/jaynowman/dev`
Read first:
- `/Users/jaynowman/dev/docs/plans/2026-01-27_realtime-collab-contract-and-atomic-task-plan.md`
- `/Users/jaynowman/dev/docs/plans/2026-01-28_realtime-retrofit-alignment.md`
- `/Users/jaynowman/dev/atoms-ui/agents.md`
- `/Users/jaynowman/dev/atoms-app/AGENTS.md`

Hard guardrails:
- Single CanvasTransport only.
- SSE truth; WS ephemeral only.
- Sidecars refs only.

Deliverables:
- UI consumes SSE truth only.
- WS presence/cursor only.
- Sidecar rendering via refs only.
