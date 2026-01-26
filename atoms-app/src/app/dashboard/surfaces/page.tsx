"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { getSystemSurfaces } from '@/lib/registry';

export default function SurfaceRegistry() {
    const router = useRouter();
    const supabase = createClient();
    const [surfaces, setSurfaces] = useState<any[]>([]);

    useEffect(() => {
        // Re-using the registry lib
        getSystemSurfaces(supabase).then(setSurfaces);
    }, [supabase]);

    return (
        <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4 md:p-12 font-sans text-black">
            <div className="w-full max-w-6xl min-h-[80vh] bg-graph-paper border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col relative">

                {/* HEAD */}
                <header className="p-12 border-b-4 border-black bg-white flex justify-between items-end">
                    <div>
                        <h1 className="text-6xl font-black uppercase tracking-tighter mb-2">Surfaces</h1>
                        <p className="font-mono text-sm uppercase tracking-widest opacity-60">Microsite Registry • App Contexts</p>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-black">{surfaces.length}</div>
                        <div className="text-xs font-mono uppercase">Active</div>
                    </div>
                </header>

                <div className="flex-1 p-12 grid grid-cols-1 md:grid-cols-2 gap-8 content-start">

                    {/* CREATE CARD */}
                    <button
                        className="group border-4 border-dashed border-black/20 hover:border-black hover:bg-white flex flex-col items-center justify-center min-h-[200px] transition-all"
                        onClick={() => alert("Connecting to Surface Template Engine...")}
                    >
                        <span className="text-6xl mb-4 group-hover:scale-110 transition-transform">+</span>
                        <span className="font-bold uppercase tracking-widest">Forge New Surface</span>
                    </button>

                    {/* EXISTING SURFACES */}
                    {surfaces.map(surface => (
                        <div key={surface.id} className="border-4 border-black bg-white p-6 relative group cursor-pointer hover:shadow-xl transition-shadow">
                            <div className="absolute top-4 right-4 text-xs font-mono border border-black px-2 uppercase">
                                {surface.key}
                            </div>
                            <h2 className="text-3xl font-black uppercase mb-2">{surface.name}</h2>
                            <p className="font-serif italic text-lg opacity-80 mb-6 leading-tigher">{surface.description}</p>

                            <dl className="grid grid-cols-2 gap-4 text-xs font-mono uppercase opacity-60">
                                <div>
                                    <dt>Host Domain</dt>
                                    <dd>{surface.config?.domain || 'atoms-fam.app'}</dd>
                                </div>
                                <div>
                                    <dt>Nexus Cluster</dt>
                                    <dd className="bg-black text-white inline-block px-1">{surface.domain_key || 'Global'}</dd>
                                </div>
                            </dl>

                            <div className="mt-8 flex gap-2">
                                <button className="flex-1 bg-black text-white py-2 font-bold text-xs uppercase hover:bg-neutral-800">
                                    Manage
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); router.push(`/surface/${surface.key}`); }}
                                    className="flex-1 border border-black py-2 font-bold text-xs uppercase hover:bg-neutral-100"
                                >
                                    Visit
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-8 border-t-4 border-black bg-white flex justify-between">
                    <button onClick={() => router.push('/dashboard')} className="font-bold uppercase tracking-widest hover:underline">
                        ← System Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
