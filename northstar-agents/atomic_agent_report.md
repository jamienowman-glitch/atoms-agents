# Atomic Agent Report

## 1. Truth & Atomicity Analysis
**Truth Score: 92%**
The repository adheres strictly to the "Atomic" philosophy in its **Registry** layout. Every entity (Model, Provider, Persona, Task, Capability) is isolated in its own YAML "card".
- **Registry**: ✅ Highly Atomic. Excellent separation of concerns.
- **Runtime**: ⚠️ Emerging Monolith Risk. The `NodeExecutor` (`src/northstar/runtime/node_executor.py`) is beginning to centralize too much logic (resolution, retrieval, prompting, execution) for different node kinds.

## 2. Frameworks
We currently support **6 Frameworks**.
They are loaded via the **Registry System** using `FrameworkAdapterCard`s and are instanced as Nodes using `ModeCard`s.

| Framework | Status | Configuration Mode (Example) |
|-----------|--------|------------------------------|
| **ADK** | 🟢 Integrated | `adk-basic` |
| **AutoGen** | 🟢 Integrated | `autogen-group-chat` |
| **Bedrock** | 🟢 Integrated | `bedrock-agent` |
| **CrewAI** | 🟢 Integrated | `crewai-hierarchical` |
| **LangGraph**| 🟢 Integrated | `langgraph-conditional` |
| **Strands** | 🟢 Integrated | `strands-linear` |

### How Frameworks function as Nodes
1.  **Definition**: A `NodeCard` (Atomic Unit) is defined with `kind: framework_team`.
2.  **Linking**: The Node references a specific **Framework Mode** via the `framework_mode_ref` field (e.g., pointing to `autogen.group_chat`).
3.  **Loading**: The system loads the `FrameworkAdapter` to get the python import path, then initializes the specific `Mode` configuration.
4.  **Execution Gap**: Currently, `NodeExecutor` detects `kind="framework_team"` but strictly returns `SKIP (Not Implemented)`. **This is the primary functional block to making Frameworks live nodes.**

## 3. Model Providers & Capabilities
We support **3 Major Providers** with **20 Total Models**.

| Provider | Models Configured | Key Models |
|----------|-------------------|------------|
| **AWS Bedrock** | **11** | Nova (Lite/Pro/Micro), Claude 3/3.5/3.7, Opus |
| **GCP Vertex** | **8** | Gemini 2.5 (Flash/Pro), Veo 2.0, Imagen |
| **Azure OpenAI**| **1** | GPT-3.5 Turbo (Default) |

**Capabilities** are loaded atomcially:
- Defined in `registry/cards/capabilities` (10 Capabilities: Vision, TTS, Code Exec, etc.).
- Linked to Models via `CapabilityBindingCard`s.
- Toggled at runtime in the `Gateway` via `CapabilityToggleRequest`.

## 4. Agent Anatomy
Agents are "Molecules" constructed dynamically at runtime from Atomic Cards. They are **not** monolithic files.

**The Agent Molecule:**
- **Persona Card** (`registry/cards/personas`): Identity, Style, Principles.
- **Task Card** (`registry/cards/tasks`): Goa, Constraints, Acceptance Criteria.
- **Manifest Card** (`registry/cards/manifests`): (Likely infrastructure/resource links).
- **Node Card** (`registry/cards/nodes`): The structural unit that binds a Persona + Task + Model to the Graph.

**The Blackboard:**
- Confirmed as an **Edge-Only** shared state.
- Passed into `NodeExecutor.execute_node(..., blackboard)`.
- Nodes explicitly define `blackboard_reads` and `blackboard_writes` in their card, ensuring strictly defined data contracts between agents.

## 5. Identified Gaps & Fixes

### 🔴 Critical: Feature Gap
- **Framework Execution**: `NodeExecutor` line 77 explicitly skips `framework_team`.
    - *Fix*: Implement a `FrameworkRunner` strategy in `src/northstar/runtime/frameworks` and delegate execution from `NodeExecutor` instead of hard-blocking.

### 🟠 Warning: Atomicity Drift
- **NodeExecutor Monolith**: `src/northstar/runtime/node_executor.py` (224 lines) is manageable now but handles:
    1. Audit Logging
    2. Nexus Retrieval
    3. Gateway Resolution
    4. Prompt Composition (Hard import)
    5. Artifact Writing
    - *Fix*: Refactor `_fetch_nexus_context` and `_invoke_gateway` into a separate `RuntimeContextAssembler` or similar helper to keep the Executor focused purely on flow control.

### 🟢 Opportunity: Atomic Verification
- Ensure every `NodeCard` has a valid `framework_mode_ref` if it is a framework node. Add a validation step in `dag_validator.py`.
