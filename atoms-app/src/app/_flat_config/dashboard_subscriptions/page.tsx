"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

const ROW_1 = [
    { id: 'agent-flows', label: 'AGENTFLOWS', desc: 'HEAVY • MID • LITE flows priced in SNAX', path: '/dashboard/subscriptions/agentflows' },
    { id: 'agent-gains', label: 'AGENT GAINS', desc: 'Developer muscle usage with external agents' },
    { id: 'flow-stax', label: 'FLOW STAX', desc: 'Stacked flow bundles + negotiated discounts' }
];

const ROW_2 = [
    { id: 'exchange-rates', label: 'EXCHANGE RATES', desc: 'SNAX price calibration vs COGS' },
    { id: 'snax-pax', label: 'SNAX PAX', desc: 'Credit bundles (SNAX) for usage' }
];

export default function SubscriptionsHub() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4 md:p-12 font-sans text-black">
            <div className="w-full max-w-6xl min-h-[70vh] bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col relative">
                <header className="p-12 border-b-4 border-black bg-neutral-50 text-center">
                    <h1 className="text-6xl font-black uppercase tracking-tighter mb-2">SUBSCRIPTIONS</h1>
                    <p className="font-mono text-sm uppercase tracking-widest opacity-60">Agent SNAX • Packages • Exchange</p>
                </header>

                <div className="flex-1 p-12 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {ROW_1.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => item.path && router.push(item.path)}
                                className="border-4 border-black p-8 text-left hover:bg-black hover:text-white transition-all group"
                            >
                                <h2 className="text-2xl font-black uppercase mb-3 group-hover:translate-x-2 transition-transform">
                                    {item.label}
                                </h2>
                                <p className="font-mono text-xs uppercase tracking-widest opacity-70">
                                    {item.desc}
                                </p>
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {ROW_2.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {}}
                                className="border-4 border-black p-8 text-left hover:bg-black hover:text-white transition-all group"
                            >
                                <h2 className="text-2xl font-black uppercase mb-3 group-hover:translate-x-2 transition-transform">
                                    {item.label}
                                </h2>
                                <p className="font-mono text-xs uppercase tracking-widest opacity-70">
                                    {item.desc}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-8 border-t-4 border-black bg-white flex justify-between">
                    <button onClick={() => router.push('/dashboard')} className="font-bold uppercase tracking-widest hover:underline">
                        ← Main Dashboard
                    </button>
                    <button onClick={() => router.push('/dashboard/cogs')} className="font-bold uppercase tracking-widest hover:underline text-xs opacity-60">
                        COGS →
                    </button>
                </div>
            </div>
        </div>
    );
}
