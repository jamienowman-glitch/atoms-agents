# UI Blockers Atomic Task Plan — 2026-01-05

## northstar-engines
- **ENG-CONFIG-01** — Config precedence + envelope hardening  
  Files: `engines/config_store/service.py`, `engines/config_store/routes.py`, `engines/config_store/tests/test_config_store.py`, `engines/chat/service/server.py` (exception handler wiring).  
  Endpoints: add `GET /config/effective` (surface→tenant→system overlay) while keeping `GET/PUT /config/{scope}`.  
  Routing: `resource_kind="config_store"` (existing).  
  Errors: 503 `config_store.missing_route` on missing route; 400 `config.invalid_scope|config.invalid_tool_canvas_mode`; responses emit top-level `error.http_status`.  
  Tests: precedence overlay, missing-route envelope shape, invalid mode/tool_canvas_mode, handler returns envelope (no `detail` wrapper).  
  Acceptance: deterministic overlay, http_status propagated, no local defaults.

- **ENG-WS-AUTH-01** — Ticket auth envelope for WS/SSE  
  Files: `engines/chat/service/ws_transport.py`, `engines/chat/service/sse_transport.py`, `engines/identity/ticket_service.py` (error codes), `engines/chat/service/tests/test_ws_hardening.py`, `engines/chat/service/tests/test_sse_transport.py`.  
  Endpoints: `/ws/chat/{thread_id}`, `/sse/chat/{thread_id}`.  
  Routing: realtime registry unchanged.  
  Errors: 401 `auth.ticket_missing`, 401 `auth.ticket_invalid`, 403 `auth.tenant_mismatch`; WS sends one JSON envelope then closes code `4003`.  
  Tests: invalid/missing ticket → envelope + close; reconnect reuses ticket until TTL; resume_cursor uses server cursor.

- **ENG-SSE-CANVAS-01** — Canvas SSE ticket + cursor enforcement  
  Files: `engines/canvas_stream/router.py`, `engines/canvas_stream/tests/test_sse_rail.py`, `engines/common/error_envelope.py` (use `cursor_invalid_error`).  
  Endpoints: `/sse/canvas/{canvas_id}` accepts `ticket` query; invalid cursor → 410 envelope; missing ticket/auth → 401 envelope.  
  Routing: realtime registry unchanged.  
  Tests: ticket success/failure, 410 on invalid `Last-Event-ID`, resume cursor emitted.

- **ENG-REGISTRY-01** — Component/Atom registry service  
  Files: new `engines/registry/routes.py`, `engines/registry/service.py`, `engines/registry/repository.py`, `engines/registry/tests/test_registry_routes.py`; mount in `engines/chat/service/server.py`.  
  Endpoints: `GET /registry/components`, `GET /registry/atoms`; support `If-None-Match`/`ETag`.  
  Routing: `resource_kind="component_registry"` via `TabularStoreService`; 503 `component_registry.missing_route` on missing route.  
  Errors: 503 missing-route; 400 schema validation failures; envelopes include `http_status`.  
  Tests: missing-route 503, restart-safe persistence (write/read after registry re-init), ETag 304, AtomSpec schema validation.

- **ENG-ERROR-01** — Global envelope passthrough  
  Files: `engines/chat/service/http_transport.py` (or shared middleware), `engines/chat/service/server.py`, `engines/tests/test_error_envelope_http.py`.  
  Behavior: HTTP errors return `{error:{...}}` (no `detail` wrapper) with `http_status` populated.  
  Tests: representative endpoints (config_store, chat) return envelope with `http_status`, gate codes preserved.

## ui
- **UI-ID-01** — Identity header contract hardening  
  Files: `packages/transport/src/identity_headers.ts`, `packages/transport/src/context.ts`, `apps/studio/src/main.tsx` (session_id provisioning), tests in `packages/transport/src/identity_headers.test.ts`.  
  Behavior: modes limited to `saas|enterprise|lab` (no `t_system`), session_id propagated/stable but only allowed in lab behind explicit gate; tenant_id/project_id required for saas/enterprise; request_id per call.  
  Errors: throw before network on invalid mode/missing tenant/project (saas/enterprise).  
  Tests: header build succeeds/fails per mode, session_id stability.

- **UI-ENV-01** — Envelope parsing alignment  
  Files: `packages/transport/src/envelope.ts`, `packages/transport/src/transport.test.ts`.  
  Behavior: read `error.http_status` from envelope (nested), map `config_store.missing_route` → ServiceUnavailable, gate codes surfaced.  
  Tests: parse envelopes emitted by Engines (with/without top-level `http_status`), ensure 503/410 map correctly.

- **UI-CONFIG-01** — Config precedence and error surfacing  
  Files: `packages/transport/src/config_client.ts`, `packages/builder-core/src/index.ts`, `apps/studio/src/App.tsx` (display).  
  Behavior: fetch scopes in order `surface→tenant→system`, stop on first non-empty; surface missing-route 503 surfaces to UI; no hardcoded defaults.  
  Tests: precedence chain, 503 bubbles, tool_canvas_mode validation propagated.

- **UI-WS-01** — Browser WS auth alignment  
  Files: `packages/transport/src/index.ts`, `packages/transport/src/transport.test.ts`.  
  Behavior: connect to `/ws/chat/{canvasId}` (canvasId as thread_id), fetch ticket from `POST /api/auth/ticket` when no Authorization, include `ticket` in hello; use server resume_cursor; on close with envelope 401/403 trigger resnapshot/replay.  
  Tests: handshake sends ticket + hello context, invalid ticket triggers retry, 410 triggers resnapshot hook.

- **UI-SSE-01** — Canvas/Chat SSE cursor + ticket handling  
  Files: `packages/transport/src/index.ts`, `packages/transport/src/transport.test.ts`.  
  Behavior: send `ticket` on SSE URLs, treat Last-Event-ID as hint, clear cache on 410, stop using stale localStorage-only cursors.  
  Tests: 410 clears persisted cursor, ticket query added, 503 surfaced.

- **UI-REGISTRY-01** — Remote registry source of truth  
  Files: `packages/builder-registry/src/service.ts`, `packages/builder-registry/src/service.test.ts`, `packages/builder-core/src/index.ts`.  
  Behavior: for saas/enterprise always call `/registry/components`; lab-only fallback guarded by explicit flag; honor ETag; 503 `component_registry.missing_route` surfaced; AtomSpec token surfaces honored.  
  Tests: ETag caching, missing-route handling, flag gating, schema validation.

## northstar-agents
- **AGENTS-ID-01** — Identity precedence enforcement  
  Files: `src/northstar/runtime/context.py`, `tests/runtime/test_context.py`.  
  Behavior: modes restricted to saas|enterprise|lab; tenant_id+project_id mandatory for saas/enterprise; lab fallback only when explicit flag set; propagate session_id when provided.  
  Errors: raise on missing tenant/project in saas/enterprise.  
  Tests: header parsing per mode, lab flag gating.

- **AGENTS-REGISTRY-01** — Align EnginesBoundary client to canonical registry  
  Files: `src/northstar/engines_boundary/client.py`, new tests in `tests/engines_boundary/test_client.py`.  
  Behavior: new `get_registry_components` calling `/registry/components` with identity headers; adopt envelope parsing; drop `/registry/system-config` assumption.  
  Errors: bubble `component_registry.missing_route` envelopes.  
  Tests: successful fetch, 503 envelope surfaced.
