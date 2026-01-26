"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function FreeTiersMenu() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4 md:p-12 font-sans text-black">
            <div className="w-full max-w-4xl min-h-[60vh] bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col relative">

                {/* HEAD */}
                <header className="p-12 border-b-4 border-black bg-neutral-50">
                    <h1 className="text-5xl font-black uppercase tracking-tighter mb-2">Free Tier Registry</h1>
                    <p className="font-mono text-sm uppercase tracking-widest opacity-60">Select Provider</p>
                </header>

                <div className="flex-1 p-12 grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* GOOGLE CLOUD */}
                    <div
                        onClick={() => router.push('/dashboard/infra/free-tiers/google')}
                        className="border-4 border-black p-8 hover:bg-neutral-50 cursor-pointer transition-colors group relative"
                    >
                        <div className="absolute top-4 right-4 text-xs font-mono bg-green-500 text-black px-2 py-1 uppercase group-hover:bg-black group-hover:text-white">
                            Active
                        </div>
                        <h2 className="text-3xl font-black uppercase mb-4 group-hover:underline">Google Cloud</h2>
                        <ul className="font-mono text-sm opacity-60 list-disc pl-4 space-y-2">
                            <li>Cloud Run (Compute)</li>
                            <li>Cloud Build (CI/CD)</li>
                            <li>BigQuery (Data)</li>
                        </ul>
                    </div>

                    {/* AZURE */}
                    <div
                        onClick={() => router.push('/dashboard/infra/free-tiers/azure')}
                        className="border-4 border-black p-8 hover:bg-blue-50 cursor-pointer transition-colors group relative"
                    >
                        <div className="absolute top-4 right-4 text-xs font-mono bg-blue-100 text-blue-900 px-2 py-1 uppercase group-hover:bg-blue-900 group-hover:text-white border border-blue-900">
                            Failover
                        </div>
                        <h2 className="text-3xl font-black uppercase mb-4 group-hover:underline text-blue-900">Microsoft Azure</h2>
                        <ul className="font-mono text-sm opacity-60 list-disc pl-4 space-y-2">
                            <li>Container Apps</li>
                            <li>Speech Services</li>
                            <li>Cosmos DB</li>
                        </ul>
                    </div>

                    {/* SAAS STACK */}
                    <div
                        onClick={() => router.push('/dashboard/infra/free-tiers/saas')}
                        className="border-4 border-black p-8 hover:bg-emerald-50 cursor-pointer transition-colors group relative"
                    >
                        <div className="absolute top-4 right-4 text-xs font-mono bg-emerald-100 text-emerald-900 px-2 py-1 uppercase group-hover:bg-emerald-900 group-hover:text-white border border-emerald-900">
                            Best In Class
                        </div>
                        <h2 className="text-3xl font-black uppercase mb-4 group-hover:underline text-emerald-900">The SaaS Stack</h2>
                        <ul className="font-mono text-sm opacity-60 list-disc pl-4 space-y-2">
                            <li>Supabase (DB/Auth)</li>
                            <li>Resend (Email)</li>
                            <li>Cloudflare (CDN)</li>
                        </ul>
                    </div>

                    {/* AWS */}
                    <div
                        className="border-4 border-black p-8 opacity-60 hover:opacity-100 cursor-not-allowed bg-neutral-100 col-span-1 md:col-span-2 text-center flex flex-col items-center justify-center"
                    >
                        <h2 className="text-xl font-black uppercase text-neutral-500">AWS (Coming Soon)</h2>
                    </div>

                </div>

                {/* FOOTER */}
                <div className="p-8 border-t-4 border-black bg-white">
                    <button onClick={() => router.push('/dashboard/infra')} className="font-bold uppercase tracking-widest hover:underline">
                        ← Back to Infrastructure
                    </button>
                </div>
            </div>
        </div>
    );
}
