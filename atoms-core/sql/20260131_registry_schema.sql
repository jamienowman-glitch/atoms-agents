-- Registry Components Schema
-- Authors: Antigravity
-- Date: 2026-01-31

-- Enums
DO $$ BEGIN
    CREATE TYPE repo_source AS ENUM ('ui', 'app', 'core', 'muscle', 'connectors', 'agents', 'tuning', 'templates', 'safety', 'packages', 'system');
EXCEPTION
    WHEN duplicate_object THEN 
        ALTER TYPE repo_source ADD VALUE IF NOT EXISTS 'packages';
        ALTER TYPE repo_source ADD VALUE IF NOT EXISTS 'system';
END $$;

DO $$ BEGIN
    CREATE TYPE component_type AS ENUM ('atom', 'vertical_slice', 'harness', 'template', 'connector', 'page', 'config');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Table
CREATE TABLE IF NOT EXISTS public.registry_components (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    alias text NOT NULL UNIQUE,
    repo repo_source NOT NULL,
    file_path text NOT NULL,
    type component_type NOT NULL DEFAULT 'atom',
    
    -- Metadata
    description text,
    has_skill boolean DEFAULT false,
    has_connector boolean DEFAULT false,
    keywords text[] DEFAULT '{}',
    
    -- Product Metadata (for Vertical Slices)
    product_name text,
    product_meta jsonb DEFAULT '{}'::jsonb,
    
    status text DEFAULT 'active',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_registry_alias ON public.registry_components(alias);
CREATE INDEX IF NOT EXISTS idx_registry_type ON public.registry_components(type);
CREATE INDEX IF NOT EXISTS idx_registry_repo ON public.registry_components(repo);
