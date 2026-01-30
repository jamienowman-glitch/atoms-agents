-- 025_ui_atoms_registry.sql
-- Registry for UI Atoms (Trait System)

CREATE TABLE IF NOT EXISTS ui_atoms (
    id TEXT PRIMARY KEY,               -- e.g. 'multi-tile'
    name TEXT NOT NULL,
    category TEXT NOT NULL,            -- e.g. 'layout', 'media'
    version TEXT NOT NULL,
    family TEXT[] NOT NULL,            -- e.g. ['multi21-web', 'multi21-seb']
    traits JSONB NOT NULL,             -- The full Trait Definition
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Safely add columns if table existed from previous version
ALTER TABLE ui_atoms ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE ui_atoms ADD COLUMN IF NOT EXISTS version TEXT;
ALTER TABLE ui_atoms ADD COLUMN IF NOT EXISTS family TEXT[];
ALTER TABLE ui_atoms ADD COLUMN IF NOT EXISTS traits JSONB;
ALTER TABLE ui_atoms ADD COLUMN IF NOT EXISTS category TEXT;

-- Safely convert ID to TEXT if it was UUID
ALTER TABLE ui_atoms ALTER COLUMN id TYPE TEXT;

-- Index for standardized family lookups (Web vs Email atoms)
CREATE INDEX IF NOT EXISTS idx_ui_atoms_family ON ui_atoms USING GIN (family);

