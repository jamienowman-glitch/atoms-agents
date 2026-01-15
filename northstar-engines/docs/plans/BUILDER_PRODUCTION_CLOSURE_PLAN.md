# Builder Production Closure Plan (Northstar Engines)

This plan outlines the roadmap to finalizing the backend infrastructure for the Builder phase, specifically enabling the Mobile Builder working end-to-end with Multi-21 feeds.

## Sequencing (Sprints)

### Sprint 1: Foundation & Tokens
**Focus**: Token Catalog, Schema Store, and Scope Safety.
- **Goal**: Ensure agents and UI can read/write tokens safely with no "mystery" state.
- **Tasks**:
    1.  **Token Catalog Merge**: consolidate disparate token definitions into `TokenVault` using `TOKENS_CONTRACT_v1.md`.
    2.  **Schema Store Decision**: Finalize if schemas live in Git or DB (Decision: Git for layout/content, DB for user data).
    3.  **Set Token Validation**: Implement strictly typed `set_token` command validation against the contract.

### Sprint 2: Core Feed Runtime (YouTube)
**Focus**: Multi-21 Feed Block Backend (YouTube).
- **Goal**: UI can create/list/refresh YouTube feeds and receive updates.
- **Tasks**:
    1.  **Generalize Feed Store**: Ensure `FeedStore` can handle `manual` and `mixed` modes.
    2.  **Generic Items Route**: `GET /feeds/{feed_id}/items` should work for any supported kind.
    3.  **SSE Implementation**: Wire `feed.updated` events in `RealtimeRouter`.

### Sprint 3: E-Commerce & Polish (Shopify)
**Focus**: Shopify Feeds & Agent Clients.
- **Goal**: Full Multi-21 support including Commerce.
- **Tasks**:
    1.  **Shopify Feed Integration**: Polish the Storefront API ingestion (already seeded).
    2.  **Agent Client Endpoints**: Ensure `EnginesBoundary` exposes all feed ops.
    3.  **Feed Picker API**: `GET /feeds/summary` for dropdowns.

### Sprint 4: Architecture & Scale
**Focus**: Storage Swap (Meminfra).
- **Goal**: Production durability.
- **Tasks**:
    1.  **Meminfra Swap**: Replace `SimpleJsonStore` with `LanceDB`/`Postgres` behind the repository interface.
    2.  **Scale Testing**: 100+ feeds, high-frequency updates.

## Out of Scope
- **Permissions/Roles**: Managed elsewhere.
- **Rendering**: Engines provide data, UI renders.
- **Legacy Migration**: No porting of old code.

## Definition of Done (DoD)
- Contract (`.md`) exists and is strictly followed.
- API Endpoint exists and returns contract-matching JSON.
- Tests (Integration + Mocked) pass.
- Application works end-to-end with UI (verified via manual smoke).
