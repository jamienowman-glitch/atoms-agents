# 02 Transport Integrity Plan (Engines)

## Guardrails
- Only modify code inside northstar-engines.
- Do not refactor or merge the Agent Loader or Registry.
- Keep WS chat and SSE canvas split intact.

## Tasks (A1-A5)
- [ ] A1 Implement SanitizerGate in `northstar-engines/engines/logging/event_sink.py` to strip or replace base64-heavy fields before persistence.
- [ ] A2 Apply SanitizerGate in `engines/logging/events/engine.py` before PII strip and backend persistence.
- [ ] A3 Update `engines/whiteboard_store/routes.py` and `engines/blackboard_store/routes.py` to accept `source_node_id` and pass it into run events.
- [ ] A4 Update `engines/realtime/run_stream.py` so run events include `provenance` with `agent_id`, `node_id`, `run_id`, and `edge_id` when provided.
- [ ] A5 Prevent VISUAL_SNAPSHOT persistence in `engines/canvas_stream/service.py` (broadcast only, no durable store).
