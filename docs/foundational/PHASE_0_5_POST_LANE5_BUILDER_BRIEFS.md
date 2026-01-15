# Phase 0.5 — Post-Lane5 Builder Briefs (Real Stores)

These briefs are ready to hand to builders. Do not change the phase name. Routing registry is mandatory; env selection is banned; filesystem is lab-only.

## Shared Rules (all builders)
- Routing registry is the only selector; missing route = hard fail.
- No filesystem or in-memory in saas/enterprise/system modes.
- No env-based backend selection; no placeholders/TODOs.
- Data must survive restart; CRUD/append+query required.
- At least one real cloud backend must work (Azure preferred).

## Builder A — Core Persistence
Scope:
- Event Stream: append/list_after, cursor/last_event_id; backends Firestore/DynamoDB/Cosmos; resource_kind=event_stream.
- Tabular Store: pk/sk JSON configs/registries; backends Cosmos/DynamoDB/Firestore; resource_kind=tabular_store.
- Memory Store: session/blackboard/maybes scoped tenant/mode/project/user/session; cloud only; resource_kind=memory_store.
- Routing Registry Store: persist routes (no filesystem); resource_kind=routing_registry_store.
Outputs: cloud-backed repos + routing wiring; smoke tests (write/read survives restart); README snippet with resource_kind names, backend configs, example routes.

## Builder B — Analytics & Attribution
Scope:
- Analytics/Metrics Store: persist tenant/mode/project/app/surface/platform/session_id/request_id/run_id/step_id/utm_* + payload; GateChain errors must not drop data (persist with status); backends Cosmos/Dynamo/Firestore; resource_kind=analytics_store or metrics_store (pick one).
- Attribution Contracts: tabular-backed contract (platform, utm template, allowed fields, version); resource_kind=attribution_contracts.
- Budget/Usage Store: tabular-backed per tenant/project/provider usage + soft limits; resource_kind=budget_store.
Outputs: repos, routes, smoke tests (ingest + query), README snippet with route shapes, example curls, GateChain error behavior.

## Builder C — Media & Objects
Scope:
- Object Store: Azure Blob, S3, GCS adapters; tenant/project namespacing; resource_kind=object_store.
- Media Output Store: reuse object_store or dedicated prefix/resource_kind=media_output_store; persist metadata (mime, size, checksum) with object ref.
Outputs: adapters + routing wiring; smoke tests (put/get round-trip with headers/namespace); README snippet (prefixes, required route fields: bucket/container, region, creds). No filesystem except guarded lab.

## Builder D — Intelligence Layer
Scope:
- Vector Store: one real non-Vertex backend (e.g., Azure AI Search, OpenSearch/KNN, Pinecone) with upsert/query; resource_kind=vector_store.
- Embedder: real embedder (Azure OpenAI / OpenAI / Bedrock), configurable via routing; resource_kind=embedder; used by vector store.
- SEO Config Store: tabular-backed CRUD scoped tenant/mode/project (+app/surface); resource_kind=seo_store.
Outputs: adapters + routing wiring; smoke tests (embed + upsert + query vector; SEO save/read); README snippet (route fields: index name, endpoint, keys; payload contracts).

## Integration Checklist (after builders finish)
- Verify no defaults to memory/filesystem; routing-only selection across stores.
- Confirm smoke tests cover restart durability.
- Produce `docs/foundational/PHASE_0_5_POST_LANE5_REAL_STORES_SUMMARY.md` listing each store, supported cloud backends, routing selection, and readiness for UI/agents.
