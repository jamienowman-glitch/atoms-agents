"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type UsageMetric = {
    label: string;
    value: number;
    unit?: string | null;
};

type ProviderSummary = {
    id: string;
    label: string;
    configured: boolean;
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
    breakdown_available: boolean;
    notes: string[];
};

type BudgetSummary = {
    as_of: string;
    currency: string;
    fx_rate: number;
    fx_source: string;
    ltd_revenue_gbp: number | null;
    ltd_discounts_gbp: number | null;
    ltd_cogs_gbp: number | null;
    ltd_cogs_no_free_gbp: number | null;
    ltd_gross_profit_gbp: number | null;
    ltd_gross_margin_pct: number | null;
    ltd_gross_profit_no_free_gbp: number | null;
    ltd_gross_margin_no_free_pct: number | null;
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

export default function CostDashboard() {
    const router = useRouter();
    const [summary, setSummary] = useState<BudgetSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/god/cogs', { cache: 'no-store' });
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

    const totalMtd = summary?.providers.reduce((acc, p) => acc + (p.mtd_cost_gbp || 0), 0) || 0;

    return (
        <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4 md:p-12 font-sans text-black">
            <div className="w-full max-w-7xl min-h-[90vh] bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col relative">

                {/* HEAD */}
                <header className="p-10 border-b-4 border-black bg-emerald-50 flex flex-col items-center text-center gap-3">
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">LIVE COST (COGS)</h1>
                    <p className="font-mono text-xs md:text-sm uppercase tracking-widest opacity-60">MTD Spend • Free Tier Tracking • Unit Economics</p>
                    {summary && (
                        <div className="text-[10px] md:text-xs font-mono opacity-50">
                            FX: {summary.fx_rate} ({summary.fx_source}) • {summary.as_of}
                        </div>
                    )}
                    <button
                        onClick={() => router.push('/dashboard/models/cost')}
                        className="font-bold uppercase tracking-widest hover:underline text-[10px] md:text-xs"
                    >
                        View Model COGS →
                    </button>
                </header>

                <div className="flex-1 p-12 overflow-x-auto space-y-8">
                    <div className="border-4 border-black bg-white p-6">
                        <div className="text-xs font-black uppercase tracking-widest mb-4 text-center">COGS SUMMARY</div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                            <div className="border-2 border-black p-4">
                                <div className="text-[10px] uppercase opacity-60 mb-2">MTD Cost (With Free Tier)</div>
                                <div className="text-2xl font-black">{money(totalMtd)}</div>
                            </div>
                            <div className="border-2 border-black p-4">
                                <div className="text-[10px] uppercase opacity-60 mb-2">MTD Cost (No Free Tier)</div>
                                <div className="text-2xl font-black">{money(summary?.providers.reduce((acc, p) => acc + (p.mtd_cost_no_free_gbp || 0), 0) || 0)}</div>
                            </div>
                            <div className="border-2 border-black p-4">
                                <div className="text-[10px] uppercase opacity-60 mb-2">Launch-to-Date Turnover</div>
                                <div className="text-2xl font-black">{money(summary?.ltd_revenue_gbp)}</div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mt-4">
                            <div className="border-2 border-black p-4">
                                <div className="text-[10px] uppercase opacity-60 mb-2">LTD Gross Profit (With Free Tier)</div>
                                <div className="text-2xl font-black">{money(summary?.ltd_gross_profit_gbp)}</div>
                                <div className="text-[10px] opacity-60 mt-1">{pct(summary?.ltd_gross_margin_pct)}</div>
                            </div>
                            <div className="border-2 border-black p-4">
                                <div className="text-[10px] uppercase opacity-60 mb-2">LTD Gross Profit (No Free Tier)</div>
                                <div className="text-2xl font-black">{money(summary?.ltd_gross_profit_no_free_gbp)}</div>
                                <div className="text-[10px] opacity-60 mt-1">{pct(summary?.ltd_gross_margin_no_free_pct)}</div>
                            </div>
                            <div className="border-2 border-black p-4">
                                <div className="text-[10px] uppercase opacity-60 mb-2">Discounts (LTD)</div>
                                <div className="text-2xl font-black">{money(summary?.ltd_discounts_gbp)}</div>
                            </div>
                        </div>
                    </div>
                    <div className="border-4 border-black bg-yellow-50 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                        <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-widest mb-2">Action Needed • Azure Billing</div>
                                <p className="font-mono text-xs leading-relaxed">
                                    Azure billing access is paused because the subscription is disabled. Re‑enable the subscription in the Azure Portal,
                                    then run the CLI blocks below and paste the JSON output into the plan note so we can wire live spend.
                                </p>
                            </div>
                            <button
                                onClick={() => router.push('/dashboard/infra/free-tiers/azure')}
                                className="font-bold uppercase tracking-widest hover:underline text-[10px]"
                            >
                                View Azure Free Tier →
                            </button>
                        </div>
                        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="border-2 border-black bg-white p-4">
                                <div className="text-[10px] font-bold uppercase mb-2">Step 1: Set Subscription</div>
                                <pre className="font-mono text-[10px] whitespace-pre-wrap">
{`az account set --subscription 64cce95c-7395-41e4-87c4-0141783036b9`}
                                </pre>
                            </div>
                            <div className="border-2 border-black bg-white p-4">
                                <div className="text-[10px] font-bold uppercase mb-2">Step 2: Create Billing SP</div>
                                <pre className="font-mono text-[10px] whitespace-pre-wrap">
{`az ad sp create-for-rbac \\
  --name "northstar-billing" \\
  --role "Cost Management Reader" \\
  --scopes /subscriptions/64cce95c-7395-41e4-87c4-0141783036b9`}
                                </pre>
                            </div>
                        </div>
                        <div className="mt-4 text-[10px] font-mono opacity-70">
                            Paste the JSON output into `docs/plans/2026-01-27_azure-billing-reenable.md`.
                        </div>
                    </div>
                    {loading && <div className="font-mono text-xs opacity-60">Loading live spend…</div>}
                    {error && <div className="font-mono text-xs text-red-600">Error: {error}</div>}

                    {summary?.providers.map((provider) => (
                        <div key={provider.id} className="border-4 border-black bg-white">
                            <div className="flex justify-between items-center p-6 border-b-4 border-black">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-3xl font-black uppercase">{provider.label}</h2>
                                    <span className={`text-xs font-bold px-2 py-1 border border-black ${provider.configured ? 'bg-emerald-300' : 'bg-red-300'}`}>
                                        {provider.configured ? 'CONNECTED' : 'MISSING KEYS'}
                                    </span>
                                </div>
                                {provider.id === 'gcp' && provider.breakdown_available && (
                                    <button
                                        onClick={() => router.push('/dashboard/infra/cost/gcp')}
                                        className="font-bold uppercase tracking-widest hover:underline text-xs"
                                    >
                                        View GCP Breakdown →
                                    </button>
                                )}
                            </div>

                            {/* ROW 1 */}
                            <div className="grid grid-cols-1 md:grid-cols-3 border-b-2 border-black">
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

                            {/* ROW 2 */}
                            <div className="grid grid-cols-1 md:grid-cols-3 border-b-2 border-black">
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

                            {/* ROW 3 */}
                            <div className="grid grid-cols-1 md:grid-cols-3 border-b-2 border-black">
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

                            {/* ROW 4 */}
                            <div className="grid grid-cols-1 md:grid-cols-3">
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

                            {provider.notes?.length > 0 && (
                                <div className="p-4 border-t-2 border-black bg-neutral-50 text-xs font-mono opacity-70">
                                    {provider.notes.join(' • ')}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* FOOTER */}
                <div className="p-8 border-t-4 border-black bg-white flex justify-between">
                    <button onClick={() => router.push('/dashboard/infra')} className="font-bold uppercase tracking-widest hover:underline">
                        ← Back to Infrastructure
                    </button>
                    <button onClick={() => router.push('/dashboard/infra/free-tiers')} className="font-bold uppercase tracking-widest hover:underline text-xs opacity-50">
                        View Free Tier Registry
                    </button>
                </div>
            </div>
        </div>
    );
}
