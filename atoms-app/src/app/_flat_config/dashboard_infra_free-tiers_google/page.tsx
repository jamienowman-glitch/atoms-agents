"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

const FREE_TIER_DATA = [
    // --- COMPUTE ---
    {
        product: "Cloud Run",
        limit: "2 Million requests/mo\n360k GB-seconds Memory\n180k vCPU-seconds Compute",
        risk: "HIGH",
        risk_desc: "Scale to Infinity (Bill Shock)",
        mitigation: "Set max-instances = 1"
    },
    {
        product: "Agent Engine",
        limit: "180,000 vCPU-seconds (50 hours)\n360,000 GiB-seconds (100 hours)",
        risk: "HIGH",
        risk_desc: "Confusion with Cloud Run (Overlap)",
        mitigation: "Investigate Product Overlap"
    },
    {
        product: "App Engine",
        limit: "28 hours/day F1 instances\n9 hours/day B1 instances\n1 GB outbound data/day",
        risk: "LOW",
        risk_desc: "Standard Environment Only",
        mitigation: "Use for small web apps"
    },
    {
        product: "Compute Engine",
        limit: "1 e2-micro instance (US Regions)\n30GB HDD",
        risk: "LOW",
        risk_desc: "Forgot to stop active instance",
        mitigation: "Use for 'Sentinel' tasks only"
    },
    {
        product: "Cloud Run Functions",
        limit: "2 million invocations/mo\n400k GB-seconds compute",
        risk: "MED",
        risk_desc: "High volume triggers",
        mitigation: "Monitor invocation counts"
    },

    // --- DATA & AI ---
    {
        product: "BigQuery",
        limit: "1 TB Querying/mo\n10 GB Storage",
        risk: "LOW",
        risk_desc: "Streaming inserts can cost $$$",
        mitigation: "Load data in batches"
    },
    {
        product: "Firestore",
        limit: "1 GiB Storage\n50k Reads, 20k Writes/day",
        risk: "MED",
        risk_desc: "Viral reads exceed quota fast",
        mitigation: "Cache frequently read data"
    },
    {
        product: "Cloud Natural Language API",
        limit: "5,000 units per month",
        risk: "LOW",
        risk_desc: "Low limit for production",
        mitigation: "Use local embeddings"
    },
    {
        product: "Cloud Vision",
        limit: "1,000 units per month",
        risk: "HIGH",
        risk_desc: "Extremely low limit",
        mitigation: "Use Muscle (OpenCLIP)"
    },
    {
        product: "Video Intelligence API",
        limit: "1,000 units per month",
        risk: "HIGH",
        risk_desc: "Expensive at scale",
        mitigation: "Use FFmpeg in Muscle"
    },
    {
        product: "Speech-to-Text",
        limit: "60 minutes per month",
        risk: "HIGH",
        risk_desc: "Very strict limit",
        mitigation: "Use Whisper (Local)"
    },

    // --- OPERATIONS & TOOLS ---
    {
        product: "Cloud Build",
        limit: "2,500 build-minutes/mo",
        risk: "LOW",
        risk_desc: "Long queues if exceeded",
        mitigation: "Use efficient Dockerfiles"
    },
    {
        product: "Artifact Registry",
        limit: "0.5 GB Storage/mo",
        risk: "MED",
        risk_desc: "Old images accumulate quickly",
        mitigation: "Run cleanup scripts weekly"
    },
    {
        product: "Cloud Storage",
        limit: "5 GB Standard Storage\n1GB Egress (North America)",
        risk: "LOW",
        risk_desc: "Egress fees for viral content",
        mitigation: "Use Cloudflare R2 for public assets"
    },
    {
        product: "Cloud Logging",
        limit: "50 GB logs/mo",
        risk: "MED",
        risk_desc: "Debug loops fill logs instantly",
        mitigation: "Set log level to INFO/WARN in prod"
    },
    {
        product: "Pub/Sub",
        limit: "10 GiB messages/mo",
        risk: "LOW",
        risk_desc: "High volume events",
        mitigation: "Batch messages"
    },
    {
        product: "Secret Manager",
        limit: "6 active secret versions\n10k access ops/mo",
        risk: "LOW",
        risk_desc: "Access ops can spike",
        mitigation: "Cache secrets in app"
    },
    {
        product: "Cloud Shell",
        limit: "5 GB Persistent Disk",
        risk: "NONE",
        risk_desc: "Dev environment only",
        mitigation: "None"
    },
    {
        product: "Cloud Source Repositories",
        limit: "5 Users\n50 GB Storage",
        risk: "NONE",
        risk_desc: "Private Git hosting",
        mitigation: "Mirror to GitHub"
    }
];

export default function GoogleFreeTiers() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4 md:p-12 font-sans text-black">
            <div className="w-full max-w-6xl min-h-[80vh] bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col relative">

                {/* HEAD */}
                <header className="p-12 border-b-4 border-black bg-neutral-50 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <img src="https://www.gstatic.com/devrel-devsite/prod/v2210075a8a68c5e622ec96a40a5015b3a479d2b2707632906e68067460c6d32/cloud/images/cloud-logo.svg" className="h-10 w-auto grayscale" alt="Google Cloud" />
                            <h1 className="text-4xl font-black uppercase tracking-tighter">Free Tier Limits</h1>
                        </div>
                        <p className="font-mono text-sm uppercase tracking-widest opacity-60">Infrastructure • Cost Control • Risk Register</p>
                    </div>
                </header>

                <div className="flex-1 p-12 overflow-x-auto">
                    <table className="w-full border-4 border-black text-left border-collapse">
                        <thead>
                            <tr className="bg-black text-white uppercase text-sm font-bold tracking-wider">
                                <th className="p-4 border-r-2 border-white/20">Product</th>
                                <th className="p-4 border-r-2 border-white/20 w-1/3">Free Limit (Monthly)</th>
                                <th className="p-4 border-r-2 border-white/20">Risk Level</th>
                                <th className="p-4 border-r-2 border-white/20">Risk Description</th>
                                <th className="p-4">Mitigation</th>
                            </tr>
                        </thead>
                        <tbody className="font-mono text-sm">
                            {FREE_TIER_DATA.map((row, i) => (
                                <tr key={row.product} className={`border-b-2 border-black ${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-yellow-50 transition-colors`}>
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
                        * Data sourced from Google Cloud Free Tier documentation. Limits subject to change by Google.
                    </div>
                </div>

                {/* FOOTER */}
                <div className="p-8 border-t-4 border-black bg-white flex justify-between">
                    <button onClick={() => router.push('/dashboard/infra')} className="font-bold uppercase tracking-widest hover:underline">
                        ← Back to Infrastructure
                    </button>
                    <button onClick={() => window.open('https://cloud.google.com/free', '_blank')} className="font-bold uppercase tracking-widest hover:underline text-xs opacity-50">
                        Verify on Google Cloud ↗
                    </button>
                </div>
            </div>
        </div>
    );
}
