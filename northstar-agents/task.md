# GraphLens Architecture Refactor

- [x] Phase 1: Planning & Schema Definition <!-- id: 0 -->
    - [x] Gap Analysis & Vision Alignment (`graphlens_gap_analysis.md`) <!-- id: 1 -->
    - [x] Create Implementation Plan for Registry Refactor (`implementation_plan.md`) <!-- id: 2 -->
    - [x] Define `NeutralNodeCard` schema <!-- id: 3 -->
    - [x] Define Lens Schemas (`ContextLayerCard`, `TokenMapCard`, `LogPolicyCard`) <!-- id: 4 -->

- [x] Phase 2: Registry Schema Refactor <!-- id: 5 -->
    - [x] Quarantine old `NodeCard` definition <!-- id: 6 -->
    - [x] Implement `src/northstar/registry/schemas/graph.py` (New Graph/Node definitions) <!-- id: 7 -->
    - [x] Implement `src/northstar/registry/schemas/lenses.py` (New Lens definitions) <!-- id: 8 -->
    - [x] Update `RegistryLoader` to support new card types <!-- id: 9 -->

- [x] Phase 3: Runtime Evolution <!-- id: 10 -->
    - [x] Refactor `NodeExecutor` to support "Component Mounting" <!-- id: 11 -->
    - [x] Implement Lens Application Logic (Middleware pattern for Lenses) <!-- id: 12 -->
    - [x] Verify execution of a simple "Atomic Flow" with Lenses <!-- id: 13 -->

- [ ] Phase 4: Integration <!-- id: 14 -->
    - [ ] Build `cli_export.json` generator for Wireframe Builder <!-- id: 15 -->
    - [ ] Verify "Flow Pack" JSON export format <!-- id: 16 -->
