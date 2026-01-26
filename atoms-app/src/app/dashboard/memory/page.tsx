"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import NexusUploader from '@/components/nexus/NexusUploader';

export default function MemoryDashboard() {
    const router = useRouter();
    const supabase = createClient();
    const [tab, setTab] = useState<'nexus' | 'whiteboard' | 'blackboard'>('nexus');

    // Nexus Data
    const [domains, setDomains] = useState<any[]>([]);

    // Whiteboard Data
    const [wbConfig, setWbConfig] = useState<any>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);

            // 1. Fetch Domains (Nexus)
            const { data: simpleDomains } = await supabase.from('domains').select('*').order('name');
            setDomains(simpleDomains || []);

            // 2. Fetch Registry Config (Whiteboard)
            const { data: wbData } = await supabase
                .from('services')
                .select('*')
                .eq('key', 'memory_whiteboard')
                .single();
            setWbConfig(wbData);

            setLoading(false);
        }
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4 md:p-12 font-sans text-black">
            <div className="w-full max-w-6xl min-h-[80vh] bg-graph-paper border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col relative">

                {/* HEAD */}
                <header className="p-12 border-b-4 border-black bg-white flex justify-between items-center">
                    <div>
                        <h1 className="text-6xl font-black uppercase tracking-tighter mb-2">MEMORY</h1>
                        <p className="font-mono text-sm uppercase tracking-widest opacity-60">The Three Brains</p>
                    </div>
                </header>

                {/* TABS */}
                <div className="flex border-b-4 border-black bg-neutral-200">
                    <button
                        onClick={() => setTab('nexus')}
                        className={`flex-1 p-4 font-bold uppercase tracking-widest hover:bg-white transition-colors border-r-4 border-black ${tab === 'nexus' ? 'bg-white text-black' : 'text-neutral-500'}`}
                    >
                        1. Nexus (Long Term)
                    </button>
                    <button
                        onClick={() => setTab('whiteboard')}
                        className={`flex-1 p-4 font-bold uppercase tracking-widest hover:bg-white transition-colors border-r-4 border-black ${tab === 'whiteboard' ? 'bg-white text-black' : 'text-neutral-500'}`}
                    >
                        2. Whiteboard (Flow)
                    </button>
                    <button
                        onClick={() => setTab('blackboard')}
                        className={`flex-1 p-4 font-bold uppercase tracking-widest hover:bg-white transition-colors ${tab === 'blackboard' ? 'bg-white text-black' : 'text-neutral-500'}`}
                    >
                        3. Blackboard (Node)
                    </button>
                </div>

                <div className="flex-1 p-12 bg-white">
                    {loading ? (
                        <p className="font-mono text-xl uppercase opacity-40">Loading Memory Circuit...</p>
                    ) : (
                        <>
                            {/* === TAB 1: NEXUS === */}
                            {tab === 'nexus' && (
                                <div className="animate-in fade-in zoom-in duration-300">
                                    <div className="mb-12 border-4 border-black bg-neutral-50 p-6 flex flex-col md:flex-row justify-between gap-6">
                                        <div>
                                            <h3 className="font-bold uppercase text-sm mb-2 opacity-60">Active Engine Stack</h3>
                                            <div className="flex gap-4">
                                                <div className="border border-black bg-white px-3 py-1">
                                                    <span className="text-xs font-mono uppercase opacity-50 block">Text</span>
                                                    <span className="font-bold text-sm">MISTRAL (Free)</span>
                                                </div>
                                                <div className="border border-black bg-white px-3 py-1">
                                                    <span className="text-xs font-mono uppercase opacity-50 block">Visual</span>
                                                    <span className="font-bold text-sm">OpenCLIP (Local)</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <h3 className="font-bold uppercase text-sm mb-2 opacity-60">Storage Backing</h3>
                                            <div className="font-mono text-xs bg-black text-white px-2 py-1 inline-block">S3 / LanceDB</div>
                                        </div>
                                    </div>

                                    {/* UPLOADER */}
                                    <div className="mb-12">
                                        <NexusUploader />
                                    </div>

                                    <h3 className="text-2xl font-black uppercase mb-6">Memory Domains (Spaces)</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {domains.map(domain => (
                                            <div key={domain.id} className="border-4 border-black bg-white p-8 hover:shadow-xl transition-shadow relative">
                                                <div className="absolute top-4 right-4 text-xs font-mono bg-black text-white px-2 py-1 uppercase">
                                                    {domain.key}
                                                </div>
                                                <h3 className="text-3xl font-black uppercase mb-4">{domain.name}</h3>
                                                <p className="font-mono text-sm opacity-60 mb-8 min-h-[40px]">{domain.description}</p>
                                                <div className="border-t-2 border-black pt-4">
                                                    <div className="text-xs font-bold uppercase mb-2">Vector Registry</div>
                                                    <code className="block bg-neutral-100 p-2 text-xs font-mono break-all">
                                                        s3://.../domains/{domain.key}/vectors.lance
                                                    </code>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* === TAB 2: WHITEBOARD === */}
                            {tab === 'whiteboard' && (
                                <div className="animate-in fade-in zoom-in duration-300">
                                    <div className="max-w-3xl border-4 border-black p-8 bg-sky-50 mb-8">
                                        <h2 className="text-4xl font-black uppercase mb-4 text-sky-900">Flow State Memory</h2>
                                        <p className="font-medium mb-4">
                                            The "Consciousness" of a running Agent Flow. Shared between all nodes in a single run.
                                        </p>

                                        <div className="bg-white border-2 border-black p-4 mb-6">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-bold uppercase text-xs">Status</span>
                                                <span className="bg-green-500 text-white px-2 py-1 text-xs font-bold uppercase">Active</span>
                                            </div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-bold uppercase text-xs">Provider</span>
                                                <span className="font-mono text-sm">{wbConfig?.provider || 'Unknown'}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold uppercase text-xs">Table</span>
                                                <span className="font-mono text-sm bg-yellow-200 px-1">{wbConfig?.config?.table || '---'}</span>
                                            </div>
                                        </div>

                                        <blockquote className="border-l-4 border-sky-900 pl-4 italic opacity-70 mb-6">
                                            "We chose Postgres over RAM because RAM is wiped when Cloud Run instances scale to zero."
                                        </blockquote>

                                        <div className="font-mono text-xs bg-black text-white p-4">
                                            {JSON.stringify(wbConfig, null, 2)}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* === TAB 3: BLACKBOARD === */}
                            {tab === 'blackboard' && (
                                <div className="animate-in fade-in zoom-in duration-300">
                                    <div className="max-w-3xl border-4 border-black p-8 bg-neutral-900 text-white mb-8">
                                        <h2 className="text-4xl font-black uppercase mb-4">Node State Memory</h2>
                                        <p className="font-medium mb-4 opacity-80">
                                            Ephemeral context passed directly from Node A to Node B.
                                        </p>

                                        <div className="bg-neutral-800 border-2 border-white/20 p-4 mb-6">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-bold uppercase text-xs opacity-50">Type</span>
                                                <span className="text-white px-2 py-1 text-xs font-bold uppercase border border-white">Direct / JSON</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold uppercase text-xs opacity-50">Storage</span>
                                                <span className="font-mono text-sm text-green-400">None (Transient)</span>
                                            </div>
                                        </div>

                                        <p className="text-sm font-mono opacity-50">
                                            Keeps context windows low. Only explicitly passed data enters the next node.
                                        </p>
                                    </div>
                                </div>
                            )}

                        </>
                    )}
                </div>

                {/* FOOTER */}
                <div className="p-8 border-t-4 border-black bg-white flex justify-between">
                    <button onClick={() => router.push('/dashboard')} className="font-bold uppercase tracking-widest hover:underline">
                        ← System Dashboard
                    </button>
                    <button onClick={() => router.push('/dashboard/infra/registries')} className="font-bold uppercase tracking-widest hover:underline text-xs opacity-50">
                        Manage Registry Tables
                    </button>
                </div>
            </div>
        </div>
    );
}
