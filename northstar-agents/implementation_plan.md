# Implementation Plan - Registry Refactor (GraphLens)

# Goal
Refactor the Registry to support the "GraphLens" architecture. This involves moving from a "Typed Node" (Inheritance) model to a "Neutral Node" (Composition) model, where Lenses (Context, View, Safety) are layered onto the graph.

## User Review Required
> [!IMPORTANT]
> **Breaking Change**: The existing `NodeCard` will be effectively deprecated. While we won't delete it immediately (Quarantine), new flows should use `NeutralNodeCard` + Components.
> **Terminology**: "Tools" are being replaced/clarified as "Connectors" (SaaS) or "Capabilities" (Native).

## Proposed Changes

### Registry Schemas

#### [NEW] [neutral.py](file:///Users/jaynowman/dev/northstar-agents/src/northstar/registry/schemas/neutral.py)
- `NeutralNodeCard`: Defines a structural node with `id`, `position`, and `components: List[ComponentRef]`.
- `ComponentRef`: Typed reference to an Agent, Framework, or Connector.

#### [NEW] [lenses.py](file:///Users/jaynowman/dev/northstar-agents/src/northstar/registry/schemas/lenses.py)
- `ContextLayerCard`: Defines deep context (style, brand, data links).
- `TokenMapCard`: Defines variable/token visibility scopes.
- `SafetyProfileCard`: Defines safety tiers.
- `LogPolicyCard`: Defines audit logging rules.
- `InteractionStateCard`: Defines chat modes (Recap, Debate, etc.).

#### [NEW] [graph.py](file:///Users/jaynowman/dev/northstar-agents/src/northstar/registry/schemas/graph.py)
- `GraphDefinitionCard`: The "Flow Pack" container that bundles Nodes + Edges + Lens Layers.

#### [MODIFY] [loader.py](file:///Users/jaynowman/dev/northstar-agents/src/northstar/registry/loader.py)
- Update `RegistryLoader` to parse `neutral_node`, `lens_context`, `lens_token_map`, `graph_def` YAML types.

#### [MODIFY] [nodes.py](file:///Users/jaynowman/dev/northstar-agents/src/northstar/registry/schemas/nodes.py)
- Add deprecation warning to `NodeCard` docstring.

## Verification Plan

### Automated Tests
1.  **Create Test Data**:
    - `tests/test_data/graph_lens_demo.yaml`: A sample flow pack containing 1 neutral node, 1 context layer, and 1 token map.
2.  **New Unit Test**:
    - `tests/registry/test_neutral_graph.py`:
        - Load the test data using `RegistryLoader`.
        - Verify `NeutralNodeCard` has correct ID and component refs.
        - Verify `ContextLayerCard` loaded correctly.
        - Verify `GraphDefinitionCard` correctly references the node and lenses.
3.  **Command**:
    ```bash
    pytest tests/registry/test_neutral_graph.py
    ```

### Manual Verification
- None required for this phase (Pure Schema Refactor).
