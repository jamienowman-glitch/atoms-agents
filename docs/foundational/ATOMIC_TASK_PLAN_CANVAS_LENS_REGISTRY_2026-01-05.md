# Atomic Task Plan — Canvas/Lens/Registry (2026-01-05)

## northstar-engines
- **ENG-CFG-OVERLAY**  
  Files: engines/config_store/routes.py, engines/config_store/service.py, engines/config_store/tests/test_config_store.py, engines/chat/service/server.py (mount middleware).  
  Endpoints: add `GET /config/effective` (surface→tenant→system overlay). Keep `GET/PUT /config/{scope}`.  
  Resource_kind: config_store (existing).  
  Tests: overlay precedence, tool_canvas_mode validation, missing-route 503 envelope (top-level `error.http_status`).  
  Acceptance: deterministic overlay, 503 emitted via canonical envelope, no local defaults, restart-safe via routing store.

- **ENG-ERR-MW**  
  Files: engines/common/error_envelope.py, engines/chat/service/server.py (exception handler/middleware), new tests engines/tests/test_error_envelope_http.py.  
  Endpoints: applies to all HTTP routes.  
  Resource_kind: n/a.  
  Tests: config_store and chat routes return top-level envelope (no `detail`), gate preserved.  
  Acceptance: every HTTPException serialized as canonical envelope with http_status.

- **ENG-WS-SSE-AUTH**  
  Files: engines/chat/service/ws_transport.py, engines/chat/service/sse_transport.py, engines/chat/service/tests/test_ws_hardening.py, engines/chat/service/tests/test_sse_transport.py.  
  Endpoints: `/ws/chat/{thread_id}`, `/sse/chat/{thread_id}`.  
  Resource_kind: ws_chat/sse_chat.  
  Tests: missing/invalid ticket -> 401/403 envelope then WS close code 4003; tenant mismatch; resume_cursor uses server cursor.  
  Acceptance: envelope emitted, ticket reuse until TTL, 410 on invalid cursor.

- **ENG-CANVAS-SSE-TICKET**  
  Files: engines/canvas_stream/router.py, engines/canvas_stream/tests/test_sse_rail.py.  
  Endpoints: `/sse/canvas/{canvas_id}` accepts `ticket` query; uses cursor_invalid_error for bad cursor.  
  Resource_kind: canvas_stream.  
  Tests: ticket success/failure envelopes, 410 on invalid Last-Event-ID, resume cursor event, missing route 503 (if routed store absent).  
  Acceptance: reconnect with ticket resumes safely; 503/410 envelopes correct.

- **ENG-REGISTRY-SVC**  
  Files: engines/registry/routes.py (new), engines/registry/service.py (new), engines/registry/repository.py (new), engines/registry/tests/test_registry_routes.py; mount in engines/chat/service/server.py.  
  Endpoints: `GET /registry/specs`, `GET /registry/specs/{id}`; support If-None-Match/ETag.  
  Resource_kind: component_registry (new routed store).  
  Tests: missing-route 503 envelope, ETag 304, restart-safe persistence via routing store, Spec schema validation.  
  Acceptance: registry reads survive restart; 503 on missing route; http_status present.

## northstar-agents
- **AG-REGISTRY-API**  
  Files: src/northstar/registry/api.py (new FastAPI/Flask layer or existing server wiring), src/northstar/registry/store.py (new), tests/registry/test_registry_api.py.  
  Endpoints: `GET /registry/specs`, `GET /registry/specs/{id}` (owning API).  
  Resource_kind: registry_store (routed; 503 on missing).  
  Tests: list/fetch specs, missing-route envelope, ETag handling.  
  Acceptance: API serves Spec payload with etag/version_hash; 503 envelope on missing route.

- **AG-REGISTRY-SEED**  
  Files: add new specs (no edits to existing cards) under src/northstar/registry/cards/specs/{builder_button.yml, graphlens_agent_flow.yml}.  
  Endpoints: consumed by AG-REGISTRY-API.  
  Resource_kind: registry_store (if persisted); filesystem fallback allowed only for lab flag.  
  Tests: tests/registry/test_specs_load.py ensures required fields (id, kind, version, schema, defaults, controls, token_surface, etag).  
  Acceptance: at least one Builder atom spec and one GraphLens spec available via API.

- **AG-IDENTITY-HARDEN**  
  Files: src/northstar/runtime/context.py, tests/runtime/test_context.py.  
  Endpoints: affects all outbound headers.  
  Resource_kind: n/a.  
  Tests: saas/enterprise require tenant_id+project_id; lab fallback only with flag; session_id propagation.  
  Acceptance: clients cannot synthesize tenant/project in sellable modes.

## ui
- **UI-ENVELOPE-PARSE**  
  Files: packages/transport/src/envelope.ts, packages/transport/src/transport.test.ts.  
  Endpoints: all fetch/WS/SSE parsing.  
  Resource_kind: n/a.  
  Tests: parse canonical envelopes with http_status, map 503/410/gate codes, handle WS close envelope.  
  Acceptance: UI surfaces gate and status reliably.

- **UI-IDENTITY-CONTRACT**  
  Files: packages/transport/src/identity_headers.ts, packages/transport/src/context.ts, apps/studio/src/main.tsx; tests packages/transport/src/identity_headers.test.ts.  
  Endpoints: all requests.  
  Resource_kind: n/a.  
  Tests: reject mode `t_system`, require tenant/project for saas/enterprise, session_id stable (lab-gated).  
  Acceptance: invalid identity rejected client-side before network.

- **UI-WS-SSE-ALIGN**  
  Files: packages/transport/src/index.ts, packages/transport/src/transport.test.ts.  
  Endpoints: `/ws/chat/{thread_id}`, `/sse/chat/{thread_id}`, `/sse/canvas/{canvas_id}`.  
  Resource_kind: ws_chat, sse_chat, canvas_stream.  
  Tests: hello includes ticket + context; 401/403 envelope triggers resnapshot; 410 clears cursor; ticket query used for SSE.  
  Acceptance: reconnect uses server cursor; no stale local-storage-only resume.

- **UI-REGISTRY-REMOTE**  
  Files: packages/builder-registry/src/service.ts, packages/builder-registry/src/service.test.ts, packages/builder-core/src/index.ts.  
  Endpoints: `GET /registry/specs`, `GET /registry/specs/{id}`.  
  Resource_kind: component_registry.  
  Tests: ETag caching, missing-route 503 surfaced, lab flag gates local fallback, Spec fields enforced (schema/defaults/controls/token_surface).  
  Acceptance: SaaS/Enterprise use remote specs; one Builder atom + GraphLens spec renders inspector.

- **UI-CONFIG-PREC**  
  Files: packages/transport/src/config_client.ts, packages/builder-core/src/index.ts, apps/studio/src/App.tsx.  
  Endpoints: `/config/{scope}`, `/config/effective` (new).  
  Resource_kind: config_store.  
  Tests: surface→tenant→system precedence, missing-route 503 bubbles, tool_canvas_mode validation.  
  Acceptance: no hardcoded defaults; toggle reflects server values.
