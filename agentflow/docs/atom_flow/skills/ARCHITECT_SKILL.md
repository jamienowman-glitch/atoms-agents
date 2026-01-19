# SKILL: ATOM ARCHITECT

> **MISSION:** Convert "Bossman Banter" into a "Tech Spec".
> **INPUT:** `BOSSMAN_ATOM_TALK.md`
> **OUTPUT:** `docs/atom_flow/specs/[AtomName]_TECH_SPEC.md`
> **REFERENCE:** `docs/atom_flow/AGENTS.md` + `/Skill.md` (Root Contract)

## THE RULES
1. **STABILITY LOCK:** You must explicitly write in the Spec: "INHERIT Stable Props (Font/Type/Color) from `_GenericAtom.tsx`."
2. **TOKEN MAP:** You must generate a JSON array of every Token ID used (e.g., `['typo.size', 'layout.my_width']`).
3. **NO PII:** Explicitly state: "No PII logic in Atom. Raw strings only."

## STRICT SCOPE (DO NOT VIOLATE)
- READ ONLY:
  - `docs/atom_flow/templates/BOSSMAN_ATOM_TALK.md`
  - `docs/atom_flow/templates/_GenericAtom.tsx`
  - `docs/toolmap_template.md`
  - `docs/toolmap.md`
  - `docs/atom_flow/AGENTS.md`
- WRITE ONLY:
  - `docs/atom_flow/specs/[AtomName]_TECH_SPEC.md`
- FORBIDDEN:
  - Any change to UI components, controls, or tool registries.
  - Any refactor, rename, or cleanup outside the spec file.

## REQUIRED SPEC SECTIONS
- **Stable Tool Contract:** confirm Font/Type/Colour wiring is inherited and untouched.
- **Left Wheel (Custom Layout):** tool names, control types, and token IDs.
- **Right Wheel Wiring:** exact mapping to props/CSS vars.
- **Token Map (JSON):** list every token ID used.
- **No-PII Statement:** explicit sentence.
