# Phase 1 UI Recon Static Audit

## 1. Executive Summary
The UI is a React-based application ("Studio") communicating with a backend via a `CanvasTransport` layer. Core collaboration features (Canvas, SSE, WebSocket gestures) are implemented and active. However, advanced features like Artifact Uploads, Audits, and detailed Tenancy/Context propagation are defined in the transport layer but **unused or missing** in the actual UI. The backend contract relies heavily on a simple Bearer token for identity, missing standard enterprise headers (Tenant, Env, Project) required by Northstar Engines.

## 2. Confirmed Inventory

| Feature | Exists? | Evidence |
| :--- | :--- | :--- |
| **Collaborative canvas** | **YES** | `apps/studio/src/components/CanvasFrame.tsx` (uses `Ay` kernel, handles `op_committed`, `applyLocal`) |
| **SSE subscription** | **YES** | `packages/transport/src/index.ts` lines 66-107 (EventSource connection, `last_event_id` support) |
| **WebSocket gestures** | **YES** | `packages/transport/src/index.ts` lines 111-145 (Heartbeat, `GestureEvent`) |
| **Upload/binding** | **NO** | `uploadArtifact` method exists in Transport (line 186) but **0 usages** found in `apps/studio` |
| **Debug/proof panels** | **YES** | `apps/studio` "Debug Inspector" overlay with Rev, Actor, Pending Ops, and Reconnect buttons |
| **Logs / drilldown** | **PARTIAL** | Debug panel shows "Pending Ops" count and "Status", but no full event timeline or drilldown UI |
| **Memory UI** | **NO** | No evidence of "Nexus", "Pack", or "HAZE" related UI components or logic |

## 3. Backend Contract Map

### Endpoints
-   **REST Command**: `POST /canvas/:id/commands`
    -   Headers: `Authorization: Bearer <token>`, `X-Idempotency-Key: <correlation_id>`
-   **SSE Stream**: `GET /sse/canvas/:id`
    -   Query: `?token=<token>&last_event_id=<id>`
-   **WebSocket**: `GET /msg/ws` (Upgrade)
    -   Query: `?token=<token>`
-   **Artifacts**: `POST /canvas/:id/artifacts` (Defined but unused)
    -   Headers: `Authorization: Bearer <token>`
    -   Body: `FormData` (file)

### Payloads
**Command Payload** (`packages/contracts/src/index.ts`):
```typescript
interface Command {
    base_rev: number;
    ops: CanvasOp[];
    actor_id: string;
    correlation_id: string;
}
```

**Conflict Payload** (409 Response):
```typescript
{
    code: "REV_MISMATCH",
    expected_rev: number,
    recovery_ops: CanvasOp[]
}
```

**Event Envelope** (SSE/WS):
```typescript
type StreamEvent = 
  | { type: 'op_committed', data: { rev: number, ops: CanvasOp[], actor_id: string } }
  | { type: 'gesture', data: { kind: 'caret'|'drag', payload: any, actor_id: string } }
  | { type: 'system', data: { code: string, message: string } };
```

**Real Event Example** (from `apps/studio` fixtures/code):
```json
{
  "type": "gesture",
  "data": {
    "kind": "caret",
    "payload": {
      "kind": "caret",
      "position": { "x": 100, "y": 200 }
    },
    "actor_id": "user-abc123456"
  }
}
```

## 4. Tenancy + Identity Injection

-   **Authorization**: Injected via `Authorization: Bearer <token>` header (REST/Upload) or `?token=` query param (SSE/WS).
-   **Tenancy Headers**: **UNKNOWN/MISSING**. Search for `X-Tenant`, `X-Env`, `X-Project`, `X-Surface` yielded **no results** in UI code.
-   **Correlation IDs**: Generated client-side (random string) and passed as `X-Idempotency-Key` and in Command body.
-   **Scoping**: UI appears to assume the **Token** explicitly defines the tenant/user scope, with no separate context headers sent.

## 5. Mismatch Scan vs Engines Direction

| Check | Status | Finding |
| :--- | :--- | :--- |
| **Engines RequestContext** | **CONFIRMED MISMATCH** | UI expects Token-only auth. Engines require `X-Tenant`, `X-Env`, etc. Transport layer **does not** inject these. |
| **StreamEvent Envelope** | **MATCH** | UI expects `type`, `data` structure which aligns with generic StreamEvent. |
| **Logs Spine** | **UNKNOWN** | UI shows no awareness of `DatasetEvents` or structured logging beyond basic conflicts. |
| **Replay Durability** | **CONFIRMED MISMATCH** | UI relies on `last_event_id` for resume, but effectively assumes local state is truth or "Snapshot" based. No "Fetch Replay" endpoint observed; only SSE resume. |

## 6. The 5 Unblockers

1.  **Exact Backend WS Path**: `/msg/ws?token=<token>` (Auth via query param). **CONFIRMED**.
2.  **SSE Events Format**: Wrapped Envelope (`{ type: "...", data: { ... } }`), **not** raw ops. **CONFIRMED**.
3.  **Replay Durability**: **Local/Mock detected**. UI initializes from memory snapshot or basic `Ay` kernel. No distinct "fetch replay history" API call found in Transport, only SSE `last_event_id` resume.
4.  **Logs Source of Truth**: **Client-side Kernel (`Ay`)**. The UI treats the local kernel's state as the primary truth, reconciling via SSE events.
5.  **Canonical Cancellation**: **UNKNOWN**. No explicit "cancel run" or "kill job" UI/API found.

## 7. Artifacts
-   `docs/foundational/PHASE_1_UI_RECON_STATIC_AUDIT.md` (This file)
