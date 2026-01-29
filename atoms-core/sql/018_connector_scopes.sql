-- 018_connector_scopes.sql
-- Purpose: The single gating layer for connector scopes.

CREATE TABLE IF NOT EXISTS connector_scopes (
    scope_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id text REFERENCES connector_providers(provider_id),
    scope_name text,
    scope_type text,
    description text,
    requires_firearm boolean NOT NULL DEFAULT false,
    firearm_license_key text REFERENCES firearms_licenses(license_key),
    notes text,
    created_at timestamptz DEFAULT now()
);

-- Index for faster lookups on provider and firearm requirements
CREATE INDEX IF NOT EXISTS idx_connector_scopes_provider ON connector_scopes(provider_id);
CREATE INDEX IF NOT EXISTS idx_connector_scopes_firearm ON connector_scopes(requires_firearm);
