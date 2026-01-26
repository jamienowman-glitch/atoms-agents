"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default function MusclesConfigPage() {
    const router = useRouter();
    const supabase = createClient();
    const [muscles, setMuscles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) router.push('/login');
            else fetchMuscles();
        });
    }, []);

    const fetchMuscles = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('muscles')
            .select('*')
            .order('key', { ascending: true });

        if (data) setMuscles(data);
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-graph-paper p-12 font-sans">
            <div className="max-w-6xl mx-auto bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8">

                {/* HEADER */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-1">MUSCLE REGISTRY</h1>
                        <p className="font-bold text-xs tracking-widest uppercase text-neutral-500">HEAVY COMPUTE & MCP TOOLS</p>
                    </div>
                    <button
                        onClick={() => router.push('/god/config')}
                        className="px-6 py-2 border-2 border-black font-bold uppercase hover:bg-black hover:text-white transition-colors"
                    >
                        ← Back
                    </button>
                </div>

                {/* AUTOMATION STATUS CARD */}
                <div className="mb-8 bg-black text-green-400 font-mono p-4 border border-green-600 shadow-[0_0_15px_rgba(74,222,128,0.2)]">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-bold uppercase">● SENTINEL SYSTEM</span>
                        <span className="text-xs border border-green-600 px-2 py-0.5 rounded">ACTIVE</span>
                    </div>
                    <p className="text-xs opacity-80 mb-4">
                        The Sentinel watches <code>atoms-muscle</code> for new <code>service.py</code> files.
                        It automatically wraps them as MCP servers and registers them here.
                    </p>
                    <div className="bg-green-900/20 p-2 rounded text-xs select-all cursor-text">
                        $ python3 atoms-muscle/scripts/sentinel.py
                    </div>
                </div>

                {/* TABLE */}
                {loading ? (
                    <div className="font-mono animate-pulse">LOADING MUSCLES...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left font-mono text-xs">
                            <thead>
                                <tr className="border-b-2 border-black bg-neutral-50">
                                    <th className="p-3 uppercase">KEY</th>
                                    <th className="p-3 uppercase">NAME</th>
                                    <th className="p-3 uppercase">MCP STATUS</th>
                                    <th className="p-3 uppercase">PRICING</th>
                                </tr>
                            </thead>
                            <tbody>
                                {muscles.map((m) => (
                                    <tr key={m.id} className="border-b border-black/10 hover:bg-yellow-50 transition-colors">
                                        <td className="p-3 font-bold">{m.key}</td>
                                        <td className="p-3">{m.name}</td>
                                        <td className="p-3">
                                            {m.spec?.mcp_endpoint ? (
                                                <span className="text-green-600 font-bold">● ONLINE</span>
                                            ) : (
                                                <span className="text-neutral-400">○ RAW</span>
                                            )}
                                        </td>
                                        <td className="p-3 opacity-60">
                                            {m.spec?.pricing || 'FREE'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
