# UI Blockers Reality Scan — 2026-01-05

## A) config_store
- **Exists**: YES in `northstar-engines/engines/config_store/routes.py` (`GET|PUT /config/{scope}`) with scopes `system|tenant|surface`; membership enforced via `require_tenant_membership`. Repo uses `TabularStoreService(resource_kind="config_store")` with `missing_route_error` (503) (`repository.py`, tests in `engines/config_store/tests/test_config_store.py`).
- **Payload**: `ConfigPayload { version: int, values: Dict }` (`service.py`) with `tool_canvas_mode` constrained to `{"A","B"}`; missing records return `{version:0, values:{}}`.
- **Clients**: UI `packages/transport/src/config_client.ts` calls `GET /config/{scope}` with identity headers and parses `values.tool_canvas_mode`.
- **Gaps**: No server-side precedence resolver (client must chain system/tenant/surface); FastAPI still wraps envelopes under `{"detail": ...}` so `error.http_status` is nested; identity headers on UI allow `t_system` and require `session_id`, diverging from Engines’ `VALID_MODES`.

## B) Browser WebSocket auth
- **Exists**: Ticket issuance at `POST /api/auth/ticket` (`engines/identity/routes_ticket.py`) using HMAC tickets (`identity/ticket_service.py`, TTL=300s, requires `ENGINES_TICKET_SECRET`). WS transport mounted at `/ws/chat/{thread_id}` expects first `hello` message with `context` + optional `ticket` (`chat/service/ws_transport.py`); SSE chat at `/sse/chat/{thread_id}` accepts `ticket` query or Authorization (`chat/service/sse_transport.py`). Canvas SSE at `/sse/canvas/{canvas_id}` requires auth headers only (`canvas_stream/router.py`).
- **Gaps**: WS/SSE failures emit plain strings (no JSON envelope) and WS closes with `4003` only; UI `CanvasTransport` dials `/msg/ws` with no ticket or thread_id and stores cursors locally; no ticket path for canvas SSE; UI error parser ignores nested `error.http_status`.

## C) Registry discovery
- **Exists**: NO HTTP registry endpoints in Engines or Agents. Searches show no `/registry/components`/`/registry/atoms` implementations; Agents client only has comments assuming `/registry/system-config` (`northstar-agents/src/northstar/engines_boundary/client.py`); UI `packages/builder-registry/src/service.ts` fetches `/registry/components` only when `NORTHSTAR_REMOTE_REGISTRY` flag is on, otherwise uses local `SCHEMAS`.
- **Gaps**: Owner undefined; no routing/resource_kind; no ETag/version semantics; no error envelopes; local fallback still default in UI.

## Error envelope helper
- **Exists**: Canonical helper at `northstar-engines/engines/common/error_envelope.py` (includes `http_status`, `gate`, `resource_kind`, `missing_route_error`, `cursor_invalid_error`).
- **Gap**: FastAPI default still wraps responses under `{"detail": ...}`, so UI parsers that expect top-level `error` + `http_status` miss codes/gates; WS paths don’t emit JSON envelopes on auth failure.
