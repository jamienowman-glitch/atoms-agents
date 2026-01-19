# GraphLens & Neutral Node: Architectural Gap Analysis (Revised)

## 1. The Core Conflict: Typed vs. Neutral Nodes
**Current Reality**: The software currently treats Nodes as **Typed Containers** (Inheritance model).
- `NodeCard` has a hard `kind` field (`agent` | `framework_team`).
- Execution logic is hard-coded to these kinds.
- **Problem**: You cannot "pile" functions onto a node dynamically.

**The Vision (Neutral Node)**:
- A Node is a **Neutral Parking Spot** (a structural anchor in the graph).
- **Agents**, **Frameworks**, and **Connectors** are components *mounted* to this node.
- **Lenses** are *Layers* piled on top to project behavior (Safety, View, Data).

## 2. Lens Capability Analysis & Definitions
We have re-mapped the Lenses based on the "Piles of Graphs" architectural vision.

| Lens Type | Definition (Revised) | Current Status | Gap / Fix |
|-----------|----------------------|----------------|-----------|
| **ContextLens** | **Deep Context Enabler**. Maps Style, Brand Guidelines, specialized "Manifests" (e.g. Pirate, Gangster), and Data/KPIs to a node. Removes the need for human repetition. | ⚠️ **Incorrectly Mapped**. Currently confused with `Task`. | Create `ContextLayerCard`. Decouple "Goal" (Task) from "Context" (Environment). Allow "Context" to be injected into the prompt system independently of the Task. |
| **CanvasLens** | **Collaborative Surface Map**. Targets specialized agents to specific UI tokens (e.g., CTA Agent -> CTA Button). Not just "screens". | ⚠️ **Primitive**. `LensOverlay` is too simple. | Support **Token Targeting**. Create a registry of "Canvas Tokens" (e.g. `shopify.builder.cta_text`) and allow Agents to subscribe/write to them specifically. |
| **SafetyLens** | **Atomic Safety Allocation**. Safety tiers allocated per node/framework. | ❌ **Missing**. | Introduce `SafetyProfileCard` that can be overlaid on a Neutral Node or a whole Graph. |
| **LogLens** | **Configurable Recorder**. Dictates *what* gets recorded and where (e.g., Enterprise Audit vs. Debug). | ⚠️ **Implicit**. Logging exists but is not dynamically configurable per-graph. | Create `LogPolicyCard` to filter/route events at the Node level. |
| **ChatModeLens** | **Interaction State**. Defines the "Mode" of the chat (e.g., State of Union, Debate, Research). | ❌ **Missing**. | Create `InteractionStateCard` to switch agent personas/styles dynamically based on the conversation phase. |
| **TokenLens** | **Data Scope**. Maps which specific "Shared State Tokens" an agent can see/edit (e.g., Color Specialist only sees color hex codes). | ❌ **Missing**. | Implement **State Scoping** in the Blackboard mechanism. Allow Nodes to declare strict `token_allowlist`. |

## 3. The "Atomicity Drift"
**Drift is Critical**.
- We are building "Molecules" (Agents) but treating them like "Monoliths" in the Registry.
- A `NodeCard` currently hard-links a `Persona`, `Task`, and `Model`.
- **Correction**: These should be loose associations. A Node should *reference* a Persona, a Context, and a Capability set, which are combined at runtime.

## 4. The "Base Agent Flow" Roadmap
To enable the "Wireframe Builder" to construct these graphs:

1.  **Refactor Node Schema**:
    - Change `NodeCard` to be a lightweight container.
    - Move `persona`, `task`, `model` into a `ComponentMount` or similar structure.

2.  **Expose Registry to Wireframe**:
    - The Wireframe Builder needs to know "What Models are available?" "What Tools (Connectors) exist?".
    - **Action**: Ensure `Atomic Agent Report` data is exposed via an API/JSON spec that the Frontend can consume to populate dropdowns.

3.  **Define the "Flow Pack" (JSON)**:
    - You mentioned selling "Flow Packs".
    - We need a `GraphDefinition` schema that bundles:
        - The Graph Topology (Nodes + Edges).
        - The Lens Layers (Context, Safety, Canvas mappings).
        - **NOT** the raw assets (which are referenced by ID), but the *configuration* of them.

## 5. Next Steps
1.  **Safety First**: Quarantine the current `NodeCard` definition.
2.  **Schema Design**: Draft the new `NeutralNode`, `ContextLayer`, and `TokenMap` schemas.
3.  **Registry Export**: Build a script to export the "Real World Lists" (Models, Providers) for the Wireframe Builder to consume.
