# Memory Isolation Master Plan (Phase 2)

## Guardrails (Global)
- [ ] Deterministic edge_id only: `edge_` + sha256(source_node_id + "::" + target_node_id + "::" + connection_handle)[0:32].
- [ ] Hard require run_id for all whiteboard operations; hard require edge_id + run_id for all blackboard operations.
- [ ] Storage key is (tenant_id, project_id, run_id, edge_id, key). Whiteboard uses edge_id="global".
- [ ] Every write must include modified_by_user_id derived from auth context; missing user_id is a hard error.
- [ ] No global in-memory dicts or implicit fallbacks in sellable modes.

## Repository: northstar-engines

### Whiteboard (rename run_memory)
- [ ] Add whiteboard resource kind constants in `engines/routing/resource_kinds.py`.
- [ ] Create `engines/whiteboard_store/cloud_whiteboard_store.py` (run_memory adapter; edge_id="global").
- [ ] Add modified_by_user_id and modified_at fields to whiteboard records and responses.
- [ ] Create `engines/whiteboard_store/service.py` with run_id required and no blackboard fallback.
- [ ] Create `engines/whiteboard_store/service_reject.py` (missing route 503; no lab fallback).
- [ ] Create `engines/whiteboard_store/routes.py` for /whiteboard/write, /whiteboard/read, /whiteboard/list-keys.
- [ ] Wire whiteboard router in `engines/chat/service/server.py`.
- [ ] Remove run_memory router or add 410 deprecation handler.

### Blackboard (edge-scoped)
- [ ] Add edge_id to blackboard request/response models in `engines/blackboard_store/routes.py`.
- [ ] Enforce run_id + edge_id required in blackboard routes (hard 400).
- [ ] Update `engines/blackboard_store/service.py` to require edge_id.
- [ ] Update `engines/blackboard_store/service_reject.py` to require edge_id and remove lab fallback.
- [ ] Update `engines/blackboard_store/cloud_blackboard_store.py` keying to include edge_id.
- [ ] Add modified_by_user_id and modified_at fields to blackboard records and responses.
- [ ] Update list_keys to filter by edge_id.

### Run Stream Broadcast (SSE)
- [ ] Add run stream publish helper to emit events keyed by run_id.
- [ ] Emit `whiteboard.write` on whiteboard write.
- [ ] Emit `blackboard.write` on blackboard write.
- [ ] Add `/sse/run/{run_id}` router with identity enforcement and Last-Event-ID replay.

### Tests
- [ ] Whiteboard: missing run_id -> 400; version conflict -> 409; modified_by_user_id required.
- [ ] Blackboard: missing edge_id -> 400; cross-edge isolation; modified_by_user_id required.
- [ ] SSE run stream: event shape and routing keys.

## Repository: northstar-agents

### Graph Schema and Parsing
- [ ] Extend Flow edge schema in `src/northstar/registry/schemas/flows.py` to require edge_id, source_handle, target_handle, connection_handle.
- [ ] Update `src/northstar/registry/parsers.py` to require edge_id and validate deterministic hash.
- [ ] Add deterministic edge_id helper (new module).
- [ ] Update example flow YAML to include edge_id and handles.

### Memory Gateway
- [ ] Add MemoryGateway protocol and MemoryRecord types (new module).
- [ ] Implement HttpMemoryGateway using EnginesBoundaryClient for /whiteboard/* and /blackboard/*.
- [ ] Add get_inbound_blackboards to return namespaced results keyed by edge_id.

### Runtime Wiring
- [ ] Extend `src/northstar/runtime/context.py` to include memory gateway and run_id.
- [ ] Update `src/northstar/runtime/profiles.py` to honor infra blackboard with no local fallback.
- [ ] Update `src/northstar/runtime/executor.py` to compute inbound/outbound edges per node.
- [ ] Update `src/northstar/runtime/node_executor.py` to accept inbound blackboards and use gateway writes.
- [ ] Fetch inbound blackboards by edge_id and pass namespaced dict to composer.
- [ ] Write outputs to each outbound edge_id via blackboard gateway.
- [ ] Update `src/northstar/runtime/prompting/composer.py` to accept namespaced inputs and honor blackboard_reads.
- [ ] Remove global blackboard dict usage in flow/server/CLI entrypoints.

### Entry Points and Tests
- [ ] Ensure server API uses a single run_id across flow execution.
- [ ] Update CLI runner to provide AgentsRequestContext with run_id and user_id.
- [ ] Add tests for edge_id validation and no cross-edge bleed.
- [ ] Add gateway tests for required run_id/edge_id behavior.
- [ ] Update `northstar-agents/Agent.md` and `northstar-agents/Skill.md` to restate no-global-state and deterministic edge_id.

## Repository: agentflow

### Graph Edge Identity
- [ ] Extend GraphEdge type in `lib/LensRegistry.ts` to include edge_id, source_handle, target_handle, connection_handle.
- [ ] Add deterministic edge_id helper (sha256) in UI library.
- [ ] Update edge creation in `AgentflowApp.tsx` to compute connection_handle and deterministic edge_id.
- [ ] Persist edge_id and handles in LensRegistry export/import.
- [ ] Use edge_id as the stable key for edge rendering.

### UI Surfaces (Whiteboard vs Blackboard)
- [ ] Add edge selection state and inspector panel showing edge_id and handles.
- [ ] Add graph-global whiteboard panel distinct from node inspector.
- [ ] Add flow-level whiteboard data container (GraphFlow field or separate store).
- [ ] Update GraphTokenEditor to render whiteboard and edge blackboard data separately.
- [ ] Add stub API module for /whiteboard and /blackboard (run_id + edge_id required).

### UI Tests
- [ ] Add UI test verifying deterministic edge_id for the same edge inputs.

## Cross-Functional Tasks (Monorepo Access Required)
- [ ] End-to-end smoke: Agentflow edge_id -> Agents gateway -> Engines write -> SSE run stream event.
- [ ] Update durability docs for whiteboard/blackboard rename + edge scoping:
  - `docs/engines/ENGINES_DURABILITY_TODO_BREAKDOWN.md`
  - `docs/engines/ENGINES_DURABILITY_HANDOFF.md`

## Worker Strategy (Access Level)
- [ ] Engines workers: sub-repo access only (`northstar-engines`).
- [ ] Agents workers: sub-repo access only (`northstar-agents`).
- [ ] UI workers: sub-repo access only (`agentflow`).
- [ ] Cross-functional tasks require explicit monorepo access; stop if not assigned.
