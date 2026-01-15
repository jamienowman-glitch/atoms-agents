# Engines Alignment Matrix

| Area | Status | Notes / Paths |
| --- | --- | --- |
| Mode-only headers (X-Mode/X-Tenant-Id/X-Project-Id) | PARTIAL | `packages/transport/src/identity_headers.ts` enforces headers but allows `t_system` mode; `apps/studio`/`builder-core` default context uses `lab` and can synthesize user_id; no guard against missing tenant/project in SaaS/Enterprise. |
| Authorization on HTTP/SSE/WS | PARTIAL | HTTP + SSE fetches include `Authorization`/`X-*` via `composeHeaders` in `packages/transport/src/index.ts`; WebSocket handshake uses bare URL with no headers, relies on post-open hello message. |
| Error envelope parsing | FAIL | `packages/transport/src/index.ts` and `packages/builder-core/src/index.ts` check `res.ok`/status only; no canonical `{error.code,message,http_status,details,gate}` parsing; 503/410/403 are not normalized. |
| Canvas snapshot/replay/SSE 410 handling | FAIL | `CanvasTransport.fetchSnapshot`/`connectSSE_Fetch`/`connect` do not handle 410 invalid cursor; reconnect loops never resnapshot, rely on localStorage cursor cache; no replay gap logic. |
| Conflicts / recovery_ops on 409 | PARTIAL | `sendCommand` returns `{ success: false, error, head_rev }` for 409; `useBuilder` applies `recovery_ops` to kernel but does not reissue original op or enforce idempotency key semantics; no test coverage. |
| Identity derivation (actor/user) | FAIL | `useBuilder` generates fallback `actorId` and default `ENGINE_CONTEXT` injects random `user_id`; UI can override server identity instead of propagating token-derived identity. |
| Config/tool_canvas_mode consumption | MISSING | No calls to config store; `tool_canvas_mode` not read; builders run with hardcoded defaults. |
| Registry/discovery | PARTIAL | `RegistryService` fetches `/registry/components` with identity headers but lacks missing-route/503 handling; `useBuilder` falls back to local `SCHEMAS` without source-of-truth versioning. |
| Safety/gate handling | PARTIAL | SafetyDecision events recorded in `CanvasTransport` and surfaced in UI; blocking semantics not enforced (optimistic ops still apply on 403 blocks; no gate-aware UI disable). |
| Missing-route 503 behavior | FAIL | No detection; failed fetches throw generic errors (`fetchSnapshot`, registry, commands); envelopes ignored. |
