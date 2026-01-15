## Main engines app
- Entrypoint: `engines/chat/service/server.py:create_app` mounts the primary FastAPI app (`app` alias) using the HTTP transport base (`engines/chat/service/http_transport.py:22 app`).
- Routers mounted (non-exhaustive list from `create_app`): chat HTTP (`engines/chat/service/routes.py`), chat SSE/WS (`engines/chat/service/sse_transport.py`, `ws_transport.py`), media (`engines/media/service/routes.py`), media_v2 (`engines/muscle/media_v2/routes.py`), maybes, identity (auth/keys/analytics/control_plane/ticket), strategy_lock, temperature, vector_explorer (+ ingest), video_timeline, video_render, video_360, video_regions, audio_service, video_mask, video_multicam, video_visual_meta, audio_semantic_timeline, audio_voice_enhance, video_presets, video_text, budget, billing, kpi, seo, bossman, debug/aws, kill_switch, ops/status, knowledge, analytics_events, three_wise, firearms, memory, actions, raw_storage, atoms/cards/index/pack/settings/runs/nexus_memory, canvas_commands, origin_snippets, persistence, routing, canvas_stream, feature_flags, config_store, registry.
- Identity/error helpers in use: HTTP routes depend on `get_request_context` (`engines/common/identity.py:73`), auth dependencies (`engines/identity/auth.py`). Error handlers registered via `register_error_handlers` in `engines/chat/service/http_transport.py:158` attached to `http_app` inside that module.

## Standalone / not mounted in main app
- Scene Engine: `engines/scene_engine/service/server.py:create_app` exposes `/scene/build` and `/health`; not mounted by `engines/chat/service/server.py`.
- Marketing Cadence: router defined at `engines/marketing_cadence/routes.py` (prefix `/api/cadence`), no server wiring in repo; not mounted in main app.
- Chat HTTP transport `http_app` (`engines/chat/service/http_transport.py`) is the base app but is composed into the main app via `create_app`; not standalone in production.

## Shared identity/error utilities
- Identity: `RequestContextBuilder.from_request/from_headers` and `get_request_context` in `engines/common/identity.py`; enforces `X-Mode` (saas|enterprise|lab), `X-Tenant-Id`, `X-Project-Id`, rejects `X-Env`.
- Auth: `get_auth_context` / `get_optional_auth_context` in `engines/identity/auth.py`; `require_tenant_membership`.
- Errors: Canonical `ErrorEnvelope` and helpers in `engines/common/error_envelope.py`; chat HTTP transport uses `register_error_handlers` to normalize exceptions for FastAPI apps.
