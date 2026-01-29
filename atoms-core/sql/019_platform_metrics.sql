-- 019_platform_metrics.sql
-- Purpose: Metrics, Mappings, and UTM Templates.

-- 1. Platform Metrics (Raw definitions)
CREATE TABLE IF NOT EXISTS platform_metrics (
    provider_id text REFERENCES connector_providers(provider_id),
    metric_name text NOT NULL,
    description text,
    data_source text,
    created_at timestamptz DEFAULT now(),
    PRIMARY KEY (provider_id, metric_name)
);

-- 2. Generic Metrics (Abstract categories)
CREATE TABLE IF NOT EXISTS generic_metrics (
    name text PRIMARY KEY,
    description text,
    category text,
    created_at timestamptz DEFAULT now()
);

-- 3. Metric Mappings (Translation Layer)
CREATE TABLE IF NOT EXISTS metric_mappings (
    mapping_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_slug text NOT NULL,
    raw_metric_name text NOT NULL,
    standard_metric_slug text NOT NULL,
    aggregation_method text NOT NULL CHECK (aggregation_method IN ('sum', 'avg', 'max')),
    is_approved boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_metric_mappings_provider ON metric_mappings(provider_slug);

-- 4. UTM Templates (URL Construction)
CREATE TABLE IF NOT EXISTS utm_templates (
    template_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_slug text NOT NULL,
    content_type_slug text NOT NULL,
    static_params jsonb DEFAULT '{}'::jsonb,
    allowed_variables jsonb DEFAULT '[]'::jsonb,
    pattern_structure text NOT NULL,
    is_approved boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_utm_templates_provider ON utm_templates(provider_slug);
