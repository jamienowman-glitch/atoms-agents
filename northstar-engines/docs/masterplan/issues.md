# Northstar Masterplan: Issues & Gaps Log

**Status**: Active Central Log
**Purpose**: Central repository for all technical conflicts, terminology drift, and outstanding questions found during the Masterplan Reality Check.

---

## 🔴 Critical Naming Conflicts

### 1. The "Project" Overload
**Issue**: The term "Project" is used for two fundamentally different concepts, causing domain confusion.
**References**:
1.  **Infrastructure Project** ("Control Plane"):
    -   **File**: `northstar-engines/engines/identity/models.py` (Line 133)
    -   **Code**: `class ControlPlaneProject(BaseModel)`
    -   **Definition**: A registry record keyed by `(tenant_id, env, project_id)`.
2.  **User Work Project** ("Video Edit"):
    -   **File**: `northstar-engines/engines/muscle/video_timeline/models.py` (Line 20)
    -   **Code**: `class VideoProject(Timestamped)`
    -   **Context**: Represents a user's creative session/file.
**Recommendation**: Rename the user-facing container (e.g., `WorkProject`, `Session`) to disambiguate.

---

## 🟡 Code Deficits & Risks

### 2. Quotas are Mocked (Billing Risk)
**Issue**: Quota enforcement is hardcoded and not connected to real usage counters.
**References**:
-   **File**: `northstar-engines/engines/nexus/hardening/quotas.py`
-   **Code**: `QUOTA_LIMITS = {...}` and "Stub implementation" comment.
-   **Impact**: No real protection against abuse or overage beyond the manual Kill Switch.

### 3. Chat is In-Memory (Data Loss Risk)
**Issue**: The Chat/Realtime transport layer stores state in Python memory.
**References**:
-   **File**: `northstar-engines/engines/chat/service/transport_layer.py`
-   **Code**: `class InMemoryBus`
-   **Impact**: Restarting the service kills all active agent conversations and streams. Non-persistent.

### 4. Identity is "Soft" (Security Risk)
**Issue**: Authentication still accepts "Legacy" insecure patterns.
**References**:
-   **File**: `northstar-engines/engines/common/identity.py`
-   **Code**: Accepts `query_params` (lines 187-191) and body JSON (lines 241-260) if headers are missing.
-   **Impact**: Hard to audit or secure strictly until deprecated.

---

## 🟡 Terminology Drift

### 5. "Run" is Ghostly (Missing Object)
**Gap**: Vision requires "Run" to be a first-class object, but it exists only as a trace string. No `class Run` model exists.

### 6. "Agent" is Decentralized (Missing Entity)
**Gap**: Vision describes a central Agent Registry, but agents are defined distributedly via Routes and Kernels. Missing `AgentProfile` or `Manifest`.

### 7. Tuning & Feedback Gap (Missing Metrics)
**Gap**: Schema lacks `rating`, `correction`, or `feedback_text` fields. No `TuningEvent` defined.

### 8. Agent Consumption Visibility (Partial Log)
**Gap**: No "Read Receipt" or "Consumption" event standard.

### 9. Missing Feed Registry
**Issue**: While `connectors` exists, there is no central `feed_registry.json` defining valid feed types and their schemas.
**Context**: We have an `engine_registry.json` for atomic engines, but Feeds are implicitly defined by code in `engines/connectors`.

### 10. Missing Infrastructure Folder
**Issue**: User expects `engines/infrastructure`, but it does not exist on disk.
**Reality**: Infrastructure code seems scattered between `engines/ops` and `engines/config`.

### 11. Empty Agent Registry
**Issue**: `packages/agents` contains the correct schemas (`AtomicCards`, `NodeCard`) but the registry itself is functionally empty (only 2 examples).
**Context**: The "Agents" monorepo package is a skeletal framework. It requires populating with actual agent definitions to be useful.
