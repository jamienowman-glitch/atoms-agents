# Northstar Execution Masterplan: The Blueprint Era

**Status**: Forward Planning
**Strategy**: "Build Blueprints to Create Reality"
**Base**: `agentflow` (Multi21) as the definition engine.

---

## 🏗️ Phase 1: The Blueprint Factory (Multi21)
We move from "Inspecting Code" to "Defining Blueprints". We use Multi21 to define the schema for everything else.

### 1.1 UI Atom Blueprints
**Goal**: A library of agnostic UI components.
*   **Task**: Extract hardcoded components from `ui` and `Multi21`.
*   **Action**: Create `AtomBlueprint` for generic sliders, toolpills, and inspectors.
*   **Output**: `atoms_factory/blueprints/ui/{atom_id}.yaml`.

### 1.2 Muscle Blueprints
**Goal**: Defining the "Heavy Lifting" operations abstractly.
*   **Task**: Map `engines/muscle` capabilities to Blueprints.
*   **Action**: Create Blueprints for `VideoRender`, `AudioMix`, `CADBoolean`.
*   **Output**: `atoms_factory/blueprints/muscle/{muscle_id}.yaml`.

### 1.3 Connector Blueprints
**Goal**: Standardized external integrations.
*   **Task**: Formalize the 79 connectors in `engines/connectors` into generic definitions.
*   **Action**: Define `ConnectorBlueprint` (Auth, Scopes, Rate Limits).
*   **Output**: `atoms_factory/blueprints/connectors/{connector_id}.yaml`.

### 1.4 Feed Blueprints
**Goal**: Defining Realtime Streams.
*   **Task**: Create the missing `feed_registry.json`.
*   **Action**: Define `FeedBlueprint` (Schema, Frequency, Source).
*   **Output**: `atoms_factory/blueprints/feeds/{feed_id}.yaml`.

---

## 🧶 Phase 2: The Glue (Tokens & Graph)

### 2.1 The Token Registry
**Goal**: Ensuring everything speaks the same language.
*   **Action**: Map UI Atoms (Sliders) to Muscle Inputs (Volume) via **Tokens**.
*   **Task**: Populate `northstar-engines/engines/tokens` with canonical definitions.

### 2.2 The Graph Blueprint
**Goal**: How Agents + Muscle + UI connect.
*   **Action**: Update `NodeCard` to support "Team Roles" (filling the noted gap).
*   **Task**: Create `GraphBlueprint` that defines a reusable "Flow Pattern" (e.g., "The Creative Studio Flow").

---

## 🚀 Phase 3: The Super Canvas
**Goal**: One Canvas to rule them all.
*   **Currently**: Validated "Piggyback" realtime structure.
*   **Future**:
    *   Switch to a dedicated **Editor** interface (not just Chat).
    *   Map Editor Tools to specific **Tool Spaces** (defined in Multi21).
    *   Ensure each Tool Space loads the correct **Muscle** and **UI Atoms**.

## 📝 Immediate Action Items
1.  **Patch the Gap**: Add `team_roles` to `NodeCard` schema.
2.  **Refactor Routing**: Implement Surface-scoped infrastructure (`ROUTING_SURFACE_REFACTOR_PLAN.md`).
3.  **Start the Factory**: Begin generating Blueprints in `atoms_factory`.
