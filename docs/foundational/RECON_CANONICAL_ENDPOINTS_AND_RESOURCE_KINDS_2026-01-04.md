# Canonical Endpoints & Resource Kinds — 2026-01-04

## Uniform Error Envelope (engines/common/error_envelope.py)

Canonical shape for every 4xx/5xx:

```json
{
  "error": {
    "code": "string.machine_code",
    "message": "human-readable",
    "http_status": 400,
    "gate": "firearms|strategy_lock|budget|kill_switch|null",
    "details": { "context": "opaque structured fields" }
  }
}
```

- Always include `http_status` matching the HTTP response code.
- Missing route → `error.code = "<resource_kind>.missing_route"`, `http_status = 503`.
- Invalid cursor → `error.code = "<domain>.cursor_invalid"`, `http_status = 410`.
- Gate blocks set `gate` and stable `error.code` per gate.

## Canonical Resource Kinds (routing)

| resource_kind | Purpose | Canonical endpoints (must use envelope above) |
| --- | --- | --- |
| `chat_store` | Durable chat transcripts with cursor replay | `POST /chat/threads/{thread_id}/messages`, `GET /chat/threads/{thread_id}/messages?cursor=`, `GET /chat/threads/{thread_id}/snapshot` (optional), `GET /sse/chat/{thread_id}` (observational; must resume from store cursor) |
| `config_store` | Routed toggles by scope (system/tenant/surface) | `GET /config/{scope}`, `PUT /config/{scope}` |
| `firearms_policy_store` | Data-driven firearms bindings & grants | `GET /firearms/policy`, `PUT /firearms/policy`, `GET /firearms/grants`, `PUT /firearms/grants` |
| `strategy_policy_store` | Independent strategy lock policy/config | `GET /strategy-lock/policy`, `PUT /strategy-lock/policy` |
| `canvas_command_store` | Durable canvas commands + idempotency | `POST /canvas/{canvas_id}/commands`, `GET /canvas/{canvas_id}/snapshot`, `GET /canvas/{canvas_id}/replay?cursor=` |
| `event_stream` | Replayable stream for SSE (chat/canvas/safety) | `GET /sse/chat/{thread_id}`, `GET /sse/canvas/{canvas_id}` replaying from durable cursor |

## Canonical Endpoints (engines)

- Tool choke: `POST /actions/execute` (always gate via GateChain; uses envelope).
- Chat rail: `POST /chat/threads/{thread_id}/messages`; `GET /chat/threads/{thread_id}/messages?cursor=`; `GET /chat/threads/{thread_id}/snapshot`; `GET /sse/chat/{thread_id}`.
- Config: `GET /config/{scope}`; `PUT /config/{scope}` (scope = `system|tenant|surface`).
- Firearms: `GET/PUT /firearms/policy`; `GET/PUT /firearms/grants`.
- Strategy lock: `GET/PUT /strategy-lock/policy`; enforcement separate from firearms.
- Canvas: `POST /canvas/{canvas_id}/commands`; `GET /canvas/{canvas_id}/snapshot`; `GET /canvas/{canvas_id}/replay?cursor=`; `GET /sse/canvas/{canvas_id}` (observational).
- Event spine remains audit/analytics sink but does not replace `chat_store` or `canvas_command_store`.

## Cursor Semantics

- `cursor` query or `Last-Event-ID` header must map to durable store cursors (chat, canvas, event_stream).
- Invalid/expired cursor returns HTTP 410 with the uniform envelope (`error.code=<domain>.cursor_invalid`, `details.cursor=<cursor>`).
- SSE is observational; authoritative replay comes from store-backed `messages`/`replay` endpoints. Clients must re-fetch snapshot + replay on 410 before resubscribing.
