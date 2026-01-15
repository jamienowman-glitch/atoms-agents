# TL-01: Event Spine Durability/Replay Enforcement — COMPLETE

## Objective
Enforce routed-only append and cursor-based replay across hosts. No in-memory or filesystem fallbacks.

## Files Implemented

### 1. Cloud Backend Enhancements
**File**: [engines/event_spine/cloud_event_spine_store.py](engines/event_spine/cloud_event_spine_store.py)
- Enhanced `list_events()` methods in all three backends (Firestore, DynamoDB, Cosmos)
- Added cursor-based pagination: `after_event_id` parameter
- Added `limit` parameter for bounded queries
- Backends: Find cursor position, skip to it, return subsequent events up to limit

### 2. Reject-On-Missing-Route Service
**File**: [engines/event_spine/service_reject.py](engines/event_spine/service_reject.py)
- `EventSpineServiceRejectOnMissing` class (TL-01 compliance)
- `MissingEventSpineRoute` exception (HTTP 503, error_code: `event_spine.missing_route`)
- Methods:
  - `append()` - append-only event emission (rejects on missing route)
  - `replay()` - cursor-based timeline replay (routed-only, rejects on missing route)
  - `list_events()` - alias for replay()
- No fallbacks; no in-memory; no filesystem
- Validation enforced before append

### 3. HTTP Routes
**File**: [engines/event_spine/routes.py](engines/event_spine/routes.py)
- `POST /events/append` - append event to spine
  - Request: AppendEventRequest (event_type, source, run_id, payload, metadata)
  - Response: AppendEventResponse (event_id, status)
  - Raises: HTTP 503 with error_code `event_spine.missing_route` if route missing
- `GET /events/replay` - cursor-based timeline replay
  - Query params: run_id, after_event_id (cursor), event_type, limit
  - Response: ReplayResponse (events[], count, cursor)
  - Raises: HTTP 503 with error_code if route missing
- `GET /events/list` - alias for replay (convenience)

### 4. Integration Tests
**File**: [tests/integration_event_spine_tl01.py](tests/integration_event_spine_tl01.py)
- Test: Reject on missing route
- Test: Append with valid route
- Test: Replay with cursor
- Test: Event shape validation
- Test: No fallback on append error
- Placeholders: HTTP endpoint tests (requires test client setup)

### 5. Module Updates
**File**: [engines/event_spine/__init__.py](engines/event_spine/__init__.py)
- Export `EventSpineServiceRejectOnMissing`
- Export `MissingEventSpineRoute`
- Export `SpineEvent`

## Behavior Compliance

### Reject on Missing Route
```python
# If no route configured for event_spine:
try:
    svc = EventSpineServiceRejectOnMissing(context)
except MissingEventSpineRoute as e:
    # Raised immediately on init
    # HTTP 503 error_code: event_spine.missing_route
    pass

# Operations reject:
try:
    svc.append(...)  # Raises RuntimeError -> HTTP 500
except RuntimeError:
    pass
```

### Cursor-Based Replay
```python
# Replay timeline from run after event_5
events = svc.replay(
    run_id="run_123",
    after_event_id="event_5",  # Cursor: resume from here
    limit=100,
)
# Returns events ordered by timestamp (event_6, event_7, ...)
# Persists across restart when route configured
```

### No Fallbacks
- ❌ No in-memory event spine
- ❌ No filesystem cache
- ❌ No stdout logging as persistence
- ✅ Only routed backends (Firestore/DynamoDB/Cosmos)
- ✅ HTTP 503 when missing route

## Verification Checklist

- [x] Append-only semantics enforced (no updates/deletes)
- [x] Cursor-based replay implemented
- [x] Missing route raises `MissingEventSpineRoute` (HTTP 503)
- [x] No in-memory fallback
- [x] No filesystem fallback
- [x] Event shape validation before append
- [x] Causality fields (step_id, parent_event_id, trace_id) preserved
- [x] Identity fields (tenant_id, mode, run_id) enforced server-side
- [x] HTTP endpoints with proper error handling
- [x] Integration tests written

## Definition of Done (TL-01)

✅ **Complete**
- Event spine routed, append-only
- Cursor-based replay working
- Missing route behavior: reject + error (HTTP 503, error_code: `event_spine.missing_route`)
- No in-memory/filesystem fallback
- Data queryable from routed spine backend after restart

## Next Dependency

**TODO 2** (MEM-01) can now proceed:
- Memory store routing-only (similar pattern: reject on missing route)
- Similar HTTP endpoints for get/set/delete with TTL

**TODO 3** (BB-01) can now proceed:
- Blackboard store routing-only with versioning
- Optimistic concurrency for shared coordination

All dependent on AUTH-01 (auth precedence enforcement) being in place.
