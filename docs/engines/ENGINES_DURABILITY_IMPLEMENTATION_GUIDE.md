# Engines Durability Implementation Guide

## event_spine
- Purpose: Append-only timeline/event stream for analytics/audit/safety/telemetry.
- Before: Routing kind declared; registry/diagnostics exist; no cursored replay; warn-first behavior unclear.
- Now: Routing control-plane in place with diagnostics/switch; event_spine kind present; append calls route-backed; no explicit replay.
- Required after implementation: Routed backend only; cursor-based replay across hosts; warning-first when route missing (emit + reject write); no in-memory fallback in saas/enterprise; lab only via explicit route.
- Routing resource_kind: `event_spine`.
- Persistence guarantees: Durable storage via routed backend; append-only.
- Warning-first vs blocking: Warning-first on missing route but reject writes; reads/writes must surface route gaps.
- API surface: `POST /timeline/events` (append), `GET /timeline/events?cursor=` (replay/resume).
- Required identity fields: tenant_id, mode, project_id, run_id; user_id/surface_id when applicable.
- Agents/UI may assume: Event appends are durable and replayable via cursor when route exists; missing route yields explicit warning + rejection.
- Agents/UI must NOT assume: Any in-memory fallback, or successful writes without a configured route.

## memory_store
- Purpose: Persistent session memory across hosts with TTL.
- Before: In-memory/Firestore options; routing kind defined; fail-fast not enforced.
- Now: memory service supports routing; in-memory still available; scope enforcement partial.
- Required after implementation: Routed backend default; warning-first + reject when route missing; scope includes tenant/mode/project/user/session; lab-only in-memory via explicit route.
- Routing resource_kind: `memory_store`.
- Persistence guarantees: Durable by default in saas/enterprise; TTL honored per route config.
- Warning-first vs blocking: Warning-first with explicit error on missing route; no silent fallback.
- API surface: `GET/POST/DELETE /memory`.
- Required identity fields: tenant_id, mode, project_id, user_id, session_id.
- Agents/UI may assume: Durable memory when route configured; warning surfaces when not.
- Agents/UI must NOT assume: Any implicit local/FS persistence in saas/enterprise.

## blackboard_store
- Purpose: Persistent shared state per run/project for coordination.
- Before: Kind declared; durability wiring unclear; possible in-memory usage.
- Now: Routing available; blackboard service not clearly bound to routed storage.
- Required after implementation: Routed backend mandatory; warning-first + reject on missing route; scope tenant/mode/project/run; no in-memory in saas/enterprise.
- Routing resource_kind: `blackboard_store`.
- Persistence guarantees: Durable in saas/enterprise; no FS default.
- Warning-first vs blocking: Warning-first with explicit rejection on route gaps.
- API surface: `POST /blackboard` (write), `GET /blackboard` (list/read), `GET /blackboard/{key}`.
- Required identity fields: tenant_id, mode, project_id, run_id.
- Agents/UI may assume: Writes persist when route exists; warnings signal unusable state otherwise.
- Agents/UI must NOT assume: Local-only coordination or hidden fallbacks.

## analytics_store
- Purpose: Durable analytics events with attribution (app/surface/platform/run/step/UTM).
- Before: In-memory defaults; durability not enforced; attribution partial.
- Now: Firestore/Dynamo/Cosmos implementations with routing; silent-drop risk if route missing.
- Required after implementation: Routed backend required; warning-first + reject on missing route; attribution fields required; no in-memory default in saas/enterprise.
- Routing resource_kind: `analytics_store`.
- Persistence guarantees: Durable in saas/enterprise; lab explicit only.
- Warning-first vs blocking: Warning-first with rejection; no silent drop.
- API surface: `POST /analytics/events`, `GET /analytics/events` (filters).
- Required identity fields: tenant_id, mode, project_id, app, surface, platform, run_id, step_id.
- Agents/UI may assume: Durable ingest/query when route exists; warnings surface route gaps.
- Agents/UI must NOT assume: Events are stored without a configured route.

## seo_config_store
- Purpose: Durable SEO configuration scoped to tenant/mode/project/app/surface.
- Before: SEO engine stub; no durable store.
- Now: No routed persistence.
- Required after implementation: Routed store (tabular/doc) mandatory; warning-first + reject on missing route; scope enforced.
- Routing resource_kind: `seo_config_store`.
- Persistence guarantees: Durable in saas/enterprise; no in-memory default.
- Warning-first vs blocking: Warning-first with rejection; lab only via explicit route.
- API surface: `GET /seo/config`, `PUT /seo/config`.
- Required identity fields: tenant_id, mode, project_id, app, surface_id.
- Agents/UI may assume: Config persists when route exists; warnings signal unusable state.
- Agents/UI must NOT assume: Default SEO config or implicit persistence.

## budget_store
- Purpose: Durable budget/usage ledger with queries/enforcement.
- Before: Budget engine allowed in-memory defaults; durability not enforced.
- Now: budget_store kind present; routing used variably.
- Required after implementation: Routed backend mandatory; warning-first + reject on missing route; no in-memory in saas/enterprise.
- Routing resource_kind: `budget_store`.
- Persistence guarantees: Durable ledger in saas/enterprise.
- Warning-first vs blocking: Warning-first with rejection; lab explicit only.
- API surface: `POST /budget/usage`, `GET /budget/usage`.
- Required identity fields: tenant_id, mode, project_id.
- Agents/UI may assume: Usage/budget writes durable when route exists; warnings show gaps.
- Agents/UI must NOT assume: Soft allow when route missing.

## audit
- Purpose: Durable append-only audit trail for actions/routing changes/etc.
- Before: Ad-hoc audit emits; no dedicated durable sink.
- Now: Audit emitted from routing; no routed audit store.
- Required after implementation: Routed audit sink (reusing event_spine/tabular) with append-only; warning-first + reject on missing route; tamper-evidence noted.
- Routing resource_kind: reuse `event_spine` or `tabular_store` for audit_stream (no new kind).
- Persistence guarantees: Durable append-only in saas/enterprise.
- Warning-first vs blocking: Warning-first with rejection on missing route.
- API surface: `POST /audit/events`, `GET /audit/events` (query). 
- Required identity fields: tenant_id, mode, user_id (when applicable), project_id, run_id.
- Agents/UI may assume: Audit persists when route exists; warnings surface route gaps.
- Agents/UI must NOT assume: No-op audit or in-memory.

## save semantics (flows / graphs / overlays / strategy locks)
- Purpose: Durable canonical storage for flows, graphs/nodes, overlays, strategy lock snapshots.
- Before: tabular_store kind only; flow/graph/overlay services absent; strategy_lock partial.
- Now: No canonical save services for flows/graphs/overlays; strategy_lock present but partial.
- Required after implementation: Routed tabular-backed CRUD for flows/graphs/overlays; versioned; strategy_lock snapshots durable; warning-first + reject when route missing.
- Routing resource_kind: `tabular_store`.
- Persistence guarantees: Durable in saas/enterprise; no FS/in-memory defaults.
- Warning-first vs blocking: Warning-first with rejection on missing route.
- API surface: `CRUD /flows`, `CRUD /graphs`, `CRUD /overlays`, `GET/POST /strategy-lock/snapshots`.
- Required identity fields: tenant_id, mode, project_id, surface_id, user_id (where applicable).
- Agents/UI may assume: Saved entities durable with versions when route exists; warnings flag unusable state.
- Agents/UI must NOT assume: Local caching as source of truth or implicit defaults.
