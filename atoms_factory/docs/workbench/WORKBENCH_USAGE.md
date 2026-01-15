# Atoms Factory Workbench

Local preview environment for developing and testing atoms.

## Features
- **Live Preview:** Renders atoms using their `View.tsx` and live tokens.
- **NA Enforcement:** Inspector highlights missing or NA token groups.
- **Responsive Mode:** Toggle between Desktop and Mobile viewports.
- **Export:** Download `instance.json` with current token state.

## How to Run
1. Navigate to `apps/workbench`:
   ```bash
   cd apps/workbench
   ```
2. Install dependencies (if needed):
   ```bash
   npm install
   ```
3. Start dev server:
   ```bash
   npm run dev
   ```
4. Open browser at `http://localhost:5173`.

## Adding Atoms
The workbench automatically picks up any atom in `atoms/aitom_family/*/views/View.tsx`.
Currently includes 66 atoms (21 Core + 45 Migrated).
Ensure your atom follows the 10-bucket structure and exports `View` from `views/View.tsx` and `DEFAULTS` from `exposed_tokens/default.ts`.
