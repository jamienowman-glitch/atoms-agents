# Atomic Task Plan (All Repos) — 2026-01-04

## /northstar-engines

- **EN-ERR-01 (Envelope Standardization)**  
  - Files: `engines/common/error_envelope.py`, `engines/actions/router.py`, `engines/event_spine/routes.py`, `engines/budget/routes.py`, `engines/strategy_lock/routes.py`, `engines/canvas_commands/router.py`, `engines/chat/service/*`, `engines/blackboard_store/routes.py`, `engines/memory_store/routes.py`.  
  - Endpoints: all listed; ensure 503/410 use canonical envelope.  
  - resource_kind: n/a (shared helper).  
  - Acceptance: every 4xx/5xx returns `{error.code,message,http_status,details,gate?}`; tests assert gate codes and missing-route 503 for each service.  
  - Tests: new unit/integration asserting envelope shape for actions, event_spine missing route, canvas conflict, chat cursor invalid.

- **EN-FIRE-01 (Firearms Policy Store)**  
  - Files: `engines/firearms/repository.py`, `engines/firearms/service.py`, `engines/firearms/routes.py`, `engines/nexus/hardening/gate_chain.py`.  
  - Endpoints: `GET/PUT /firearms/policy`, `GET/PUT /firearms/grants`.  
  - resource_kind: `firearms_policy_store`.  
  - Acceptance: policies/grants persisted via routing (Firestore/Dynamo/Cosmos); GateChain pulls bindings/grants from store (no `DANGEROUS_ACTIONS` constant); missing route → 503 envelope; per-tenant/surface scope enforced.  
  - Tests: happy path append/read, missing-route 503, gate block when grant absent, replay after restart.

- **EN-STRAT-01 (Strategy Policy Store)**  
  - Files: `engines/strategy_lock/config_repository.py`, `engines/strategy_lock/repository.py`, `engines/strategy_lock/resolution.py`, `engines/strategy_lock/routes.py`.  
  - Endpoints: `GET/PUT /strategy-lock/policy`.  
  - resource_kind: `strategy_policy_store`.  
  - Acceptance: strategy requirements stored durably (no in-memory defaults); GateChain consults policy independently of firearms; missing route → 503 envelope; 410 on stale cursor if replayed.  
  - Tests: policy read/write by surface, GateChain block when policy demands lock, restart durability, missing-route 503.

- **EN-CHAT-01 (Chat Store + Cursor Replay)**  
  - Files: `engines/chat/service/transport_layer.py`, `engines/chat/service/routes.py`, `engines/chat/service/sse_transport.py`, `engines/realtime/timeline.py`, new `engines/chat/store_service.py` (if needed).  
  - Endpoints: `POST /chat/threads/{thread_id}/messages`, `GET /chat/threads/{thread_id}/messages?cursor=`, `GET /chat/threads/{thread_id}/snapshot`, `GET /sse/chat/{thread_id}`.  
  - resource_kind: `chat_store` (plus `event_stream` for SSE).  
  - Acceptance: append/list backed by routed store; SSE replays from store cursor; invalid cursor → 410 envelope; missing route → 503; redis/memory removed in sellable modes.  
  - Tests: append+replay after restart, 410 on bad cursor, SSE resume with Last-Event-ID, missing-route 503.

- **EN-CONF-01 (Config Store)**  
  - Files: new config service/router under `engines/config_store/*`, `engines/actions/router.py` (read toggles), `engines/feature_flags` (if reused).  
  - Endpoints: `GET/PUT /config/{scope}`.  
  - resource_kind: `config_store`.  
  - Acceptance: system/tenant/surface configs persisted via routing; missing route → 503 envelope; GateChain/tool-canvas mode reads from store (no defaults); multi-cloud examples documented.  
  - Tests: write/read per scope, override precedence, missing-route 503.

- **EN-CAN-01 (Canvas Durability & Replay)**  
  - Files: `engines/canvas_commands/service.py`, `engines/canvas_commands/store_service.py`, `engines/canvas_commands/router.py`, `engines/realtime/timeline.py`, `engines/canvas_stream/service.py`.  
  - Endpoints: `POST /canvas/{id}/commands`, `GET /canvas/{id}/snapshot`, `GET /canvas/{id}/replay?cursor=`, `GET /sse/canvas/{id}`.  
  - resource_kind: `canvas_command_store`, `event_stream`.  
  - Acceptance: commands persisted via routing (idempotency key + rev); snapshot rebuilds from store; replay uses durable timeline with 410 on invalid cursor; missing route → 503; no in-memory repo.  
  - Tests: restart replay, conflict handling returns recovery_ops, missing-route 503, SSE resume after restart.

- **EN-ROUTE-01 (Routing Coverage + Diagnostics)**  
  - Files: `engines/realtime/timeline.py`, `engines/routing/registry.py` (diagnostics endpoint), `engines/common/error_envelope.py`.  
  - Endpoints: diagnostics (new) listing routes for `chat_store`, `config_store`, `firearms_policy_store`, `strategy_policy_store`, `canvas_command_store`, `event_stream`.  
  - resource_kind: all above.  
  - Acceptance: route resolution uses request context (tenant/mode/project); diagnostics shows active/missing; missing routes return 503 envelope not RuntimeError.  
  - Tests: diagnostics output per tenant, missing-route detection for each new kind.

## /northstar-agents

- **AG-CTX-01 (Strict Request Context)**  
  - Files: `src/northstar/runtime/context.py`, call sites constructing `AgentsRequestContext`.  
  - Endpoints: all engines calls via boundary client (headers).  
  - resource_kind: n/a.  
  - Acceptance: saas/enterprise require tenant_id/mode/project_id (no LAB default); actor/user derived from auth; headers forwarded to Engines.  
  - Tests: context creation fails without tenant/project in saas/enterprise; headers set on boundary calls.

- **AG-ENDPOINT-01 (Boundary Alignment)**  
  - Files: `src/northstar/engines_boundary/client.py`, `src/northstar/engines_boundary/event_spine_client.py`, `src/northstar/engines_boundary/blackboard_client.py`.  
  - Endpoints: align to canonical `/actions/execute`, `/events/append`, `/canvas/{id}/commands`, `/config/{scope}`, `/firearms/*`, `/strategy-lock/*`.  
  - resource_kind: uses envelope from Engines.  
  - Acceptance: no `UNKNOWN` or wrong `/api/v1` prefixes; error envelope parsed for gates; tests cover happy-path + 503/410 handling.  
  - Tests: client unit tests for path formation and envelope parsing.

- **AG-BB-01 (Durable Blackboard/Memory Wiring)**  
  - Files: `src/northstar/runtime/profiles.py`, `src/northstar/runtime/node_executor.py`, `src/northstar/runtime/remote_blackboard.py`.  
  - Endpoints: `/blackboard/*`, `/memory` (existing engines).  
  - resource_kind: `blackboard_store`, `memory_store`.  
  - Acceptance: no filesystem/local fallbacks in saas/enterprise; NodeExecutor uses `Blackboard` interface backed by Engines clients; tests isolate per run.  
  - Tests: run execution writes/reads via Engines mock, failure when route missing.

- **AG-EMIT-01 (Event/Budget/Audit Emission)**  
  - Files: `src/northstar/runtime/node_executor.py`, `src/northstar/runtime/gateway.py` (or equivalent), `src/northstar/engines_boundary/client.py`.  
  - Endpoints: `/events/append`, `/budget/usage`, `/analytics/ingest` using envelope.  
  - resource_kind: `event_spine`, `budget_store`, `analytics_store`.  
  - Acceptance: every tool/LLM call emits audit/usage with envelope handling; no silent drops; tests cover 503 missing-route behavior.  
  - Tests: integration mocks asserting payloads and error propagation.

## /ui

- **UI-REPLAY-01 (Canvas Replay & 410 Handling)**  
  - Files: `packages/transport/src/index.ts`, `packages/builder-core/src/index.ts`, `packages/canvas-kernel/src/index.ts`.  
  - Endpoints: `GET /canvas/{id}/snapshot`, `GET /canvas/{id}/replay?cursor=`, `GET /sse/canvas/{id}`, `POST /canvas/{id}/commands`.  
  - resource_kind: consumes `canvas_command_store` + `event_stream`.  
  - Acceptance: on load, fetch snapshot then replay gap (no reliance on localStorage as truth); 410 triggers re-snapshot + replay; cursors persisted from server responses; pending ops rebase on recovery_ops.  
  - Tests: transport unit tests for 410 handling; builder-core integration replaying after simulated restart.

- **UI-UX-01 (Safety/Error Envelope Surfacing)**  
  - Files: `packages/transport/src/index.ts`, `packages/builder-core/src/index.ts`, `packages/projections/src/index.tsx`.  
  - Endpoints: all Engines calls.  
  - resource_kind: consumes envelope.  
  - Acceptance: render gate (firearms/strategy_lock/budget) from envelope; block optimistic ops on BLOCK; show last safety decision per stream.  
  - Tests: UI unit tests for envelope parsing; e2e stub verifying block UX.

- **UI-CONFIG-01 (Config Toggle Consumption)**  
  - Files: `packages/transport/src/index.ts`, `packages/builder-core/src/index.ts`.  
  - Endpoints: `GET /config/{scope}`.  
  - resource_kind: `config_store`.  
  - Acceptance: builder reads `tool_canvas_mode` (and other toggles) from config_store; no hardcoded defaults in production modes; handles 503 gracefully.  
  - Tests: transport mock tests for config fetch + fallback messaging.

> All tasks: no in-memory/filesystem defaults in saas/enterprise; missing routes must fail with 503 envelope.
