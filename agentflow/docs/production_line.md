# Path to Production Line

Goal: turn atom builds into a repeatable, safe workflow where stable tools never break and new atoms only fill the open slots.

---

## Phase 1: Build the Next Atom by Hand
- Clone the current working atom (Multi-21) into a new atom folder.
- Wire only the open surfaces (Layout slot + any atom-specific tools).
- Keep stable tools untouched (Font, Type, Colour, UI atom buttons).
- Validate on-canvas that stable tools still work end-to-end.

Deliverable: a second atom that works and proves the wiring contract.

---

## Phase 2: Lock the Contract
Create three canonical artifacts:
1) `SKILL.md` (Stable Tool Contract)
   - Exact tool IDs and mappings for Font/Type/Colour.
   - Explicit “do not touch” rules for magnifiers + stable UI surfaces.
   - Required wiring checklist per atom.

2) `AGENTS.md` (Process Rules)
   - Which files are allowed to change.
   - Which files are forbidden to change.
   - Order of operations and verification steps.

3) Prompt/Form (Atom Spec Intake)
   - Required fields for the open slots (Layout + atom-specific tools).
   - Required outputs (renderer updates + connected block wiring + tool map).

Deliverable: a written contract that future agents must follow.

---

## Phase 3: Standardize the File Structure
- Create an atom template directory containing:
  - Renderer
  - Connected block
  - Tool map
  - Settings/config (if needed)
- Document the template as the only allowed starting point.

Deliverable: a canonical atom template.

---

## Phase 4: Validate with a Generic Atom
- Build a “generic atom” using only the template and the contract.
- Verify stable tools still function without modification.
- Verify the open slots can be wired without side effects.

Deliverable: a proven pipeline that can be repeated.

---

## Phase 5: Apply the Same Model to Canvases
- Define a shared canvas kernel (stable tools).
- Add per-canvas extensions as separate, limited scope additions.
- Repeat the contract + template approach for each canvas type.

Deliverable: a scalable production line for multiple canvases.
