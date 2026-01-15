# UI Blockers Contract Confirmation — 2026-01-05

## A) config_store (owner: northstar-engines)
- **Endpoints**: `GET /config/{scope}`, `PUT /config/{scope}` where `scope ∈ {system, tenant, surface}` (implemented at `northstar-engines/engines/config_store/routes.py`).
- **Headers**: `X-Mode` (saas|enterprise|lab), `X-Tenant-Id`, `X-Project-Id`; `X-Surface-Id` required for `scope=surface`; Authorization/JWT for membership checks.
- **Precedence**: Effective config is resolved `surface → tenant → system`; if a scope key is missing, the service returns `{version: 0, values: {}}` and the client must continue down the precedence chain. No UI/agent fallbacks are allowed.
- **Success JSON**: `{ "version": <int>, "values": { "tool_canvas_mode": "A"|"B", ... } }` (validated in `engines/config_store/service.py`).
- **Error envelope (503 missing route)**:
  ```json
  {
    "error": {
      "code": "config_store.missing_route",
      "message": "No routing configured for config_store",
      "http_status": 503,
      "resource_kind": "config_store",
      "details": { "resource_kind": "config_store", "tenant_id": "t_demo", "env": "dev" }
    }
  }
  ```

## B) Browser WebSocket auth (owner: northstar-engines)
- **Ticket issuance**: `POST /api/auth/ticket` (`northstar-engines/engines/identity/routes_ticket.py`) returns `{ "ticket": "<token>", "expires_in": 300 }`; requires `ENGINES_TICKET_SECRET`, identity headers, and authenticated caller.
- **WS connect**: `GET /ws/chat/{thread_id}`; client sends first message `{"type":"hello","context":{"tenant_id","mode","project_id","surface_id?","app_id?","user_id?","request_id?"},"ticket":"<token>?","last_event_id":"<cursor>?"}`. Server validates ticket vs. context, replays from timeline using server cursor, and emits `resume_cursor` with the authoritative cursor.
- **SSE connect (chat)**: `GET /sse/chat/{thread_id}?ticket=<token>` accepts either ticket or Authorization; `Last-Event-ID` header (or `last_event_id` query) is treated as a hint only—server resume cursor is authoritative.
- **Reconnect rules**: Reuse the same valid ticket until expiry; on reconnect, use the last server-provided cursor (ignore stale local storage).
- **Auth failure behavior**: On missing/invalid auth, emit one JSON error envelope then close with code `4003`:
  ```json
  {
    "error": {
      "code": "auth.ticket_invalid",
      "message": "Auth or ticket required",
      "http_status": 401,
      "resource_kind": "ws_chat",
      "details": { "reason": "ticket missing or expired" }
    }
  }
  ```

## C) Registry discovery (owner: northstar-engines)
- **Endpoints** (new):  
  - `GET /registry/components` → `{ "version": "v1.0.0", "schemas": {<id>: ComponentSchema}, "section_templates": [...] }`  
  - `GET /registry/atoms` → `{ "version": "v1.0.0", "atoms": [AtomSpec] }`
- **Caching**: `ETag` header set to `version` (or a hash of payload); clients send `If-None-Match` to allow 304 responses. Registry data is authoritative for all modes; lab requires explicit routing (no local defaults).
- **Resource kind**: `component_registry`; missing route returns 503 envelope:
  ```json
  {
    "error": {
      "code": "component_registry.missing_route",
      "message": "No routing configured for component_registry",
      "http_status": 503,
      "resource_kind": "component_registry",
      "details": { "resource_kind": "component_registry", "tenant_id": "t_demo", "env": "dev" }
    }
  }
  ```
- **AtomSpec (minimal)**: `{ "id": "hero-section", "version": "2026-01-05", "schema": {...}, "defaults": {...}, "token_surface": ["layout.padding", ...], "tracking": { "analytics_event_name": "...", "conversion_goal_id": "...", "utm_template": "..." } }` with NA markers where fields do not apply.
