# Phase 1 — Reality Scan

## 1.1 What Engines Already Guarantees
| Capability | Current Behavior / Guarantee | Evidence |
| --- | --- | --- |
| Event spine durability | Routed append-only event store with required tenant/mode/run fields, append/replay APIs, and validation; backends Firestore/Dynamo/Cosmos via routing registry. | northstar-engines/engines/event_spine/service.py; northstar-engines/engines/event_spine/routes.py; northstar-engines/engines/event_spine/validation_service.py |
| Memory store | Durable session memory keyed by tenant/mode/project/user/session with TTL; backend resolved via routing registry. | northstar-engines/engines/memory_store/service.py; northstar-engines/engines/memory_store/routes.py |
| Blackboard store | Durable, versioned shared state with optimistic concurrency; routing-based backend selection. | northstar-engines/engines/blackboard_store/service.py; northstar-engines/engines/blackboard_store/routes.py |
| Realtime timeline | Stream timeline append/list with routing guard; disallows filesystem backend in sellable modes. | northstar-engines/engines/realtime/timeline.py; northstar-engines/engines/realtime/routes.py |
| Budget usage/policy | Records cost events with storage_class=cost, policy CRUD/query with tenant membership enforcement. | northstar-engines/engines/budget/service.py; northstar-engines/engines/budget/routes.py |
| Analytics store | Routed ingest/query with missing-route enforcement; supports Firestore/Dynamo/Cosmos. | northstar-engines/engines/analytics/routing_service.py; northstar-engines/engines/analytics/routes.py |
| Audit logging & PII | Audit events emitted as DatasetEvent with PII strip/train_ok before persistence to Nexus backend. | northstar-engines/engines/logging/audit.py; northstar-engines/engines/logging/events/engine.py; northstar-engines/engines/dataset/events/schemas.py |
| Routing control plane | Persistent resource_kind→backend registry with FastAPI routes for CRUD and diagnostics. | northstar-engines/engines/routing/registry.py; northstar-engines/engines/routing/routes.py |
| Identity enforcement | RequestContext requires X-Mode/X-Tenant-Id/X-Project-Id, rejects X-Env, normalizes mode; validates server precedence. | northstar-engines/engines/common/identity.py |
| AuthZ gate | JWT/Cognito auth dependencies with tenant membership/role checks. | northstar-engines/engines/identity/auth.py |
| GateChain choke point | `/actions/execute` runs kill-switch → firearms → strategy-lock → budget/KPI/temperature gates and emits safety/audit events. | northstar-engines/engines/actions/router.py; northstar-engines/engines/nexus/hardening/gate_chain.py |
| Strategy lock enforcement | Create/list/get/update/approve/reject locks; require_strategy_lock_or_raise for actions. | northstar-engines/engines/strategy_lock/service.py; northstar-engines/engines/strategy_lock/routes.py |
| Firearms licensing | Licence issue/revoke/get/list with dangerous-action map; require_licence_or_raise used by GateChain. | northstar-engines/engines/firearms/service.py |

## 1.2 What Agents Already Owns
| Component | Current State | Evidence / Do Not Touch |
| --- | --- | --- |
| Registry loader & card directories | Loads framework_modes, profiles, providers, models, capabilities, capability_bindings, personas, tasks, artifact_specs, nodes, flows, overlays, tenants, policy_packs, budgets, nexus_profiles from YAML. | northstar-agents/src/northstar/registry/loader.py; card YAML under northstar-agents/src/northstar/registry/cards/** (must not modify existing cards/registries) |
| Card schemas | FlowCard/NodeCard and other card dataclasses define flow/node/persona/task/model structures. | northstar-agents/src/northstar/registry/schemas/*.py (e.g., flows.py, nodes.py, capabilities.py) |
| Runtime context | AgentsRequestContext builds headers, defaults missing tenant/project/mode to lab/p_default; actor_id/user_id optional. | northstar-agents/src/northstar/runtime/context.py |
| Flow execution | FlowExecutor validates DAG and executes nodes with in-memory blackboard dict, writing report artifacts locally. | northstar-agents/src/northstar/runtime/executor.py |
| Engines boundary stubs | Clients for event_spine/blackboard have placeholder UNKNOWN paths; EnginesBoundaryClient builds requests with headers only. | northstar-agents/src/northstar/engines_boundary/event_spine_client.py; northstar-agents/src/northstar/engines_boundary/blackboard_client.py; northstar-agents/src/northstar/engines_boundary/client.py |
| Server discovery APIs | APIHandler exposes discovery for nodes/flows/personas/tasks/providers/models and detail endpoints; saves workspace cards. | northstar-agents/src/northstar/server/api.py |
| Framework adapters | Framework implementations live under runtime/frameworks (langgraph, crewai, autogen, strands, bedrock, adk). | northstar-agents/src/northstar/runtime/frameworks/** |
| Gateway/contracts | LLMGateway interface and capability toggles defined for providers/models. | northstar-agents/src/northstar/runtime/gateway.py |

## 1.3 What UI Already Implements
| Capability | Current Behavior | Evidence |
| --- | --- | --- |
| Canvas contract | Atom/CanvasOp schema (add/remove/update/move), Command/CommandResponse, stream event shapes including safety_decision. | ui/packages/contracts/src/index.ts |
| Canvas kernel | Optimistic local ops, remote apply/ack, pending queue, snapshot/revision tracking. | ui/packages/canvas-kernel/src/index.ts; ui/packages/canvas-kernel/src/reducer.ts |
| Transport | CanvasTransport manages SSE/WS, stores lastEventId in localStorage, builds identity headers (X-Mode/X-Tenant-Id/X-Project-Id/request/run/step optional), sends commands/uploads/audit. | ui/packages/transport/src/index.ts; ui/packages/transport/src/identity_headers.ts |
| Builder runtime | useBuilder wires kernel + transport, handles op apply/ack, stores canvas state to localStorage, listens for safety_decision events. | ui/packages/builder-core/src/index.ts |
| Atom registry/rendering | AtomRegistry React components and CanvasView renderer with cursor overlay. | ui/packages/ui-atoms/src/index.tsx; ui/packages/projections/src/index.tsx |
| Component schemas | Builder registry defines schema for atoms/sections (settings, defaults, allowed blocks). | ui/packages/builder-registry/src/models.ts |
