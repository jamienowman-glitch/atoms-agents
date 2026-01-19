# SKILL: ATOM BUILDER (WORKER)

> **MISSION:** Convert "Tech Spec" into Code.
> **INPUT:** `[AtomName]_TECH_SPEC.md` + `_GenericAtom.tsx`
> **OUTPUT:** `components/multi21/atoms/[AtomName].tsx`
> **REFERENCE:** `docs/atom_flow/AGENTS.md` + `/Skill.md` (Root Contract)

## THE CONTRACT (SENDER / RECEIVER)
You must wire the props exactly as defined in the Root `Skill.md`.
- **SENDER:** ToolPop (Token ID) -> **RECEIVER:** Atom (Prop) -> **WIRE:** CSS Variable.
- **NO DEAD SLIDERS:** If a prop exists, it MUST affect the DOM or Style.

## EXECUTION STEPS
1. Read the Tech Spec.
2. Copy `_GenericAtom.tsx`.
3. REPLACE the "Content Slot" with the HTML structure from the Spec.
4. ADD the new "Left Wheel" props defined in the Spec.
5. SAVE to `components/multi21/atoms/`.

## STRICT SCOPE (DO NOT VIOLATE)
- READ ONLY:
  - `docs/atom_flow/specs/[AtomName]_TECH_SPEC.md`
  - `docs/atom_flow/templates/_GenericAtom.tsx`
  - `docs/atom_flow/AGENTS.md`
- WRITE ONLY:
  - `components/multi21/atoms/[AtomName].tsx`
- FORBIDDEN:
  - Any change to `BottomControlsPanel`, `ConnectedBlock`, `Tool registry`, or any existing atom.
  - Any refactor, rename, or cleanup outside the atom file.
