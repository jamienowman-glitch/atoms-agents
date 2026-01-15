# Northstar System Usage Guide (2026-01-03)

## Invoking a Tool
- Build identity headers: `Authorization: Bearer <token>`, `X-Mode (saas|enterprise|lab)`, `X-Tenant-Id`, `X-Project-Id`, `X-Request-Id`; include `X-Trace-Id`/`X-Run-Id`/`X-Step-Id`/`X-Surface-Id`/`X-App-Id`/`X-User-Id` when known.
- POST `/actions/execute` with `{action_name, subject_type, subject_id, surface_id?, app_id?, payload?}`. The action_name should match the tool/capability id; subject ties to run/thread/canvas.
- Handle responses: `status=PASS` returns tool result; `status=BLOCK` or HTTP 4xx returns error envelope with `error.code` (firearms_licence_required, strategy_lock_required, budget_blocked, kill_switch, etc.). Safety_decision events also stream on SSE.
- All tool calls auto-emit audit/analytics/cost events to event_spine; no extra client logging required beyond structured inputs/outputs (PII already redacted upstream).

## Canvas Mutation
- Fetch state: `GET /canvas/{id}/snapshot` to get `head_rev` + atoms; subscribe to `GET /sse/canvas/{id}` with `Last-Event-ID` if resuming.
- Submit change: POST `/canvas/{id}/commands` with `{base_rev, ops: CanvasOp[], actor_id, correlation_id(idempotency_key)}`. Expect `head_rev` on success or `conflict` with `recovery_ops`.
- Apply updates: On SSE `op_committed`, ack local ops; on `conflict`, apply `recovery_ops` then resend pending ops with new base_rev.
- Gestures: send gestures via `/canvas/{id}/gestures` only (no local-only cursor state).
- Artifacts/Audit: upload via `/canvas/{id}/artifacts`; request audit via `/canvas/{id}/audits`.

## Strategy Lock Behavior
- Locks are created/approved at `/strategy-locks`; scoped by surface/scope/action and optional time window.
- GateChain enforces locks on every `/actions/execute` and `/canvas/*/commands`. If blocked, error envelope includes lock_id and reason (strategy_lock_required or three_wise_verdict_required).
- To unblock: obtain approval on the lock or adjust action to match allowed_actions; retries should include the same run_id/step_id to preserve audit trail.

## Firearms Enforcement
- Licences are managed via `/firearms/licences`; actions mapped in `DANGEROUS_ACTIONS` (e.g., dangerous_tool_use, agent_autonomy_high).
- GateChain checks licence on every tool/canvas action. Blocks return `firearms_licence_required` with action name; SAFETY_DECISION is streamed to SSE.
- To proceed: issue appropriate licence for subject_type/subject_id, then retry with same run/request identifiers.

## Discovery (Tools, Atoms, Exposures)
- Registry discovery (agents): `GET /registry/nodes`, `/registry/flows`, `/registry/personas`, `/registry/tasks`, `/registry/providers`, `/registry/models`, and detail endpoints `/registry/nodes/{id}`, `/registry/flows/{id}`. Responses include source (registry/workspace) and version hash.
- Canvas atoms: use packaged registries `@northstar/ui-atoms` and schemas from `@northstar/builder-registry`; no runtime mutation of atom registry.
- Backend exposures/durability: check `/routing/routes` for configured backends (event_spine, memory_store, blackboard_store, analytics_store, canvas_command_store, event_stream).

## Replay Semantics
- Canvas: Use `Last-Event-ID` header when connecting to `/sse/canvas/{id}`. For cold start or missed events, call `/canvas/{id}/replay?after_event_id=<cursor>` then resume SSE.
- Event spine: `GET /events/replay?run_id=...&after_event_id=...` to reconstruct audit/usage timeline for a run.
- Idempotency: always reuse the same `correlation_id`/idempotency_key when retrying commands or tool calls after network errors to avoid duplicate effects.

## Anti-Patterns (Do NOT)
- Do not invoke tools or mutate canvas outside `/actions/execute` and `/canvas/*/commands` (bypasses GateChain, firearms, strategy locks, audit).
- Do not rely on in-memory state (local blackboards, ad-hoc caches) for run coordination; use Engines blackboard_store/memory_store.
- Do not omit `X-Mode/X-Tenant-Id/X-Project-Id` or invent actor_id/user_id; all identity must derive from auth and headers.
- Do not store or log raw prompts/responses without PII redaction; rely on Engines logging pipeline.
- Do not skip conflict handling on canvas (always reconcile `recovery_ops` and base_rev before resubmitting).
