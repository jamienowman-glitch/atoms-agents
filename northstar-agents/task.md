- [ ] Phase 6: Memory Isolation Protocols <!-- id: 28 -->
    - [ ] Graph Schema and Parsing <!-- id: 29 -->
        - [ ] Extend Flow edge schema in `flows.py` <!-- id: 30 -->
        - [ ] Update `parsers.py` to require edge_id <!-- id: 31 -->
        - [ ] Add deterministic edge_id helper <!-- id: 32 -->
        - [ ] Update example flow YAML <!-- id: 33 -->
    - [ ] Memory Gateway <!-- id: 34 -->
        - [ ] Add MemoryGateway protocol and MemoryRecord types <!-- id: 35 -->
        - [ ] Implement HttpMemoryGateway <!-- id: 36 -->
        - [ ] Add get_inbound_blackboards <!-- id: 37 -->
    - [ ] Runtime Wiring <!-- id: 38 -->
        - [ ] Extend `context.py` to include memory gateway <!-- id: 39 -->
        - [ ] Update `profiles.py` to honor infra blackboard <!-- id: 40 -->
        - [ ] Update `executor.py` to compute inbound/outbound edges <!-- id: 41 -->
        - [ ] Update `node_executor.py` to accept inbound blackboards <!-- id: 42 -->
        - [ ] Update `composer.py` to accept namespaced inputs <!-- id: 43 -->
        - [ ] Remove global blackboard dict usage <!-- id: 44 -->
    - [ ] Entry Points and Tests <!-- id: 45 -->
        - [ ] Ensure server API uses a single run_id <!-- id: 46 -->
        - [ ] Update CLI runner <!-- id: 47 -->
        - [ ] Add tests for edge_id validation <!-- id: 48 -->
        - [ ] Update `Agent.md` and `Skill.md` <!-- id: 49 -->

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

- [x] Phase 5: Spine-Sync (Pending Protocol Definition) <!-- id: 17 -->
    - [x] Adopt `AGENT.MD` Architectural Manifest <!-- id: 18 -->
    - [x] Implement `SpinePayload` listener in Agents (NodeExecutor/Mirror logic) <!-- id: 19 -->
    - [x] Align `AuditEvent` with Engines Envelope <!-- id: 20 -->
    - [x] Implement `src/northstar/registry/schemas/lenses.py` (New Lens definitions) <!-- id: 8 -->
    - [x] Update `RegistryLoader` to support new card types <!-- id: 9 -->

- [x] Phase 3: Runtime Evolution <!-- id: 10 -->
    - [x] Refactor `NodeExecutor` to support "Component Mounting" <!-- id: 11 -->
    - [x] Implement Lens Application Logic (Middleware pattern for Lenses) <!-- id: 12 -->
    - [x] Verify execution of a simple "Atomic Flow" with Lenses <!-- id: 13 -->

- [ ] Phase 4: Integration <!-- id: 14 -->
    - [ ] Build `cli_export.json` generator for Wireframe Builder <!-- id: 15 -->
- [ ] Phase 20: Model Router & Provider Expansion <!-- id: 21 -->
    - [x] Implement DeepSeek Provider (`deepseek.py`) <!-- id: 22 -->
    - [x] Implement Gemini 3 Provider (`gemini.py`) <!-- id: 23 -->
    - [x] Implement Molmo 2 Provider (`molmo.py`) <!-- id: 24 -->
    - [x] Implement Nvidia Alpamayo Provider (`nvidia.py`) <!-- id: 25 -->
    - [x] Implement Mistral Provider (`mistral.py`) <!-- id: 26 -->
    - [x] Implement ElevenLabs Scribe Provider (`elevenlabs.py`) <!-- id: 27 -->
