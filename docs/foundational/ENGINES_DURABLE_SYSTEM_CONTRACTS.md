# ENGINES Durable System Contracts

Authoritative contract for durable-by-default engines. No alternatives, no fallbacks, routing-first everywhere.

## System Invariants (Locked)
- Persistent-by-default across all domains; no implicit TTL; survives restarts/host changes/deploys.
- Routing registry is the sole backend selector; missing route = hard fail; no env flags or in-service selection.
- All cloud backends supported simultaneously; routing picks active Cosmos DB / Firestore / DynamoDB target.
- No agent/UI/connector writes host-local state; filesystem allowed only in lab with an explicit route and visible labeling.
- One system event/log spine feeds analytics, audit, safety, RL/RLHA, tuning, budget, strategy locks; no parallel paths.

## Scope and Ownership (System-Enforced)
- Identity scope on every record: tenant_id, mode, user_id, surface_id (chat|canvas|builder|...), optional project_id, and provenance run_id/thread_id.
- Ownership is user-first, not run-first. Tenant/mode/user/surface resolved server-side from auth; project_id validated per surface.

## Persistence Guarantees
- Durable in saas/enterprise/system modes; no downgrade to in-memory or filesystem.
- TTL only when explicitly configured; default is retained until explicit delete (except session memory honoring configured TTL).
- Missing backend route in saas/enterprise/system -> hard failure at init and on first operation.

## 1. Durability Gap Matrix
| Domain | Current State (fact) | Durability Status | Required Persistent Behavior | Routing Resource Kind | Backing Stores (Cosmos + Firestore + DynamoDB) | Failure Mode if Misconfigured |
| --- | --- | --- | --- | --- | --- | --- |
| Event Stream / Timeline | Fragmented per-domain logging; no unified routed spine. | non-persistent | Single append-only spine for analytics/audit/safety/RL/RLHA/tuning/budget/strategy events; ordered, no drops. | event_spine | Routed to `event_spine` container/collection/table. | Startup/emit hard-fails; GateChain errors recorded; no stdout fallback. |
| Memory Store (session) | Host-local/in-memory caches only. | non-persistent | Persistent session memory with configurable TTL; get/set/delete across hosts. | memory_store | Routed to `memory_store` container/collection/table. | Memory ops rejected; session continuity unavailable; fail fast. |
| Blackboard Store | No routed blackboard; ad-hoc coordination. | non-persistent | Persistent shared state per tenant/mode/project/run with versioned writes and list/read/write APIs. | blackboard_store | Routed to `blackboard_store` container/collection/table. | Run init fails; writes blocked; no silent overwrite. |
| Analytics | Cloud-backed analytics_store implemented (Builders B/C). | persistent | Keep routed persistence; all analytics events also flow through event spine. | analytics_store | Routed to `analytics_store` container/collection/table. | Ingest fails; diagnostics raise; no memory fallback. |
| SEO Config | Not implemented. | non-persistent | Persistent per-tenant/mode/surface SEO config; versioned reads/writes. | seo_config_store (tabular_store) | Routed to `seo_config_store` container/collection/table. | Config fetch/save fails; UI blocks; no defaults injected. |
| Budget / Usage | budget_store implemented (Builders B/C). | persistent | Append-only budget ledger; enforcement reads routed store; emits to event spine. | budget_store | Routed to `budget_store` container/collection/table. | Requests blocked; enforcement disabled and hard-fails; no silent allow. |
| Audit Sink | Host/service logs only; not routed. | non-persistent | Append-only audit events into event spine; query via routed store only. | event_spine (audit stream) | Routed to `event_spine` container/collection/table. | Authz/audit ops fail; requests rejected until sink route exists. |
| Saved Flows | UI/local exports only; no system record. | non-persistent | Persistent CRUD for flow definitions; versioned; scoped to tenant/mode/project/surface/user. | tabular_store (flow_store) | Routed to `flow_store` container/collection/table. | Save/load fails; UI must hard-fail; no local cache fallback. |
| Saved Graphs / Nodes | Same as flows; ad-hoc files. | non-persistent | Persistent CRUD for graph/node definitions; versioned; scoped. | tabular_store (graph_store) | Routed to `graph_store` container/collection/table. | Save/load fails; canvas features blocked; no host files. |
| UI Overlays / Lenses | Not implemented. | non-persistent | Persistent overlays/lenses per tenant/mode/surface/app/user with version history. | tabular_store (overlay_store) | Routed to `overlay_store` container/collection/table. | Overlay render/save fails; feature disabled with explicit error. |
| Strategy Lock Snapshots | In-memory toggles/flags only. | non-persistent | Persistent snapshots with append-only history; latest view readable. | tabular_store (strategy_lock_store) + event_spine emit | Routed to `strategy_lock_store` container/collection/table plus event spine. | Strategy enforcement disabled and requests fail; no transient locks. |
| Safety Decisions | Gate outcomes logged locally only. | non-persistent | Persist every safety decision + justification to event spine; queryable view allowed. | event_spine (safety stream) | Routed to `event_spine` container/collection/table. | Safety enforcement halts; no execution without sink; no drop. |
| RL / RLHA Telemetry | Not emitted persistently. | non-persistent | Persist telemetry to event spine for training/feedback; no alternate path. | event_spine (rl_stream) | Routed to `event_spine` container/collection/table. | RL/RLHA disabled; attempts fail; no buffering. |
| Tuning / Optimization Logs | Not captured. | non-persistent | Append tuning/optimization logs to event spine; queryable indexes allowed. | event_spine (tuning_stream) | Routed to `event_spine` container/collection/table. | Tuning ops blocked; pipeline rejects until route configured. |

## 2. Canonical Persistent Memory Model
### A. Session Memory (Persistent)
- Scope: tenant / mode / project / user / session.
- Purpose: conversational continuity across restarts/hosts.
- TTL: configurable; data persists until expiry; default is durable.
- API: get / set / delete.
- Routing: resource_kind `memory_store`; Cosmos/Firestore/Dynamo via routing.
- Filesystem: forbidden in saas/enterprise/system; allowed only in lab with explicit route.

### B. Blackboard (Persistent, Shared)
- Scope: tenant / mode / project / run.
- Purpose: shared agent coordination + canvas state.
- Semantics: versioned writes (no silent overwrite); list/read/write with optimistic concurrency.
- Size constraints: explicitly enforced per key (route-level config).
- Routing: resource_kind `blackboard_store`; persistent backends only.

### C. Maybes / Notes (Explicitly Durable, User-Owned)
- Definition: persistent personal knowledge store (Apple Notes/Notion equivalent), not speculative memory.
- Scope: tenant_id + mode + user_id + surface_id; optional project_id; owned by user.
- Persistence: durable until explicit delete; no TTL by default; survives host changes; routing-only.
- Routing: resource_kind `notes_store` (or `maybes_store`, stable and explicit); backends via routing (Cosmos/Firestore/DynamoDB).
- Filesystem: forbidden in saas/enterprise/system; lab allowed only via explicit route.
- API (minimum): POST /notes, GET /notes/{note_id}, PUT /notes/{note_id}, LIST /notes?user_id=&surface_id=&project_id=, DELETE /notes/{note_id}; identity derived server-side from headers/JWT; tenant/mode enforced server-side.
- Data model (minimum):
```json
{
  "note_id": "uuid",
  "tenant_id": "...",
  "mode": "...",
  "user_id": "...",
  "surface_id": "chat|canvas|builder|…",
  "project_id": "...?",
  "title": "string",
  "content": "markdown|json|text",
  "tags": ["string"],
  "source": {
    "created_by": "user|agent",
    "agent_id": "...?",
    "run_id": "...?"
  },
  "timestamps": {
    "created_at": "...",
    "updated_at": "..."
  }
}
```
- Explicit non-use: not for agent coordination (Blackboard), not for speculative scratch, not for session continuity (Memory).

## 3. Saved Project / Flow / Graph / Overlay Persistence
- Canonical store: `tabular_store` via routing for flow definitions, graph/node definitions, overlays/lenses, and strategy locks.
- Data model: `{id, scope (tenant_id/mode/project_id/surface_id/app_id/user_id), json_blob, version, created_at, updated_at}`.
- Scope: tenant / mode / project (+ surface/app/user where needed).
- APIs: CRUD required; writes are versioned; reads resolve latest unless version specified.
- System of record: the tabular store; agents/UI may cache but must treat routed store as authoritative.
- Missing backend in saas/enterprise/system: hard fail for save/load; UI/agents must block with explicit error; no filesystem fallback.

## 4. Unified Event / Log / Telemetry Spine
- Single append-only spine; no alternate logging paths. Analytics, audit, safety decisions, RL, RLHA, tuning/optimization, budget usage, strategy locks all emit here.
- Minimum event shape:
```json
{
  "event_id": "uuid",
  "tenant_id": "...",
  "mode": "...",
  "user_id": "...?",
  "surface_id": "...?",
  "project_id": "...?",
  "run_id": "...",
  "step_id": "...",
  "parent_event_id": "...?",
  "timestamp": "...",
  "event_type": "analytics|audit|safety|rl|rlha|tuning|budget|strategy_lock|...",
  "source": "ui|agent|connector|tool",
  "payload": {...},
  "route": "event_spine",
  "causality": {
    "trace_id": "...?",
    "span_id": "...?"
  }
}
```
- Required identity fields: tenant_id, mode, route; user_id/surface_id/project_id when applicable; run_id for provenance.
- Required causality fields: run_id, step_id, parent_event_id (when linked); trace/span optional but preferred.
- GateChain failures: emitted as event_type `safety` with failure metadata; never dropped; recorded even when enforcement denies execution.
- Append-only; no updates/deletes. Queryable via routed analytics/audit views and indexes; derived warehouses allowed but spine remains source of truth.

## 5. Identity & Auth Precedence (Uniform)
- Server-derived only: tenant_id, mode, auth principal, surface binding. These are sourced from validated JWT/auth session and routing context; client headers cannot override.
- Client-supplied but validated: user_id (from JWT), project_id/surface_id parameters validated against tenant/mode; rejected if not authorized.
- Precedence: server binding > JWT claims > headers/query. Any mismatch triggers rejection (4xx/401) and audit event to event spine; no silent override.
- Applies uniformly to UI, agents, connectors, tools; all APIs enforce server-derived identity before executing writes/reads.

## 6. Explicit Deferred Capabilities (Reserved Shapes, Not Active)
- PII rehydration (per-tenant): reserved contract for secure vault-backed retrieval; nothing may depend on rehydration yet.
- Nexus / RAG runtime hydration: structure reserved for retrieval pipelines; no runtime dependencies allowed.
- Tool registries: reserved tabular/registry structure; no dynamic tool loading may assume existence.
- Canvas registries: reserved for future canvas asset discovery; no current dependency.
- Vector store / embedder: intentionally deferred; no embedding/pinecone/etc. assumed.
- External connector execution: future capability; current system must not assume outbound connector execution or persistence.

## Enforcement and Failure Behavior
- Missing routing entries: initialization and first operation hard-fail with explicit error; diagnostics already implemented must surface the missing route.
- No automatic downgrade to in-memory/filesystem; lab exceptions require explicit lab route and visible labeling.
- Services must refuse to start if any required resource_kind lacks a route in saas/enterprise/system.

