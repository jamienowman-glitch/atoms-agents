# Atomic Task Plan: Nexus RAG Transparency (via ATOM-CORE Event V2)

**Goal**: Implement the "Data Topography" logger using the **OFFICIAL** `atoms-core` Event V2 Spine. This supersedes previous instructions to use `northstar-engines`.

## 1. The Method: atoms-core Event V2
**Library**: `atoms_core.src.event_spine.service.EventSpineService`

### A. The "Heat" Event (Frequency)
*   **Topic/Event**: `nexus.atom.search_hit` (or equivalent valid schema)
*   **Payload**:
    *   `search_id`: UUID
    *   `query_text`: String (Redacted)
    *   `score`: Float
    *   `rank`: Integer

### B. The "Cluster" Event (Co-occurrence)
*   **Topic/Event**: `nexus.cluster.formed`
*   **Payload**:
    *   `search_id`: UUID
    *   `atom_ids`: List[UUID]

## 2. The Implementation (Python)
Update `northstar-engines/engines/nexus/index/service.py`.

*   **Import**: `from atoms_core.src.event_spine.service import get_event_spine`
*   **Hook**: Inside `search()`.
*   **Logic**:
    1.  `spine = get_event_spine()`
    2.  `spine.emit(event_type="nexus.search_hit", payload={...})`

## 3. The Aggregation (For Haze)
The Haze "Muscle" will query the `atoms-core` Event Store (likely backed by Supabase/Postgres) to build the heatmap.

## 4. Atomic Tasks
- [ ] Inject `atoms-core` Event Spine into Nexus.
- [ ] Verify events flow to the correct new tables.
