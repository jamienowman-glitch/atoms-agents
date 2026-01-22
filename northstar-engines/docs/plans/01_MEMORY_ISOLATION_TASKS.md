# Memory Isolation Tasks (Engines)

## Guardrails (Engines)
- [ ] Deterministic edge_id only; no UUIDs for edges.
- [ ] Hard require run_id for whiteboard and run_id + edge_id for blackboard (400 on missing).
- [ ] Storage key is (tenant_id, project_id, run_id, edge_id, key).
- [ ] modified_by_user_id is required on every write; derive from auth context.
- [ ] No fallback to in-memory/global state in sellable modes.

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
