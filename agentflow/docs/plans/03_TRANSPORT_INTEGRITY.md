# 03 Transport Integrity Plan (UI)

## Guardrails
- Only modify code inside agentflow.
- Do not touch northstar-engines or northstar-agents.
- Keep Chat WS and Canvas SSE separate; do not collapse streams.

## Tasks (C1-C3)
- [ ] C1 Update `components/workbench/ConsoleContext.tsx` to subscribe to `/sse/run/{run_id}` alongside existing streams.
- [ ] C2 Handle WHITEBOARD_WRITE and BLACKBOARD_WRITE run events to update the Token Editor with run-global vs edge-scoped data.
- [ ] C3 Implement visibility filtering in the Chat stream (hide internal thoughts by default).
