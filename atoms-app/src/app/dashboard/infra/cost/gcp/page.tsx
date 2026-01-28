"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type BreakdownItem = {
    service: string;
    cost_gbp: number;
    usage?: number | null;
    unit?: string | null;
};

type BreakdownResponse = {
    provider: string;
    currency: string;
    fx_rate: number;
    fx_source: string;
    items: BreakdownItem[];
};

type UsageMetric = {
    label: string;
    value: number;
    unit?: string | null;
};

type ProviderSummary = {
    id: string;
    label: string;
    currency: string;
    mtd_cost_gbp: number;
    mtd_cost_no_free_gbp: number;
    mtd_usage: UsageMetric[];
    free_tier_remaining: UsageMetric[];
    avg_per_flow_gbp: number | null;
    ltd_revenue_gbp: number | null;
    ltd_gross_profit_gbp: number | null;
    ltd_gross_margin_pct: number | null;
    ltd_revenue_no_free_gbp: number | null;
    ltd_gross_profit_no_free_gbp: number | null;
    ltd_gross_margin_no_free_pct: number | null;
};

type BudgetSummary = {
    providers: ProviderSummary[];
};

const money = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "TBD";
    return `£${value.toFixed(2)}`;
};

const pct = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "TBD";
    return `${value.toFixed(2)}%`;
};

const usageBlock = (items: UsageMetric[]) => {
    if (!items || items.length === 0) return <span className="opacity-50 text-xs">—</span>;
    return (
        <div className="space-y-1 text-xs font-mono">
            {items.slice(0, 3).map((item) => (
                <div key={item.label} className="flex justify-between gap-2">
                    <span className="uppercase">{item.label}</span>
                    <span>{item.value.toLocaleString()} {item.unit ?? ''}</span>
                </div>
            ))}
        </div>
    );
};

export default function GcpCostBreakdown() {
    const router = useRouter();
    const [data, setData] = useState<BreakdownResponse | null>(null);
    const [summary, setSummary] = useState<BudgetSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/god/cogs/gcp', { cache: 'no-store' });
                if (!res.ok) {
                    setError(await res.text());
                    return;
                }
                const json = await res.json();
                setData(json);
                const summaryRes = await fetch('/api/god/cogs', { cache: 'no-store' });
                if (summaryRes.ok) {
                    const summaryJson = await summaryRes.json();
                    setSummary(summaryJson);
                }
            } catch (err) {
                setError(String(err));
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4 md:p-12 font-sans text-black">
            <div className="w-full max-w-6xl min-h-[80vh] bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col relative">

                {/* HEAD */}
                <header className="p-12 border-b-4 border-black bg-neutral-50 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="text-3xl">☁️</div>
                            <h1 className="text-4xl font-black uppercase tracking-tighter">GCP Cost Breakdown</h1>
                        </div>
                        <p className="font-mono text-sm uppercase tracking-widest opacity-60">Service-Level Spend • Month to Date</p>
                    </div>
                    {data && (
                        <div className="text-right font-mono text-xs opacity-60">
                            FX: {data.fx_rate} ({data.fx_source})
                        </div>
                    )}
                </header>

                <div className="flex-1 p-12 overflow-x-auto space-y-6">
                    {loading && <div className="font-mono text-xs opacity-60">Loading breakdown…</div>}
                    {error && <div className="font-mono text-xs text-red-600">Error: {error}</div>}

                    {summary && (
                        (() => {
                            const provider = summary.providers.find((p) => p.id === 'gcp');
                            if (!provider) return null;
                            return (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-3 border-2 border-black">
                                        <div className="p-4 border-r-2 border-black">
                                            <div className="text-xs font-bold uppercase opacity-60 mb-2">MTD Usage</div>
                                            {usageBlock(provider.mtd_usage)}
                                        </div>
                                        <div className="p-4 border-r-2 border-black">
                                            <div className="text-xs font-bold uppercase opacity-60 mb-2">Free Tier Allowance Left</div>
                                            {usageBlock(provider.free_tier_remaining)}
                                        </div>
                                        <div className="p-4">
                                            <div className="text-xs font-bold uppercase opacity-60 mb-2">Avg / Flow Run (Stub)</div>
                                            <div className="font-mono text-sm">{money(provider.avg_per_flow_gbp)}</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 border-2 border-black">
                                        <div className="p-4 border-r-2 border-black">
                                            <div className="text-xs font-bold uppercase opacity-60 mb-2">£ MTD Cost (With Free Tier)</div>
                                            <div className="text-2xl font-black">{money(provider.mtd_cost_gbp)}</div>
                                        </div>
                                        <div className="p-4 border-r-2 border-black">
                                            <div className="text-xs font-bold uppercase opacity-60 mb-2">£ MTD Cost (No Free Tier)</div>
                                            <div className="text-2xl font-black">{money(provider.mtd_cost_no_free_gbp)}</div>
                                        </div>
                                        <div className="p-4">
                                            <div className="text-xs font-bold uppercase opacity-60 mb-2">Currency</div>
                                            <div className="font-mono text-sm">{provider.currency}</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 border-2 border-black">
                                        <div className="p-4 border-r-2 border-black">
                                            <div className="text-xs font-bold uppercase opacity-60 mb-2">Launch-to-Date Turnover</div>
                                            <div className="text-xl font-black">{money(provider.ltd_revenue_gbp)}</div>
                                        </div>
                                        <div className="p-4 border-r-2 border-black">
                                            <div className="text-xs font-bold uppercase opacity-60 mb-2">Launch-to-Date Gross Profit</div>
                                            <div className="text-xl font-black">{money(provider.ltd_gross_profit_gbp)}</div>
                                        </div>
                                        <div className="p-4">
                                            <div className="text-xs font-bold uppercase opacity-60 mb-2">Launch-to-Date Gross Margin</div>
                                            <div className="text-xl font-black">{pct(provider.ltd_gross_margin_pct)}</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 border-2 border-black">
                                        <div className="p-4 border-r-2 border-black">
                                            <div className="text-xs font-bold uppercase opacity-60 mb-2">LTD Turnover (No Free Tier)</div>
                                            <div className="text-xl font-black">{money(provider.ltd_revenue_no_free_gbp)}</div>
                                        </div>
                                        <div className="p-4 border-r-2 border-black">
                                            <div className="text-xs font-bold uppercase opacity-60 mb-2">LTD Gross Profit (No Free Tier)</div>
                                            <div className="text-xl font-black">{money(provider.ltd_gross_profit_no_free_gbp)}</div>
                                        </div>
                                        <div className="p-4">
                                            <div className="text-xs font-bold uppercase opacity-60 mb-2">LTD Gross Margin (No Free Tier)</div>
                                            <div className="text-xl font-black">{pct(provider.ltd_gross_margin_no_free_pct)}</div>
                                        </div>
                                    </div>
                                </>
                            );
                        })()
                    )}

                    {!loading && data && (
                        <table className="w-full border-4 border-black text-left border-collapse">
                            <thead>
                                <tr className="bg-black text-white uppercase text-sm font-bold tracking-wider">
                                    <th className="p-4 border-r-2 border-white/20">Service</th>
                                    <th className="p-4 border-r-2 border-white/20">Usage</th>
                                    <th className="p-4">Cost (GBP)</th>
                                </tr>
                            </thead>
                            <tbody className="font-mono text-sm">
                                {data.items.map((row, i) => (
                                    <tr key={row.service} className={`border-b-2 border-black ${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-neutral-100 transition-colors`}>
                                        <td className="p-4 border-r-2 border-black font-bold uppercase">{row.service}</td>
                                        <td className="p-4 border-r-2 border-black">
                                            {row.usage !== null && row.usage !== undefined ? row.usage.toLocaleString() : '—'} {row.unit ?? ''}
                                        </td>
                                        <td className="p-4 font-bold">£{row.cost_gbp.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* FOOTER */}
                <div className="p-8 border-t-4 border-black bg-white flex justify-between">
                    <button onClick={() => router.push('/dashboard/infra/cost')} className="font-bold uppercase tracking-widest hover:underline">
                        ← Back to Live Cost
                    </button>
                </div>
            </div>
        </div>
    );
}
