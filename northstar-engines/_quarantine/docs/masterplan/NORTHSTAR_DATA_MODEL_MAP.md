# Northstar Data Models: The Agents Reality

**Status**: Verified
**Repo**: `packages/agents` (src/northstar)

---

## 1. The Schema (The "Cards")
The data model is aligned with the vision of "Atomic primitives".
Located in `src/northstar/registry/schemas/`:

| Concept | Class Name | File | Description |
| :--- | :--- | :--- | :--- |
| **Agent / Persona** | `PersonaCard` | `atomic_cards.py` | Identity, style, principles. |
| **Task** | `TaskCard` | `atomic_cards.py` | Goal, constraints, acceptance criteria. |
| **Skill / Capability** | `CapabilityCard` | `capabilities.py` | Abstract skill (e.g. "Vision"). |
| **Binding** | `CapabilityBindingCard` | `capabilities.py` | Provider implementations (e.g. "GPT-4o"). |
| **Blueprint / Node** | `NodeCard` | `nodes.py` | The composition unit: `Persona` + `Task` + `Skills`. |

## 2. The Registry (The Population)
The registry is **functionally empty** (skeletal examples only).
Located in `src/northstar/registry/cards/`:

| Directory | Count | Examples |
| :--- | :--- | :--- |
| `capabilities/` | 10 | `vision.yaml`, `code_exec.yaml`, `tool_use.yaml` |
| `personas/` | 2 | `brand_writer_v1.yaml`, `system_designer_v1.yaml` |
| `tasks/` | 2 | `write_landing_page_v1.yaml`, `audit_flow_graph_v1.yaml` |
| `nodes/` | 2 | `example_brand_landing_page_writer.yaml`, `example_flow_auditor.yaml` |

## 3. The Gap
**We have the "Box", but it is empty.**
-   We need to populate `personas`, `tasks`, and `nodes` with the actual library of Northstar Agents.
-   The execution engine (`node_executor.py`) is ready to run `NodeCard`s.

## 4. Recommendation
The next major work stream should be **Populating the Registry**.
We do not need to refactor the data model; it is solid.
