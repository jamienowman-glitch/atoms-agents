# Routing & Event Infrastructure Inventory

**Date:** 2 January 2026  
**Scope:** /Users/jaynowman/dev workspace infrastructure discovery  
**Purpose:** Map existing routing/registry and event spine implementations to guide new event_spine infrastructure integration

---

## Summary

The workspace contains a **production-ready routing registry system** (Phase 0.5 Lanes 0-5 completed) with **partial event spine implementation**. The routing infrastructure is durable and fully integrated; event spine is partially implemented at the timeline/audit layer but **lacks a unified event emission and storage system**.

---

## 1. Routing Infrastructure (COMPLETE)

### 1.1 Routing Registry System
**Status:** ✅ **Production-ready** (Phase 0.5 completed)

**Location:** [northstar-engines/engines/routing/](northstar-engines/engines/routing/)

**Key Files:**

| File | Purpose | Status |
|------|---------|--------|
| [northstar-engines/engines/routing/registry.py](northstar-engines/engines/routing/registry.py) | Core registry with ResourceRoute model; persistent storage abstraction | Production |
| [northstar-engines/engines/routing/registry_store.py](northstar-engines/engines/routing/registry_store.py) | Registry persistence layer (filesystem/Firestore/DynamoDB/Cosmos) | Production |
| [northstar-engines/engines/routing/service.py](northstar-engines/engines/routing/service.py) | Service layer for route lookup/audit emission | Production |
| [northstar-engines/engines/routing/manager.py](northstar-engines/engines/routing/manager.py) | Route lifecycle management | Production |
| [northstar-engines/engines/routing/resource_kinds.py](northstar-engines/engines/routing/resource_kinds.py) | Canonical resource_kind definitions | Production |
| [northstar-engines/engines/routing/schemas.py](northstar-engines/engines/routing/schemas.py) | Route request/response schemas | Production |

**Functionality:**

- **Resource Kind Mapping:** Routing registry maps logical `resource_kind` identifiers to backend configurations
- **Multi-tenant:** Routes scoped by `tenant_id`, `env`, `project_id`, `mode`
- **Backend Agnostic:** Supports Firestore, DynamoDB, Cosmos DB, filesystem (lab-only)
- **Audit Trail:** Every route lookup/modification emitted via `emit_audit_event()`
- **Validation:** Hard-fail on missing routes; no environment variable fallbacks
- **Diagnostic Metadata:** Tier, health_status, cost_notes, switch history (Lane 5 additions)

**Canonical Resource Kinds Defined:**

```python
event_spine              # Unified event log (analytics/audit/safety/RL/tuning/budget/strategy)
event_stream            # Append/list_after stream with cursor support
tabular_store          # Key/value persistence (policies, configs, registries)
analytics_store        # Analytics event storage
budget_store           # Usage ledger persistence
memory_store           # Session memory with TTL
routing_registry_store # Registry persistence itself
vector_store           # Vector search backends
object_store           # Blob storage (S3/Blob/GCS)
```

**Current Route Query Example:**
```python
from engines.routing.registry import routing_registry

registry = routing_registry()
route = registry.get_route(
    resource_kind="event_spine",
    tenant_id="t_acme",
    env="prod",
    project_id="p_bigdata"
)
# route.backend_type → "firestore" | "dynamodb" | "cosmos"
# route.config → {"project": "...", "collection": "event_spine", ...}
```

---

## 2. Event Spine / Event Store Infrastructure

### 2.1 Timeline Store (Partial Implementation)
**Status:** ⚠️ **Partial** - In-memory + Firestore, but not integrated with routing registry

**Location:** [northstar-engines/engines/realtime/timeline.py](northstar-engines/engines/realtime/timeline.py)

**Key Features:**

- **TimelineStore Protocol:** Abstract interface for append/list_after operations
- **InMemoryTimelineStore:** Default for testing; validates tenant/mode/project scope
- **FirestoreTimelineStore:** Cloud persistence to Firestore
- **Validation:** Ensures event routing matches RequestContext scope (tenant_id, mode, project_id)

**Current Limitation:** Uses environment variable fallback (`STREAM_TIMELINE_BACKEND`); **not routed through registry**

```python
# Current: Environment-driven
timeline_store = _default_timeline_store()  # Checks env var

# Should be: Registry-routed
registry.get_route("event_spine")  # → Firestore/DynamoDB/Cosmos config
```

### 2.2 Event Stream Repository
**Status:** ⚠️ **Partial** - Cloud backends defined but not integrated

**Location:** [northstar-engines/engines/realtime/event_stream_repository.py](northstar-engines/engines/realtime/event_stream_repository.py)

**Cloud Adapters Implemented:**

- **FirestoreEventStreamStore:** Collection-based event stream with cursor support
- **DynamoDBEventStreamStore:** (Defined but not fully tested)
- **CosmosEventStreamStore:** (Defined but not fully tested)

**Current Limitation:** Each backend hardcoded; **not resolver-integrated**

### 2.3 Audit Event Emission
**Status:** ✅ **Production** - Used widely, routes to logging engine

**Location:** [northstar-engines/engines/logging/audit.py](northstar-engines/engines/logging/audit.py)

**Key Function:**
```python
def emit_audit_event(
    ctx: RequestContext,
    action: str,
    surface: str = "audit",
    metadata: Optional[Dict[str, Any]] = None,
    input_data: Optional[Dict[str, Any]] = None,
    output_data: Optional[Dict[str, Any]] = None,
) -> None:
```

**Behavior:**

- Creates `DatasetEvent` with trace_id, request_id, actor_type
- Routes through `engines.logging.events.engine.run()`
- Hard-fails if `AUDIT_STRICT=1` and persistence fails

**Usage Pattern:** Used throughout system for mutation tracking (routing, maybes, firearms, nexus)

```python
# Example from engines/routing/service.py
emit_audit_event(
    ctx,
    action="routing.lookup",
    surface="routing",
    metadata={"resource_kind": "event_spine"}
)
```

### 2.4 Audit Chain
**Status:** ⚠️ **Partial** - Conceptual framework, not fully implemented

**Location:** [northstar-engines/engines/logging/audit_chain.py](northstar-engines/engines/logging/audit_chain.py)

**Intended Purpose:** Hash chaining for immutability; append-only audit log

**Current State:** Definitions exist but not integrated into persistence path

### 2.5 Contract Definitions
**Status:** ✅ **Complete** - Authoritative contract defined

**Location:** [northstar-engines/engines/realtime/contracts.py](northstar-engines/engines/realtime/contracts.py)

**Defines:** `StreamEvent` envelope with routing/metadata/payload structure

---

## 3. Backend Storage Interfaces

### 3.1 Tabular Store Service (Production)
**Status:** ✅ **Production** - Fully routed, tested

**Location:** [northstar-engines/engines/storage/routing_service.py](northstar-engines/engines/storage/routing_service.py)

**Resolved Adapters:**

- **FileSystemTabularStore:** Lab-only with mode guard
- **FirestoreTabularStore:** Cloud production
- **DynamoDBTabularStore:** Cloud alternative  
- **CosmosTabularStore:** Azure production

**Resolution Pattern:**
```python
class TabularStoreService:
    def _resolve_adapter(self):
        route = routing_registry().get_route(
            resource_kind="tabular_store",
            tenant_id=context.tenant_id,
            env=context.env,
            project_id=context.project_id,
        )
        backend_type = route.backend_type  # "firestore" | "dynamodb" | "cosmos"
        # → Instantiate correct adapter with route.config
```

**Used By:**
- Analytics: Attribution contracts, analytics event storage
- Budget: Usage ledger
- Media: Metadata persistence
- SEO: Config storage

### 3.2 Cloud Tabular Store Implementations
**Status:** ✅ **Production**

**Location:** [northstar-engines/engines/storage/cloud_tabular_store.py](northstar-engines/engines/storage/cloud_tabular_store.py)

**Implementations:**

1. **FirestoreTabularStore**
   - Collection-based, document per key
   - Project-scoped via runtime_config

2. **DynamoDBTabularStore**
   - Table per resource_kind
   - Boto3-based client

3. **CosmosTabularStore**
   - Container per resource_kind
   - Azure SDK

---

## 4. Event Emission Points (Existing)

### 4.1 Audit Events
**Emitters Found:**

| Component | Location | Event Type | Routed |
|-----------|----------|-----------|--------|
| Routing Service | engines/routing/service.py | routing.lookup, routing.update | Via emit_audit_event |
| Maybes Service | engines/maybes/service.py | note.create, note.update, note.delete | Via emit_audit_event |
| Firearms Service | engines/firearms/service.py | firearms.issue, firearms.revoke | Via emit_audit_event |
| GateChain | engines/nexus/hardening/gate_chain.py | safety decisions | Via emit_audit_event |
| Raw Storage | engines/nexus/raw_storage/ | presign, register | Via audit helper |

### 4.2 Timeline Events
**Emitters Found:**

| Component | Location | Stream ID | Storage |
|-----------|----------|-----------|---------|
| Routing Service | engines/routing/service.py | timeline_id | get_timeline_store() |
| GateChain | engines/nexus/hardening/gate_chain.py | thread_id/canvas_id | get_timeline_store() |

**Current Pattern:**
```python
# From engines/routing/service.py
timeline = get_timeline_store()
timeline.append(stream_id, event, context)
```

---

## 5. Existing Documentation & Contracts

### 5.1 Authoritative Specs
**Location:** [docs/foundational/](docs/foundational/)

| Document | Purpose | Status |
|----------|---------|--------|
| [ENGINES_DURABLE_SYSTEM_CONTRACTS.md](docs/foundational/ENGINES_DURABLE_SYSTEM_CONTRACTS.md) | System invariants; durability gaps matrix | ✅ Current |
| [ENGINE_CONTRACTS_AND_CONSUMER_GUIDE.md](docs/foundational/ENGINE_CONTRACTS_AND_CONSUMER_GUIDE.md) | Service contracts; how to use timeline/analytics/budget | ✅ Current |
| [PHASE_0_5_POST_LANE5_BUILDER_BRIEFS.md](docs/foundational/PHASE_0_5_POST_LANE5_BUILDER_BRIEFS.md) | Resource kind specs; backend configs; testing requirements | ✅ Current |
| [PHASE_0_5_INFRA_ROUTING_PARALLEL_PLAN.md](northstar-engines/docs/foundational/PHASE_0_5_INFRA_ROUTING_PARALLEL_PLAN.md) | Phase 0.5 execution plan; commit ordering | ✅ Historical |

### 5.2 Implementation Summaries
**Location:** [northstar-engines/](northstar-engines/)

| Document | Purpose | Status |
|----------|---------|--------|
| PHASE_0_6_BUILDER_BC_COMPLETION_SUMMARY.md | Analytics/attribution implementation details | ✅ Current |
| PHASE_0_5_LANE0_LANE1_SUMMARY.md | Routing registry + contract stabilization | ✅ Current |
| PHASE_0_5_LANE2_COMPLETION_SUMMARY.md | Tabular store cloud backends | ✅ Current |
| PHASE_0_5_LANE3_COMPLETION_SUMMARY.md | Memory store routing | ✅ Current |
| PHASE_0_5_LANE4_COMPLETION_SUMMARY.md | Vector/object stores routing | ✅ Current |
| PHASE_0_5_LANE5_COMPLETION_SUMMARY.md | Analytics routing + diagnostics | ✅ Current |

---

## 6. Gap Analysis & Integration Points

### 6.1 What EXISTS (Ready to Use)

✅ **Routing Registry:** Complete, production-ready, all backends supported  
✅ **Tabular Store Service:** Fully routed and tested  
✅ **Audit Emission:** Wide usage, data-driven  
✅ **Timeline Storage:** Firestore + in-memory, validates scope  
✅ **Contract Definitions:** StreamEvent envelope defined  
✅ **Cloud Backends:** Firestore/DynamoDB/Cosmos adapters for tabular + partial for event streams

### 6.2 What's MISSING (To Integrate)

❌ **Unified Event Spine Service:** No single routing-based service to emit events across all domains (analytics/audit/safety/RL/tuning/budget/strategy)  
❌ **Event Stream Routing:** Event stream repository backends not integrated with routing registry resolver  
❌ **Timeline Routing:** Timeline store selection still env-driven; should use routing registry  
❌ **Event Emission Framework:** No canonical emit_* functions for non-audit events (safety decisions, RL telemetry, tuning logs, etc.)  
❌ **Query/Cursor Interface:** Last_event_id cursor partially defined; not fully tested with cloud backends  
❌ **Event Filtering/Multiplexing:** No multi-domain event fan-out or selective subscription  
❌ **Event Spine Tests:** Smoke tests for cross-backend write/read not comprehensive

### 6.3 Where to Integrate event_spine

**Phase 0.7 Candidate Locations:**

1. **Create `engines/event_spine/service.py`**
   - Singleton `EventSpineService` with routing-based backend resolution
   - `emit_event(ctx, event_type, stream_id, payload, metadata)` → appends to all enabled sinks
   - Uses routing registry to resolve `event_spine` → [firestore|dynamodb|cosmos]
   - Hard-fails if route missing in saas/enterprise/system modes

2. **Extend `engines/realtime/event_stream_repository.py`**
   - Create `EventStreamService(context)` wrapper similar to `TabularStoreService`
   - Auto-resolve backend via `routing_registry().get_route("event_stream")`
   - Add comprehensive cursor support + query builder
   - Tests for Firestore/DynamoDB/Cosmos round-trip

3. **Update `engines/routing/service.py` Integration**
   - Change timeline store selection from `get_timeline_store()` to `routing_registry().get_route("event_spine")`
   - Emit to event spine on routing changes (not just timeline)

4. **Create `engines/logging/event_emitters.py`**
   - Canonical emitters for safety decisions, RL telemetry, tuning logs, budget events
   - All use `EventSpineService.emit_event()` as backbone
   - Consistent metadata envelope (tenant_id, mode, user_id, surface_id, request_id, trace_id, run_id)

5. **Add Comprehensive Tests**
   - [northstar-engines/tests/integration_event_spine.py](northstar-engines/tests/integration_event_spine.py) (new)
   - Verify write/read survives restart on each backend
   - Verify cursor position after batch appends
   - Verify scope validation (tenant mismatch raises)

---

## 7. File Structure & Key Paths

```
/Users/jaynowman/dev/
├── docs/foundational/
│   ├── ENGINES_DURABLE_SYSTEM_CONTRACTS.md           # Authority
│   ├── ENGINE_CONTRACTS_AND_CONSUMER_GUIDE.md
│   └── PHASE_0_5_POST_LANE5_BUILDER_BRIEFS.md
│
├── northstar-engines/
│   ├── engines/
│   │   ├── routing/                                   # ✅ Complete
│   │   │   ├── registry.py
│   │   │   ├── registry_store.py
│   │   │   ├── service.py
│   │   │   ├── manager.py
│   │   │   ├── resource_kinds.py
│   │   │   ├── schemas.py
│   │   │   └── tests/
│   │   │
│   │   ├── realtime/                                  # ⚠️ Partial
│   │   │   ├── timeline.py (env-driven, not routed)
│   │   │   ├── event_stream_repository.py (backends defined, not routed)
│   │   │   ├── contracts.py
│   │   │   ├── isolation.py
│   │   │   ├── routes.py
│   │   │   └── tests/
│   │   │
│   │   ├── storage/                                   # ✅ Complete
│   │   │   ├── routing_service.py
│   │   │   ├── cloud_tabular_store.py
│   │   │   ├── filesystem_tabular.py
│   │   │   └── tests/
│   │   │
│   │   ├── logging/                                   # ✅ Partial (audit complete)
│   │   │   ├── audit.py
│   │   │   ├── audit_chain.py (not fully integrated)
│   │   │   ├── event_log.py
│   │   │   ├── events/
│   │   │   │   └── engine.py
│   │   │   └── tests/
│   │   │
│   │   └── nexus/hardening/
│   │       └── gate_chain.py (emits timeline events)
│   │
│   ├── tests/
│   │   ├── integration_lane0_lane1.py (routing tests)
│   │   └── integration_lane2_lane3.py (storage tests)
│   │
│   └── docs/foundational/
│       ├── PHASE_0_5_LANE0_LANE1_SUMMARY.md
│       ├── PHASE_0_5_LANE2_COMPLETION_SUMMARY.md
│       └── ...
│
└── northstar-core/
    └── src/ (models registry, but no event infrastructure)
```

---

## 8. Decision Points for event_spine Integration

### Question 1: Unified vs. Domain-Scoped Stores?

**Option A (RECOMMENDED):** Unified `event_spine` resource_kind
- Single routing target shared by all domains (analytics, audit, safety, RL, tuning, budget, strategy)
- Simpler routing; fewer resource kinds
- Requires filtering/stream_id scoping at query time
- **Matches ENGINES_DURABLE_SYSTEM_CONTRACTS intent**

**Option B:** Separate resource_kind per domain
- `event_spine_analytics`, `event_spine_audit`, `event_spine_safety`, etc.
- More granular routing control
- More complex; higher operational burden
- **Not aligned with contract; avoided**

**Decision:** Use Option A (unified `event_spine`)

### Question 2: Event Storage Adapter (Single vs. Multi)?

**Option A (RECOMMENDED):** Single routed store (as with tabular_store)
- `EventSpineService` resolves backend once at init
- All events appended to chosen backend
- Mirror strategy: deploy separate routes per tenant if replication desired

**Option B:** Fan-out to multiple backends
- Every emit hits Firestore + DynamoDB + Cosmos
- Redundancy built-in
- Massive cost increase; not recommended

**Decision:** Use Option A (single routed store)

### Question 3: Timeline vs. Event Spine?

**Option A:** Merge timeline into event_spine
- Deprecate `get_timeline_store()` 
- Use `EventSpineService` for all appends
- Stream IDs disambiguate (thread_id/canvas_id vs. analytics, audit, safety)

**Option B (CURRENT):** Keep separate
- Timeline for realtime SSE/WS (current; fast in-memory)
- Event spine for durable logging (cloud backends)

**Decision:** Phase 0.7 can merge; for now, keep separate (timeline fast path, event_spine slow durable path)

---

## 9. Actionable Next Steps for event_spine

1. **Define event_spine routes** in routing registry
   - Add `resource_kind=event_spine` routes for all tenants/envs
   - Set backend_type to firestore/dynamodb/cosmos
   - Create test fixtures

2. **Create EventSpineService** (similar to TabularStoreService)
   - Auto-resolve backend from routing registry
   - Wrap event stream repository adapters
   - Hard-fail on missing route

3. **Create event emitters** for non-audit domains
   - `emit_safety_decision(ctx, decision, justification)`
   - `emit_rl_telemetry(ctx, model_version, reward, metadata)`
   - `emit_tuning_log(ctx, config_version, change_description)`
   - All use EventSpineService as backbone

4. **Update timeline integration**
   - Replace `get_timeline_store()` with `EventSpineService` option flag
   - Allow both paths (timeline for fast, event_spine for durable)
   - Audit metadata flow through both

5. **Add comprehensive tests**
   - Round-trip write/read on all backends
   - Scope validation (tenant/mode mismatch raises)
   - Cursor position after batch appends
   - Smoke test with restart between ops

6. **Update documentation**
   - Add event_spine section to ENGINE_CONTRACTS_AND_CONSUMER_GUIDE
   - Document event types and metadata envelopes
   - Provide examples for each emitter

---

## Appendix: Key Code References

### Routing Registry Get Pattern
```python
from engines.routing.registry import routing_registry

registry = routing_registry()
route = registry.get_route(
    resource_kind="event_spine",
    tenant_id="t_acme",
    env="prod",
    project_id="p_bigdata",
)
backend_type = route.backend_type  # "firestore" | "dynamodb" | "cosmos"
config = route.config  # Backend-specific: {"project": "...", "collection": "..."}
```

### TabularStoreService Pattern (To Emulate)
```python
from engines.storage.routing_service import TabularStoreService

class TabularStoreService:
    def __init__(self, context: RequestContext) -> None:
        self._context = context
        self._adapter = self._resolve_adapter()
    
    def _resolve_adapter(self):
        route = routing_registry().get_route(
            resource_kind="tabular_store",
            tenant_id=self._context.tenant_id,
            env=self._context.env,
            project_id=self._context.project_id,
        )
        backend_type = (route.backend_type or "").lower()
        # Instantiate correct adapter with route.config
```

### Audit Event Emission Pattern
```python
from engines.logging.audit import emit_audit_event

emit_audit_event(
    ctx,
    action="event_spine.append",
    surface="event_spine",
    metadata={"stream_id": "analytics_" + run_id, "event_type": "model_score"}
)
```

### StreamEvent Envelope (From contracts.py)
```python
from engines.realtime.contracts import StreamEvent

event = StreamEvent(
    event_id=str(uuid.uuid4()),
    ts=datetime.now(timezone.utc),
    event_type="safety_decision",  # or "analytics", "audit", "rl", "tuning", "budget", "strategy"
    stream_id="analytics_" + run_id,
    routing=EventRouting(
        tenant_id=ctx.tenant_id,
        env=ctx.env,
        mode=ctx.mode,
        project_id=ctx.project_id,
    ),
    metadata={
        "request_id": ctx.request_id,
        "trace_id": ctx.request_id,
        "user_id": ctx.user_id,
        "surface_id": ctx.surface_id,
    },
    payload={"decision": "allow", "reason": "passed safety gates"},
)
```

---

**End of Inventory**

This document should be referenced during Phase 0.7 infrastructure work to ensure event_spine is integrated consistently with the routing-first architecture established in Phase 0.5.
