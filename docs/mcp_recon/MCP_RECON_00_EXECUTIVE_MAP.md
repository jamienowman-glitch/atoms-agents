## Minimal surfaces to make MCP + Workbench real (what already exists)
- **Identity + scope**: `RequestContext` + builders enforce `X-Mode|X-Tenant-Id|X-Project-Id` (plus app/surface/user) and reject legacy `X-Env` (`engines/common/identity.py:22-177`); reuse for HTTP, SSE, WS, tickets.
- **Routing/multicloud guardrail**: Control-plane registry + manager expose `/routing/*` (`engines/routing/routes.py`) and enforce cloud backends + fail-fast on missing routes (`engines/routing/manager.py:21-82`). Backends: Firestore/DynamoDB/Cosmos/Filesystem for tabular/object/event streams.
- **Durable registries/stores**: Routed `TabularStoreService` (registry/policy/config stores) (`engines/storage/routing_service.py`), versioned flow/graph/overlay store (`engines/persistence/service.py` + `storage/versioned_store.py`), object/raw storage (`engines/nexus/raw_storage/routing_service.py`), media assets/artifacts (`engines/muscle/media_v2/service.py`), component/spec registry (`engines/registry/service.py`), firearms/strategy lock policy stores (`engines/firearms/repository.py`, `engines/strategy_lock/policy.py`), KPI file registry (`engines/kpi/repository.py`).
- **Observability spine**: Event spine (append/replay) routed to Firestore/DynamoDB/Cosmos with envelope errors on missing routes (`engines/event_spine/routes.py`, `service_reject.py`). DatasetEvent pipeline (`engines/logging/events/engine.py`, `engines/logging/audit.py`) and GateChain safety decisions (`engines/nexus/hardening/gate_chain.py`) reuse request/run ids.
- **Budget/KPI gating**: Budget usage + policy (`engines/budget/service.py`, `repository.py`), KPI corridors/definitions/raw measurements (`engines/kpi/service.py`, `repository.py`), GateChain attaches budget/kpi/firearms/strategy_lock results to envelopes and timeline.
- **Workbench-friendly immediacy**: VersionedStore persists on every write (no drafts-in-memory) and emits persistence events to spine (`engines/persistence/events.py`). Media_v2 enforces durable storage in sellable modes (`engines/muscle/media_v2/routes.py:_ensure_durable_storage_config`).
- **Error contract**: Canonical `ErrorEnvelope` (`engines/common/error_envelope.py`) + HTTP/SSE/WS wrappers in chat/media_v2/routes; missing on several control-plane routes (see coverage map).

## Order of operations (using existing pieces)
- **Create/update a connector/tool spec**
  1) Ensure routing registry has cloud backends for `tabular_store`, `component_registry`, `firearms_policy_store`, `strategy_policy_store` (`/routing/routes`, `engines/routing/routes.py`).
  2) Persist tool/spec metadata via component registry service (`ComponentRegistryService.save_spec/save_component` → `TabularStoreService` -> selected backend) (`engines/registry/service.py`, `repository.py`).
  3) Bind action_name -> firearms/strategy policy if dangerous (`engines/firearms/repository.py:RoutedFirearmsRepository.create_binding`, `engines/strategy_lock/policy.py:StrategyPolicyService.save_policies`).
  4) Expose execution surface via existing HTTP routes (e.g., `/actions/execute`, `/chat/threads/...`, `/media-v2/assets`) with `RequestContext` dependency and GateChain (`engines/actions/router.py`, `engines/chat/service/http_transport.py`, `engines/nexus/hardening/gate_chain.py`).
- **“Click save” → registry**
  - Component/spec registry: `/registry/specs|components|atoms` → `ComponentRegistryService` → `TabularStoreService` (routes to Firestore/DynamoDB/Cosmos/FS depending on registry config) with ETag caching (`engines/registry/routes.py`).
  - Workbench drafts/versions: `/flows|/graphs|/overlays` → `ArtifactPersistenceService` → `VersionedStore` (scoped by tenant/mode/project/surface/app/user) → tabular_store backend (`engines/persistence/service.py`, `storage/versioned_store.py`).
  - KPI definitions/corridors/raw: `/kpi/*` → filesystem repo under `var/kpi/{tenant}/{env}/{surface}` (`engines/kpi/repository.py`).
  - Firearms licenses/bindings: `/firearms/*` → tabular_store resource `firearms_policy_store` (`engines/firearms/repository.py`).
- **Sandbox test → live asset verification**
  - Lab mode allows filesystem backends for tabular/object/media when routing entry sets backend=`filesystem` (`engines/storage/routing_service.py`, `engines/nexus/raw_storage/routing_service.py`, `engines/muscle/media_v2/routes.py:_durable_storage_required`).
  - Register sandbox outputs as media_v2 assets/artifacts (`/media-v2/assets`, `/media-v2/assets/{id}/artifacts`) and verify via GET (same router, Firestore/S3/FS repo `engines/muscle/media_v2/service.py`).
  - For realtime artifacts (chat/canvas), validate replay via `/sse/chat/{thread_id}` or `/sse/canvas/{canvas_id}` with cursor checks (`engines/chat/service/sse_transport.py`, `engines/canvas_stream/router.py`).
- **Logging/budget/audit emission**
  - Emit DatasetEvent/Audit via `emit_audit_event` (calls `logging/events/engine.run`) or persistence helpers (`engines/logging/audit.py`, `engines/persistence/events.py`).
  - Budget usage: `/budget/usage` → `BudgetService.record_usage` (attaches request_id/run_id, storage_class=COST) to FS/Firestore repo (`engines/budget/service.py`, `repository.py`).
  - GateChain emits `SAFETY_DECISION` StreamEvents + audit on every gated action (`engines/nexus/hardening/gate_chain.py`).
- **KPI mapping attach**
  - KPI corridors/definitions/raw values stored/read via `KpiService` filesystem repo (`engines/kpi/service.py`, `repository.py`); GateChain pulls latest measurements per surface and encodes gate="kpi" in envelopes/events.
- **Entitlement/subscription gating**
  - Strategy lock + firearms bindings enforce approvals/licences (`engines/strategy_lock/policy.py`, `engines/firearms/service.py`).
  - Billing exists (`/billing/checkout-session`) but no runtime entitlement hook; mark as MISSING for tool/workbench execution gating.
