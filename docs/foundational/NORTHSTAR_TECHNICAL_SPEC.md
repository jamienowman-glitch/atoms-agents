# Northstar Technical Specification (Authoritative)

All behavior ties to current code paths; new components are named and scoped to avoid registry/card drift. Identity headers are mandatory: `X-Mode (saas|enterprise|lab)`, `X-Tenant-Id`, `X-Project-Id`, `X-Request-Id`, plus `X-Trace-Id`/`X-Run-Id`/`X-Step-Id`/`X-Surface-Id`/`X-App-Id`/`X-User-Id` as available. Actor/user IDs derive from auth tokens, not client choice.

## /northstar-engines
- **Tool Invocation Gate**
  - Endpoint: `POST /actions/execute` (existing) is the choke point for all tool/muscle invocations.
  - Behavior: builds `RequestContext`, enforces tenant membership/roles, then runs `GateChain` (`kill_switch` → `firearms` → `strategy_lock` → `budget`/`kpi`/`temperature`). Emits `SAFETY_DECISION` event to timeline and `audit` DatasetEvent.
  - Contract: callers must include `action_name`, `subject_type`, `subject_id`; `surface_id/app_id` optional but recommended for policy scoping.
  - Side effects: emit to `event_spine` (`event_type=budget|strategy_lock|safety` as appropriate, source=agent|tool|ui) and `analytics_store`.

- **Durability Services**
  - Event Spine: `POST /events/append`, `GET /events/replay`, `GET /events/list` via `EventSpineService` routed by `routing_registry` (FireStore/Dynamo/Cosmos). Required fields: tenant/mode/run_id/event_type/source with run/step/trace propagation.
  - Memory Store: `POST/GET/DELETE /memory` (existing routes) with routing-backed adapters for persistent session memory.
  - Blackboard Store: `PUT/GET /blackboard/{run_id}/entries/{key}` (router) with optimistic versioning and routing-backed adapters.
  - Timeline Store: `GET /realtime/timeline/{stream_id}/list`, `POST /realtime/timeline/{stream_id}/append` with backend guard (filesystem forbidden in sellable modes) for replayable stream events.

- **Canvas Command & Stream**
  - Commands: Expose `POST /canvas/{canvas_id}/commands` (alias existing `canvas_commands` service) accepting UI `Command` envelope (base_rev, ops[], actor_id, correlation_id/idempotency_key). Server maps to `CommandEnvelope` and enforces:
    - isolation (`verify_canvas_access`), GateChain action=`canvas_command`, strategy lock/firearms/budget checks,
    - optimistic concurrency on `base_rev`,
    - idempotency via durable store (replace in-memory repo with routing-backed persistence), returning `head_rev`, `applied_ops`, `recovery_ops` on conflict, and standardized error envelope `{error.code,message,expected_rev?,details?}`.
  - Snapshot: `GET /canvas/{canvas_id}/snapshot` returns last committed revision + atoms state reconstructed from durable command log/timeline.
  - Replay: `GET /canvas/{canvas_id}/replay?after_event_id=` streams committed events in order (reuse timeline store) for reconnect.
  - SSE: `GET /sse/canvas/{canvas_id}` (existing) streams `StreamEvent` (commit/gesture/safety_decision) honoring `Last-Event-ID` for replay; enforces tenant isolation.
  - Gestures: `POST /canvas/{canvas_id}/gestures` publishes gesture events through GateChain and feature-flag controls.
  - Artifacts/Audit: `POST /canvas/{canvas_id}/artifacts` and `POST /canvas/{canvas_id}/audits` remain authoritative for uploads/audit reports.

- **Safety & Policy**
  - Firearms: `POST /firearms/licences`, `GET /firearms/licences`, `POST /firearms/{id}/revoke` (service exists) with enforcement through GateChain `DANGEROUS_ACTIONS`.
  - Strategy Lock: `POST /strategy-locks`, `GET /strategy-locks`, `PATCH /strategy-locks/{id}`, `POST /strategy-locks/{id}/approve|reject`; GateChain uses `require_strategy_lock_or_raise`.
  - Kill Switch/Budget/KPI/Temperature: enforced inside `GateChain` for every tool/canvas action; budget usage recorded via `BudgetService.record_usage`.

- **Discovery & Routing**
  - Routing registry: `POST /routing/routes`, `GET /routing/routes` is the authoritative backend selector for all durability services (event_spine, memory_store, blackboard_store, analytics_store, event_stream, canvas_command_store).
  - Error Envelope: standardize on `{error.code, message, context?}` across all routes (event_spine/budget/strategy_lock/actions/canvas) for predictable client handling.

- **Authoritative Data**
  - Event truth: event_spine records (tenant/mode/project/run/step) are the source of truth for audit/usage/safety.
  - Canvas truth: durable command store + timeline stream; SSE is read-only view.

## /northstar-agents
- **Context & Identity**
  - Agents must construct `AgentsRequestContext` from caller token/headers (no defaults in saas/enterprise); propagate `tenant_id/mode/project_id/request_id/trace_id/run_id/step_id/surface_id/app_id/user_id`.
  - Actor_id must derive from token/user_id; do not accept client-supplied actor values.

- **Tool/Muscle Invocation**
  - All tool/muscle execution (framework adapters, node execution) routes through Engines `/actions/execute` with `action_name` = tool id or capability, `subject_type` = thread/canvas/run, `subject_id` = run_id/canvas_id/thread_id.
  - Agents emit audit/usage events to Engines: `event_spine.append` (source=agent), `budget.post_usage` for LLM/tool invocations with storage_class=cost, and `analytics.ingest` for UX telemetry.
  - Enforce PII and train_ok before sending any prompt/response to Engines/LLMs; use existing guardrails where present.

- **Durable State**
  - Replace in-memory blackboard with Engines blackboard_store via `PUT/GET /blackboard` (routing-backed); include `run_id` and optimistic version tokens.
  - Session memory reads/writes use Engines memory_store with TTL as needed.
  - Run/trace/step IDs must be generated once per request and forwarded to all engines calls and LLM gateways.

- **Registry & Discovery**
  - Keep existing registry cards unchanged. Add read-only discovery endpoints surfaced by `server.api`:
    - `GET /registry/nodes`, `GET /registry/flows`, `GET /registry/personas`, `GET /registry/tasks`, `GET /registry/providers`, `GET /registry/models`
    - `GET /registry/nodes/{id}`, `GET /registry/flows/{id}`
  - Discovery responses include source (registry/workspace), card type, and version hash to allow UI caching.

- **Canvas/Replay Integration**
  - When an agent tool mutates canvas state, it must call Engines `POST /canvas/{id}/commands` with idempotency_key and base_rev from SSE replay; no local file/state writes.
  - For replay/resume, agents request `GET /canvas/{id}/snapshot` then `GET /canvas/{id}/replay` with cursor to reconstruct state before applying new tool output.

- **Error Handling**
  - Agents normalize upstream errors into shared envelope `{error.code,message,http_status,upstream}` and surface gate blocks distinctly (firearms/strategy_lock/budget/kill_switch).

## /ui
- **Identity & Headers**
  - UI uses `buildIdentityHeaders` to send `Authorization` + identity headers; must supply `X-Mode` ∈ {saas,enterprise,lab}, `X-Tenant-Id`, `X-Project-Id`, `X-Request-Id`; include `X-Run-Id`/`X-Step-Id`/`X-Surface-Id`/`X-App-Id`/`X-User-Id` when known.

- **Canvas Client**
  - Commands: UI sends `POST /canvas/{canvas_id}/commands` with `{base_rev, ops: CanvasOp[], actor_id, correlation_id(idempotency_key)}`; on `conflict`, apply `recovery_ops` then rebase pending ops.
  - SSE: connect to `GET /sse/canvas/{canvas_id}` with `Last-Event-ID` from durable cursor; process `op_committed`, `safety_decision`, `system` events; persist last_event_id locally after server ack.
  - Snapshot/Rehydrate: on load, fetch `GET /canvas/{canvas_id}/snapshot`; play `replay` or SSE gap using `Last-Event-ID`.
  - Artifacts/Audit: upload via `/canvas/{canvas_id}/artifacts`; request audits via `/canvas/{canvas_id}/audits`.

- **Discovery**
  - Query Agents registry discovery endpoints to list tools/nodes/flows/personas/tasks/models/providers; cache version hash; render Atom registry from packaged schemas (`@northstar/ui-atoms`, `@northstar/builder-registry`).

- **Safety Surfacing**
  - Render `safety_decision` events in UI (GateChain blocks) and block local optimistic ops until user resolves; display strategy lock/firearms reasons from error envelope.

## Cross-Repo Flows
- **Tool Invocation Flow**
  1) UI/agent requests tool → Agents runtime builds full context, calls Engines `/actions/execute` with action metadata.  
  2) GateChain enforces kill-switch/firearms/strategy_lock/budget/kpi/temperature.  
  3) On PASS: Engines executes tool/muscle, emits `event_spine` analytics/audit/cost events, returns result with standard envelope. On BLOCK: returns error envelope with gate + reason and emits safety_decision SSE.

- **Canvas Mutation Flow**
  1) UI/agent obtains snapshot + last_event_id; subscribes to `/sse/canvas/{id}`.  
  2) UI/agent submits command to `/canvas/{id}/commands` with base_rev/idempotency_key.  
  3) Engines validates GateChain + strategy_lock/firearms, checks idempotency/rev, persists command to durable store and timeline, emits `canvas_commit` StreamEvent and event_spine audit/analytics.  
  4) Clients receive SSE, ack locals, and rebase pending ops; conflicts return recovery_ops for client-side reapply.  
  5) Replay uses `Last-Event-ID` or `/replay` to restore state.

- **Strategy Lock Lifecycle**
  - Create/update/approve/reject via `/strategy-locks` endpoints (Engines).  
  - GateChain reads approved locks scoped by surface/scope/action and blocks if none or expired/three_wise pending.  
  - Agents/UI must include `surface_id` and action name on every tool/canvas call for lock matching.

- **Firearms Lifecycle**
  - Issue/revoke/list licences via `/firearms` endpoints.  
  - GateChain checks `DANGEROUS_ACTIONS` map for action name; blocks if no active licence.  
  - Agents/UI label high-risk tools/actions accordingly when invoking `/actions/execute` or `/canvas/*/commands`.

- **Discovery & Registry Access**
  - Agents expose read-only registry discovery endpoints; UI consumes to show available flows/nodes/tools/personas/tasks/models/providers.  
  - Engines remain authoritative for backend routing/discovery of durability services via `/routing/routes`.

- **Replay Semantics**
  - Stream events (canvas, safety_decision) carry `routing` + `ids` (request/run/step) and use `Last-Event-ID` for resume.  
  - Event spine `replay` reconstructs audit/usage timeline per run.  
  - Command store supports idempotent re-apply using `idempotency_key` and `base_rev`.
