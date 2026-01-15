# Canvas, Lens, and Registry Contract — 2026-01-05

## A1) Canonical terminology
- **Canvas**: Durable state container that accepts commands (`POST /canvas/{canvas_id}/commands`), exposes a snapshot (`GET /canvas/{canvas_id}/snapshot`), and supports replay (`GET /canvas/{canvas_id}/replay`). Replay cursors are authoritative and must return 410 on invalid cursor.
- **Lens**: View/controller over a canvas that constrains which tokens/controls are exposed to humans/agents. Examples: Builder inspector lens, video editor timeline lens, GraphLens flow editor lens.
- **Spec**: Versioned schema bundle describing tokens, defaults, controls, and token_surface for a canvas/lens/atom/tool. Specs are fetched from registry endpoints and cached via etag/version_hash.
- **TokenSurface**: Allowlist of JSON Pointer paths (or prefixes) that may be patched for a given lens/node/agent. Anything outside the allowlist is rejected by the UI/agent client.

## A2) Canonical endpoints (must exist)
### Engines (durability + enforcement)
- `GET /config/{scope}` (`scope=system|tenant|surface`) → `ConfigPayload { version:int, values:object }`
- `PUT /config/{scope}` with body `ConfigRequest { version:int, values:object }`
- `POST /api/auth/ticket` → `{ ticket:string, expires_in:int }` (TTL=300s)
- `POST /canvas/{canvas_id}/commands` → `{ success: bool, head_rev:int, error?:object }`
- `GET /canvas/{canvas_id}/snapshot` → `{ state:object, head_event_id:string, head_rev:int }`
- `GET /canvas/{canvas_id}/replay?after_event_id=<cursor>` → `{ events: StreamEvent[] }`
- `GET /sse/canvas/{canvas_id}` (read-only stream; accepts `ticket` or auth headers)
- Cursor rule: invalid/expired cursor ⇒ 410 envelope:  
  ```json
  { "error": { "code": "canvas.cursor_invalid", "message": "Cursor invalid or expired: <cursor>", "http_status": 410, "resource_kind": "canvas_stream", "details": { "cursor": "<cursor>" } } }
  ```

### northstar-agents (registry API owner)
- `GET /registry/specs?kind=atom|lens|canvas|graphlens|tool&cursor=<token>` → `{ specs: Spec[], next_cursor?: string, etag?: string }`
- `GET /registry/specs/{id}` → `Spec`
- If aliases already exist, keep them and add the above without breaking compatibility.

### UI
- SaaS/Enterprise must fetch specs from remote registry; lab may fall back to local only behind explicit lab flag.
- UI consumes engines durability endpoints (commands/snapshot/replay/SSE) and registry specs to render inspectors/token surfaces; no hardcoded schemas in sellable modes.

### Error envelopes for these endpoints
- Missing route (503):  
  ```json
  { "error": { "code": "<resource_kind>.missing_route", "message": "No routing configured for <resource_kind>", "http_status": 503, "resource_kind": "<resource_kind>", "details": { "resource_kind": "<resource_kind>", "tenant_id": "<tenant>", "env": "<env>" } } }
  ```
- Auth/tenant block (403 example):  
  ```json
  { "error": { "code": "auth.tenant_mismatch", "message": "Tenant mismatch", "http_status": 403, "gate": null, "resource_kind": "<resource_kind>", "details": {} } }
  ```
- Invalid cursor (410): see above.

## A3) Uniform error envelope (locked)
```json
{
  "error": {
    "code": "string.machine_code",
    "message": "string",
    "http_status": 400,
    "gate": "firearms|strategy_lock|budget|kill_switch|null",
    "resource_kind": "optional",
    "details": {}
  }
}
```
Rules: missing route ⇒ `<resource_kind>.missing_route` + 503; invalid cursor ⇒ `<domain>.cursor_invalid` + 410; identity override ⇒ `auth.identity_override` + 403.

## A4) Registry Spec payload (minimum)
```json
{
  "id": "atom.builder.button",
  "kind": "atom|lens|canvas|tool|graphlens",
  "version": "opaque",
  "schema": { "...": "json-schema or equivalent" },
  "defaults": { "...": "complete object" },
  "controls": { "/token/path": { "type": "select", "options": [] } },
  "token_surface": ["/layout/padding", "/typography/text", "/data/binding"],
  "etag": "hash-or-version",
  "version_hash": "same-as-etag or separate",
  "metadata": { "title": "optional", "description": "optional" },
  "na_policy": "non-applicable groups must be explicit, never blank"
}
```

## A5) Ownership & storage reality
- Registries (spec APIs + filesystem cards) live in northstar-agents. Engines does not own or mutate cards.
- Engines own durability and enforcement for canvases/commands/config/auth/tickets.
- Registry persistence may use a routed backend (optional `resource_kind="registry_store"`); missing route must emit 503 envelope.
- UI uses agents’ registry API for sellable modes; lab-only fallback allowed via explicit flag. No local/spec hardcoding for SaaS/Enterprise.
