# Engines Durability TODO Breakdown

## Hard Blockers (must land first)

- [AUTH-01] Auth precedence enforcement ✅ COMPLETE
  - Domain: auth  
  - Files: engines/common/identity.py (added validate_identity_precedence, emit audit on mismatch), engines/event_spine/routes.py, engines/memory_store/routes.py, engines/blackboard_store/routes.py.  
  - Preconditions: Routing registry available (satisfied).  
  - Success: All listed routes reject header/payload overrides; tenant/mode/project/user/surface required; audit on mismatch (auth_violation event); tests for all mismatch scenarios.  
  - Status: Implemented validate_identity_precedence() as centralized validation; HTTP 403 (error_code: auth.identity_override) on mismatch; audit emitted; all 3 core durable domains (event_spine, memory_store, blackboard_store) enforced.
  - Unblocks: Safe execution of agents (identity verified, audit trail established).

- [TL-01] Event spine durability/replay enforcement ✅ COMPLETE
  - Domain: event_spine  
  - Files: engines/event_spine/*, routing-aware services; timeline endpoints.  
  - Preconditions: AUTH-01; routing registry routes for event_spine.  
  - Success: Cursor-based replay implemented; missing route → reject (HTTP 503, error_code: event_spine.missing_route); no in-memory fallback; cursor resume works across restart.  
  - Status: Implemented in service_reject.py (EventSpineServiceRejectOnMissing) with routes in routes.py and integration tests in tests/integration_event_spine_tl01.py.
  - Unblocks: Agents/UI timeline durability.

- [MEM-01] Memory store routing-only ✅ COMPLETE
  - Domain: memory_store  
  - Files: engines/memory_store/service_reject.py, engines/memory_store/routes.py, routing lookup.  
  - Preconditions: AUTH-01; routing entry for memory_store.  
  - Success: SaaS/enterprise use routed backend only; missing route → HTTP 503 (error_code: memory_store.missing_route); scope enforced; in-memory only in explicit lab mode.  
  - Status: Implemented in service_reject.py (MemoryStoreServiceRejectOnMissing) with routes in routes.py and integration tests in tests/integration_memory_store_mem01.py.
  - Unblocks: Agents session continuity.

- [BB-01] Blackboard store routing-only ✅ COMPLETE
  - Domain: blackboard_store  
  - Files: engines/blackboard_store/service_reject.py, engines/blackboard_store/routes.py, routing lookup.  
  - Preconditions: AUTH-01; routing entry for blackboard_store.  
  - Success: Routed backend required; missing route → HTTP 503 (error_code: blackboard_store.missing_route); scope tenant/mode/project/run enforced; no in-memory in saas/enterprise; versioned writes with optimistic concurrency.  
  - Status: Implemented in service_reject.py (BlackboardStoreServiceRejectOnMissing) with routes in routes.py and integration tests in tests/integration_blackboard_store_bb01.py.
  - Unblocks: Agents coordination/canvas.

## Can Run in Parallel

- [AN-01] Analytics store enforcement ✅ COMPLETE
  - Domain: analytics_store  
  - Files: engines/analytics/service_reject.py, engines/analytics/routes.py, engines/routing/resource_kinds.py.  
  - Preconditions: AUTH-01; routing entry for analytics_store.  
  - Success: Routed backend only; missing route → HTTP 503 (error_code: analytics_store.missing_route); attribution fields required; in-memory disabled in saas/enterprise; hard rejection enforcement.  
  - Status: Implemented AnalyticsStoreServiceRejectOnMissing with routes in routes.py; smoke tests (6/6 passing) validate routing rejection, lab mode tolerance, backend adapter selection, ingest with attribution. Configuration templates for Firestore/DynamoDB/Cosmos provided. Comprehensive deployment documentation created.
  - Unblocks: Agents/UI analytics durability.

- [SEO-01] SEO config durability  
  - Domain: seo_config_store  
  - Files: engines/seo/*, routing lookup, storage adapter (tabular/doc).  
  - Preconditions: AUTH-01; routing entry for seo_config_store.  
  - Success: Routed backend; scope enforced; missing route → warning + reject; no in-memory default.  
  - Unblocks: UI/agents SEO config.

- [BUD-01] Budget/usage durability  
  - Domain: budget_store  
  - Files: engines/budget/*, routing usage.  
  - Preconditions: AUTH-01; routing entry for budget_store.  
  - Success: Routed backend only; missing route → warning + reject; in-memory disabled in saas/enterprise.  
  - Unblocks: Agents cost enforcement.

- [AUD-01] Audit sink routing  
  - Domain: audit (reuse event_spine/tabular)  
  - Files: audit emitters (routing/service), new audit sink service.  
  - Preconditions: AUTH-01; routing entry for chosen audit backend.  
  - Success: Append-only audit persisted via route; missing route → warning + reject; query path available.  
  - Unblocks: Compliance/audit for agents/UI.

- [SAVE-01] Save semantics (flows/graphs/overlays/strategy locks)  
  - Domain: tabular_store  
  - Files: new CRUD services/routes for flows, graphs, overlays; engines/strategy_lock/* for snapshots.  
  - Preconditions: AUTH-01; routing entry for tabular_store.  
  - Success: Routed tabular CRUD with versioning; missing route → warning + reject; strategy_lock snapshots durable.  
  - Unblocks: Agents/UI persistence for flows/graphs/overlays.

- [DIAG-01] Aggregated diagnostics  
  - Domain: diagnostics  
  - Files: new diagnostics endpoint (e.g., engines/routing/ or dedicated status module).  
  - Preconditions: Routing registry reading; services expose route status.  
  - Success: Endpoint lists active routes/status for event_spine/memory_store/blackboard_store/analytics_store/seo_config_store/budget_store/audit/save-store; warning-first visible.  
  - Unblocks: Operators + agents readiness checks.

## Nice-to-Have Later

- [NH-01] Lab-only explicit mode guards  
  - Domain: all  
  - Files: env/config guards in services.  
  - Preconditions: Core blockers done.  
  - Success: Lab mode explicitly required to enable in-memory routes; warning emitted when enabled.  
  - Unblocks: Safer demos/testing clarity.

## What must be true before agents can rely on durability

- AUTH-01 enforced across all listed domains.  
- Event spine (TL-01) routed, cursor replay working, missing routes warn + reject.  
- Memory store (MEM-01) routed-only in saas/enterprise; no in-memory fallback.  
- Blackboard store (BB-01) routed-only in saas/enterprise.  
- Analytics (AN-01) routed-only; no in-memory in saas/enterprise.  
- SEO config (SEO-01) routed and durable.  
- Budget (BUD-01) routed and durable.  
- Audit sink (AUD-01) routed and append-only.  
- Save semantics (SAVE-01) routed tabular CRUD for flows/graphs/overlays + durable strategy_lock snapshots.  
- Diagnostics (DIAG-01) endpoint exposes route status and warnings.  
- Warning-first behavior visible (logged/diagnostics) with rejection when route missing; no silent fallbacks.

## FINAL EXECUTION TODOs (Blocking Agents)

### TODO 1 — event_spine
Objective:
- Enforce routed-only append and cursor-based replay across hosts.
Files to Modify:
- engines/event_spine/*
- engines/routing/routes.py (ensure diagnostics covers event_spine)
Explicit Removals:
- Delete/disable any in-memory or filesystem event spine fallbacks.
Required Routing:
- resource_kind: event_spine
- Missing route behavior: reject + error
Failure Mode:
- HTTP 503
- error_code: event_spine.missing_route
Verification:
- Restart service
- Append event, fetch via cursor after restart
- Confirm persistence and cursor resume work across restart

### TODO 2 — memory_store
Objective:
- Route-backed session memory only; no in-memory in saas/enterprise.
Files to Modify:
- engines/memory/*
- engines/memory_store/*
Explicit Removals:
- Delete/disable in-memory defaults outside explicit tests.
Required Routing:
- resource_kind: memory_store
- Missing route behavior: reject + error
Failure Mode:
- HTTP 503
- error_code: memory_store.missing_route
Verification:
- Restart service
- Write/read session memory via HTTP
- Confirm data persists across restart only when route configured

### TODO 3 — blackboard_store
Objective:
- Route-backed blackboard only; durable per tenant/mode/project/run.
Files to Modify:
- engines/blackboard_store/*
Explicit Removals:
- Delete/disable in-memory/FS blackboard fallbacks.
Required Routing:
- resource_kind: blackboard_store
- Missing route behavior: reject + error
Failure Mode:
- HTTP 503
- error_code: blackboard_store.missing_route
Verification:
- Restart service
- Write/read blackboard entry
- Confirm persistence across restart with route; fails without route

### TODO 4 — analytics_store
Objective:
- Enforce routed analytics ingest/query; no in-memory defaults.
Files to Modify:
- engines/analytics/* (ingest/query paths)
Explicit Removals:
- Delete/disable in-memory analytics stores/default backends.
Required Routing:
- resource_kind: analytics_store
- Missing route behavior: reject + error
Failure Mode:
- HTTP 503
- error_code: analytics_store.missing_route
Verification:
- Restart service
- Ingest analytics event, query by time/run
- Confirm persistence across restart; missing route returns error

### TODO 5 — seo_config_store
Objective:
- Implement routed durable SEO config store with enforced scope.
Files to Modify:
- engines/seo/*
Explicit Removals:
- Delete/disable stub/in-memory SEO config handling.
Required Routing:
- resource_kind: seo_config_store
- Missing route behavior: reject + error
Failure Mode:
- HTTP 503
- error_code: seo_config_store.missing_route
Verification:
- Restart service
- Save/load SEO config with tenant/mode/project/app/surface
- Confirm persistence across restart; error when route absent

### TODO 6 — budget_store
Objective:
- Route-backed budget/usage ledger only; no soft defaults.
Files to Modify:
- engines/budget/*
Explicit Removals:
- Delete/disable in-memory budget repositories/defaults.
Required Routing:
- resource_kind: budget_store
- Missing route behavior: reject + error
Failure Mode:
- HTTP 503
- error_code: budget_store.missing_route
Verification:
- Restart service
- Record usage, query ledger
- Confirm persistence across restart; error on missing route

### TODO 7 — audit
Objective:
- Durable routed append-only audit sink with query.
Files to Modify:
- audit emitters (e.g., engines/routing/service.py)
- new audit sink service (reuse event_spine/tabular)
Explicit Removals:
- Delete/disable noop/in-memory audit paths.
Required Routing:
- resource_kind: event_spine or tabular_store (audit stream)
- Missing route behavior: reject + error
Failure Mode:
- HTTP 503
- error_code: audit.missing_route
Verification:
- Restart service
- Append audit event, query audit log
- Confirm persistence across restart; error when route absent

### TODO 8 — flows / graphs / overlays
Objective:
- Provide routed tabular CRUD for flows/graphs/overlays with versioning.
Files to Modify:
- new services/routes under engines/ (flows, graphs, overlays)
- engines/strategy_lock/* for durable snapshots
Explicit Removals:
- Delete/disable any local/FS prototypes for these saves.
Required Routing:
- resource_kind: tabular_store
- Missing route behavior: reject + error
Failure Mode:
- HTTP 503
- error_code: save_store.missing_route
Verification:
- Restart service
- Create/read/update flow/graph/overlay; create strategy_lock snapshot
- Confirm persistence/versioning across restart; error when route absent

## AGENT ASSIGNMENT GUIDE
- Parallel: TODO 1, 2, 3, 4, 5, 6, 7, 8 can be executed concurrently once AUTH/routing context understood; no cross-file coupling beyond routing config.
- Blockers: Each TODO blocks its domain’s durability; no fallback allowed. Event_spine, memory_store, blackboard_store are highest urgency for agents continuity; analytics/budget/audit/save/seo block respective features.
- Definition of Done (overall): All TODOs return HTTP 503 with specific error_code on missing route; no in-memory/FS persistence remains; routed backends persist across restart; identity enforcement applied per domain; diagnostics reflect route status.
