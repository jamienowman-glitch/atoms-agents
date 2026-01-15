# Routing Registry Refactor: Surface Scoping

**Status**: Planning
**Goal**: Enable infrastructure configuration "per tenant AND per surface".

## Problem
Current `get_route` signature: `(resource_kind, tenant_id, env, project_id)`
Missing: `surface_id`.
Result: You cannot configure a different database for "Canvas" vs "Chat" within the same tenant.

## Proposed Changes

### 1. Update Protocol (`engines/routing/registry.py`)
Modify `RoutingRegistry.get_route` and `delete_route`:
```python
def get_route(
    self, 
    resource_kind: str, 
    tenant_id: str, 
    env: str, 
    project_id: Optional[str] = None,
    surface_id: Optional[str] = None  # <--- NEW
) -> Optional[ResourceRoute]: ...
```

### 2. Update Implementations
#### A. InMemory
Update `_key` tuple to include `surface_id`.

#### B. Firestore
Update `get_route` query to filter by `surface_id` if provided (or `None`).

#### C. Filesystem (The Tricky Part)
Current Path: `var/routing/{kind}/{tenant}/{env}/{project}.json`
New Path: `var/routing/{kind}/{tenant}/{env}/{surface}/{project}.json`
-   If `surface_id` is None, use `_` (underscore) directory.

### 3. Update Manager (`engines/routing/manager.py`)
Update `get_route_config` and `get_backend_type` to accept `surface_id` and pass it to registry.

### 4. Update Consumers (`engines/realtime/timeline.py` etc.)
Update `_default_timeline_store` to try resolving with `surface_id` from context.

## Verification
1.  Create two routes:
    -   `event_stream` for `surface="chat"` -> `firestore`
    -   `event_stream` for `surface="canvas"` -> `dynamodb`
2.  Call `get_backend_type` with different surfaces.
3.  Verify correct backend is returned.
