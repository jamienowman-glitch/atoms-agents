# Engine Contracts and Consumer Guide (current truth)

This documents what exists in `northstar-engines` today, how to call it, and what is **not** implemented. No new architecture is introduced here.

## 1) Identity & Tenancy Contract (mandatory)
- Fields: `tenant_id` (required), `mode` (`saas|enterprise|lab` required), `project_id` (required), `request_id` (required), optional `surface_id`, `app_id`, `user_id`, `membership_role`, `session_id` (not fully propagated), `trace_id`, `run_id`, `step_id`, `strategy_lock_id`, `three_wise_id`.
- Origin: parsed by `engines/common/identity.py:get_request_context` from headers (`X-Mode`, `X-Tenant-Id`, `X-Project-Id`, `X-Request-Id`, optional `X-App-Id`, `X-Surface-Id`, `X-User-Id`, `X-Trace-Id`, `X-Run-Id`, `X-Step-Id`, `X-Strategy-Lock-Id`, `X-Three-Wise-Id`). Missing required fields raise 400; env defaults are removed for mode.
- Propagation: every HTTP/SSE/WS/tool call must pass the same identity; consumers must not invent or default values. If identity is missing, GateChain and repos either reject or mis-scope data.

## 2) Unified Logging & Event Stream
- Contract: `StreamEvent` (see `engines/realtime/contracts.py`) with `event_id`, `type`, `ts`, `routing` (tenant/mode/project/surface/thread_id/canvas_id), `ids` (request_id/run_id/step_id), and payload-specific `data`.
- Store: timeline store via `engines/realtime/timeline.py` (FirestoreTimelineStore or FileSystemTimelineStore). Selection currently tries routing registry, falls back to env `STREAM_TIMELINE_BACKEND`; no other logging path should be used.
- Replay: SSE/WS clients may pass `Last-Event-ID`/`last_event_id`; `list_after` returns events after the cursor.
- Safety/audit/analytics multiplexing: SAFETY_DECISION events are emitted via GateChain callers (chat/canvas), and timeline can carry mixed event types. There is no separate logging bus.
- Failure modes: missing route/env raises; Firestore errors warn/skip; filesystem is for dev/lab only.

## 3) Analytics & Attribution
- Routes: `/analytics/events/pageview` and `/analytics/events/cta-click` (FastAPI router `engines/analytics_events/routes.py`).
- Model: `AnalyticsEventRecord` fields `id`, `tenant_id`, `env` (mode not yet wired), `event_type`, `payload`, `created_at`. `PageViewEvent`/`CtaClickEvent` include `surface`, optional `url/referrer/utm_*`, `seo_*`, metadata.
- Storage: default `InMemoryAnalyticsEventRepository`; env `ANALYTICS_EVENTS_BACKEND=firestore` enables Firestore repo. No routing; persistence is in-memory unless Firestore env set.
- GateChain: called but exceptions are swallowed; events still logged via dataset logger; failures are not persisted as status.
- Attribution contracts: not present; no platform/utm template enforcement.
- GA4/pixels: not implemented.

## 4) Memory Model (agents/chat)
- Session memory & messages: `engines/memory/repository.py` uses `FileMemoryRepository` (filesystem under `var/memory`), scoped by tenant/mode/project/user/session. No cloud backend; no routing.
- Blackboard: same repository, keyed by tenant/mode/project/key; filesystem only.
- Maybes/scratchpad: not implemented beyond this filesystem store.
- Survival: survives process restart on the same disk; not tenant-isolated across machines; not cloud-durable.
- Writers: APIs under `engines/memory/routes.py`/service; no GateChain enforcement today.
- Answer: Chat memory survives browser refresh if the server filesystem persists; does not survive project switch across servers; no multi-agent handoff guarantees.

## 5) Routing & Infrastructure Reality
- Routing registry exists (`engines/routing`); some subsystems (timeline) attempt to use it, many still use env or defaults.
- Resource kinds in code: event_stream (partial), others not yet uniformly routed.
- Missing route should be treated as fatal; current implementations often fall back to env/in-memory (violates target contract).
- Sellable modes should forbid filesystem/in-memory, but only some adapters enforce this (e.g., FileSystemTabularStore enforces).
- Consumers (UI/agents) must not pick backends directly; they call engines endpoints which should resolve via routing once fully wired.

## 6) Object & Media Storage
- GCS helper: `engines/storage/gcs_client.py` uses env `RAW_BUCKET`/`DATASETS_BUCKET`; no routing; no namespacing beyond caller-provided paths.
- S3 path: media_v2 has S3 usage (not routed).
- Azure Blob: not implemented in code.
- Media output store pattern: not formalized; artifacts endpoints exist (canvas) storing via service-specific storage.
- Metadata guarantees: minimal (mime/size when provided); no standard metadata contract.

## 7) SEO Config Contract
- Routes/Service: `engines/seo/service.py`, router in `engines/seo/routes.py` (CRUD).
- Model: `PageSeoConfig` with `tenant_id`, `env`, `surface`, `page_type`, `title`, `description`, etc.
- Storage: default `InMemorySeoRepository`; Firestore via env `SEO_BACKEND=firestore`; no routing; no mode/project scoping (uses env + surface).
- Persistence: in-memory unless Firestore env set; not durable by default; no app/project fields.

## 8) Budget & Usage Tracking
- Budget usage: `engines/budget/repository.py` has InMemory + Firestore usage repo (env-driven). Budget policy persistence is not fully implemented; GateChain budget enforcement assumes policy/usage but defaults to in-memory.
- Token/usage flow: not fully wired; usage events may not persist.
- Limits: soft/hard limits not enforced except via GateChain budget gate when configured.

## 9) Safety & Audit
- GateChain: `engines/nexus/hardening/gate_chain.py` used on chat/canvas; emits SAFETY_DECISION via timeline and audit logger; rejects on block.
- Audit: `engines/logging/audit.py` exists; hash chaining/append-only not fully implemented (per Phase 0.2 notes). Audit sink may be noop/in-memory depending on config.
- Requirements for consumers: include identity headers; expect 403 on safety block; SAFETY_DECISION events appear in stream (thread/canvas timeline) when configured; no separate audit fetch API documented.

## 10) Explicitly NOT Implemented Yet (do not assume)
- PII rehydration rules per tenant.
- Nexus/RAG runtime hydration with non-Vertex backend (current vector store is Vertex-only; no routing; no FAISS/pgvector).
- Registries: tool registry, canvas registry, connector registry.
- Durable, routed memory store (cloud); current is filesystem.
- Routed object store (Azure Blob/S3/GCS) with namespacing and metadata contract.
- Analytics store via routing with mode/project/app/surface/platform/session/run/step and GateChain error persistence.
- Attribution contracts (platform → UTM template).
- Budget/usage durable tracking across providers.
- Media output store contract and routing.
- Embedder routing (Azure OpenAI/Bedrock/OpenAI) and non-Vertex vector backend.
- Connector execution (Shopify/YouTube/etc.) beyond stubs.

---

Consumers must treat the above as the current truth. If a field, route, or backend is not listed as implemented, it must be treated as **unspecified** and not relied upon. This document is the source of truth for AGENTS/UI integration until the missing pieces are built.**
