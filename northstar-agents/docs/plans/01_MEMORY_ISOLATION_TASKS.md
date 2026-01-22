# Memory Isolation Tasks (Agents)

## Guardrails (Agents)
- [ ] No global blackboard dicts; use edge-scoped blackboards only.
- [ ] Deterministic edge_id required and validated.
- [ ] run_id required for all memory calls; edge_id required for blackboard calls.
- [ ] No local fallback for infra blackboard in sellable modes.
- [ ] modified_by_user_id must be present on all writes (ensure user_id in context).

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
