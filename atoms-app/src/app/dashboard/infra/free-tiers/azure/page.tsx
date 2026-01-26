"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

const FREE_TIER_DATA = [
    {
        product: "Container Apps",
        limit: "180k vCPU-seconds\n360k GiB-seconds\n2 Million Requests",
        risk: "HIGH",
        risk_desc: "Identical to Cloud Run. Scale Risk.",
        mitigation: "Set max replicas = 1"
    },
    {
        product: "Speech to Text",
        limit: "5 Audio Hours / month",
        risk: "LOW",
        risk_desc: "Hard limit stops service",
        mitigation: "Backup for Muscle (Whisper)"
    },
    {
        product: "Language (Text Analytics)",
        limit: "5,000 text records / month",
        risk: "LOW",
        risk_desc: "Good for lightweight sentiment",
        mitigation: "Use for Sentiment Analysis (Leads)"
    },
    {
        product: "Cosmos DB (NoSQL)",
        limit: "1000 RU/s + 25GB Storage",
        risk: "MED",
        risk_desc: "Throughput throttling",
        mitigation: "Alternative to Firestore/Supabase"
    },
    {
        product: "Blob Storage",
        limit: "5 GB LRS Hot Block (12 Months)",
        risk: "LOW",
        risk_desc: "Not 'Always Free'",
        mitigation: "Use for backup, not primary"
    },
    {
        product: "Functions",
        limit: "1 Million Requests / month",
        risk: "MED",
        risk_desc: "High volume event trigger risk",
        mitigation: "Use for Async Jobs"
    },
    {
        product: "Active Directory B2C",
        limit: "50,000 MAU",
        risk: "LOW",
        risk_desc: "Generous identity tier",
        mitigation: "Backup Auth provider"
    },
    {
        product: "DevOps",
        limit: "5 Users + Unlimited Private Repos",
        risk: "NONE",
        risk_desc: "Great for private backup repos",
        mitigation: "Mirror GitHub/GitLab here"
    },
    {
        product: "Virtual Machines (Linux)",
        limit: "750 Hours B1s (12 Months)",
        risk: "LOW",
        risk_desc: "Standard VM, not powerful",
        mitigation: "Sentinel / Cron Server"
    }
];

export default function AzureFreeTiers() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4 md:p-12 font-sans text-black">
            <div className="w-full max-w-6xl min-h-[80vh] bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col relative">

                {/* HEAD */}
                <header className="p-12 border-b-4 border-black bg-blue-50 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            {/* Azure Logic Logo Placeholder */}
                            <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">A</div>
                            <h1 className="text-4xl font-black uppercase tracking-tighter text-blue-900">Azure Free Tier</h1>
                        </div>
                        <p className="font-mono text-sm uppercase tracking-widest opacity-60">Failover Strategy • Microsoft Cloud</p>
                    </div>
                </header>

                <div className="flex-1 p-12 overflow-x-auto">
                    <table className="w-full border-4 border-black text-left border-collapse">
                        <thead>
                            <tr className="bg-blue-900 text-white uppercase text-sm font-bold tracking-wider">
                                <th className="p-4 border-r-2 border-white/20">Product</th>
                                <th className="p-4 border-r-2 border-white/20 w-1/3">Free Limit</th>
                                <th className="p-4 border-r-2 border-white/20">Risk Level</th>
                                <th className="p-4 border-r-2 border-white/20">Strategy</th>
                                <th className="p-4">Mitigation</th>
                            </tr>
                        </thead>
                        <tbody className="font-mono text-sm">
                            {FREE_TIER_DATA.map((row, i) => (
                                <tr key={row.product} className={`border-b-2 border-black ${i % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100 transition-colors`}>
                                    <td className="p-4 border-r-2 border-black font-bold uppercase">{row.product}</td>
                                    <td className="p-4 border-r-2 border-black whitespace-pre-line">{row.limit}</td>
                                    <td className="p-4 border-r-2 border-black">
                                        <span className={`px-2 py-1 font-bold text-xs border border-black ${row.risk === 'HIGH' ? 'bg-red-500 text-white' :
                                                row.risk === 'MED' ? 'bg-yellow-400 text-black' :
                                                    'bg-green-400 text-black'
                                            }`}>
                                            {row.risk}
                                        </span>
                                    </td>
                                    <td className="p-4 border-r-2 border-black text-xs opacity-80">{row.risk_desc}</td>
                                    <td className="p-4 text-xs font-bold text-blue-800">{row.mitigation}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* FOOTER NOTE */}
                    <div className="mt-8 p-4 border-2 border-black bg-neutral-100 text-xs font-mono opacity-60">
                        * Data sourced from Azure Free Account documentation. "Always Free" vs "12 Months" noted where critical.
                    </div>
                </div>

                {/* FOOTER */}
                <div className="p-8 border-t-4 border-black bg-white flex justify-between">
                    <button onClick={() => router.push('/dashboard/infra/free-tiers')} className="font-bold uppercase tracking-widest hover:underline">
                        ← Back to Registry
                    </button>
                    <button onClick={() => window.open('https://azure.microsoft.com/en-gb/free/', '_blank')} className="font-bold uppercase tracking-widest hover:underline text-xs opacity-50">
                        Verify on Azure ↗
                    </button>
                </div>
            </div>
        </div>
    );
}
