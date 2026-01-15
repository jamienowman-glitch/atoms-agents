# Canvas/Lens Gap Table — 2026-01-05

| Requirement | Current status | Evidence (paths) | Owner repo | Break risk | Minimal implementation to close |
| --- | --- | --- | --- | --- | --- |
| GET/PUT `/config/{scope}` present | YES | northstar-engines/engines/config_store/routes.py; service model ConfigPayload | engines | correctness | Keep; add effective overlay endpoint + envelope passthrough |
| GET `/config/effective` | NO | not found in engines | engines | UI blocker | Add overlay endpoint surface→tenant→system with canonical envelope |
| Config missing-route returns 503 envelope | PARTIAL | missing_route_error in engines/config_store/repository.py -> common/error_envelope.py (wrapped under FastAPI detail) | engines | UI blocker | Add global envelope handler to emit top-level `error.http_status` |
| POST `/api/auth/ticket` | YES | engines/identity/routes_ticket.py; ticket_service.py (TTL=300) | engines | correctness | Keep; ensure envelope on failure |
| WS chat auth with ticket; envelope on failure | PARTIAL | engines/chat/service/ws_transport.py (hello expects context/ticket, closes 4003 strings) | engines | UI blocker | Emit JSON envelope before close; keep 4003 |
| SSE chat ticket query support | YES | engines/chat/service/sse_transport.py (`ticket` Query) | engines | correctness | Add canonical envelope on failure |
| SSE canvas accepts ticket | NO | engines/canvas_stream/router.py requires auth headers only | engines | UI blocker | Add ticket query + envelope + 410 cursor handling |
| Canvas cursor invalid → 410 envelope | PARTIAL | cursor_invalid_error exists (common/error_envelope.py); canvas_stream/router.py does not use; ws transport sends plain close | engines | correctness | Wire cursor_invalid_error into SSE/WS replay paths |
| Registry discovery endpoints (`/registry/specs*` or `/registry/components`) | NO | no `/registry/*` routes in engines or agents (`rg "/registry"` none) | agents | UI blocker | Add agents registry API with routing + etag |
| Registry payload with schema/defaults/token_surface/etag | NO | not present; UI uses local SCHEMAS (ui/packages/builder-registry/src/service.ts) | agents | UI blocker | Implement Spec payload + etag caching |
| UI uses remote registry in sellable modes | NO | UI falls back to local SCHEMAS unless env flag set; endpoint absent | ui | UI blocker | Wire to new agents registry; gate lab fallback |
| Uniform envelope with http_status top-level | PARTIAL | helper in engines/common/error_envelope.py; FastAPI responses still under `detail` and WS uses strings | engines/ui | correctness | Add middleware/exception handler to return canonical envelope; update UI parser |
| GraphLens spec available | NO | No registry entry or endpoint for graphlens/tool | agents | nice-to-have (future lens) | Add Spec entries + endpoint coverage (no card edits to existing) |
