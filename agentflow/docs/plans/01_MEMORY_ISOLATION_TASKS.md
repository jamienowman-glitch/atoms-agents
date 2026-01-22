# Memory Isolation Tasks (Agentflow UI)

## Guardrails (UI)
- [ ] Deterministic edge_id only; no UUID edge IDs.
- [ ] Require run_id and edge_id in all memory API payloads.
- [ ] UI must not assume backend imports or cross-repo symbols.
- [ ] No global in-memory state treated as durable.

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
