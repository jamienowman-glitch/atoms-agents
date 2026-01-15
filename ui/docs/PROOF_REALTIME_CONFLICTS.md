# PROOF_REALTIME_CONFLICTS.md

## 1. Conflict Protocol (409 REV_MISMATCH)

We use optimistic locking based on `base_rev`. If the client is behind, the server rejects the command with `409 Conflict` and provides `recovery_ops` to bring the client up to speed.

### Payload Shape

**Request (Client -> Server):**
```json
POST /commands
{
  "base_rev": 10,
  "ops": [{ "kind": "add", ... }],
  "actor_id": "user-123",
  "correlation_id": "test-conflict"
}
```

**Response (Server -> Client):**
`HTTP 409 Conflict`
```json
{
  "code": "REV_MISMATCH",
  "message": "Simulated Conflict",
  "expected_rev": 12,  // Server is ahead by 2
  "recovery_ops": [
    {
       "kind": "add",
       "atom": { "id": "server-conflict-box", "properties": { "background": "red" } }
    }
  ]
}
```

**Client Behavior:**
1.  Receives 409.
2.  Calls `kernel.applyRemote([], 12, recovery_ops)`.
3.  Kernel applies `recovery_ops` (Red Box adds).
4.  Kernel sets `committed_rev` to 12.
5.  Kernel rebases local atomic ops on top of new state.

## 2. Realtime Transport (SSE + WS)

### SSE Event (Committed Ops)
Used for reliable syncing of the graph state.

```
id: 15
data: {
  "type": "op_committed",
  "data": {
    "rev": 15,
    "ops": [{ "kind": "update", "atom_id": "text-1", "properties": { "text": "Hello" } }],
    "actor_id": "user-other"
  }
}
```

### WS Packet (Ephemeral Gestures)
Used for high-frequency cursors and drags.

```json
{
  "type": "gesture",
  "data": {
    "kind": "caret",
    "actor_id": "user-456",
    "payload": {
      "kind": "caret",
      "position": { "x": 100, "y": 200 },
      "atom_id": "text-1"
    }
  }
}
```

### Reconnect / Resume
When SSE reconnects, it sends the `Last-Event-ID` header.

**Request:**
`GET /sse/canvas/demo`
`Last-Event-ID: 15`

**Server Logic:**
- Looks up event history.
- Replaies events > 15.
- Client catches up without holes.
