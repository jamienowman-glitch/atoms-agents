# Implementation Plan: Supabase-Backed Atom Registry & Trait System

## Goal
To automate the registration of UI Atoms into Supabase so that the **Universal Harness** can dynamically render tools based on the active atom's **Traits**, eliminating manual wiring.

## User Review Required
> [!IMPORTANT]
> **Database Access**: This plan assumes write access to the `ui_atoms` table in Supabase via the existing Vault keys. I will create the table if it doesn't exist.

## Proposed Changes

### 1. The Standard: Atom Config (`atoms-ui`)
We will define a standard configuration file for every Atom.

#### [NEW] `atoms-ui/ui-atoms/multi-tile/MultiTile.config.ts`
This file exports the `AtomConfig` object, defining the Atom's identity and its **Traits**.

```typescript
import { AtomConfig } from '../../registry/types';

export const MultiTileConfig: AtomConfig = {
    id: 'multi-tile',
    name: 'Universal Tile',
    category: 'layout',
    version: '1.0.0',
    family: 'multi21', // Applicable Canvases
    traits: [
        {
            type: 'layout',
            properties: [
                { id: 'cols', label: 'Columns', type: 'slider', min: 1, max: 12, responsive: true },
                { id: 'gap', label: 'Gap', type: 'slider', min: 0, max: 64, responsive: true },
                { id: 'radius', label: 'Radius', type: 'slider', min: 0, max: 32, responsive: true }
            ]
        },
        {
            type: 'typography',
            properties: [
                { id: 'size', label: 'Size', type: 'slider', min: 10, max: 64, responsive: true },
                { id: 'family', label: 'Font', type: 'select', options: ['Roboto', 'Inter', 'Serif'] }
            ]
        }
    ]
};
```

---

### 2. The Scanner: Registry Script (`atoms-core`)
A Python script that scans the `atoms-ui/ui-atoms` directory, parses the `.config.ts` files (using regex or AST), and upserts them into Supabase.

#### [NEW] `atoms-core/scripts/sync_ui_atoms.py`
*   **Input**: Scans `/Users/jaynowman/dev/atoms-ui/ui-atoms/**/*.config.ts`
*   **Logic**: extracting the JSON structure from the TS file.
*   **Output**: Upsert to Supabase table `ui_atoms`.

---

### 3. The Database: Supabase Schema (`atoms-core`)
We need a place to store this registry.

#### [NEW] `atoms-core/sql/025_ui_atoms_registry.sql`
```sql
CREATE TABLE IF NOT EXISTS ui_atoms (
    id TEXT PRIMARY KEY, -- e.g. 'multi-tile'
    name TEXT NOT NULL,
    family TEXT NOT NULL, -- 'multi21', 'stigma', etc.
    version TEXT NOT NULL,
    traits JSONB NOT NULL, -- The Config Definition
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## Verification Plan

### Automated Verification
1.  **Run Scanner**: Execute `python3 atoms-core/scripts/sync_ui_atoms.py`.
2.  **Verify Supabase**: Query the `ui_atoms` table to ensure `multi-tile` is present with the correct JSON structure.

### Manual Verification
1.  **Review Config**: Check `MultiTile.config.ts` for correctness.
