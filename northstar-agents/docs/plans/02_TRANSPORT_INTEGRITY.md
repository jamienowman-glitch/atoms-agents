# 02 Transport Integrity Plan (Agents)

## Guardrails
- Only modify code inside northstar-agents.
- Do not refactor or merge the Agent Loader or Registry.
- Keep transport split intact; do not route visuals into chat.

## Tasks (B1-B4)
- [ ] B1 Update `src/northstar/runtime/node_executor.py` to emit thought visibility (public/internal/system), defaulting chain-of-thought to internal.
- [ ] B2 Update `src/northstar/runtime/memory_gateway.py` to send provenance (`agent_id`, `source_node_id`) on whiteboard/blackboard writes.
- [ ] B3 Implement a sidecar uploader for VISUAL_SNAPSHOT (new module under `src/northstar/runtime/`) that stores images and emits only a URI.
- [ ] B4 Harden `src/northstar/runtime/canvas_mirror.py` (or a dedicated visual listener) to store only sidecar references, never raw base64.
