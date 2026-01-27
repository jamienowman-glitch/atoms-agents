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

export default function GcpCostBreakdown() {
    const router = useRouter();
    const [data, setData] = useState<BreakdownResponse | null>(null);
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

                <div className="flex-1 p-12 overflow-x-auto">
                    {loading && <div className="font-mono text-xs opacity-60">Loading breakdown…</div>}
                    {error && <div className="font-mono text-xs text-red-600">Error: {error}</div>}

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
