"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { PlatformMetric, CoreKpi, KpiMapping } from '../types';

interface KpiMapperProps {
    providerId: string;
}

export const KpiMapper: React.FC<KpiMapperProps> = ({ providerId }) => {
    const supabase = createClient();
    const [metrics, setMetrics] = useState<PlatformMetric[]>([]);
    const [kpis, setKpis] = useState<CoreKpi[]>([]);
    const [mappings, setMappings] = useState<KpiMapping[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const loadData = useCallback(async () => {
        const [metricRes, kpiRes, mapRes] = await Promise.all([
            supabase.from('platform_metrics').select('*').eq('provider_id', providerId).order('metric_name', { ascending: true }),
            supabase.from('core_kpis').select('*').order('name', { ascending: true }),
            supabase.from('kpi_mappings').select('*').eq('provider_id', providerId)
        ]);

        setMetrics((metricRes.data as PlatformMetric[]) || []);
        setKpis((kpiRes.data as CoreKpi[]) || []);
        setMappings((mapRes.data as KpiMapping[]) || []);
    }, [providerId, supabase]);

    useEffect(() => {
        if (providerId) {
            loadData();
        }
    }, [providerId, loadData]);

    const addMetric = async () => {
        const metric_name = prompt('Platform metric name (e.g., views, impressions)');
        if (!metric_name) return;
        const description = prompt('Description') || null;
        await supabase.from('platform_metrics').insert({
            provider_id: providerId,
            metric_name,
            description
        });
        loadData();
    };

    const addCoreKpi = async () => {
        const name = prompt('Core KPI slug (e.g., spend, impressions)');
        if (!name) return;
        const display_label = prompt('Display label') || null;
        await supabase.from('core_kpis').insert({ name, display_label });
        loadData();
    };

    const updateMapping = async (metricId: string, coreKpiId: string | null) => {
        if (!coreKpiId) {
            // Delete mapping if set to null
            await supabase.from('kpi_mappings').delete().eq('provider_id', providerId).eq('metric_id', metricId);
        } else {
            // Upsert mapping
            const existing = mappings.find(m => m.metric_id === metricId);

            if (existing) {
                 await supabase.from('kpi_mappings').update({
                    core_kpi_id: coreKpiId,
                    is_approved: false // Reset approval on change
                 }).eq('mapping_id', existing.mapping_id);
            } else {
                 await supabase.from('kpi_mappings').insert({
                    provider_id: providerId,
                    metric_id: metricId,
                    core_kpi_id: coreKpiId,
                    is_approved: false
                 });
            }
        }
        loadData();
    };

    return (
        <div className="border-2 border-black">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center px-4 py-3 bg-white uppercase font-black tracking-tight text-lg hover:bg-neutral-50"
            >
                <span>KPI Mapper</span>
                <span>{isOpen ? '[-]' : '[+]'}</span>
            </button>

            {isOpen && (
                <div className="px-4 py-4 text-sm border-t-2 border-black bg-neutral-50 space-y-4">
                    <div className="flex gap-2">
                        <button onClick={addMetric} className="px-3 py-1 border-2 border-black font-bold uppercase text-xs hover:bg-black hover:text-white transition-colors">+ Platform Metric</button>
                        <button onClick={addCoreKpi} className="px-3 py-1 border-2 border-black font-bold uppercase text-xs hover:bg-black hover:text-white transition-colors">+ Core KPI</button>
                    </div>

                    <div className="space-y-2">
                        {metrics.map((m) => {
                            const mapping = mappings.find(map => map.metric_id === m.metric_id);
                            return (
                                <div key={m.metric_id} className="border-2 border-black p-3 bg-white flex flex-col md:flex-row gap-4 items-center justify-between">
                                    <div className="flex-1">
                                        <div className="font-bold uppercase text-xs">{m.metric_name}</div>
                                        <div className="text-[10px] text-neutral-500">{m.description || 'No description'}</div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">➔</span>
                                    </div>

                                    <div className="flex-1 w-full md:w-auto">
                                        <select
                                            className="w-full border-2 border-black px-2 py-2 text-xs bg-white font-mono uppercase"
                                            value={mapping?.core_kpi_id || ''}
                                            onChange={(e) => updateMapping(m.metric_id, e.target.value || null)}
                                        >
                                            <option value="">-- UNMAPPED --</option>
                                            {kpis.map((k) => (
                                                <option key={k.core_kpi_id} value={k.core_kpi_id}>
                                                    {k.display_label || k.name} ({k.name})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="w-8 flex justify-center">
                                        {mapping && (
                                            <div title={mapping.is_approved ? "Approved" : "Pending Approval"}>
                                                {mapping.is_approved ? '✅' : '⚠️'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        {metrics.length === 0 && (
                             <div className="text-xs uppercase text-neutral-500 italic">No platform metrics defined.</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
