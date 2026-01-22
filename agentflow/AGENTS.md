# AGENTS.md — Agentflow Surface Factory

## Scope & Authority
- This is the local law for `/Users/jaynowman/dev/agentflow`.
- It extends the monorepo `AGENTS.md` with UI-specific boundaries.
- The following documents are authoritative and must be treated as the source of truth:
  - `/Users/jaynowman/dev/agentflow/docs/toolpop_spec.md` (Toolpop interaction model)
  - `/Users/jaynowman/dev/agentflow/docs/atom_flow/AGENTS.md` (Atom Flow safety rules)
  - `/Users/jaynowman/dev/agentflow/docs/production_line.md` (stable tools and production workflow)
  - `/Users/jaynowman/dev/agentflow/docs/toolmap.md` (tool wiring reference)

## Plans Location
- The canonical location for plans in this repo is `/Users/jaynowman/dev/agentflow/docs/plans/`.
- Do not relocate existing plans unless explicitly instructed.

## Surface Laws
- **Stable tools are protected:** Font, Type, Colour, magnifiers, and core tool registry wiring are stable unless explicitly authorized to change.
- **Atom flow boundaries:** Follow the read/write scopes defined in `docs/atom_flow/AGENTS.md`.
- **Wiring first:** Toolpop and tool wiring must follow `docs/toolpop_spec.md` and `docs/toolmap.md`.
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
