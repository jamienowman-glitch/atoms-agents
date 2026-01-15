# Canvas Wire Protocol v1 (FROZEN)

## Overview
This document freezes the wire contract for the Collaborative Canvas. All transport implementations must adhere to this spec.

## 1. Scoping & Connection
*   **Scope**: All connections are scoped to a `CanvasId` (UUID).
*   **Auth**: Bearer token required in query param or header (implementation dependent, current Stub uses `token` query param).
*   **Kill Switch**: Disconnects are granular to the `CanvasId`. Closing the SSE/WS connection effectively "kills" the session for that user device. Server-side ban/kill would reject new connections for the `CanvasId`.

## 2. HTTP Command API
**Endpoint**: `POST /canvas/{canvas_id}/commands`
**Purpose**: Submit optimistic operations.

**Request Payload**:
```json
{
  "base_rev": 10,                 // The revision these ops are built on
  "ops": [ ... ],                 // Array of CanvasOp
  "actor_id": "user-123",         // Who is acting
  "correlation_id": "uuid-v4"     // Idempotency key
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "head_rev": 11
}
```

**Response (409 Conflict)**:
**Guarantees**: The server guarantees that if `REV_MISMATCH` is returned, `recovery_ops` will transform the client's state to be compatible with `expected_rev`.
```json
{
  "code": "REV_MISMATCH",
  "message": "Revision mismatch",
  "expected_rev": 15,             // The server's current head revision
  "recovery_ops": [ ... ]         // Ops the client missed/needs to apply before their op
}
```

## 3. Realtime SSE (Server-Sent Events)
**Endpoint**: `GET /sse/canvas/{canvas_id}`
**Purpose**: Reliable, ordered delivery of committed operations.

**Headers**:
*   `Last-Event-ID`: Sent by client on reconnect to resume stream.

**Event: `op_committed`**
```
id: 11
event: op_committed
data: {
  "rev": 11,
  "ops": [ ... ],
  "actor_id": "user-123"
}
```
*   **Replay Semantics**: Server MUST buffer recent events (e.g., last 100). On reconnect with `Last-Event-ID`, server MUST replay all events `> Last-Event-ID` immediately.

## 4. WebSocket Gestures
**Endpoint**: `WS /msg/ws`
**Purpose**: Ephemeral, high-frequency, loss-tolerant data (cursors).

**Protocol**:
*   **Heartbeat**: Server may send `ping`. Client must respond `pong`.
*   **Gesture**:
    ```json
    {
      "type": "gesture",
      "data": {
        "kind": "caret",
        "actor_id": "user-123",
        "payload": {
          "kind": "caret",
          "atom_id": "text-1",
          "position": { "x": 100, "y": 200 }
        }
      }
    }
    ```

## 5. E2E Conflict Fixture
For validation, the server implements a deterministic conflict simulation.

**Trigger**:
Send a command with `correlation_id: "test-conflict"`.

**Behavior**:
1. Server acts as if it is ahead by N revisions.
2. Server rejects command with `409`.
3. Server returns a deterministic `recovery_op` (e.g., adding a specific "Server Recovery Atom").
4. Client MUST apply `recovery_op`, update its `base_rev`, and rebase its pending ops.
