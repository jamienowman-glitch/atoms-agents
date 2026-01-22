# AGENTS.md — Backend Engine Factory

## Scope & Authority
- This is the local law for `/Users/jaynowman/dev/northstar-engines`.
- It extends the monorepo `AGENTS.md` with backend-specific rules.

## Mission
- Build and harden the Backend Engine Factory: routing, safety, realtime, event spine, storage, and muscle engines.

## Plans Location
- The canonical location for plans in this repo is `/Users/jaynowman/dev/northstar-engines/docs/plans/`.
- Do not relocate existing plans unless explicitly instructed.

## Non-Negotiable Laws (Backend)
- **GateChain first:** Any state mutation or external tool call must pass GateChain with a full `RequestContext`.
- **Durable realtime:** SSE/WS must be replayable and tenant-isolated; no in-memory-only streams in sellable modes.
- **Registry-first reality:** Nothing is “real” unless registered; registry data must persist through approved storage backends.
- **Routing required:** Resource kinds must be routed through the registry before use; filesystem/in-memory backends are lab-only.
- **PII boundary:** Never log raw PII; sanitize/tokenize before persistence.
- **Muscle pattern:** New muscles follow Core → Service → MCP, with `spec.yaml` describing scopes and maturity.
- **Connectors contract:** External capabilities must declare inputs, respect routing, and emit auditable events.

## Documentation Sources (Authoritative)
- `/Users/jaynowman/dev/northstar-engines/Agent.md` (system laws and architecture anchors)
- `/Users/jaynowman/dev/ROUTING_EVENT_INFRASTRUCTURE_INVENTORY.md` (routing/event spine reality map)
- `/Users/jaynowman/dev/northstar-engines/MUSCLE_HEALTH.md` (muscle durability status)
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
