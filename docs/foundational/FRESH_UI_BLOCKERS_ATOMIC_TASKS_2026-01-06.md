# FRESH UI BLOCKERS — Atomic Tasks (2026-01-06, P0 = UI blockers today)

## Canonical error envelope (no deviations)
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "http_status": 400,
    "gate": "firearms|strategy_lock|budget|kill_switch|temperature|kpi|null",
    "action_name": "string|null",
    "resource_kind": "string|null",
    "details": {}
  }
}
```

## Tasks by repo

### /northstar-engines
- **ENG-1: Registry specs endpoint**
  - Goal: Expose unified discovery for atoms/components/lenses with stable payload + ETag/cursor.
  - Endpoints: `GET /registry/specs?kind=atom|component|lens&cursor=...`, `GET /registry/specs/{id}`.
  - resource_kind: `component_registry`.
  - Files: `engines/registry/routes.py`, `engines/registry/service.py`, `engines/registry/repository.py`, add tests `engines/registry/tests/test_registry_specs.py` (verify path).
  - Tests: ETag match 304; missing route → 503 envelope with `error.code=component_registry.missing_route`, `error.http_status=503`; invalid cursor → 410 envelope with `error.code=component_registry.cursor_invalid`, `error.http_status=410`; payload includes schema/defaults/controls/token_surface, includes one Builder atom + one GraphLens lens/spec fixture, restart reload from routed store; unknown spec id 404 envelope (`component_registry.spec_not_found`) is optional/TBD (not required P0).
  - Acceptance: Restart-safe persistence; 503 envelope on missing route with `component_registry.missing_route`; 410 envelope on invalid cursor with `component_registry.cursor_invalid`; deterministic `error.code`/`http_status`; ETag/version_hash present; routing-backed store only.

- **ENG-2: WS timeline routing hardening**
  - Goal: Ensure `/ws/chat/{thread_id}` surfaces 503 envelope (then close 4003) when `event_stream` routing is missing instead of crashing; preserve 410 cursor handling.
  - Endpoints: `/ws/chat/{thread_id}`.
  - resource_kind: `event_stream` (timeline store).
  - Files: `engines/chat/service/ws_transport.py`, `engines/realtime/timeline.py` (verify path), tests `engines/chat/tests/test_ws_timeline_routing.py` (verify path).
  - Tests: Missing event_stream route → WS sends envelope with `error.code=event_stream.missing_route`, `error.http_status=503` then closes 4003; valid route still replays/resumes; invalid cursor → 410 envelope; restart-safe timeline store behavior when routing is configured.
  - Acceptance: Restart-safe; 503 envelope on missing route (`event_stream.missing_route`); 410 on invalid cursor; WS closes with 4003 after envelope; deterministic `error.code`/`http_status`.

### /ui
- **UI-1: Ticket-first realtime transport**
  - Goal: Fetch `/api/auth/ticket` when Authorization absent, pass ticket in chat WS hello and chat SSE query, handle envelope errors deterministically; canvas SSE uses Authorization until ticket support is confirmed.
  - Endpoints: `/api/auth/ticket`, `/ws/chat/{thread_id}`, `/sse/chat/{thread_id}` (ticket path), `/sse/canvas/{canvas_id}` (Authorization path).
  - resource_kinds: `auth`, `chat_store`, `event_stream`.
  - Files: `packages/transport/src/index.ts`, add ticket helper if needed (`packages/transport/src/*`), tests `packages/transport/src/transport.test.ts` (extend) (verify paths).
  - Tests: No-token path triggers ticket fetch and chat hello includes ticket; chat SSE uses `ticket` query; canvas SSE uses Authorization header (documented until Engines ticket support lands); 401/403/503 envelopes propagate; WS close 4003 after envelope handled; 410 cursor triggers InvalidCursor handler and clears persisted cursor; restart-safe cursor cache handling.
  - Acceptance: Restart-safe cursor persistence; 503 envelope on missing route; 410 on invalid cursor; deterministic `error.code`/`http_status`; WS sends envelope before close 4003 on auth failures; chat SSE/WS accept ticket flow; canvas SSE uses Authorization pending Engines support.

- **UI-2: Registry spec consumer**
  - Goal: Consume `/registry/specs` + `{id}` payload (schema/defaults/controls/token_surface/etag), surface envelopes to UI.
  - Endpoints: `GET /registry/specs?kind=...`, `GET /registry/specs/{id}`.
  - resource_kind: `component_registry`.
  - Files: Add client in `packages/transport/src/` (verify path), integrate in app code (e.g., `apps/*` where registry data rendered) (verify path), tests `packages/transport/src/registry_client.test.ts` (verify path) and UI integration tests if present.
  - Tests: ETag caching respected (304 with no body yields “no change” and reuses cached payload); payload parsed for atom+GraphLens samples; 503/410 envelopes surfaced via TransportEnvelopeError; restart-safe caching behavior (no stale on relaunch).
  - Acceptance: Restart-safe; 503 envelope on missing route; 410 on invalid cursor; deterministic `error.code`/`http_status`; payload fields mapped for UI (id/kind/version/schema/defaults/controls/token_surface/etag); 304 handling uses cached payload.

### /northstar-agents
- **AGNT-1: Engines boundary client for registry specs**
  - Goal: Extend engines_boundary client to call `/registry/specs` and `/registry/specs/{id}` with envelope propagation.
  - Endpoints: `/registry/specs?kind=...`, `/registry/specs/{id}`.
  - resource_kind: `component_registry`.
  - Files: `src/northstar/engines_boundary/client.py`, tests `tests/engines_boundary/test_registry_specs.py` (verify path); do not touch registry cards/schemas.
  - Tests: Successful fetch parses schema/defaults/controls/token_surface/etag; 503/410 envelopes raise deterministic errors; 304 handling: client may pass If-None-Match but does not cache (treats 304 as no-change/no body); restart-safe behavior when base URL persists.
  - Acceptance: Restart-safe; 503 envelope on missing route; 410 on invalid cursor; deterministic `error.code`/`http_status`; no registry card/schema mutations; 304 does not break client flow (no cache state assumed).

## CHANGELOG (2026-01-06)
- Clarified ENG-1 missing-route/cursor codes and ETag expectations; marked spec_not_found as optional/TBD.
- Tightened ENG-2 to require `event_stream.missing_route` 503 envelope before WS close.
- Narrowed UI-1 ticket scope to chat WS/SSE; canvas SSE uses Authorization until Engines confirms ticket support.
- Added explicit 304/ETag handling expectations for UI-2 and AGNT-1 tasks.
