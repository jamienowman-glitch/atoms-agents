# Memory Isolation Implementation Plan

## Goal Description
Implement strict memory isolation protocols to prevent data leakage between agent steps. This involves enforcing edge-specific blackboards (whiteboards/blackboards) accessed via a deterministic `edge_id`, and removing all reliance on global state dictionaries.

## User Review Required
> [!IMPORTANT]
> This is a breaking change for the Runtime. Any existing flows without `edge_id`s in their definition will fail validation until migrated.
> Global `run_context` usage will be removed.

## Proposed Changes

### Registry & Schema
#### [MODIFY] [flows.py](file:///Users/jaynowman/dev/northstar-agents/src/northstar/registry/schemas/flows.py)
- Update `FlowEdge` schema to include `edge_id` (required), `source_handle`, `target_handle`, `connection_handle`.

#### [MODIFY] [parsers.py](file:///Users/jaynowman/dev/northstar-agents/src/northstar/registry/parsers.py)
- Validate presence of `edge_id`.
- Validate `edge_id` matches deterministic hash of (source, target, handles).

#### [NEW] [identifiers.py](file:///Users/jaynowman/dev/northstar-agents/src/northstar/core/identifiers.py)
- Implement `generate_deterministic_edge_id(source_node, source_handle, target_node, target_handle)`.

### Memory Gateway
#### [NEW] [memory_gateway.py](file:///Users/jaynowman/dev/northstar-agents/src/northstar/runtime/memory_gateway.py)
- Define `MemoryGateway` Protocol.
- Define `MemoryRecord` TypedDict.
- Implement `HttpMemoryGateway` using `EnginesBoundaryClient`.
  - methods: `read_whiteboard`, `write_blackboard`, `get_inbound_blackboards`.

### Runtime Wiring (The "Spine")
#### [MODIFY] [context.py](file:///Users/jaynowman/dev/northstar-agents/src/northstar/runtime/context.py)
- Add `memory_gateway: MemoryGateway` to `AgentsRequestContext`.
- Add `run_id: str` to `AgentsRequestContext`.

#### [MODIFY] [executor.py](file:///Users/jaynowman/dev/northstar-agents/src/northstar/runtime/executor.py)
- In `execute_flow`:
  - Compute inbound/outbound edges for each node step.
  - Pass `edge_ids` to `NodeExecutor`.

#### [MODIFY] [node_executor.py](file:///Users/jaynowman/dev/northstar-agents/src/northstar/runtime/node_executor.py)
- Use `gateway.get_inbound_blackboards(edge_ids)` to fetch inputs.
- Pass namespaced inputs to `Composer`.
- Write outputs to `gateway` via `edge_id`.

#### [MODIFY] [composer.py](file:///Users/jaynowman/dev/northstar-agents/src/northstar/runtime/prompting/composer.py)
- Refactor variable resolution to look in namespaced `inbound_blackboards` instead of global context.

## Verification Plan

### Automated Tests
- Create `tests/runtime/test_memory_isolation.py`:
  - Verify deterministic ID generation.
  - Verify `HttpMemoryGateway` calls correct endpoints.
  - Verify `NodeExecutor` correctly reads/writes from gateway.
- Run `pytest tests/runtime/test_memory_isolation.py`.

### Manual Verification
- Run a simple flow using the CLI and verify `edge_id`s are generated and data is passed.
