"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

type ModelUsage = {
    model_id: string;
    provider_id: string;
    official_id?: string | null;
    input_tokens: number;
    output_tokens: number;
    requests: number;
    cost_gbp: number;
    cost_no_free_gbp: number;
};

type ModelProviderSummary = {
    id: string;
    label: string;
    currency: string;
    mtd_cost_gbp: number;
    mtd_cost_no_free_gbp: number;
    models: ModelUsage[];
};

type ModelBudgetSummary = {
    as_of: string;
    fx_rate: number;
    fx_source: string;
    providers: ModelProviderSummary[];
};

const money = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "TBD";
    return `£${value.toFixed(2)}`;
};

export default function ModelProviderDetail() {
    const router = useRouter();
    const params = useParams();
    const providerId = String(params?.provider || '');
    const [summary, setSummary] = useState<ModelBudgetSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/god/model-cogs', { cache: 'no-store' });
                if (!res.ok) {
                    setError(await res.text());
                    return;
                }
                const data = await res.json();
                setSummary(data);
            } catch (err) {
                setError(String(err));
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const provider = summary?.providers.find((p) => p.id === providerId);

    return (
        <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4 md:p-12 font-sans text-black">
            <div className="w-full max-w-6xl min-h-[80vh] bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col relative">
                <header className="p-12 border-b-4 border-black bg-indigo-50 flex justify-between items-center">
                    <div>
                        <h1 className="text-5xl font-black uppercase tracking-tighter mb-2">{provider?.label || providerId}</h1>
                        <p className="font-mono text-sm uppercase tracking-widest opacity-60">Model Provider Breakdown</p>
                    </div>
                    {provider && (
                        <div className="text-right">
                            <div className="text-sm font-bold uppercase opacity-50">MTD Cost</div>
                            <div className="text-4xl font-black text-indigo-700">
                                {money(provider.mtd_cost_gbp)}
                            </div>
                            <div className="text-xs font-mono opacity-50 mt-2">
                                No‑credit: {money(provider.mtd_cost_no_free_gbp)}
                            </div>
                        </div>
                    )}
                </header>

                <div className="flex-1 p-12 overflow-x-auto">
                    {loading && <div className="font-mono text-xs opacity-60">Loading provider…</div>}
                    {error && <div className="font-mono text-xs text-red-600">Error: {error}</div>}

                    {provider && (
                        <table className="w-full border-4 border-black text-left border-collapse text-xs font-mono">
                            <thead>
                                <tr className="bg-black text-white uppercase text-[10px]">
                                    <th className="p-3 border-r border-white/20">Model</th>
                                    <th className="p-3 border-r border-white/20">Official ID</th>
                                    <th className="p-3 border-r border-white/20">Input Tokens</th>
                                    <th className="p-3 border-r border-white/20">Output Tokens</th>
                                    <th className="p-3 border-r border-white/20">Calls</th>
                                    <th className="p-3 border-r border-white/20">£ Cost</th>
                                    <th className="p-3">£ Cost (No Credits)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {provider.models.map((model, idx) => (
                                    <tr key={model.model_id} className={idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}>
                                        <td className="p-3 border-r border-black font-bold">{model.model_id}</td>
                                        <td className="p-3 border-r border-black">{model.official_id || '—'}</td>
                                        <td className="p-3 border-r border-black">{model.input_tokens.toLocaleString()}</td>
                                        <td className="p-3 border-r border-black">{model.output_tokens.toLocaleString()}</td>
                                        <td className="p-3 border-r border-black">{model.requests.toLocaleString()}</td>
                                        <td className="p-3 border-r border-black">{money(model.cost_gbp)}</td>
                                        <td className="p-3">{money(model.cost_no_free_gbp)}</td>
                                    </tr>
                                ))}
                                {provider.models.length === 0 && (
                                    <tr>
                                        <td className="p-4 text-center opacity-50" colSpan={7}>No model usage recorded yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="p-8 border-t-4 border-black bg-white flex justify-between">
                    <button onClick={() => router.push('/dashboard/models/cost')} className="font-bold uppercase tracking-widest hover:underline">
                        ← Back to Model COGS
                    </button>
                    <button onClick={() => router.push('/dashboard/infra/cost')} className="font-bold uppercase tracking-widest hover:underline text-xs opacity-60">
                        Infra COGS →
                    </button>
                </div>
            </div>
        </div>
    );
}
