"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function CogsHub() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4 md:p-12 font-sans text-black">
            <div className="w-full max-w-5xl min-h-[70vh] bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col relative">
                <header className="p-12 border-b-4 border-black bg-neutral-50">
                    <h1 className="text-6xl font-black uppercase tracking-tighter mb-2">COGS</h1>
                    <p className="font-mono text-sm uppercase tracking-widest opacity-60">Cost of Goods Sold • Pick a Lens</p>
                </header>

                <div className="flex-1 p-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <button
                        onClick={() => router.push('/dashboard/infra/cost')}
                        className="border-4 border-black p-8 text-left hover:bg-black hover:text-white transition-all group"
                    >
                        <h2 className="text-3xl font-black uppercase mb-3 group-hover:translate-x-2 transition-transform">
                            Infrastructure
                        </h2>
                        <p className="font-mono text-xs uppercase tracking-widest opacity-70">
                            Cloud spend, storage, compute, SaaS backbone
                        </p>
                    </button>

                    <button
                        onClick={() => router.push('/dashboard/models/cost')}
                        className="border-4 border-black p-8 text-left hover:bg-black hover:text-white transition-all group"
                    >
                        <h2 className="text-3xl font-black uppercase mb-3 group-hover:translate-x-2 transition-transform">
                            Models
                        </h2>
                        <p className="font-mono text-xs uppercase tracking-widest opacity-70">
                            Providers, models, tokens, AI studio vs Vertex
                        </p>
                    </button>
                </div>

                <div className="p-8 border-t-4 border-black bg-white flex justify-between">
                    <button onClick={() => router.push('/god/config')} className="font-bold uppercase tracking-widest hover:underline">
                        ← God Config
                    </button>
                    <button onClick={() => router.push('/dashboard')} className="font-bold uppercase tracking-widest hover:underline text-xs opacity-60">
                        Main Dashboard →
                    </button>
                </div>
            </div>
        </div>
    );
}
