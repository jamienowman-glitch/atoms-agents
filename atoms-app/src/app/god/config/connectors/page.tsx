"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

type ConnectorProvider = {
    provider_id: string;
    platform_slug: string;
    display_name: string | null;
    naming_rule: string;
    created_at: string;
};

type FirearmType = {
    firearm_type_id: string;
    name: string;
    description: string | null;
};

type ScopeCategory = {
    category_id: string;
    provider_id: string;
    name: string;
};

type ConnectorScope = {
    scope_id: string;
    provider_id: string;
    scope_name: string;
    scope_type: string | null;
    description: string | null;
    requires_firearm: boolean;
    firearm_type_id: string | null;
    category_id: string | null;
};

type PlatformMetric = {
    metric_id: string;
    provider_id: string;
    metric_name: string;
    description: string | null;
    data_source: string | null;
};

type GenericMetric = {
    generic_metric_id: string;
    name: string;
};

type CoreKpi = {
    core_kpi_id: string;
    name: string;
    display_label: string | null;
};

type MetricMapping = {
    mapping_id: string;
    provider_id: string;
    metric_id: string | null;
    generic_metric_id: string | null;
    raw_metric_name: string | null;
    standard_metric_slug: string | null;
    aggregation_method: string | null;
    is_approved: boolean;
};

type KpiMapping = {
    mapping_id: string;
    provider_id: string;
    metric_id: string | null;
    core_kpi_id: string | null;
    is_approved: boolean;
};

type UtmTemplate = {
    template_id: string;
    provider_id: string;
    provider_slug: string | null;
    content_type_slug: string | null;
    static_params: any;
    allowed_variables: any;
    pattern_structure: string | null;
    is_approved: boolean;
};

type DevAccount = {
    provider_id: string;
    system_dev_username: string | null;
    vault_key_hint: string | null;
    tenant_owned_keys: any;
    secondary_information: any;
};

type OAuthRequirement = {
    provider_id: string;
    free_testing_limit: string | null;
    authorization_links: any;
    functional_summary: string | null;
};

type AuthMode = {
    provider_id: string;
    oauth_only: boolean;
    byok_only: boolean;
    oauth_and_byok: boolean;
};

type BudgetMetric = {
    budget_metric_id: string;
    provider_id: string;
    name: string;
    description: string | null;
};

type BudgetMapping = {
    mapping_id: string;
    provider_id: string;
    budget_metric_id: string | null;
    generic_metric_id: string | null;
    core_kpi_id: string | null;
    aggregation_method: string | null;
    is_approved: boolean;
};

const SECTIONS = [
    'Dev Account',
    'Scopes',
    'KPI',
    'UTM',
    'Budgets',
    'OAuth / Marketplace',
    'BYOK'
];

const safeParse = (value: string, fallback: any) => {
    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
};

const jsonPretty = (value: any) => {
    try {
        return JSON.stringify(value ?? {}, null, 2);
    } catch {
        return '{}';
    }
};

export default function ConnectorsConfigPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [providers, setProviders] = useState<ConnectorProvider[]>([]);
    const [selected, setSelected] = useState<ConnectorProvider | null>(null);
    const [open, setOpen] = useState<Record<string, boolean>>({});

    const [devAccount, setDevAccount] = useState<DevAccount | null>(null);
    const [scopeCategories, setScopeCategories] = useState<ScopeCategory[]>([]);
    const [scopes, setScopes] = useState<ConnectorScope[]>([]);
    const [firearmTypes, setFirearmTypes] = useState<FirearmType[]>([]);

    const [platformMetrics, setPlatformMetrics] = useState<PlatformMetric[]>([]);
    const [genericMetrics, setGenericMetrics] = useState<GenericMetric[]>([]);
    const [coreKpis, setCoreKpis] = useState<CoreKpi[]>([]);
    const [metricMappings, setMetricMappings] = useState<MetricMapping[]>([]);
    const [kpiMappings, setKpiMappings] = useState<KpiMapping[]>([]);

    const [utmTemplates, setUtmTemplates] = useState<UtmTemplate[]>([]);
    const [oauthReq, setOauthReq] = useState<OAuthRequirement | null>(null);
    const [authMode, setAuthMode] = useState<AuthMode | null>(null);

    const [budgetMetrics, setBudgetMetrics] = useState<BudgetMetric[]>([]);
    const [budgetMappings, setBudgetMappings] = useState<BudgetMapping[]>([]);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) router.push('/login');
            else fetchProviders();
        });
    }, []);

    const fetchProviders = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('connector_providers')
            .select('*')
            .order('platform_slug', { ascending: true });
        if (data) {
            setProviders(data as ConnectorProvider[]);
            const first = (data as ConnectorProvider[])[0] || null;
            setSelected(first);
        }
        setLoading(false);
    };

    const loadProviderData = async (providerId: string) => {
        const [
            devRes,
            catRes,
            scopeRes,
            firearmRes,
            pmRes,
            gmRes,
            kpiRes,
            mapRes,
            kpiMapRes,
            utmRes,
            oauthRes,
            authRes,
            budgetMetricRes,
            budgetMapRes
        ] = await Promise.all([
            supabase.from('connector_dev_accounts').select('*').eq('provider_id', providerId).maybeSingle(),
            supabase.from('connector_scope_categories').select('*').eq('provider_id', providerId).order('name', { ascending: true }),
            supabase.from('connector_scopes').select('*').eq('provider_id', providerId).order('scope_name', { ascending: true }),
            supabase.from('firearm_types').select('*').order('name', { ascending: true }),
            supabase.from('platform_metrics').select('*').eq('provider_id', providerId).order('metric_name', { ascending: true }),
            supabase.from('generic_metrics').select('*').order('name', { ascending: true }),
            supabase.from('core_kpis').select('*').order('name', { ascending: true }),
            supabase.from('metric_mappings').select('*').eq('provider_id', providerId),
            supabase.from('kpi_mappings').select('*').eq('provider_id', providerId),
            supabase.from('utm_templates').select('*').eq('provider_id', providerId),
            supabase.from('connector_oauth_requirements').select('*').eq('provider_id', providerId).maybeSingle(),
            supabase.from('connector_auth_modes').select('*').eq('provider_id', providerId).maybeSingle(),
            supabase.from('budget_metrics').select('*').eq('provider_id', providerId),
            supabase.from('budget_mappings').select('*').eq('provider_id', providerId)
        ]);

        setDevAccount(devRes.data as DevAccount | null);
        setScopeCategories((catRes.data as ScopeCategory[]) || []);
        setScopes((scopeRes.data as ConnectorScope[]) || []);
        setFirearmTypes((firearmRes.data as FirearmType[]) || []);
        setPlatformMetrics((pmRes.data as PlatformMetric[]) || []);
        setGenericMetrics((gmRes.data as GenericMetric[]) || []);
        setCoreKpis((kpiRes.data as CoreKpi[]) || []);
        setMetricMappings((mapRes.data as MetricMapping[]) || []);
        setKpiMappings((kpiMapRes.data as KpiMapping[]) || []);
        setUtmTemplates((utmRes.data as UtmTemplate[]) || []);
        setOauthReq(oauthRes.data as OAuthRequirement | null);
        setAuthMode(authRes.data as AuthMode | null);
        setBudgetMetrics((budgetMetricRes.data as BudgetMetric[]) || []);
        setBudgetMappings((budgetMapRes.data as BudgetMapping[]) || []);
    };

    useEffect(() => {
        if (selected?.provider_id) {
            loadProviderData(selected.provider_id);
        }
    }, [selected?.provider_id]);

    const toggle = (section: string) => {
        setOpen(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const addConnector = async () => {
        const slug = prompt('Provider slug (e.g., shopify, tiktok, youtube)');
        if (!slug) return;
        const display = prompt('Display name (e.g., Shopify)');
        if (!display) return;
        const payload = {
            provider_id: slug,
            platform_slug: slug,
            display_name: display,
            naming_rule: 'PROVIDER_{PLATFORM}_KEY'
        };
        const { error } = await supabase.from('connector_providers').insert(payload);
        if (error) {
            alert(error.message);
            return;
        }
        await fetchProviders();
    };

    const saveDevAccount = async () => {
        if (!selected) return;
        const payload = {
            provider_id: selected.provider_id,
            system_dev_username: devAccount?.system_dev_username || null,
            vault_key_hint: devAccount?.vault_key_hint || null,
            tenant_owned_keys: devAccount?.tenant_owned_keys ?? [],
            secondary_information: devAccount?.secondary_information ?? []
        };
        await supabase.from('connector_dev_accounts').upsert(payload, { onConflict: 'provider_id' });
        await loadProviderData(selected.provider_id);
    };

    const addScopeCategory = async () => {
        if (!selected) return;
        const name = prompt('Scope category name (e.g., Analytics, Content)');
        if (!name) return;
        await supabase.from('connector_scope_categories').insert({
            provider_id: selected.provider_id,
            name
        });
        await loadProviderData(selected.provider_id);
    };

    const addScope = async () => {
        if (!selected) return;
        const scope_name = prompt('Scope name');
        if (!scope_name) return;
        const scope_type = prompt('Scope type (oauth_scope, api_scope, etc.)') || null;
        const description = prompt('Description') || null;
        await supabase.from('connector_scopes').insert({
            provider_id: selected.provider_id,
            scope_name,
            scope_type,
            description,
            requires_firearm: false,
            firearm_type_id: null
        });
        await loadProviderData(selected.provider_id);
    };

    const updateScope = async (scope: ConnectorScope, changes: Partial<ConnectorScope>) => {
        await supabase.from('connector_scopes').update(changes).eq('scope_id', scope.scope_id);
        if (selected) await loadProviderData(selected.provider_id);
    };

    const addFirearmType = async () => {
        const name = prompt('Firearm type name');
        if (!name) return;
        const description = prompt('Description') || null;
        await supabase.from('firearm_types').insert({ name, description });
        if (selected) await loadProviderData(selected.provider_id);
    };

    const addPlatformMetric = async () => {
        if (!selected) return;
        const metric_name = prompt('Platform metric name');
        if (!metric_name) return;
        const description = prompt('Description') || null;
        await supabase.from('platform_metrics').insert({
            provider_id: selected.provider_id,
            metric_name,
            description
        });
        await loadProviderData(selected.provider_id);
    };

    const addGenericMetric = async () => {
        const name = prompt('Generic metric name');
        if (!name) return;
        const description = prompt('Description') || null;
        await supabase.from('generic_metrics').insert({ name, description });
        if (selected) await loadProviderData(selected.provider_id);
    };

    const addCoreKpi = async () => {
        const name = prompt('Core KPI slug');
        if (!name) return;
        const display_label = prompt('Display label') || null;
        await supabase.from('core_kpis').insert({ name, display_label });
        if (selected) await loadProviderData(selected.provider_id);
    };

    const addMetricMapping = async (metric: PlatformMetric) => {
        if (!selected) return;
        await supabase.from('metric_mappings').insert({
            provider_id: selected.provider_id,
            metric_id: metric.metric_id,
            is_approved: false
        });
        await loadProviderData(selected.provider_id);
    };

    const updateMetricMapping = async (mapping: MetricMapping, changes: Partial<MetricMapping>) => {
        await supabase.from('metric_mappings').update(changes).eq('mapping_id', mapping.mapping_id);
        if (selected) await loadProviderData(selected.provider_id);
    };

    const addKpiMapping = async (metric: PlatformMetric) => {
        if (!selected) return;
        await supabase.from('kpi_mappings').insert({
            provider_id: selected.provider_id,
            metric_id: metric.metric_id,
            is_approved: false
        });
        await loadProviderData(selected.provider_id);
    };

    const updateKpiMapping = async (mapping: KpiMapping, changes: Partial<KpiMapping>) => {
        await supabase.from('kpi_mappings').update(changes).eq('mapping_id', mapping.mapping_id);
        if (selected) await loadProviderData(selected.provider_id);
    };

    const addUtmTemplate = async () => {
        if (!selected) return;
        const content_type_slug = prompt('Content type slug (e.g., reel, carousel)') || '';
        await supabase.from('utm_templates').insert({
            provider_id: selected.provider_id,
            provider_slug: selected.platform_slug,
            content_type_slug,
            static_params: { utm_source: selected.platform_slug },
            allowed_variables: [],
            pattern_structure: '',
            is_approved: false
        });
        await loadProviderData(selected.provider_id);
    };

    const updateUtmTemplate = async (template: UtmTemplate, changes: Partial<UtmTemplate>) => {
        await supabase.from('utm_templates').update(changes).eq('template_id', template.template_id);
        if (selected) await loadProviderData(selected.provider_id);
    };

    const saveOauth = async () => {
        if (!selected) return;
        const payload = {
            provider_id: selected.provider_id,
            free_testing_limit: oauthReq?.free_testing_limit || null,
            authorization_links: oauthReq?.authorization_links ?? [],
            functional_summary: oauthReq?.functional_summary || null
        };
        await supabase.from('connector_oauth_requirements').upsert(payload, { onConflict: 'provider_id' });
        await loadProviderData(selected.provider_id);
    };

    const saveAuthMode = async (changes: Partial<AuthMode>) => {
        if (!selected) return;
        const payload = {
            provider_id: selected.provider_id,
            oauth_only: changes.oauth_only ?? authMode?.oauth_only ?? false,
            byok_only: changes.byok_only ?? authMode?.byok_only ?? false,
            oauth_and_byok: changes.oauth_and_byok ?? authMode?.oauth_and_byok ?? true
        };
        await supabase.from('connector_auth_modes').upsert(payload, { onConflict: 'provider_id' });
        await loadProviderData(selected.provider_id);
    };

    const addBudgetMetric = async () => {
        if (!selected) return;
        const name = prompt('Budget metric name');
        if (!name) return;
        const description = prompt('Description') || null;
        await supabase.from('budget_metrics').insert({
            provider_id: selected.provider_id,
            name,
            description
        });
        await loadProviderData(selected.provider_id);
    };

    const addBudgetMapping = async (metric: BudgetMetric) => {
        if (!selected) return;
        await supabase.from('budget_mappings').insert({
            provider_id: selected.provider_id,
            budget_metric_id: metric.budget_metric_id,
            is_approved: false
        });
        await loadProviderData(selected.provider_id);
    };

    const updateBudgetMapping = async (mapping: BudgetMapping, changes: Partial<BudgetMapping>) => {
        await supabase.from('budget_mappings').update(changes).eq('mapping_id', mapping.mapping_id);
        if (selected) await loadProviderData(selected.provider_id);
    };

    const selectedTitle = useMemo(() => {
        if (!selected) return 'CONNECTORS';
        return `${selected.display_name || selected.platform_slug}`.toUpperCase();
    }, [selected]);

    return (
        <div className="min-h-screen bg-graph-paper p-6 md:p-12 font-sans">
            <div className="max-w-7xl mx-auto bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 md:p-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-1">CONNECTOR FACTORY — GOD CONFIG</h1>
                        <p className="font-bold text-xs tracking-widest uppercase text-neutral-500">FLAT SECTIONS • MOBILE FIRST • FIREARMS ONLY</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={addConnector}
                            className="px-6 py-2 border-2 border-black font-bold uppercase hover:bg-black hover:text-white transition-colors"
                        >
                            + Add Connector
                        </button>
                        <button
                            onClick={() => router.push('/god/config')}
                            className="px-6 py-2 border-2 border-black font-bold uppercase hover:bg-black hover:text-white transition-colors"
                        >
                            ← Back
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="font-mono animate-pulse">LOADING CONNECTORS...</div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
                        <div className="border-2 border-black">
                            <div className="bg-black text-white px-4 py-3 font-black uppercase text-sm">CONNECTORS</div>
                            <div className="divide-y-2 divide-black">
                                {providers.map((p) => (
                                    <button
                                        key={p.provider_id}
                                        onClick={() => setSelected(p)}
                                        className={`w-full text-left px-4 py-3 uppercase font-bold tracking-tight transition-colors ${
                                            selected?.provider_id === p.provider_id ? 'bg-neutral-100' : 'hover:bg-neutral-50'
                                        }`}
                                    >
                                        {p.display_name || p.platform_slug}
                                    </button>
                                ))}
                                {providers.length === 0 && (
                                    <div className="p-4 text-xs uppercase text-neutral-500">No connectors yet.</div>
                                )}
                            </div>
                        </div>

                        <div className="border-2 border-black">
                            <div className="bg-black text-white px-4 py-3 font-black uppercase text-sm">{selectedTitle}</div>
                            <div className="p-4 md:p-6 space-y-4">
                                {SECTIONS.map((section) => (
                                    <div key={section} className="border-2 border-black">
                                        <button
                                            onClick={() => toggle(section)}
                                            className="w-full flex justify-between items-center px-4 py-3 bg-white uppercase font-black tracking-tight text-lg"
                                        >
                                            <span>{section}</span>
                                            <span>{open[section] ? '[-]' : '[+]'}</span>
                                        </button>
                                        {open[section] && (
                                            <div className="px-4 py-4 text-sm border-t-2 border-black bg-neutral-50 space-y-4">
                                                {section === 'Dev Account' && (
                                                    <div className="space-y-4">
                                                        <div className="grid md:grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-xs uppercase font-bold">System Dev Username</label>
                                                                <input
                                                                    className="w-full border-2 border-black px-3 py-2"
                                                                    value={devAccount?.system_dev_username || ''}
                                                                    onChange={(e) => setDevAccount(prev => ({
                                                                        provider_id: selected?.provider_id || '',
                                                                        system_dev_username: e.target.value,
                                                                        vault_key_hint: prev?.vault_key_hint || null,
                                                                        tenant_owned_keys: prev?.tenant_owned_keys ?? [],
                                                                        secondary_information: prev?.secondary_information ?? []
                                                                    }))}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs uppercase font-bold">Vault Key Hint</label>
                                                                <input
                                                                    className="w-full border-2 border-black px-3 py-2"
                                                                    value={devAccount?.vault_key_hint || ''}
                                                                    onChange={(e) => setDevAccount(prev => ({
                                                                        provider_id: selected?.provider_id || '',
                                                                        system_dev_username: prev?.system_dev_username || null,
                                                                        vault_key_hint: e.target.value,
                                                                        tenant_owned_keys: prev?.tenant_owned_keys ?? [],
                                                                        secondary_information: prev?.secondary_information ?? []
                                                                    }))}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs uppercase font-bold">Tenant Owned Keys (JSON)</label>
                                                            <textarea
                                                                className="w-full border-2 border-black px-3 py-2 font-mono text-xs"
                                                                rows={4}
                                                                value={jsonPretty(devAccount?.tenant_owned_keys ?? [])}
                                                                onChange={(e) => setDevAccount(prev => ({
                                                                    provider_id: selected?.provider_id || '',
                                                                    system_dev_username: prev?.system_dev_username || null,
                                                                    vault_key_hint: prev?.vault_key_hint || null,
                                                                    tenant_owned_keys: safeParse(e.target.value, []),
                                                                    secondary_information: prev?.secondary_information ?? []
                                                                }))}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs uppercase font-bold">Secondary Information (JSON)</label>
                                                            <textarea
                                                                className="w-full border-2 border-black px-3 py-2 font-mono text-xs"
                                                                rows={4}
                                                                value={jsonPretty(devAccount?.secondary_information ?? [])}
                                                                onChange={(e) => setDevAccount(prev => ({
                                                                    provider_id: selected?.provider_id || '',
                                                                    system_dev_username: prev?.system_dev_username || null,
                                                                    vault_key_hint: prev?.vault_key_hint || null,
                                                                    tenant_owned_keys: prev?.tenant_owned_keys ?? [],
                                                                    secondary_information: safeParse(e.target.value, [])
                                                                }))}
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={saveDevAccount}
                                                            className="px-4 py-2 border-2 border-black font-bold uppercase hover:bg-black hover:text-white"
                                                        >
                                                            Save Dev Account
                                                        </button>
                                                    </div>
                                                )}

                                                {section === 'Scopes' && (
                                                    <div className="space-y-4">
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={addScopeCategory}
                                                                className="px-3 py-1 border-2 border-black font-bold uppercase text-xs"
                                                            >
                                                                + Category
                                                            </button>
                                                            <button
                                                                onClick={addScope}
                                                                className="px-3 py-1 border-2 border-black font-bold uppercase text-xs"
                                                            >
                                                                + Scope
                                                            </button>
                                                            <button
                                                                onClick={addFirearmType}
                                                                className="px-3 py-1 border-2 border-black font-bold uppercase text-xs"
                                                            >
                                                                + Firearm Type
                                                            </button>
                                                        </div>
                                                        <div className="space-y-2">
                                                            {scopes.map((s) => (
                                                                <div key={s.scope_id} className="border-2 border-black p-3 bg-white space-y-2">
                                                                    <div className="flex flex-wrap gap-3 items-center">
                                                                        <span className="font-bold uppercase text-xs">{s.scope_name}</span>
                                                                        <span className="text-xs text-neutral-500">{s.scope_type}</span>
                                                                    </div>
                                                                    <div className="grid md:grid-cols-3 gap-2">
                                                                        <select
                                                                            className="border-2 border-black px-2 py-1 text-xs"
                                                                            value={s.category_id || ''}
                                                                            onChange={(e) => updateScope(s, { category_id: e.target.value || null })}
                                                                        >
                                                                            <option value="">Uncategorized</option>
                                                                            {scopeCategories.map((c) => (
                                                                                <option key={c.category_id} value={c.category_id}>{c.name}</option>
                                                                            ))}
                                                                        </select>
                                                                        <label className="flex items-center gap-2 text-xs">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={s.requires_firearm}
                                                                                onChange={(e) => updateScope(s, { requires_firearm: e.target.checked })}
                                                                            />
                                                                            Requires Firearms
                                                                        </label>
                                                                        <select
                                                                            className="border-2 border-black px-2 py-1 text-xs"
                                                                            value={s.firearm_type_id || ''}
                                                                            onChange={(e) => updateScope(s, { firearm_type_id: e.target.value || null })}
                                                                        >
                                                                            <option value="">Select Firearm Type</option>
                                                                            {firearmTypes.map((f) => (
                                                                                <option key={f.firearm_type_id} value={f.firearm_type_id}>{f.name}</option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                    <div className="text-xs text-neutral-600">{s.description}</div>
                                                                </div>
                                                            ))}
                                                            {scopes.length === 0 && (
                                                                <div className="text-xs uppercase text-neutral-500">No scopes yet.</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {section === 'KPI' && (
                                                    <div className="space-y-4">
                                                        <div className="flex gap-2">
                                                            <button onClick={addPlatformMetric} className="px-3 py-1 border-2 border-black font-bold uppercase text-xs">+ Platform Metric</button>
                                                            <button onClick={addGenericMetric} className="px-3 py-1 border-2 border-black font-bold uppercase text-xs">+ Generic Metric</button>
                                                            <button onClick={addCoreKpi} className="px-3 py-1 border-2 border-black font-bold uppercase text-xs">+ Core KPI</button>
                                                        </div>
                                                        <div className="space-y-2">
                                                            {platformMetrics.map((m) => {
                                                                const mapping = metricMappings.find(mm => mm.metric_id === m.metric_id) || null;
                                                                const kpiMapping = kpiMappings.find(km => km.metric_id === m.metric_id) || null;
                                                                return (
                                                                    <div key={m.metric_id} className="border-2 border-black p-3 bg-white space-y-2">
                                                                        <div className="flex justify-between items-center">
                                                                            <div className="font-bold uppercase text-xs">{m.metric_name}</div>
                                                                            <div className="flex gap-2">
                                                                                <button onClick={() => addMetricMapping(m)} className="px-2 py-1 border-2 border-black text-[10px] uppercase">+ Mapping</button>
                                                                                <button onClick={() => addKpiMapping(m)} className="px-2 py-1 border-2 border-black text-[10px] uppercase">+ KPI</button>
                                                                            </div>
                                                                        </div>
                                                                        <div className="grid md:grid-cols-2 gap-2">
                                                                            <select
                                                                                className="border-2 border-black px-2 py-1 text-xs"
                                                                                value={mapping?.generic_metric_id || ''}
                                                                                onChange={(e) => mapping && updateMetricMapping(mapping, { generic_metric_id: e.target.value || null })}
                                                                            >
                                                                                <option value="">Map to Generic Metric</option>
                                                                                {genericMetrics.map((g) => (
                                                                                    <option key={g.generic_metric_id} value={g.generic_metric_id}>{g.name}</option>
                                                                                ))}
                                                                            </select>
                                                                            <select
                                                                                className="border-2 border-black px-2 py-1 text-xs"
                                                                                value={kpiMapping?.core_kpi_id || ''}
                                                                                onChange={(e) => kpiMapping && updateKpiMapping(kpiMapping, { core_kpi_id: e.target.value || null })}
                                                                            >
                                                                                <option value="">Map to Core KPI</option>
                                                                                {coreKpis.map((k) => (
                                                                                    <option key={k.core_kpi_id} value={k.core_kpi_id}>{k.display_label || k.name}</option>
                                                                                ))}
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                            {platformMetrics.length === 0 && (
                                                                <div className="text-xs uppercase text-neutral-500">No platform metrics yet.</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {section === 'UTM' && (
                                                    <div className="space-y-4">
                                                        <button onClick={addUtmTemplate} className="px-3 py-1 border-2 border-black font-bold uppercase text-xs">+ Template</button>
                                                        <div className="space-y-2">
                                                            {utmTemplates.map((t) => (
                                                                <div key={t.template_id} className="border-2 border-black p-3 bg-white space-y-2">
                                                                    <div className="grid md:grid-cols-2 gap-2">
                                                                        <input
                                                                            className="border-2 border-black px-2 py-1 text-xs"
                                                                            placeholder="content_type_slug"
                                                                            value={t.content_type_slug || ''}
                                                                            onChange={(e) => updateUtmTemplate(t, { content_type_slug: e.target.value })}
                                                                        />
                                                                        <label className="flex items-center gap-2 text-xs">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={t.is_approved}
                                                                                onChange={(e) => updateUtmTemplate(t, { is_approved: e.target.checked })}
                                                                            />
                                                                            Approved
                                                                        </label>
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-xs uppercase font-bold">Static Params (JSON)</label>
                                                                        <textarea
                                                                            className="w-full border-2 border-black px-2 py-1 font-mono text-xs"
                                                                            rows={3}
                                                                            value={jsonPretty(t.static_params || {})}
                                                                            onChange={(e) => updateUtmTemplate(t, { static_params: safeParse(e.target.value, {}) })}
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-xs uppercase font-bold">Allowed Variables (JSON array)</label>
                                                                        <textarea
                                                                            className="w-full border-2 border-black px-2 py-1 font-mono text-xs"
                                                                            rows={2}
                                                                            value={jsonPretty(t.allowed_variables || [])}
                                                                            onChange={(e) => updateUtmTemplate(t, { allowed_variables: safeParse(e.target.value, []) })}
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-xs uppercase font-bold">Pattern Structure</label>
                                                                        <input
                                                                            className="w-full border-2 border-black px-2 py-1 text-xs"
                                                                            value={t.pattern_structure || ''}
                                                                            onChange={(e) => updateUtmTemplate(t, { pattern_structure: e.target.value })}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            {utmTemplates.length === 0 && (
                                                                <div className="text-xs uppercase text-neutral-500">No UTM templates yet.</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {section === 'Budgets' && (
                                                    <div className="space-y-4">
                                                        <div className="flex gap-2">
                                                            <button onClick={addBudgetMetric} className="px-3 py-1 border-2 border-black font-bold uppercase text-xs">+ Budget Metric</button>
                                                        </div>
                                                        <div className="space-y-2">
                                                            {budgetMetrics.map((m) => {
                                                                const mapping = budgetMappings.find(bm => bm.budget_metric_id === m.budget_metric_id) || null;
                                                                return (
                                                                    <div key={m.budget_metric_id} className="border-2 border-black p-3 bg-white space-y-2">
                                                                        <div className="flex justify-between items-center">
                                                                            <div className="font-bold uppercase text-xs">{m.name}</div>
                                                                            <button onClick={() => addBudgetMapping(m)} className="px-2 py-1 border-2 border-black text-[10px] uppercase">+ Mapping</button>
                                                                        </div>
                                                                        <div className="grid md:grid-cols-2 gap-2">
                                                                            <select
                                                                                className="border-2 border-black px-2 py-1 text-xs"
                                                                                value={mapping?.generic_metric_id || ''}
                                                                                onChange={(e) => mapping && updateBudgetMapping(mapping, { generic_metric_id: e.target.value || null })}
                                                                            >
                                                                                <option value="">Map to Generic Metric</option>
                                                                                {genericMetrics.map((g) => (
                                                                                    <option key={g.generic_metric_id} value={g.generic_metric_id}>{g.name}</option>
                                                                                ))}
                                                                            </select>
                                                                            <select
                                                                                className="border-2 border-black px-2 py-1 text-xs"
                                                                                value={mapping?.core_kpi_id || ''}
                                                                                onChange={(e) => mapping && updateBudgetMapping(mapping, { core_kpi_id: e.target.value || null })}
                                                                            >
                                                                                <option value="">Map to Core KPI</option>
                                                                                {coreKpis.map((k) => (
                                                                                    <option key={k.core_kpi_id} value={k.core_kpi_id}>{k.display_label || k.name}</option>
                                                                                ))}
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                            {budgetMetrics.length === 0 && (
                                                                <div className="text-xs uppercase text-neutral-500">No budget metrics yet.</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {section === 'OAuth / Marketplace' && (
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block text-xs uppercase font-bold">Free Testing Limit</label>
                                                            <input
                                                                className="w-full border-2 border-black px-3 py-2"
                                                                value={oauthReq?.free_testing_limit || ''}
                                                                onChange={(e) => setOauthReq(prev => ({
                                                                    provider_id: selected?.provider_id || '',
                                                                    free_testing_limit: e.target.value,
                                                                    authorization_links: prev?.authorization_links ?? [],
                                                                    functional_summary: prev?.functional_summary || null
                                                                }))}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs uppercase font-bold">Authorization Links (JSON array)</label>
                                                            <textarea
                                                                className="w-full border-2 border-black px-3 py-2 font-mono text-xs"
                                                                rows={3}
                                                                value={jsonPretty(oauthReq?.authorization_links ?? [])}
                                                                onChange={(e) => setOauthReq(prev => ({
                                                                    provider_id: selected?.provider_id || '',
                                                                    free_testing_limit: prev?.free_testing_limit || null,
                                                                    authorization_links: safeParse(e.target.value, []),
                                                                    functional_summary: prev?.functional_summary || null
                                                                }))}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs uppercase font-bold">Functional Summary</label>
                                                            <textarea
                                                                className="w-full border-2 border-black px-3 py-2"
                                                                rows={3}
                                                                value={oauthReq?.functional_summary || ''}
                                                                onChange={(e) => setOauthReq(prev => ({
                                                                    provider_id: selected?.provider_id || '',
                                                                    free_testing_limit: prev?.free_testing_limit || null,
                                                                    authorization_links: prev?.authorization_links ?? [],
                                                                    functional_summary: e.target.value
                                                                }))}
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={saveOauth}
                                                            className="px-4 py-2 border-2 border-black font-bold uppercase hover:bg-black hover:text-white"
                                                        >
                                                            Save OAuth / Marketplace
                                                        </button>
                                                    </div>
                                                )}

                                                {section === 'BYOK' && (
                                                    <div className="space-y-2">
                                                        <label className="flex items-center gap-2 text-xs uppercase">
                                                            <input
                                                                type="checkbox"
                                                                checked={authMode?.oauth_only || false}
                                                                onChange={(e) => saveAuthMode({ oauth_only: e.target.checked })}
                                                            />
                                                            OAuth Only
                                                        </label>
                                                        <label className="flex items-center gap-2 text-xs uppercase">
                                                            <input
                                                                type="checkbox"
                                                                checked={authMode?.byok_only || false}
                                                                onChange={(e) => saveAuthMode({ byok_only: e.target.checked })}
                                                            />
                                                            BYOK Only
                                                        </label>
                                                        <label className="flex items-center gap-2 text-xs uppercase">
                                                            <input
                                                                type="checkbox"
                                                                checked={authMode?.oauth_and_byok || false}
                                                                onChange={(e) => saveAuthMode({ oauth_and_byok: e.target.checked })}
                                                            />
                                                            OAuth + BYOK
                                                        </label>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
