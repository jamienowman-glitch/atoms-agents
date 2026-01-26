"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PRICE_CARD, calculateShadowCost, getUtilization } from '@/lib/pricing';

// MOCK DATA HARVESTER (Until we connect to Budget Engine)
const MOCK_USAGE = {
    'gcp_cloud_run_req': 45032, // 45k requests
    'gcp_cloud_run_cpu': 12000, // 12k vCPU seconds
    'sb_db_storage': 125,       // 125 MB
    'sb_auth_mau': 12           // 12 Users
};

export default function CostDashboard() {
    const router = useRouter();
    const [usageData, setUsageData] = useState<any>(MOCK_USAGE);
    const [loading, setLoading] = useState(false);

    // Calculate Totals
    const totalShadowCost = PRICE_CARD.reduce((acc, item) => {
        return acc + calculateShadowCost(item.id, usageData[item.id] || 0);
    }, 0);

    return (
        <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4 md:p-12 font-sans text-black">
            <div className="w-full max-w-6xl min-h-[90vh] bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col relative">

                {/* HEAD */}
                <header className="p-12 border-b-4 border-black bg-emerald-50 flex justify-between items-center">
                    <div>
                        <h1 className="text-6xl font-black uppercase tracking-tighter mb-2">LIVE COST</h1>
                        <p className="font-mono text-sm uppercase tracking-widest opacity-60">Shadow Billing • Unit Economics • Forecasting</p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-bold uppercase opacity-50">Month to Date (Shadow)</div>
                        <div className="text-5xl font-black text-emerald-600">
                            ${totalShadowCost.toFixed(4)}
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-12 overflow-x-auto">

                    {/* USAGE TABLE */}
                    <table className="w-full border-4 border-black text-left border-collapse mb-12">
                        <thead>
                            <tr className="bg-black text-white uppercase text-sm font-bold tracking-wider">
                                <th className="p-4 border-r-2 border-white/20">Service</th>
                                <th className="p-4 border-r-2 border-white/20">Usage</th>
                                <th className="p-4 border-r-2 border-white/20 w-1/3">Free Tier Utilization</th>
                                <th className="p-4 border-r-2 border-white/20">Shadow Cost</th>
                            </tr>
                        </thead>
                        <tbody className="font-mono text-sm">
                            {PRICE_CARD.map((item, i) => {
                                const usage = usageData[item.id] || 0;
                                const utilization = getUtilization(item.id, usage);
                                const cost = calculateShadowCost(item.id, usage);
                                const isDanger = utilization > 80;

                                return (
                                    <tr key={item.id} className={`border-b-2 border-black ${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-neutral-100 transition-colors`}>
                                        <td className="p-4 border-r-2 border-black font-bold uppercase">{item.service}</td>
                                        <td className="p-4 border-r-2 border-black">
                                            {usage.toLocaleString()} <span className="opacity-50 text-xs">{item.unit}</span>
                                        </td>
                                        <td className="p-4 border-r-2 border-black">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-4 border-2 border-black bg-white relative">
                                                    <div
                                                        className={`absolute top-0 left-0 h-full ${isDanger ? 'bg-red-500' : 'bg-emerald-500'}`}
                                                        style={{ width: `${Math.min(utilization, 100)}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-bold w-12 text-right">{utilization.toFixed(1)}%</span>
                                            </div>
                                            <div className="text-[10px] opacity-50 mt-1">
                                                Limit: {item.freeLimit.toLocaleString()} {item.unit}
                                            </div>
                                        </td>
                                        <td className="p-4 font-bold">
                                            {cost > 0 ? (
                                                <span className="text-red-600">${cost.toFixed(4)}</span>
                                            ) : (
                                                <span className="text-emerald-600 opacity-50">FREE</span>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>

                    {/* UNIT ECONOMICS (MOCK) */}
                    <h3 className="text-2xl font-black uppercase mb-6">Unit Economics (Last 5 Flows)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((flow) => (
                            <div key={flow} className="border-4 border-black p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                                <div className="flex justify-between mb-4">
                                    <span className="font-bold uppercase text-xs">Run ID</span>
                                    <span className="font-mono text-xs bg-black text-white px-1">r-{Math.random().toString(36).substring(7)}</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="text-xs uppercase opacity-60">Est. Cost</div>
                                        <div className="text-2xl font-black">$0.000{flow * 2}</div>
                                    </div>
                                    <div className="text-xs font-bold text-emerald-600">PROFITABLE</div>
                                </div>
                            </div>
                        ))}
                    </div>

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
