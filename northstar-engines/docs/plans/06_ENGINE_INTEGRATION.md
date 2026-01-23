# Plan 06: Engine Integration (The Plug-In)

**Phase**: 5 - The Console Circle
**Target**: `northstar-engines` (Integration)
**Status**: DRAFT

## 1. Executive Summary
We have rediscovered the existing machinery in `northstar-engines`.
Instead of rebuilding Tenancy and Routing in `agents`, we will "Plug In" to the existing OS.
**Key Finding**: `engines` and `agents` are loosely coupled. `engines` reads `agents` YAML files directly from disk, avoiding a circular dependency.

## 2. The Engine Map
| Concept | Engine Module | File Path |
| :--- | :--- | :--- |
| **Tenancy & Identity** | `engines.identity` | `engines/identity/models.py` |
| **Surface/App** | `engines.identity` | `engines/identity/models.py` (`Surface`, `App`) |
| **Routing (Credit Hunter)** | `engines.routing` | `engines/routing/provider_router.py` |
| **Events/Timeline** | `engines.realtime` | `engines/realtime/filesystem_timeline.py` |

## 3. The Plug-In Strategy

### 3.1 The "Top End" Bootstrap (`agentflow` -> `engines`)
The Frontend (`agentflow`) needs to know "Who am I?" and "What Console is this?".
We will use the existing `engines.identity` module.

**Endpoint**: `GET /api/v1/bootstrap` (hosted by `engines`)
**Flow**:
1.  **Auth**: Middleware (Cloudflare) passes `user_id`.
2.  **Identity Engine**: `engines.identity.service.get_user_context(user_id)`.
    - Returns `User`, `Tenant`, `TenantMembership`.
3.  **Surface Logic**: `engines.identity` (or new `engines.console`) determines the active `Surface` (Console) based on the URL or User preference.
4.  **Response**:
    ```json
    {
      "user": { "id": "u1", "email": "..." },
      "tenant": { "id": "t1", "name": "Nike" },
      "console": { "id": "agnx_marketing", "theme": "dark" }
    }
    ```

### 3.2 The Execution Loop (`engines` -> `agents`)
The Engine controls *routing* and *cost*. The Agent controls *reasoning*.

**Flow**:
1.  **Request**: User sends prompt to `engines` (`POST /api/v1/chat`).
2.  **Router**: `engines.routing.ProviderRouter` loads `routing/dev_free_tier_hunter.yaml` (from `agents` repo).
3.  **Decision**: Router selects "OpenRouter / DeepSeek R1".
4.  **Handoff**: Engine calls Agent Runner (via subprocess or direct Python import if `agents` is installed as a lib in the container).
    - *Correction*: Since `engines` reads YAMLs directly, we should keep them decoupled. Engine can `POST` to a local `agents` service or import `northstar.runtime` if the container merges them.
    - **Strategy**: **Unified Container**. `northstar-engines` will add `northstar-agents` to its `PYTHONPATH`.

## 4. Execution Plan

### 4.1 Task 1: Expose the Bootstrap Endpoint
**Objective**: Create the session starter.
- **Action**: Add `routes_bootstrap.py` to `engines/identity`.
- **Logic**: Use `identity.models.Surface` to return the UI config.

### 4.2 Task 2: Connect the Router
**Objective**: Enable "Credit Hunter" routing for Agent calls.
- **Action**: Update `engines/routing/provider_router.py` to support the new Atomic Schema from Phase 4 (`family_id`, etc.).
- **Action**: Ensure `ProviderRouter` can find the `northstar-agents` directory via an ENV var (`NORTHSTAR_AGENTS_PATH`).

### 4.3 Task 3: The Unified Runner
**Objective**: Allow Engines to import Agents runtime.
- **Action**: Verify `PYTHONPATH` includes `northstar-agents/src`.
- **Action**: Create `engines/agents_boundary/runner.py` to wrap `northstar.runtime.NodeExecutor`.

## 5. Success Criteria
- [ ] `GET /api/v1/bootstrap` returns a valid User/Tenant/Console payload.
- [ ] `ProviderRouter` correctly parses the new Atomic Registry cards.
- [ ] Engine can trigger an Agent execution using a specific Route.
