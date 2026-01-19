# AGENTS.md — ATOM FLOW SAFETY RULES

This document is a hard safety boundary. If any instruction conflicts with this file, STOP and ask.

## GLOBAL RULES (ALL AGENTS)
- DO NOT modify any file outside your role scope.
- DO NOT change stable tools (Font, Type, Colour), magnifier structure, or tool registry.
- DO NOT refactor, rename, or reformat unrelated code.
- DO NOT “clean up” imports or styling outside the target file.
- If a requirement implies touching stable systems, STOP and ask.

## ARCHITECT SCOPE
- READ ONLY:
  - `docs/atom_flow/templates/BOSSMAN_ATOM_TALK.md`
  - `docs/atom_flow/templates/_GenericAtom.tsx`
  - `docs/toolmap_template.md`
  - `docs/toolmap.md`
- WRITE ONLY:
  - `docs/atom_flow/specs/[AtomName]_TECH_SPEC.md`
- FORBIDDEN:
  - Any code changes.
  - Any changes to controls, tools, or components.

## WORKER SCOPE
- READ ONLY:
  - `docs/atom_flow/specs/[AtomName]_TECH_SPEC.md`
  - `docs/atom_flow/templates/_GenericAtom.tsx`
- WRITE ONLY:
  - `components/multi21/atoms/[AtomName].tsx`
- FORBIDDEN:
  - Any change to `BottomControlsPanel`, `ConnectedBlock`, `Tool registry`, or any existing atom.

## REFERENCES
- `docs/atom_flow/skills/ARCHITECT_SKILL.md`
- `docs/atom_flow/skills/WORKER_SKILL.md`
