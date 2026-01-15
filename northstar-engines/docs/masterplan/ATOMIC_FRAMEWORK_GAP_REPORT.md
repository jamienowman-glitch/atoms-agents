# Atomic Frameworks: Verification & Gap Report

**Status**: Verified with Gap ⚠️
**Scope**: Frameworks, Modes, Nested Agents, Roles.

---

## 1. The Core Question
**"Can we load a framework, nest agents, and appoint roles to each agent per framework?"**

**Answer: PARTIALLY.**

### ✅ What Works (Atomic Loading)
1.  **Frameworks are Atomic**: You can swap `framework_mode_ref` on a Node (e.g., switch from `autogen-basic` to `crewai-hierarchical`) without changing the agents inside.
2.  **Nesting Works**: A Framework Node points to a `subflow_ref` (a Flow Card) which contains the list of Nested Agents ("Atoms").
3.  **Modes Work**: `ModeCard` defines the behavior (e.g., "Hierarchical" vs "Sequential").

### ❌ The Gap (Role Assignment)
You asked: *"Are you able to then appoint roles... to each agent nested?"*
**Currently: NO.**

I inspected `src/northstar/registry/schemas/nodes.py`.
The `NodeCard` has `subflow_ref` (pointing to children), but **it lacks a mechanism to assign roles to those children.**

**The Problem**:
-   You have a Flow with `[AgentA, AgentB]`.
-   You have a Framework Node using `crewai-hierarchical` (which requires a "Manager").
-   **Missing**: A field to say "AgentA is the Manager".

## 2. The Missing Link (Schema Update Required)
To support your Atomic Framework vision, we must add a `team_composition` field to the `NodeCard`.

**Proposed Schema**:
```python
@dataclass
class NodeCard:
    # ... existing fields ...
    kind: str = "framework_team"
    framework_mode_ref: str = "crewai-hierarchical"
    subflow_ref: str = "marketing_team_flow"
    
    # NEW FIELD REQUIRED
    team_roles: Dict[str, str] = field(default_factory=dict)
    # Example: { "agent_a_id": "manager", "agent_b_id": "worker" }
```

## 3. Recommendation
We verify that the logic is *intended* to be atomic, but the **runtime schema** needs this specific patch to enable the "Role Appointment" feature you described.
We should add `team_roles` to `NodeCard` immediately.
