# Atomic Task Plan: Agent RAG Assistant (The Missing Tool)

**Goal**: Construct a dedicated `atoms-muscle` service to give Agents easy RAG capabilities.
**Status**: `atoms-core/src/nexus` exists but is "Low Level" (Embedding Adapter, Vector Store).
**Gap**: Agents need a higher-level "Knowledge Muscle" to handle the `query -> embed -> search -> rank -> log` flow automatically.

## 1. The New Muscle: `atoms-muscle/src/knowledge/search_assistant`
Do not build this in `atoms-core` (generic logic). Build it in `atoms-muscle` (Agent capabilities).

### A. Capabilities
1.  **Search**: `query(q: str, tags: list[str]) -> list[Document]`
2.  **Multimodal**: `query_visual(image: bytes)` (Future)
3.  **Transparency**: **AUTOMATICALLY** emits Event V2 `nexus.search_hit`.

### B. Architecture (The Mesh Standard)
*   **Path**: `atoms-muscle/src/knowledge/search_assistant/`
*   **Components**:
    1.  `service.py`: Pure Python class `SearchAssistant`.
        *   Imports: `from atoms_core.src.nexus.service import NexusService`
        *   Imports: `from atoms_core.src.event_spine.service import get_event_spine`
    2.  `mcp.py`: FastMCP wrapper.
        *   **No Stubs**: Must call `service.search()` and return clean JSON.
    3.  `SKILL.md`: Defines the capability for Agents.

## 2. Atomic Tasks
- [ ] Create `atoms-muscle/src/knowledge/search_assistant/service.py`.
- [ ] Create `atoms-muscle/src/knowledge/search_assistant/mcp.py` (Must be complete).
- [ ] Create `atoms-muscle/src/knowledge/search_assistant/SKILL.md`.
- [ ] **Hard Requirement**: Inject `nexus.search_hit` logging in `service.py`.
- [ ] **Hard Requirement**: Inject `nexus.cluster.formed` logging in `service.py`.
- [ ] Run `python3 atoms-muscle/scripts/normalize_mcp.py`.
- [ ] Run `python3 atoms-muscle/scripts/sync_muscles.py`.

## 3. Why This Helps Agents?
*   Agents don't need to know how to embed text.
*   Agents don't need to remember to log events (for Haze).
*   Agents just call `search_assistant.query("what is the pricing policy?")`.
