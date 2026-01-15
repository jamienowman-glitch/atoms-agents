# UI Blockers Test Plan — 2026-01-05

## Engines
- **Config store envelopes**: `engines/config_store/tests/test_config_store.py` — missing route raises HTTP 503 with `error.http_status=503` and code `config_store.missing_route`; invalid `tool_canvas_mode` → 400 envelope; `GET /config/effective` overlays surface→tenant→system deterministically.
- **Envelope handler**: `engines/tests/test_error_envelope_http.py` — representative routes (`/config/system`, `/chat/threads/...`) return top-level `{error:{...}}` (no `detail` wrapper) with `http_status` populated.
- **WS auth failure**: `engines/chat/service/tests/test_ws_hardening.py` — missing/invalid ticket results in one JSON envelope then close code `4003`; tenant mismatch returns 403 envelope; resume cursor uses server value.
- **Chat SSE auth**: `engines/chat/service/tests/test_sse_transport.py` — ticket success path; invalid ticket → 401 envelope; 410 on invalid `last_event_id`.
- **Canvas SSE**: `engines/canvas_stream/tests/test_sse_rail.py` — ticket accepted, 401 on missing auth/ticket, 410 on bad cursor, resume cursor emitted.
- **Registry service**: `engines/registry/tests/test_registry_routes.py` — 503 `component_registry.missing_route` when route absent; successful fetch returns ETag and version; restart-safe persistence across repository re-init; AtomSpec schema validation (required fields + NA handling).

## UI
- **Envelope parsing**: `packages/transport/src/transport.test.ts` — normalize nested `error.http_status`, map 503/410 to correct kinds, surface gate/code.
- **Identity headers**: `packages/transport/src/identity_headers.test.ts` — reject mode `t_system`, require tenant/project for saas/enterprise, preserve session_id when supplied.
- **Config precedence**: `packages/transport/src/config_client.test.ts` — fetch surface→tenant→system chain, stop on first non-empty, bubble 503 envelopes.
- **WS/SSE flows**: `packages/transport/src/transport.test.ts` — ws hello carries ticket + context, 401/403 envelope triggers resnapshot; Last-Event-ID hint cleared on 410; ticket reuse until expiry.
- **Registry client**: `packages/builder-registry/src/service.test.ts` — ETag caching, 503 handling, lab flag gating, schema validation of AtomSpec token surfaces.

## Agents
- **Context enforcement**: `tests/runtime/test_context.py` — saas/enterprise require tenant_id+project_id, lab fallback only with explicit flag, session_id propagation.
- **Registry client**: `tests/engines_boundary/test_client.py` — `/registry/components` happy path and 503 envelope surfacing.
