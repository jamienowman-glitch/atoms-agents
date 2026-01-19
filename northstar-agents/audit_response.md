# Audit Response: Agents Repo (Northstar-Agents)

## 1. Local Agent Commentary
The "Tri-Repo Audit" results align perfectly with my local analysis of `northstar-agents`.
*   **Disconnected Brain CONFIRMED**: The `NodeExecutor` is currently purely blackboard-driven and blind to the Real-Time Canvas State.
*   **GraphLens Solution**: The `TokenMapCard` and `ComponentRunner` (Phase 3) are ready to receive the "Canvas Mirror" logic once the specific Transport Protocols are defined.
*   **Event Schema**: I acknowledge the gap in `AuditEvent` fields (`canvas_type`, `pii_stripped`) vs the Engine's `StreamEvent`.

## 2. Global Tri-Repo Audit Findings (The "Spine-Sync")

**Status**: audit_complete
**Scope**: Engines, Agents, Surface (`agentflow`)

### Protocol Audit
*   **Chat WebSocket**: `/ws/chat/{thread_id}` (Auth enforced).
*   **Chat SSE**: `/sse/chat/{thread_id}` (Legacy/Parallel?).
*   **Canvas SSE**: `/sse/canvas/{canvas_id}` ( Wraps bus messages in `StreamEvent`).
*   **Surface Gap**: `agentflow` (formerly `ui`/`atoms-factory`) uses `EventSource` without headers (Auth Fail) and expects different event snapshot types.
*   **Gesture Transport**: UI expects `/msg/ws` for gestures; Engines only have `/ws/chat`.

### Event Envelope & Schema Gaps
*   **Engines**: `StreamEvent` (realtime) vs `SpineEvent` (storage). Missing `nodeId`, `canvasType`.
*   **Agents**: `AuditEvent` mirrors scope but lacks `pii_stripped`, `canvas_type`.
*   **UI**: Expects `op_committed` / `gesture` formats.
*   **Consolidation Needed**: We need a unified `SpinePayload` that all three repos agree on.

### Spatial Awareness (The "DOM-Unit")
*   **Critical Gap**: No `ResizeObserver` or `SPATIAL_UPDATE` event exists in the pipeline.
*   **Impact**: Agents cannot see if a user manually resizes an element.

---

## 3. The Repo Task Manifest (Consolidated)

### **REPO 1: ENGINES (THE SPINE)**
*   [ ] Extend `StreamEvent` (or define `SpinePayload`) to include `node_id`, `canvas_type`, `pii_stripped`.
*   [ ] align `StreamEvent` (Realtime) and `SpineEvent` (Storage).
*   [ ] Define `SPATIAL_UPDATE` command/event schema.
*   [ ] Review Tenant-Scoped connection keys to prevent collisions.

### **REPO 2: AGENTS (THE BRAINS)**
*   [ ] **Implement Spine Listener**: Create `CanvasMirror` in `NodeExecutor` to subscribe to `/sse/canvas/{id}`.
*   [ ] **Inject State**: Use `TokenMap` lenses to inject subscribed canvas state into the System Prompt.
*   [ ] **Harmonize Events**: Update `AuditEvent` to match the new `SpinePayload` fields.
*   [ ] **Handle Spatial**: Add runtime handler for `SPATIAL_UPDATE` events.

### **REPO 3: ATOMSFAM / AGENTFLOW (THE SURFACE)**
*   [ ] **Fix Transport**: Replace `EventSource` with Authenticated Fetch/SSE or `CanvasTransport`.
*   [ ] **Align Payloads**: Update Workbench commands to match `CommandEnvelope`.
*   [ ] **Implement DOM Unit**: Add `ResizeObserver` hooks to emit `SPATIAL_UPDATE`.
*   [ ] **Map Gestures**: Route gestures through the canonical Canvas Kernel.

---

## 4. Plan & Status
**Current State**: `WAITING_FOR_DECISION`
**Plan**:
1.  **Hold** on Phase 4 (Integration/Wireframe Builder).
2.  **Hold** on implementing the Agent-side listeners until the `SpinePayload` schema is finalized in Engines.
3.  **Ready** to implement the Agents Task Manifest as soon as the signal is given.
