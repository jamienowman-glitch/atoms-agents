"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- Types ---
interface DiscountPolicy {
    id?: string;
    tenant_id: string;
    min_discount_pct: number;
    max_discount_pct: number;
    kpi_ceiling: Record<string, number>;
}

// --- Mock Client (Replace with context/hook in real app) ---
// Ideally use a provided supabase client from context, but for "God" mode we often use client-side instantiation or a hook.
// For this standalone page, assuming standard env vars or passed client.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function DiscountPolicyPage() {
    const [loading, setLoading] = useState(true);
    const [policy, setPolicy] = useState<DiscountPolicy | null>(null);
    const [tenantId, setTenantId] = useState<string | null>(null);

    // KPI State
    const [newKpiSlug, setNewKpiSlug] = useState('');
    const [newKpiFloor, setNewKpiFloor] = useState('0.10');

    // 1. Fetch Tenant & Policy
    useEffect(() => {
        async function load() {
            // Mock Tenant ID fetch (In real app, this comes from auth/context)
            // We'll fetch the first tenant we have access to for now, or assume a fixed one for dev.
            // Let's grab the user's tenant.
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return; // Handle auth redirect

            // Assume mapping or just grab first tenant where user is member
            // Simplified: Just trying to get a policy.
            // For "God Config", maybe we are setting it for a specific tenant?
            // Let's just query the discount_policy table directly if RLS allows listing.

            const { data: policies, error } = await supabase
                .from('discount_policy')
                .select('*')
                .limit(1);

            if (policies && policies.length > 0) {
                setPolicy(policies[0]);
                setTenantId(policies[0].tenant_id);
            } else {
                // Create default or handle empty
                // For now, prompt creation? or just wait.
                // If we don't have a tenant_id, we can't create. 
                // Let's assume we need to seed or select one.
            }
            setLoading(false);
        }
        load();
    }, []);

    const handleSave = async () => {
        if (!policy || !tenantId) return;

        const { error } = await supabase
            .from('discount_policy')
            .upsert({
                id: policy.id, // If exists
                tenant_id: tenantId,
                min_discount_pct: policy.min_discount_pct,
                max_discount_pct: policy.max_discount_pct,
                kpi_ceiling: policy.kpi_ceiling,
                updated_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            alert(`Error saving: ${error.message}`);
        } else {
            alert('Policy Saved');
        }
    };

    const addKpi = () => {
        if (!policy || !newKpiSlug) return;
        const updated = { ...policy.kpi_ceiling, [newKpiSlug]: parseFloat(newKpiFloor) };
        setPolicy({ ...policy, kpi_ceiling: updated });
        setNewKpiSlug('');
    };

    const removeKpi = (slug: string) => {
        if (!policy) return;
        const updated = { ...policy.kpi_ceiling };
        delete updated[slug];
        setPolicy({ ...policy, kpi_ceiling: updated });
    };

    if (loading) return <div className="p-8 text-zinc-400">Loading Policy Engine...</div>;
    if (!policy) return <div className="p-8 text-zinc-400">No Policy Found / Select Tenant</div>;

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8 font-mono">
            <header className="mb-8 border-b border-zinc-800 pb-4">
                <h1 className="text-2xl font-bold uppercase tracking-widest text-emerald-500">
                    Discount Engine <span className="text-zinc-600">// God Config</span>
                </h1>
                <p className="text-zinc-500 text-sm mt-2">
                    Tenant: {policy.tenant_id} | Surface: Global
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* SECTION 1: GLOBAL LIMITS */}
                <section className="bg-zinc-900/50 p-6 border border-zinc-800 rounded-lg">
                    <h2 className="text-lg font-bold text-zinc-300 mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Global Headroom
                    </h2>

                    <div className="space-y-8">
                        {/* Min Discount */}
                        <div>
                            <div className="flex justify-between mb-2 text-sm">
                                <label className="text-zinc-400">Min Discount %</label>
                                <span className="text-blue-400">{(policy.min_discount_pct * 100).toFixed(0)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="1" step="0.01"
                                value={policy.min_discount_pct}
                                onChange={(e) => setPolicy({ ...policy, min_discount_pct: parseFloat(e.target.value) })}
                                className="w-full accent-blue-500 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        {/* Max Discount */}
                        <div>
                            <div className="flex justify-between mb-2 text-sm">
                                <label className="text-zinc-400">Max Discount %</label>
                                <span className="text-red-400">{(policy.max_discount_pct * 100).toFixed(0)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="1" step="0.01"
                                value={policy.max_discount_pct}
                                onChange={(e) => setPolicy({ ...policy, max_discount_pct: parseFloat(e.target.value) })}
                                className="w-full accent-red-500 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        {/* Visualizer */}
                        <div className="mt-8 pt-8 border-t border-zinc-800">
                            <label className="text-xs text-zinc-500 uppercase tracking-wider mb-2 block">Policy Band</label>
                            <div className="relative h-12 bg-zinc-900 rounded border border-zinc-700 overflow-hidden flex items-center">
                                <div
                                    className="absolute bg-zinc-800 h-full border-r border-zinc-700"
                                    style={{ width: `${policy.min_discount_pct * 100}%` }}
                                >
                                    <span className="absolute right-2 top-4 text-xs text-zinc-500">Min</span>
                                </div>
                                <div
                                    className="absolute bg-emerald-900/40 h-full border-x border-emerald-500/50"
                                    style={{
                                        left: `${policy.min_discount_pct * 100}%`,
                                        width: `${(policy.max_discount_pct - policy.min_discount_pct) * 100}%`
                                    }}
                                >
                                    <div className="flex items-center justify-center h-full text-emerald-400 text-xs font-bold tracking-widest">
                                        ALLOWED ZONE
                                    </div>
                                </div>
                                <div
                                    className="absolute bg-red-900/20 h-full border-l border-red-900/50"
                                    style={{ left: `${policy.max_discount_pct * 100}%`, right: 0 }}
                                >
                                    <span className="absolute left-2 top-4 text-xs text-red-900">Prohibited</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 2: KPI GOVERNOR */}
                <section className="bg-zinc-900/50 p-6 border border-zinc-800 rounded-lg">
                    <h2 className="text-lg font-bold text-zinc-300 mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        KPI Governor
                        <span className="text-xs font-normal text-zinc-500 ml-auto bg-zinc-800 px-2 py-0.5 rounded">Ceiling Law</span>
                    </h2>

                    <div className="space-y-4">
                        {Object.entries(policy.kpi_ceiling || {}).map(([slug, floor]) => (
                            <div key={slug} className="flex items-center justify-between bg-zinc-950 p-3 rounded border border-zinc-800 hover:border-zinc-700 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded bg-zinc-900 flex items-center justify-center text-xs text-zinc-500">
                                        #
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-zinc-200">{slug}</div>
                                        <div className="text-xs text-zinc-600">Floor Limit</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-emerald-500">{floor}</div>
                                    </div>
                                    <button
                                        onClick={() => removeKpi(slug)}
                                        className="p-2 hover:text-red-500 text-zinc-600 transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Add New */}
                        <div className="mt-6 p-4 bg-zinc-950/50 border border-dashed border-zinc-800 rounded">
                            <h3 className="text-xs uppercase text-zinc-500 mb-3">Add Governance Rule</h3>
                            <div className="flex gap-2">
                                <input
                                    placeholder="KPI Slug (e.g. mer, profit)"
                                    className="bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-300 w-full"
                                    value={newKpiSlug}
                                    onChange={(e) => setNewKpiSlug(e.target.value)}
                                />
                                <input
                                    type="number" step="0.01"
                                    placeholder="Min Value"
                                    className="bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-300 w-24 text-center"
                                    value={newKpiFloor}
                                    onChange={(e) => setNewKpiFloor(e.target.value)}
                                />
                                <button
                                    onClick={addKpi}
                                    className="font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded text-sm transition-colors border border-zinc-700"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <div className="mt-8 flex justify-end pt-6 border-t border-zinc-800">
                <button
                    onClick={handleSave}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-105 active:scale-95"
                >
                    Save Policy Configuration
                </button>
            </div>
        </div>
    );
}
