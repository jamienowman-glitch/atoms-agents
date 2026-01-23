# AGENTS.md — Northstar Agents

## Scope & Authority
- This is the local law for `/Users/jaynowman/dev/northstar-agents`.
- It extends the monorepo `AGENTS.md` with repo-specific guidance.

## Mission
- Maintain the agent framework, registry cards, and runtime configuration for the agent layer.

## Plans Location
- The canonical location for plans in this repo is `/Users/jaynowman/dev/northstar-agents/docs/plans/`.
- Do not relocate existing plans unless explicitly instructed.

## Reference Sources
- `/Users/jaynowman/dev/northstar-agents/src/northstar/registry/cards/README.md`
- **Skill Authoring:** `/Users/jaynowman/dev/docs/skills/skill-authoring/SKILL.md`

# 🛑 PROTOCOL: COMMERCE & VERIFICATION

- **NO GHOSTS:** Do not hardcode Model IDs. Use `list_models()` to fetch reality.
- **THE TRUTH LOOP:** Verification is only valid if confirmed via the SSE Stream. Local logs are not proof.

# 🛑 PROTOCOL: REGISTRY ATOMICITY

- **THE SPLIT LAW:** Never use monolithic model IDs. All models must declare family, version, and reasoning_effort.
- **FRAMEWORK HIERARCHY:** Frameworks are parents; Modes are children. Do not flatten them.

# ARCHITECTURAL MANIFEST (Merged from Agent.md)

## 🛑 TRANSPORT & INTEGRITY PROTOCOLS
- **VISIBILITY:** All Chain-of-Thought must be tagged visibility='internal'.
- **SIDECAR RULE:** Never emit raw images to Chat. Upload to ArtifactStore, then emit URI.
- **MEMORY ISOLATION:** Respect run_global (Whiteboard) vs edge_scoped (Blackboard).

## 1. THE CORE PHILOSOPHY
**We do not build for specific flows. We build Capabilities.**

*   **Infrastructure is Agnostic**: The Spine (Engines) and the Surface (AgentFlow) do not know what "Lead the Dance" or "Multi-21" are. They only know Nodes, Atoms, and Events.
*   **Context is Selective**: Information (Spatial, Content, Multimodal) is strictly "Need to Know." The GraphLens determines which agent gets which token.

## 2. REPO RESPONSIBILITIES

### REPO: ENGINES (THE SPINE)
*   **The Authority**: `contracts.py` defines the `StreamEvent`. All data must fit this envelope.
*   **Isolation**: All real-time streams (WS/SSE) MUST require `project_id`. No project, no pipe.
*   **The Mirror**: Engines provide a snapshot + delta stream to allow Agents to maintain a "mental mirror" of the UI state.

### REPO: AGENTS (THE BRAINS)
*   **The Mirror**: Every agent runtime has a `canvas_mirror.py` capability. It buffers UI state but only exposes it to the agent's context if the GraphLens attaches that specific `Token`.
*   **Capability over Model**: Skills like `VisionCapable` or `SpatialAware` are modular toggles. They are not hardcoded to specific personas.

### REPO: AGENTFLOW (THE SURFACE)
*   **The Sensors**: Atoms are sensors. They report spatial moves (`SPATIAL_UPDATE`) and content changes (`ATOM_UPDATE`) only when the broadcast prop is active.
*   **Handshake**: On mount, every canvas emits a `CANVAS_READY` event containing its Tool Manifest. This tells the Agent what "buttons" it can press.

## 3. DATA FLOW PROTOCOL
### MEMORY LAWS (NON-NEGOTIABLE)
1. **No Global State**: Agents must NEVER rely on a global `run_context` dictionary for task data.
2. **Deterministic Edges**: All data flows across `edge_id`s. An agent reads from Inbound Blackboards and writes to Outbound Blackboards using the `MemoryGateway`.
3. **Traceability**: Every memory write is stamped with a `run_id` and `user_id`.

*   **Transport**: WebSocket is the primary bi-directional rail. SSE is the secondary broadcast rail.
*   **Multimodal**: Media (Screenshots/Audio) is handled via Sidecars. The Event Envelope carries a reference/URL; the model fetches the blob separately.

# 🛑 ATOMS FAM: NON-NEGOTIABLE PRESERVATION PROTOCOLS

> **CRITICAL INSTRUCTION:** You are working inside a high-precision **Orchestration Factory**, not a simple App. The following architectural pillars are **INVIOLATE**. You must NEVER collapse, summarize, or hardcode over these structures.

### 1. THE ATOMIC INTELLIGENCE LAW
We do not "build agents" in code. We assemble them from Atomic Cards.
* **NEVER** hardcode an Agent's definition into a Python/TS file.
* **NEVER** collapse the hierarchy. You must distinctively respect:
    1.  **Manifest** (The Speciality/Role)
    2.  **Persona** (The Voice/Style)
    3.  **Framework** (e.g., AutoGen, CrewAI, LangGraph) - *Loaded Separately*
    4.  **Framework Mode** (The specific configuration of that framework) - *Loaded Separately*
    5.  **Model Provider** (e.g., OpenRouter, Bedrock) - *Loaded Separately*
    6.  **Model** (e.g., Gemini 1.5, Claude 3.5) - *Loaded Separately*
    7.  **Capabilities** (The "Firearms" like Code Exec, Vision) - *Loaded Separately*
* **Violating this atomicity is a critical failure.**

### 2. THE UI & TOOL MAPPING SANCTITY (AgentFlow)
* **Preserve the Canvas:** The `AgentFlow` 'Multi21' 'Stigma' and any other collaborative canvas, its `ToolMap`, and `UI Tools` are carefully calibrated surface elements.
* **Do Not Refactor UI Logic** unless explicitly tasked.
* **Do Not "Simplify"** the `CanvasLens` or `TokenLens` architectures. These are complex by design to handle multi-surface rendering.
* **Do Not "Simplify"** or change the look of or create a pop-up card version of toolpop it's contained magnifiers. the sliders.

### 3. THE REGISTRY IS SACRED (Northstar-Agents)
* The `src/northstar/registry` is the Source of Truth.
* **NEVER** delete existing YAML cards without explicit instruction.
* **NEVER** merge distinct cards into a single file to "save space."
* **NEVER** hallucinate new card schemas. Use the existing definitions.

### 4. ANTI-DRIFT & ANTI-COLLAPSE
* **No "Refactoring for Cleanliness":** Do not summarize complex logic into helper functions unless instructed. You lose context.
* **No Global State:** Respect the **Blackboard** (Edge-Scoped) vs. **Whiteboard** (Run-Scoped) memory isolation. Do not leak data between nodes.
* **Atomic Scope:** Work ONLY on the file or module you are assigned. Do not "fix" imports in other files "while you are at it."

> **IF YOU VIOLATE THESE PROTOCOLS, YOU BREAK THE FACTORY.**

## 🎨 UI FOUNDRY SKILL ( REQUIRED FOR GUI TASKS )
* **Location:** `agentflow/docs/skills/UI_FOUNDRY_SKILL.md`
* **Protocol:** Any agent working on UI, Canvas, or Components within `agentflow` MUST ingest this skill file before modifying the Workbench.
* **Key Constraint:** The Workbench Frame is immutable. All work happens inside Cartridges.

## 🔌 CONNECTIVITY SKILL ( REQUIRED FOR NETWORK/COMMERCE TASKS )
* **Location:** `northstar-agents/docs/skills/connectivity-protocol/SKILL.md`
* **Protocol:** Any agent working on Gateways, Pricing, or Lab Verification MUST ingest this skill.
* **Key Constraint:** "Ghost" usage is forbidden. All tokens must be accounted and verified via SSE.
