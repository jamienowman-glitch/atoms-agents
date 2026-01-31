"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

const FREE_TIER_DATA = [
    // SUPABASE
    {
        provider: "Supabase",
        product: "Postgres Database",
        limit: "500 MB Storage",
        risk: "MED",
        risk_desc: "Pauses after 7 days inactivity",
        mitigation: "Use Upgrade ($25) for Prod",
        link: "https://supabase.com/pricing"
    },
    {
        provider: "Supabase",
        product: "Auth (MAU)",
        limit: "50,000 Monthly Active Users",
        risk: "LOW",
        risk_desc: "Generous limit",
        mitigation: "Cleaner user data"
    },
    {
        provider: "Supabase",
        product: "Storage",
        limit: "1 GB File Storage",
        risk: "MED",
        risk_desc: "Fill up quickly with 4K video",
        mitigation: "Use S3/R2 for heavy media"
    },

    // RESEND
    {
        provider: "Resend",
        product: "Transactional Email",
        limit: "3,000 Emails / Month\n100 Emails / Day",
        risk: "HIGH",
        risk_desc: "Daily limit (100) is tight",
        mitigation: "Batch notifications / Upgrade",
        link: "https://resend.com/pricing"
    },

    // CLOUDFLARE
    {
        provider: "Cloudflare",
        product: "R2 Storage",
        limit: "10 GB Storage / Month\nZero Egress Fees",
        risk: "LOW",
        risk_desc: "Ideal for public assets",
        mitigation: "Primary CDN Strategy",
        link: "https://developers.cloudflare.com/r2/pricing/"
    },
    {
        provider: "Cloudflare",
        product: "Workers",
        limit: "100,000 Requests / Day",
        risk: "LOW",
        risk_desc: "Great for edge logic",
        mitigation: "Keep logic simple",
        link: "https://developers.cloudflare.com/workers/platform/pricing/"
    },
    {
        provider: "Cloudflare",
        product: "Pages",
        limit: "500 Builds / Month\nunlimited bandwidth",
        risk: "LOW",
        risk_desc: "Static site hosting",
        mitigation: "Use for Landing Pages",
        link: "https://developers.cloudflare.com/pages/platform/limits/"
    }
];

export default function SaasFreeTiers() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4 md:p-12 font-sans text-black">
            <div className="w-full max-w-6xl min-h-[80vh] bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col relative">

                {/* HEAD */}
                <header className="p-12 border-b-4 border-black bg-emerald-50 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="text-4xl">⚡️</div>
                            <h1 className="text-4xl font-black uppercase tracking-tighter text-emerald-900">The Modern Stack</h1>
                        </div>
                        <p className="font-mono text-sm uppercase tracking-widest opacity-60">Supabase • Resend • Cloudflare</p>
                    </div>
                </header>

                <div className="flex-1 p-12 overflow-x-auto">
                    <table className="w-full border-4 border-black text-left border-collapse">
                        <thead>
                            <tr className="bg-emerald-900 text-white uppercase text-sm font-bold tracking-wider">
                                <th className="p-4 border-r-2 border-white/20">Provider</th>
                                <th className="p-4 border-r-2 border-white/20">Product</th>
                                <th className="p-4 border-r-2 border-white/20 w-1/4">Free Limit</th>
                                <th className="p-4 border-r-2 border-white/20">Risk Level</th>
                                <th className="p-4 border-r-2 border-white/20">Risk Description</th>
                                <th className="p-4">Mitigation</th>
                            </tr>
                        </thead>
                        <tbody className="font-mono text-sm">
                            {FREE_TIER_DATA.map((row, i) => (
                                <tr key={row.product + row.provider} className={`border-b-2 border-black ${i % 2 === 0 ? 'bg-white' : 'bg-emerald-50'} hover:bg-emerald-100 transition-colors`}>
                                    <td className="p-4 border-r-2 border-black font-bold uppercase">{row.provider}</td>
                                    <td className="p-4 border-r-2 border-black font-bold">{row.product}</td>
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
                                    <td className="p-4 text-xs font-bold text-emerald-900">{row.mitigation}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* FOOTER NOTE */}
                    <div className="mt-8 p-4 border-2 border-black bg-neutral-100 text-xs font-mono opacity-60">
                        * Data verified 2026. &quot;Inactivity Pause&quot; on Supabase is critical for Prototype tier.
                        <div className="mt-2 font-bold">
                            &quot;Free Tier&quot; usually means limited usage forever. &quot;Trial&quot; means limited time.
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="p-8 border-t-4 border-black bg-white flex justify-between">
                    <button onClick={() => router.push('/dashboard/infra/free-tiers')} className="font-bold uppercase tracking-widest hover:underline">
                        ← Back to Registry
                    </button>
                    <div className="space-x-4">
                        <button onClick={() => window.open('https://supabase.com/pricing', '_blank')} className="font-bold uppercase tracking-widest hover:underline text-xs opacity-50">
                            Supabase ↗
                        </button>
                        <button onClick={() => window.open('https://resend.com/pricing', '_blank')} className="font-bold uppercase tracking-widest hover:underline text-xs opacity-50">
                            Resend ↗
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
