# AGENTS.md — Monorepo Law

## Scope & Authority
- This file governs `/Users/jaynowman/dev` and all sub-repos unless a local `AGENTS.md` adds stricter rules.

## Definitions
- **Blackboard:** The committed file state on disk. This is the source of truth.
- **Whiteboard:** The chat state. It is ephemeral and never a source of truth.

## Plans Location
- The canonical location for plans is `/Users/jaynowman/dev/docs/plans/`.
- All new plans must be written there unless explicitly instructed.
- Do not relocate existing plans unless explicitly instructed.

## Quarantine
- `_quarantine/` is the only authorized location for deprecated files.
- Do not create or use `/_archive/`.
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

## 🧠 GLOBAL SKILL INDEX
* **Agent Assembly:** `northstar-agents/docs/skills/agent-assembly/SKILL.md`
* **Connectivity Protocol:** `northstar-agents/docs/skills/connectivity-protocol/SKILL.md`
* **Frontend Craftsmanship:** `agentflow/docs/skills/frontend-craftsmanship/SKILL.md`
* **UI Foundry:** `agentflow/docs/skills/ui-foundry/SKILL.md`
* **Skill Authoring:** `docs/skills/skill-authoring/SKILL.md`

## 🌍 GLOBAL PROTOCOLS (Federated)
These laws are enforced at the sub-repo level but apply to any agent crossing boundaries.

### 🏛️ REGISTRY (Northstar-Agents)
* **The Split Law:** Models are Atomic (Family/Version/Variant). No monolithic IDs.
* **Stateless Brain:** Agents are infrastructure-agnostic. They do not know about Tenants.

### 💰 COMMERCE (Northstar-Engines)
* **The Receipt Law:** No Ghost usage. Every generation must return `TokenUsage` and map to `price_book.json`.
* **The OS Layer:** Engines are the host. Agents are the guest library.

### 📐 PHYSICS (Agentflow)
* **Geometry Law:** Mobile = Vertical + Hive (Exploding Hexagons). Desktop = Horizontal (Infinite Canvas).
* **Magnifier Law:** Left = Context. Right = Value.

## 🎨 UI & SURFACES
* **THE BUILDER PROTOCOL:** The agentflow surface is the designated Wireframe Builder. It must support `.agentflow` file export/import.

## 🎨 UI FOUNDRY SKILL ( REQUIRED FOR GUI TASKS )
* **Location:** `agentflow/docs/skills/ui-foundry/SKILL.md`
* **Protocol:** Any agent working on UI, Canvas, or Components within `agentflow` MUST ingest this skill file before modifying the Workbench.
* **Key Constraint:** The Workbench Frame is immutable. All work happens inside Cartridges.
