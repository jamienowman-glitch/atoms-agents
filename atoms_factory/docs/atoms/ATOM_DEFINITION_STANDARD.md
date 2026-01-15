# Atom Definition Standard

**Authority**: Atoms Factory  
**Pattern**: "One Folder Per Atom"

## 1. Directory Structure

All Atoms must live in `atoms/aitom_family/<atom_id>/`.
The structure is strict to ensure the Workbench auto-discovers them.

```text
atoms/aitom_family/
  ├── <atom_id>/               # e.g. "cta_button", "hero_banner"
  │   ├── views/
  │   │   └── View.tsx         # The React Component (Default Export)
  │   ├── exposed_tokens/
  │   │   ├── schema.ts        # The Token Contract (Types, Constraints)
  │   │   ├── default.ts       # Default Token Values (The "Instance")
  │   │   └── _index.ts        # (Legacy) Aggregator
  │   ├── data_schema/         # (Optional) Data binding rules
  │   └── README.md            # Usage docs
```

## 2. The View Contract (`View.tsx`)

The component MUST accept a `tokens` prop matching its schema.

```tsx
// atoms/aitom_family/my_atom/views/View.tsx
export const View = ({ tokens }: { tokens: MyAtomTokens }) => {
  // Render using tokens directly
  return <div style={{ color: tokens.color.text }}>{tokens.content.text.content}</div>;
};
```

## 3. The Token Contract (`schema.ts`)

Defines the "Shape" of the atom. See `TOKEN_EXPOSURE_CONTRACT.md` for types.

## 4. Registration (The "One True Way")

**Discovery is Automatic.**
The Workbench uses `import.meta.glob` to find all `.../views/View.tsx` files.
*Requirement*: You MUST create the files in the correct path. No manual registration in a central list is required.

## 5. Agent Constraints

**Agents are ALLOWED to:**
- Create/Edit `atoms/aitom_family/<new_atom_id>/**`
- Import shared styles/fonts from `atoms/_shared` or `fonts/`

**Agents are FORBIDDEN from:**
- Editing `apps/workbench/**` (The Inspector / Registry)
- Editing other atoms (unless refactoring shared code)
