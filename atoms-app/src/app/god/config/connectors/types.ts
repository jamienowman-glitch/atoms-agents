export type ConnectorProvider = {
    provider_id: string;
    platform_slug: string;
    display_name: string | null;
    naming_rule: string;
    created_at: string;
};

export type FirearmType = {
    firearm_type_id: string;
    name: string;
    description: string | null;
};

export type ScopeCategory = {
    category_id: string;
    provider_id: string;
    name: string;
};

export type ConnectorScope = {
    scope_id: string;
    provider_id: string;
    scope_name: string;
    scope_type: string | null;
    description: string | null;
    requires_firearm: boolean;
    firearm_type_id: string | null;
    category_id: string | null;
};

export type PlatformMetric = {
    metric_id: string;
    provider_id: string;
    metric_name: string;
    description: string | null;
    data_source: string | null;
};

export type GenericMetric = {
    generic_metric_id: string;
    name: string;
};

export type CoreKpi = {
    core_kpi_id: string;
    name: string;
    display_label: string | null;
};

export type MetricMapping = {
    mapping_id: string;
    provider_id: string;
    metric_id: string | null;
    generic_metric_id: string | null;
    raw_metric_name: string | null;
    standard_metric_slug: string | null;
    aggregation_method: string | null;
    is_approved: boolean;
};

export type KpiMapping = {
    mapping_id: string;
    provider_id: string;
    metric_id: string | null;
    core_kpi_id: string | null;
    is_approved: boolean;
};

export type UtmTemplate = {
    template_id: string;
    provider_id: string;
    provider_slug: string | null;
    content_type_slug: string | null;
    static_params: any;
    allowed_variables: any;
    pattern_structure: string | null;
    is_approved: boolean;
};

export type DevAccount = {
    provider_id: string;
    system_dev_username: string | null;
    vault_key_hint: string | null;
    tenant_owned_keys: any;
    secondary_information: any;
};

export type OAuthRequirement = {
    provider_id: string;
    free_testing_limit: string | null;
    authorization_links: any;
    functional_summary: string | null;
};

export type AuthMode = {
    provider_id: string;
    oauth_only: boolean;
    byok_only: boolean;
    oauth_and_byok: boolean;
};

export type BudgetMetric = {
    budget_metric_id: string;
    provider_id: string;
    name: string;
    description: string | null;
};

export type BudgetMapping = {
    mapping_id: string;
    provider_id: string;
    budget_metric_id: string | null;
    generic_metric_id: string | null;
    core_kpi_id: string | null;
    aggregation_method: string | null;
    is_approved: boolean;
};
