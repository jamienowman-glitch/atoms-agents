# Collaborative Canvas Contract (Transport, Visibility, Attribution)
Status: Approved
Version: 1.1
Applies to: northstar-agents, northstar-engines, agentflow
Audience: Documentation Team

## 0. Scope and Non-Goals
- This contract defines transport, visibility, attribution, and heavy-asset rules.
- Non-goal: Refactor or merge the Agent Loader or Registry. Personas, Manifests, Capabilities, Models, Frameworks, and Modes remain strictly separate.

## 1. Streams of Truth (Do Not Mix)
1) Narrative (User Facing)
   - Purpose: User-visible messages and agent outputs.
   - Transport: Chat WS only.
   - Persistence: Yes (timeline + dataset logs).
2) System (Dev Facing)
   - Purpose: Stack traces, latency, connection errors, guardrail outcomes.
   - Transport: Ops logs + audit chain; not streamed into user UI.
   - Persistence: Yes (ops/audit storage classes).
3) Visuals (Ephemeral)
   - Purpose: Visual snapshots, canvases, and vision payloads.
   - Transport: Canvas SSE only.
   - Persistence: No text logs, no DB writes of raw pixels.
4) State (Run Context)
   - Purpose: Whiteboard and Blackboard changes.
   - Transport: Run SSE (`/sse/run/{run_id}`).
   - Persistence: Yes (run stream + durable storage).

## 2. Visibility Protocol
Visibility is mandatory for all narrative/system outputs.
Visibility enum:
- public: safe for UI display.
- internal: chain-of-thought or scratch; never shown by default.
- system: machine-facing logs; never shown to end users.

Rules:
- Chain-of-thought MUST be flagged as internal.
- The UI must default-hide internal messages and only reveal them in debug tooling.
- System events must never flow through the chat UI.

Recommended placement:
- Stream events: `data.visibility`
- Dataset/audit logs: `metadata.visibility`

Defaulting:
- Chat messages default to public if not specified.
- System events default to system if not specified.
- Visual events are not part of the narrative stream.

## 3. Attribution Protocol (Provenance Schema)
Every state-changing event must include provenance:
```
provenance: {
  agent_id: string,
  node_id: string,
  run_id: string,
  edge_id?: string
}
```
Rules:
- agent_id maps to the actor running the node.
- node_id is required for all agent-driven writes.
- run_id is required for all state and run events.
- edge_id is required for blackboard updates (edge-scoped).
- Whiteboard updates MUST use run-global semantics (no edge_id or edge_id="global").

Where this lives:
- Stream events: `data.provenance`
- Whiteboard/Blackboard HTTP writes: `source_node_id` in the request and reflected in emitted run events.

## 4. Heavy Asset Protocol (Sidecar Rule)
Rule: NO Base64 payloads larger than 2KB may enter logs, timelines, or dataset/audit storage.

Requirements:
- Visual snapshots must be uploaded to ArtifactStore (S3 or equivalent).
- Events carry only references:
  - `media_payload.sidecars[].uri` or `artifact_id`
- The event stream MAY include small inline blobs up to 2KB for diagnostic markers only.

Sanitization:
- Any event payload > 2KB or matching base64 patterns must be truncated or replaced with:
  `{"redacted": true, "original_size": n, "sha256": "...", "uri": "..."}`

## 5. State Scoping (Hard Law)
- Whiteboard = Run-Global (entire flow context).
- Blackboard = Edge-Scoped (handover between Node A -> Node B).
- Edge scope is mandatory for blackboard writes.
- Whiteboard writes must never be edge-specific.

## 6. Transport Routing Summary
- Chat WS: `/ws/chat/{thread_id}` (narrative only).
- Canvas SSE: `/sse/canvas/{canvas_id}` (visuals only).
- Run SSE: `/sse/run/{run_id}` (state updates only).
- Console/UI MUST subscribe to all three: Chat WS, Canvas SSE, and Run SSE.
- Visual snapshots never enter the chat pipeline.

## 7. Compliance Checklist
- Every event has visibility.
- Every state update has provenance.
- No raw base64 > 2KB in logs or DB.
- Visuals use sidecars and are SSE-only.
- UI subscribes to Run Stream and respects visibility filtering.

End of contract.
