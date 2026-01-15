# Engines Interface Questions (Streaming & Realtime)
**Goal:** Establish the canonical transport + event contract that Core should publish into, ensuring a "live feel" without Core re-implementing the WS/SSE stack.

## 1) "Where do stream events go?"
- [x] What is the single canonical realtime rail for product UI?
  - **ANSWER:** `northstar-engines` currently supports **both** WebSocket and SSE.
  - **WebSocket:** `ws://.../ws/chat/{thread_id}` (Defined in `engines/chat/service/ws_transport.py`)
  - **SSE:** `http://.../sse/chat/{thread_id}` and `http://.../sse/canvas/{canvas_id}` (Defined in `engines/chat/service/sse_transport.py`)
  - **Recommendation:** WebSocket is more robust (heartbeats, presence) but SSE is used for Canvas.
- [x] WebSocket endpoint(s) and/or SSE endpoint(s)?
  - See above. Both exist.
- [x] Do you want Core to run in-process inside Engines (preferred) or as a separate service that Engines calls?
  - **ANSWER:** In-process. `engines/chat/pipeline.py` imports `llm_client` and calls `stream_chat` directly. Core adapters should likely be invoked similarly as a library function that yields chunks.

## 2) Canonical event schema (must be explicit)
Provide the exact JSON shape for stream events that UI expects.
Minimum events we need for canvas + chat:
- [ ] `run_start`, `run_end`
- [ ] `node_start`, `node_end` (or "step")
- [ ] `agent_message` (text payload)
- [ ] `token_chunk` (optional but supported)
- [ ] `artifact_written` (path/id + preview)
- [ ] `blackboard_update` (diff or full snapshot)
- [ ] `error` (typed + recoverability)
Required IDs on every event:
- [x] `request_id` -> Not explicitly in `Message` schema. Use `id`?
- [x] `tenant_id` -> Inferred from context, not in `Message`.
- [x] `env` -> Inferred.
- [x] `thread_id` (chat) -> **YES**.
- [x] `canvas_id` (if used) -> Used as `thread_id` in Canvas stream.
- [x] `run_id` -> Not in `Message`.
- [x] `step_id` / `node_id` -> Not in `Message`.
- [ ] `agent_id` -> Mapped to `sender.id`.

**CURRENT REALITY:**
 The current `Message` contract (`engines/chat/contracts.py`) is rigid:
 ```python
 class Message(BaseModel):
     id: str
     thread_id: str
     sender: Contact
     text: str  <-- payload goes here
     created_at: datetime
     role: str
 ```
 *Gap:* Core will need to stuff structured event data (run_id, node_id, type) into the `text` field (as JSON) or the `Message` schema needs to accept a `metadata` or `payload` dict. Canvas currently wraps events in `text` as `{"type": ..., "data": ...}`.

## 3) Routing rules + isolation
- [x] How do you map a stream to tenant isolation?
  - **ANSWER:**
    - **WS:** Token in query param (`?token=...`) decoded to `AuthContext`.
    - **SSE:** `Authorization` header.
    - `tenant_id` must match the token claims.
- [x] What keys/IDs are required to subscribe?
  - **ANSWER:** `thread_id`.
- [x] What prevents "guess thread_id" attacks? (Confirm current auth handshake)
  - **ANSWER:** Currently relies on `AuthContext`. `ws_transport.py` has a placeholder `TODO: Verify thread_id belongs to tenant_id`. It is NOT strictly enforced yet beyond checking valid Auth token.

## 4) Persistence + resume
- [x] Are streams replayable after reconnect?
  - **ANSWER:** **Yes**, via `InMemoryBus`.
  - **SSE:** Supports `Last-Event-ID` header.
  - **WS:** No explicit resume protocol in `ws_transport.py` yet (simple connect), but `bus.get_messages(after_id=...)` supports it.
- [x] Where are events stored (in-memory vs Firestore vs other)?
  - **ANSWER:** `InMemoryBus` (`endpoints/chat/service/transport_layer.py`). Ephemeral.
- [x] What is the data retention policy?
  - **ANSWER:** Process lifetime (In-Memory). Long term persistence happens via `Nexus` (`pipeline.py` writes snippets).

## 5) Cancellation / stop (critical for runaway prevention)
- [x] What is the official "cancel run" mechanism?
  - **ANSWER:** **None** implementation for per-run cancellation found in `pipeline.py`.
- [x] Endpoint + required IDs?
  - **ANSWER:** Global `KillSwitch` exists (`/kill-switches`) for tenants/owners.
- [x] Expected behaviour mid-stream (stop within turn, between nodes, immediate)?
  - **ANSWER:** Current pipeline is **synchronous** blocking iteration. Cannot interrupt easily without process kill or async restructuring.
- [ ] Do you have a standard "heartbeat/keepalive" pattern?
  - **ANSWER:** **Yes**, `ws_transport.py` implements a 30s PING/PONG heartbeat.

## 6) Timeouts and backpressure
- [x] Default timeouts for: model call, node execution, whole run, idle stream.
  - **ANSWER:** None explicit.
- [x] Backpressure rules: If UI is slow, do you buffer, drop, or disconnect?
  - **ANSWER:** `anyio.from_thread.run(manager.broadcast, ...)` suggests unbound buffering or fire-and-forget.
- [x] Max message size per event?
  - **ANSWER:** No limit enforced in code.

## 7) Integration hook for Core
We need the "producer" interface Engines wants Core to call:
- [x] **Option A:** Core yields `AsyncIterator[StreamChunk]` and Engines forwards to WS/SSE
  - **ANSWER:** Current `pipeline.py` uses `iterable` (sync) loop over `stream_callable`. Adapting to `AsyncIterator` is the natural evolution.
- [ ] **Option B:** Core calls an Engines emitter like `emit_event(ctx, event)` as it runs
*Which option is preferred?* **Option A** fits the current pattern.

## 8) Artifact storage rules
- [x] Where should Core write artifacts for tests/runs (local disk vs object store)?
  - **ANSWER:** **Nexus** for text/JSON snippets. **GCS** via `drivers.storage` for binary blobs (images/videos).
  - Canvas currently uses an `InMemoryArtifactStorage` stub (Phase 04), but production should use the `GcsClient`.
- [x] Naming convention for:
    - run logs -> **Nexus Snippets** (ID: `{thread_id}-{sender.id}` or random UUID). Stored in `nexus_events` or `nexus_snippets` Firestore collections.
    - artifact files -> **GCS Keys**: `{tenant_id}/media/{asset_id}/{filename}` or `{tenant_id}/datasets/{path}`.
    - correlation to `run_id` -> Not explicitly correlated in storage path; must be linked via `NexusDocument.metadata` or `DatasetEvent.metadata`.
