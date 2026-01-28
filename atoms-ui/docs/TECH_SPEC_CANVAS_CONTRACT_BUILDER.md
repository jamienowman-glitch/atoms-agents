# Tech Spec: The Canvas Contract Builder Standardization

## Objective
Establish a rigourous, standardized, and automated workflow for creating new Canvases in `atoms-ui`. This ensures every new canvas (Video, Gantt, Planning) adheres strictly to the Harness/Atom architecture without manual boilerplate fatigue.

## 1. The Law (`atoms-ui/agents.md`)
This document serves as the **Constitution** for Agents working in this repo.
-   **Definitions**: Defines "Harness", "Surface", "Canvas", "Atom", "Molecule".
-   **Architecture**: Explains the `ToolControlContext` >> `ConnectedBlock` >> `Atom` flow.
-   **Strict Rules**: e.g., "Atoms must optionally accept `style` props", "Harness must handle all state".

## 2. The Worker (`atoms-ui/.agent/skills/canvas-contract-builder/SKILL.md`)
A strictly formatted Anthropic Agent Skill.
    -   **Frontmatter**: `name: canvas-contract-builder`, `description: Defines the contract and generates boilerplate for a new Canvas...`
-   **Input**: `CanvasContract` (JSON/Markdown block).
-   **Process**:
    1.  Parse Contract (Canvas Name, Atoms needed, Tools needed).
    2.  Generate `Connected{Name}.tsx` (Controller).
    3.  Generate `molecules/{Name}Grid.tsx` (Container).
    4.  Generate `atoms/{Name}Atom.tsx` (Stub).
    5.  Wire into `registry.ts`.

## 3. The Contract Schema
We will define a standard JSON/YAML schema for describing a canvas.
```yaml
canvas: VideoTimeline
description: A non-linear video editing timeline.
atoms:
  - name: Clip
    props: [startTime, duration, trackId]
  - name: Playhead
    props: [position]
tools:
  - magnifier_left: [track_height, zoom_level]
  - magnifier_right: [export_format]
```

## Verification
-   **Manual**: We will manually "run" the skill by asking the Agent (me) to "Execute SKILL_CANVAS_FORGE for 'VideoCanvas'".
-   **Output**: Verify the generated files match the `Multi21` architecture.
