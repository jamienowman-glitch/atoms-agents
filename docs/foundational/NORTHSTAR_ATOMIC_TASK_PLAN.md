# Phase 4 — Atomic Task Breakdown

## /northstar-engines
- **EN-01: Error envelope standardization**
  - Files: engines/actions/router.py; engines/event_spine/routes.py; engines/budget/routes.py; engines/strategy_lock/routes.py; engines/canvas_commands/router.py
  - Preconditions: Decide canonical envelope shape `{error.code,message,context?}`.
  - Success: All listed routes return standardized error envelope; tests assert error codes for gate blocks/conflicts/missing routes.
  - Unblocks: Agents/UI uniform error handling and safety surfacing.
- **EN-02: GateChain emission & audit wiring**
  - Files: engines/actions/router.py; engines/nexus/hardening/gate_chain.py; engines/logging/audit.py; engines/event_spine/service.py
  - Preconditions: Error envelope (EN-01).
  - Success: Every PASS/BLOCK emits event_spine (analytics/audit) with tenant/mode/project/run/step; safety_decision SSE emitted; firearms/strategy_lock/budget reasons preserved.
  - Unblocks: Contract compliance for tool choke point and firearms/strategy lock visibility.
- **EN-03: Canvas command durability + alias**
  - Files: engines/canvas_commands/service.py; engines/canvas_commands/router.py (add /canvas/{id}/commands alias); engines/canvas_commands/repository.py (persist via routing); engines/realtime/timeline.py
  - Preconditions: Routing registry entries for `canvas_command_store` and `event_stream`.
  - Success: Commands stored durably with idempotency keys; optimistic conflicts return recovery_ops; GateChain enforced; alias path matches UI (`/canvas/{id}/commands`); event_spine + timeline events emitted.
  - Unblocks: UI command flow, Agents canvas mutation path.
- **EN-04: Canvas snapshot/replay endpoints**
  - Files: engines/canvas_commands/router.py (new GET /canvas/{id}/snapshot, GET /canvas/{id}/replay); engines/canvas_commands/service.py (state reconstruct from durable log); engines/canvas_stream/service.py (replay consumes durable timeline).
  - Preconditions: EN-03 persistence in place.
  - Success: Snapshot returns head_rev+state; replay returns ordered events after cursor; SSE honors durable timeline after restart.
  - Unblocks: UI reconnect, Agents resume flows.
- **EN-05: Routing-backed storage enforcement**
  - Files: engines/memory_store/service.py; engines/blackboard_store/service.py; engines/analytics/routing_service.py; engines/event_spine/service.py
  - Preconditions: Routing registry configured.
  - Success: No in-memory/noop fallbacks in saas/enterprise; missing routes return explicit 503 with error.code; tests cover routing required paths.
  - Unblocks: Durable state compliance for agents.

## /northstar-agents
- **AG-01: Strict request context propagation**
  - Files: src/northstar/runtime/context.py; call sites constructing AgentsRequestContext
  - Preconditions: None.
  - Success: saas/enterprise requests fail on missing tenant_id/mode/project_id; actor_id/user_id derived from auth; headers forwarded on EnginesBoundaryClient calls.
  - Unblocks: Correct GateChain enforcement and audit scope.
- **AG-02: Tool choke integration**
  - Files: src/northstar/runtime/node_executor.py; framework adapters under src/northstar/runtime/frameworks/**; src/northstar/engines_boundary/action_envelope.py; src/northstar/engines_boundary/client.py
  - Preconditions: EN-01/EN-02.
  - Success: All tool/muscle invocations call Engines `/actions/execute` with action_name/subject metadata; handle BLOCK via error envelope; emit budget/events via Engines endpoints.
  - Unblocks: Firearms/strategy lock enforcement coverage.
- **AG-03: Durable blackboard & memory wiring**
  - Files: src/northstar/engines_boundary/blackboard_client.py (real paths); src/northstar/runtime/node_executor.py; src/northstar/runtime/executor.py
  - Preconditions: EN-05 routing for blackboard/memory.
  - Success: Blackboard reads/writes call Engines blackboard_store with run_id/version; in-memory dict removed; session memory uses Engines memory_store; tests isolate per run.
  - Unblocks: Multi-node flow consistency.
- **AG-04: Event/budget/audit emission**
  - Files: src/northstar/runtime/node_executor.py; src/northstar/runtime/gateway.py; src/northstar/runtime/profiles.py; EnginesBoundary clients for event_spine/budget/analytics (paths fixed)
  - Preconditions: EN-02, EN-05.
  - Success: Each tool/LLM call emits event_spine (audit/analytics), budget usage with storage_class=cost, and PII redaction before logging; run/trace/step propagated.
  - Unblocks: Usage/audit compliance and replayability.
- **AG-05: Registry discovery API**
  - Files: src/northstar/server/api.py; server routes exposing /registry/*
  - Preconditions: None.
  - Success: Read-only endpoints return registry/workspace nodes/flows/personas/tasks/providers/models with version hash; no card mutation endpoints added.
  - Unblocks: UI discovery integration.
- **AG-06: Canvas command client**
  - Files: src/northstar/engines_boundary/client.py; new canvas command client; flow/node handlers that mutate canvas
  - Preconditions: EN-03/EN-04.
  - Success: Agents submit commands to `/canvas/{id}/commands` with base_rev/idempotency_key and consume snapshot/replay before mutations; handle conflicts via recovery_ops.
  - Unblocks: Agent-driven canvas edits without local state.

## /ui
- **UI-01: Command envelope alignment**
  - Files: packages/transport/src/index.ts; packages/canvas-kernel/src/index.ts; packages/canvas-kernel/src/reducer.ts
  - Preconditions: EN-03 error envelope + command alias.
  - Success: sendCommand payload matches Engines command schema (idempotency_key from correlation_id); handle conflict recovery_ops; store head_rev from responses.
  - Unblocks: Reliable canvas writes.
- **UI-02: Snapshot/replay consumption**
  - Files: packages/transport/src/index.ts; packages/builder-core/src/index.ts
  - Preconditions: EN-04 snapshot/replay endpoints.
  - Success: On load/reconnect, fetch snapshot then replay since cursor before applying ops; `Last-Event-ID` persisted from server cursor not only localStorage; handles SSE gap recovery.
  - Unblocks: Resume after restart; prevents orphan states.
- **UI-03: Safety UX and error envelope**
  - Files: packages/builder-core/src/index.ts; packages/projections/src/index.tsx
  - Preconditions: EN-01 standardized errors.
  - Success: Blocks optimistic ops on safety_decision BLOCK or error envelope; renders gate/reason (firearms/strategy_lock/budget); shows last safety decision per stream.
  - Unblocks: Operator visibility into enforcement.
- **UI-04: Discovery wiring**
  - Files: packages/builder-core/src/index.ts; apps consuming registry; network layer
  - Preconditions: AG-05 registry endpoints.
  - Success: UI fetches registry discovery to list tools/nodes/flows/personas; caches version hash; no hardcoded lists.
    - Unblocks: User-facing selection aligned with registry truth.

## Worker 4: Tool-Canvas Integration (2026-01-03)

### Option A: Engines Recommend Ops
- **Repo**: `northstar-engines`
- **Mechanism**: `POST /actions/execute` emits `tool_completed` event with `recommended_canvas_ops` payload if provided by the tool.
- **Emission**: Configured in `engines/actions/router.py`.

### Option B: Agent Explicit Writes
- **Repo**: `northstar-agents`
- **Mechanism**: Agent explicitly calls `POST /canvas/{id}/commands` after tool execution if system config `tool_canvas_mode` is `agent_writes_ops`.
- **Logic**: Implemented in `NodeExecutor` (Agents) and `EnginesBoundaryClient`.

### Config Switch
- **Key**: `tool_canvas_mode`
- **Values**: `engines_recommend_ops` (default), `agent_writes_ops`
- **Read**: `EnginesBoundaryClient.get_system_config`
