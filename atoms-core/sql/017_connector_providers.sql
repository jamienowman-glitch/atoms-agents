-- 017_connector_providers.sql
-- Purpose: Registry for connector providers (platforms).

CREATE TABLE IF NOT EXISTS connector_providers (
    provider_id text PRIMARY KEY,
    platform_slug text UNIQUE NOT NULL,
    display_name text,
    naming_rule text NOT NULL,
    created_at timestamptz DEFAULT now()
);
