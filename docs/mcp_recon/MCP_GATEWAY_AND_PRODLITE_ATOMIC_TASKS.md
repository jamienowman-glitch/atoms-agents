## Recommended order
- MCP lane: MCP-ENG-01 → MCP-ENG-02 → MCP-ENG-05 → MCP-ENG-03 → MCP-ENG-04 → MCP-ENG-06.
- Prod-lite lane: PL-CHAT-* → PL-CANVAS-* → PL-MEDIA-* → PL-AUDIO-* → PL-VRENDER-* → PL-VTIMELINE-* → PL-CAD-* → PL-VECTOR-* → PL-BUDGET-* → PL-IMAGE-* → PL-SCENE-* → PL-MARKETING-* → PL-AST-* (audio semantic timeline).

## Top 5 unknowns
- Durable replay backend for chat_store/canvas_stream (current store is in-memory; no durable module located).
- GateChain/routing prerequisites for exposing raw_storage and media_v2 safely under MCP (routing config enforcement in `engines/routing/manager.py` assumed).
- Budget/audit emission patterns across engines (no shared helper found beyond budget service).
- Media_v2 storage requirements in sellable modes (S3/Firestore configs not enforced by default).
- Async/worker support for video_render jobs (only synchronous service methods present).

## Section A — MCP Gateway (engines lane)
- MCP-ENG-01 — Type: INTEGRATION. Preconditions: `engines/common/identity.py`, `engines/common/error_envelope.py`, `engines/chat/service/http_transport.py:158 register_error_handlers` available. Files/locations: **new** `engines/mcp_gateway/server.py`, `engines/mcp_gateway/__init__.py`. Acceptance: FastAPI (or JSON-RPC host) boots, wires `register_error_handlers(app)` and a health route, builds `RequestContext` from headers via `RequestContextBuilder` (imported from `engines/common/identity.py`). Unblocks: inventory and tool wiring.
- MCP-ENG-02 — Type: DX. Preconditions: MCP-ENG-01, ability to import `engines/chat/service/server.py:create_app`. Files: **new** `engines/mcp_gateway/inventory.py`. Acceptance: `tools/list` reads inventory by instantiating `create_app()` and enumerating mounted routers (e.g., chat, media_v2, audio_service, video_render); output includes engine_id, lane guess, invocation_type (http_sync/http_async/ws/sse), and request/response model symbols when declared on routes. Unblocks: schema exposure for tools.
- MCP-ENG-03 — Type: INTEGRATION. Preconditions: MCP-ENG-01, MCP-ENG-02. Files: **new** `engines/mcp_gateway/tools/chat.py`. Acceptance: `tools.call` for chat post-message uses service-layer entrypoint `publish_message` (`engines/chat/service/transport_layer.py:146`) and constructs `RequestContext` via MCP identity shim; returns `Message`/`ChatMessageOut` shape without invoking FastAPI route functions. Tests cover missing `X-Mode` failure and tenant mismatch using `require_tenant_membership`.
- MCP-ENG-04 — Type: INTEGRATION. Preconditions: MCP-ENG-01, MCP-ENG-02. Files: **new** `engines/mcp_gateway/tools/media_v2.py`. Acceptance: `tools.call` for media asset creation uses `get_media_service().register_remote(...)` (`engines/muscle/media_v2/service.py:193`) with `MediaUploadRequest` payload; enforces tenant via `require_tenant_membership`; rejects multipart (JSON-only). Returns `MediaAsset`/`DerivedArtifact` Pydantic models. Tests cover missing mode/tenant headers and successful asset creation using LocalMediaStorage stub.
- MCP-ENG-05 — Type: QUALITY. Preconditions: MCP-ENG-01. Files: **new** `engines/mcp_gateway/errors.py`. Acceptance: Exception mapper converts HTTPException/ValueError/ValidationError to `ErrorEnvelope` (`engines/common/error_envelope.py:13`) and places payload in JSON-RPC `error.data`; unit tests assert `http_status` mirrored in RPC `code`.
- MCP-ENG-06 — Type: QUALITY. Preconditions: MCP-ENG-02/03/04. Files: **new** `engines/mcp_gateway/tests/test_tools.py`. Acceptance: Tests cover `tools/list` inventory shape, chat tool happy/tenant-mismatch cases, media_v2 tool happy/mode-missing cases, and error mapping from MCP-ENG-05; uses in-process services (no HTTP client).

## Section B — Prod-lite readiness (per engine)
### chat_service
- PL-CHAT-01 — Type: QUALITY. Preconditions: chat_store implementation available. Files: `engines/chat/service/transport_layer.py`, `engines/chat/store_service.py`. Acceptance: add durable replay store (non-memory) for `subscribe_async`/`_chat_stream_with_resume` and validate cursor after restart; tests simulate restart + Last-Event-ID resume.
- PL-CHAT-02 — Type: SECURITY. Files: `engines/chat/service/sse_transport.py`, `engines/chat/service/ws_transport.py`. Acceptance: enforce `X-Mode/X-Project-Id/X-App-Id` via `assert_context_matches` in `_sse_context` and WS hello resolution; tests reject missing/override headers and ticket misuse.
- PL-CHAT-03 — Type: QUALITY. Files: `engines/chat/service/http_transport.py`. Acceptance: ensure `_http_exception_handler` wraps all HTTPException/validation errors; tests cover gate_chain rejection and validation error returning canonical `ErrorEnvelope`.

### canvas_stream
- PL-CANVAS-01 — Type: INTEGRATION. Files: `engines/canvas_stream/router.py`, `engines/canvas_stream/service.py`. Acceptance: persist canvas events to durable store (media_v2/raw_storage) and replay via Last-Event-ID; tests cover restart + cursor resume and cursor-invalid envelope mapping.
- PL-CANVAS-02 — Type: SECURITY. Files: `engines/canvas_stream/router.py`. Acceptance: enforce `X-Mode/X-Project-Id/X-App-Id` in `_canvas_context`; emit `ErrorEnvelope` for auth errors; tests reject missing headers and cross-tenant tickets.

### media_v2_assets
- PL-MEDIA-01 — Type: SECURITY. Files: `engines/muscle/media_v2/service.py`. Acceptance: fail fast in sellable modes when RAW_BUCKET/Firestore config absent (no LocalMediaStorage fallback); tests assert RuntimeError when config missing.
- PL-MEDIA-02 — Type: QUALITY. Files: `engines/muscle/media_v2/routes.py`, `engines/muscle/media_v2/tests`. Acceptance: tests for multipart + JSON enforce `require_tenant_membership` and reject cross-tenant artifact creation; cover `assert_context_matches`.
- PL-MEDIA-03 — Type: DX. Files: `engines/muscle/media_v2/models.py`. Acceptance: document artifact kind meta requirements (e.g., `visual_meta`, `video_region_summary`) and expose deterministic `pipeline_hash`/`backend_version` meta; tests assert meta fields present on creation.

### audio_service
- PL-AUDIO-01 — Type: QUALITY. Files: `engines/muscle/audio_service/service.py`. Acceptance: emit budget/audit events per operation using `BudgetService.record_usage` and/or event_spine with `request_id/run_id`; tests assert calls and include mode-only identity.
- PL-AUDIO-02 — Type: QUALITY. Files: `engines/muscle/audio_service/tests`. Acceptance: add invalid-input tests (missing asset/artifact) returning canonical `ErrorEnvelope`; ensure RequestContext tenant/env enforced in service layer (not just routes).

### video_render
- PL-VRENDER-01 — Type: QUALITY. Files: `engines/muscle/video_render/service.py`. Acceptance: compute deterministic `pipeline_hash` for render plans (inputs + profile) and include in artifact meta; tests validate hash stability.
- PL-VRENDER-02 — Type: SECURITY. Files: `engines/muscle/video_render/routes.py`, `engines/muscle/video_render/service.py`. Acceptance: emit budget/audit events on render/job submission with surface/project metadata; tests assert BudgetService usage and canonical error envelope on budget violations.
- PL-VRENDER-03 — Type: INTEGRATION. Files: `engines/muscle/video_render/routes.py`, `engines/chat/service/server.py`. Acceptance: declare async worker support flag (or explicit lack) surfaced in MCP inventory; tests confirm flag toggles invocation type (http_async vs http_sync).

### video_timeline
- PL-VTIMELINE-01 — Type: SECURITY. Files: `engines/muscle/video_timeline/service.py`. Acceptance: fail fast when Firestore config missing (no silent default to in-memory); tests simulate missing project env -> raises.
- PL-VTIMELINE-02 — Type: QUALITY. Files: `engines/muscle/video_timeline/routes.py`, `engines/muscle/video_timeline/service.py`. Acceptance: optional media_v2 linkage for clips (asset/artifact validation); tests reject unknown asset_id and ensure canonical errors.

### cad_ingest
- PL-CAD-01 — Type: INTEGRATION. Preconditions: routing registry ready. Files: `engines/chat/service/server.py`, `engines/muscle/cad_ingest/routes.py`. Acceptance: mount `cad_ingest_router` behind feature flag; FastAPI TestClient proves availability and RequestContext enforcement.
- PL-CAD-02 — Type: QUALITY. Files: `engines/muscle/cad_ingest/service.py`. Acceptance: add remote `source_uri` ingest via raw_storage presign+download; tests cover multipart and remote.
- PL-CAD-03 — Type: SECURITY. Files: `engines/muscle/cad_ingest/routes.py`. Acceptance: integrate GateChain/budget/audit when ingesting; tests assert gate_chain invoked and canonical error envelope returned.

### vector_explorer
- PL-VECTOR-01 — Type: QUALITY. Files: `engines/nexus/vector_explorer/routes.py`, `engines/nexus/vector_explorer/ingest_routes.py`. Acceptance: wrap errors with `ErrorEnvelope` and enforce `RequestContext` (mode/project) in query + ingest; tests cover missing headers and unauthorized ingest.
- PL-VECTOR-02 — Type: DX. Files: `engines/nexus/vector_explorer/schemas.py`. Acceptance: add schema export helpers to produce JSON schemas for query/ingest; tests assert required fields (tenant_id, env, space, tags).

### budget_usage
- PL-BUDGET-01 — Type: QUALITY. Files: `engines/budget/repository.py`. Acceptance: add durable backend option (e.g., Firestore/S3) with configuration guard; tests verify write/read in durable mode.
- PL-BUDGET-02 — Type: QUALITY. Files: `engines/budget/routes.py`, `engines/budget/tests`. Acceptance: validation for missing mode/project/app uses `ErrorEnvelope`; tests assert 400 with canonical structure.

### image_core (escaped hardening)
- PL-IMAGE-01 — Type: SECURITY. Files: `engines/muscle/image_core/routes.py`. Acceptance: add `RequestContext`/Auth enforcement (mode-only, tenant/project) for render endpoints; tests ensure 401/403 on missing/mismatch.
- PL-IMAGE-02 — Type: QUALITY. Files: `engines/muscle/image_core/routes.py`, `engines/image_core/service.py`. Acceptance: wrap errors in canonical `ErrorEnvelope`; tests cover invalid composition/preset errors.
- PL-IMAGE-03 — Type: QUALITY. Files: `engines/image_core/service.py`. Acceptance: ensure media_v2 artifact registration includes deterministic `pipeline_hash`/backend_version in meta; tests assert presence.

### scene_engine (escaped hardening)
- PL-SCENE-01 — Type: SECURITY. Files: `engines/scene_engine/service/routes.py`, `engines/scene_engine/service/server.py`. Acceptance: enforce `RequestContext` (mode/tenant/project) on `/scene/build`; tests verify rejection without headers.
- PL-SCENE-02 — Type: QUALITY. Files: `engines/scene_engine/service/routes.py`. Acceptance: add canonical `ErrorEnvelope` handling for validation failures; tests cover empty boxes and surface invalid input.
- PL-SCENE-03 — Type: INTEGRATION. Files: `engines/scene_engine/service/server.py`. Acceptance: explicit flag in main app inventory noting scene_engine is standalone; documented for MCP inventory consumption.

### marketing_cadence (escaped hardening)
- PL-MARKETING-01 — Type: SECURITY. Files: `engines/marketing_cadence/routes.py`. Acceptance: add `RequestContext`/Auth with `X-Mode/X-Tenant-Id/X-Project-Id` enforcement and canonical errors; tests cover missing headers and tenant mismatch.
- PL-MARKETING-02 — Type: QUALITY. Files: `engines/marketing_cadence/service.py`. Acceptance: add optional durable store abstraction (instead of in-memory dict) guarded by config; tests validate persistence and deterministic schedule IDs.

### audio_semantic_timeline (escaped hardening)
- PL-AST-01 — Type: SECURITY. Files: `engines/muscle/audio_semantic_timeline/routes.py`. Acceptance: require `RequestContext`/Auth and enforce tenant/mode before analysis; tests reject missing headers/token.
- PL-AST-02 — Type: QUALITY. Files: `engines/muscle/audio_semantic_timeline/routes.py`, `engines/muscle/audio_semantic_timeline/service.py`. Acceptance: wrap errors with `ErrorEnvelope`; tests cover missing asset/audio file and backend failures.
- PL-AST-03 — Type: QUALITY. Files: `engines/muscle/audio_semantic_timeline/service.py`. Acceptance: ensure media_v2 artifacts include backend_version/pipeline_hash metadata and budget/audit emits per analyze call; tests assert meta fields and budget call.

## Section C — Registry plan
- REG-01 — Type: PLAN. Preconditions: MCP-ENG-02 inventory. Files: `docs/mcp_recon/MCP_RECON_00_ENGINE_INDEX.tsv`, `docs/mcp_recon/fixtures/` (new). Acceptance: draft Spec Registry component JSON fixtures (kind=component, metadata.spec_class=muscle) for chat_service and media_v2 including invocation types and schema refs; stored under `docs/mcp_recon/fixtures/`.
- REG-02 — Type: DX. Preconditions: REG-01. Files: `docs/mcp_recon/REGISTRY_PLAN.md` (new). Acceptance: document adapter contract mapping inventory rows to registry fields (engine_id, lane, invocation_types, schema_uri) without code; references `engines/registry/service.py` placeholder path for future implementation.
- REG-03 — Type: QUALITY. Preconditions: REG-01. Files: `docs/mcp_recon/fixtures/test_inventory.json` (new), `docs/mcp_recon/MCP_RECON_00_ENGINE_INDEX.tsv`. Acceptance: fixture test data showing TSV-to-registry conversion (engine_id, name, schema_uri) without network calls; usable by future automation.
