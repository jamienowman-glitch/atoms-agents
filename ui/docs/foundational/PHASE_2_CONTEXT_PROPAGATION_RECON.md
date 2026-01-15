# Phase 2 Context Propagation Recon (STRICT)

## 1. Repo Entrypoints
*   **Startup/Wiring**: `apps/studio/src/components/CanvasFrame.tsx` (Component mounting, `CanvasTransport` instantiation).
*   **Transport Layer**: `packages/transport/src/index.ts` (`CanvasTransport` class, `connect`, `sendCommand`).
*   **App Root**: `apps/studio/src/main.tsx` (Mounts `CanvasFrame` via `App.tsx`).

## 2. Current Contract Map

| Operation | URL/Path | Auth Method | Headers | Payload Shape |
| :--- | :--- | :--- | :--- | :--- |
| **Command** | `POST /canvas/:id/commands` | `Authorization: Bearer <token>` | `X-Idempotency-Key` | `{ base_rev, ops, actor_id, correlation_id }` |
| **SSE Stream** | `GET /sse/canvas/:id` | Query `?token=<token>` | None | Wrapped Envelope (`StreamEvent`) |
| **WS Gestures** | `/msg/ws` | Query `?token=<token>` | None | Wrapped Envelope (`StreamEvent`) |
| **Uploads** | `POST /canvas/:id/artifacts` | `Authorization: Bearer <token>` | None | `FormData` (file) |
| **Audits** | `POST /canvas/:id/audits` | `Authorization: Bearer <token>` | None | `{ ruleset }` |

## 3. Current Context Status

| Context Field | Status | Evidence |
| :--- | :--- | :--- |
| **tenant_id** | **MISSING** | No `tenant_id` or `X-Tenant-Id` found in `CanvasFrame.tsx` or `transport`. |
| **env** | **MISSING** | No `env` field found. Config is hardcoded to localhost. |
| **project_id** | **MISSING** | No `project_id` or `X-Project-Id` found. |
| **canvas_id** | **PRESENT** | Passed to `connect(canvasId)` in `CanvasFrame.tsx`. Hardcoded as `"canvas-demo"`. |
| **actor_id** | **PARTIAL** | Generated client-side (`"user-" + random`). Not derived from auth/server. |

## 4. Minimal Context Contract Draft (UI-side)

```typescript
type NsEnv = 'saas' | 'enterprise' | 'lab';

type RequestContext = {
  tenant_id: string;        // t_system allowed; others from auth/context
  env: NsEnv;
  project_id: string;
  user_id?: string;
  actor_id: string;         // used for attribution + gestures
  canvas_id?: string;
  surface_id?: string;      // optional, if you find a concept of "surface"
};
```

## 5. Injection Point Recommendation
**Recommendation**: The `CanvasTransport` constructor in `packages/transport/src/index.ts` is the single best choke point.
If we add `RequestContext` (or individual fields) to the `TransportConfig` interface, we can reference `this.config.context` in:
1.  `connectSSE` (append to URL search params).
2.  `connectWS` (append to URL search params).
3.  `sendCommand` / `uploadArtifact` (inject into Request Headers).

## 6. Top 10 Integration Mismatch Risks
1.  **Missing Tenant Header**: Engines will reject requests (401/403) without `X-Tenant-Id`.
2.  **Missing Env Header**: Engines will reject without `X-Env`.
3.  **Client-Side Actor ID**: UI generates random actor IDs, but Engines likely expect actor IDs derived from the Auth Token (JWT) or strict User ID.
4.  **Hardcoded Canvas ID**: `canvas-demo` usage implies no routing/persistence for real canvases yet.
5.  **Token Scoping**: UI assumes the Token contains all scope; Engines likely require explicit headers for routing (e.g. Project isolation).
6.  **No Project ID**: UI cannot support multi-project tenants without a place to store/pass `project_id`.
7.  **SSE Auth Query**: Passing tokens in URL params (SSE/WS) is often logged by proxies; risk if not short-lived tickets.
8.  **Replay Reliability**: UI relies on `last_event_id` resume, assuming server retains history indefinitely (untrue for standard SSE buffers).
9.  **No "Surface" Concept**: UI has no "Surface ID" to distinguish between Studio vs. Embed vs. Mobile usage.
10. **Hardcoded Config**: `localhost:8000` is hardcoded; no current mechanism to switch between `saas` / `enterprise` endpoints.

## 7. Five Concrete Questions for Engines
1.  What are the **exact header names** required for Tenant, Env, and Project? (`X-Tenant-Id` vs `X-Tenant`, etc.)
2.  Does the WebSocket endpoint accept `Authorization` headers during Upgrade, or **must** we use `?token=` query params?
3.  Is `actor_id` strictly validated against the Auth Token's subject, or can the client specify a "delegated" actor (e.g. for agents)?
4.  For SSE resume, does the backend support `Last-Event-ID` header, or only the query parameter?
5.  What is the source of truth for `canvas_id` creation? Does the UI generate a UUID, or must it request creation from a factory endpoint first?
