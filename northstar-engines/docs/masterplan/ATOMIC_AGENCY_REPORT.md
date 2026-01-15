# Atomic Agency: Verification Report

**Status**: Verified ✅
**Scope**: Persona, Task, Node (Manifest), Capability, Model, Provider.

---

## 1. The Core Question
**"Is it set to be atomic? Can we mix and match elements individually?"**

**Answer: YES.**
The architecture is strictly **Reference-Based**, not nested. The "Agent" (Node) is just a wiring diagram that points to independent definitions.

## 2. Evidence of Separation

### A. The Manifest (NodeCard)
The `NodeCard` (`src/northstar/registry/schemas/nodes.py`) does **not** contain the persona or task. It contains **pointers**:

```python
@dataclass
class NodeCard:
    node_id: str
    persona_ref: Optional[str] = None  # <--- Pointer to Persona
    task_ref: Optional[str] = None     # <--- Pointer to Task
    model_ref: Optional[str] = None    # <--- Pointer to Model
    provider_ref: Optional[str] = None # <--- Pointer to Provider
    capability_ids: List[str] = ...    # <--- List of Pointers to Skills
```

**Impact**: You can change `persona_ref` from `"brand_writer_v1"` to `"technical_writer_v1"` without touching the Task, Model, or Skills.

### B. Runtime Resolution (Mix & Match)
The `NodeExecutor` (`src/northstar/runtime/node_executor.py`) proves that these are loaded individually at runtime:

```python
# Lines 86-87
persona = self.registry.personas.get(node.persona_ref)
task = self.registry.tasks.get(node.task_ref)
```

**Feature: Overrides**
The executor explicitly supports overriding the Model/Provider at runtime, ignoring what's in the manifest:
```python
# Lines 92-93
provider_id = provider_override or node.provider_ref
model_id = model_override or node.model_ref
```
This means you can take a "GPT-4 Agent" and run it on "Claude 3" just by passing an argument, without rewriting the agent code.

### C. Capabilities (Skills)
Skills are bound dynamically. The manifest lists `capability_ids` (e.g., `["vision", "code_exec"]`).
The Execution Engine retrieves the *implementation* of those skills (`CapabilityBinding`) based on the *current* Provider/Model.
-   If you switch to Gemini, the "Vision" skill automatically resolves to the Gemini implementation.
-   If you switch to GPT-4, it resolves to the OpenAI implementation.
-   **The Agent Definition remains unchanged.**

## 3. Conclusion
The system deals in **Atoms**, not Monoliths.
-   **Persona** is a standalone file.
-   **Task** is a standalone file.
-   **Agent** is a wiring file (Manifest).
-   **Model** is a runtime switch.

You have full mix-and-match capability.
