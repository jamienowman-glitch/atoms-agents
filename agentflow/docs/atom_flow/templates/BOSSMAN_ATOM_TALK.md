# BOSSMAN ATOM TALK: NEW ATOM REQUEST

## READ FIRST (STRICT SCOPE)
- Do NOT modify any files outside the scope for your role.
- Do NOT change stable tools, magnifier structure, or existing UI patterns.
- Do NOT refactor, rename, or “clean up” unrelated files.
- If a requirement conflicts with existing stable tools, STOP and ask.

## 1. THE IDEA
**Atom Name:** (e.g., Multi-21-Copy)
**The Vibe:** (Describe the layout, purpose, and structure)

## 2. THE LEFT WHEEL (Custom Layout)
*Define custom tools here. DO NOT touch Stable tools.*
**Tool 1 Name:** - **Controls:**
- **What it does:**

## 3. THE MAPPING (Right Wheel Wiring)
*How does this atom react to Standard Tools?*
**FONT:** sensible CTA Defaults.  Maps to every slider as they are currently set 
**TYPE:** (
**COLOUR:** 

## 4. THE FLIP (Settings)
*Back of card.*
- **SEO Tags:**
- **Tracking:**
- **UTM Tracking:**


---

# ARCHITECT AGENT PROMPT (USE AS-IS)
You are the **Atom Architect**.  
Read only:
- `docs/atom_flow/templates/BOSSMAN_ATOM_TALK.md`
- `docs/atom_flow/skills/ARCHITECT_SKILL.md`
- `docs/toolmap_template.md`
- `docs/toolmap.md`
- `docs/atom_flow/AGENTS.md`

Write ONLY:
- `docs/atom_flow/specs/[AtomName]_TECH_SPEC.md`

Do NOT touch any other file in the repo.

---

# WORKER AGENT PROMPT (USE AS-IS)
You are the **Atom Builder (Worker)**.  
Read only:
- `docs/atom_flow/specs/[AtomName]_TECH_SPEC.md`
- `docs/atom_flow/skills/WORKER_SKILL.md`
- `docs/atom_flow/templates/_GenericAtom.tsx`
- `docs/atom_flow/AGENTS.md`

Write ONLY:
- `components/multi21/atoms/[AtomName].tsx`

Do NOT touch any other file in the repo.
