"use client";

import { createClient } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { Loader2, Plus } from 'lucide-react';

export default function MuscleRegistry() {
    const supabase = createClient();
    const [muscles, setMuscles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetch() {
            const { data } = await supabase.from('muscles').select('*').order('name');
            setMuscles(data || []);
            setLoading(false);
        }
        fetch();
    }, []);

    return (
        <div className="p-8 md:p-12 min-h-screen bg-neutral-100 font-sans text-black">
            {/* HEAD */}
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-2">MUSCLE REGISTRY</h1>
                    <div className="flex md:items-center flex-col md:flex-row gap-4">
                        <p className="font-mono text-sm uppercase tracking-widest opacity-60">Heavy Compute Inventory • MCP • API</p>
                        <div className="bg-blue-50 text-blue-800 px-3 py-1 font-mono text-xs border border-blue-200">
                            🔧 FACTORY PROTOCOL: Invoke <strong>create-muscle</strong> skill to build new tools.
                        </div>
                    </div>
                </div>
            </div>
            {/* 
                <button className="bg-black text-white px-6 py-3 font-bold uppercase hover:bg-neutral-800 flex items-center gap-2">
                    <Plus size={16} /> Register New
                </button>
                */}
        </div>

            {
        loading ? (
            <div className="flex items-center gap-2 opacity-50 font-mono"><Loader2 className="animate-spin" /> Load Inventory...</div>
        ) : (
            <div className="grid grid-cols-1 gap-6">
                {muscles.map((m) => (
                    <div key={m.id} className="bg-white border-4 border-black p-6 relative hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-shadow">
                        <div className="absolute top-4 right-4 flex gap-2">
                            <div className={`font-mono text-xs px-2 py-1 uppercase ${m.status === 'ready' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {m.status}
                            </div>
                            <div className="font-mono text-xs bg-neutral-100 px-2 py-1 uppercase border border-black/10">v{m.version}</div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-1">
                                <h3 className="text-2xl font-black uppercase mb-2">{m.name}</h3>
                                <p className="font-medium text-lg mb-4 opacity-80">{m.description_human}</p>

                                <div className="bg-neutral-50 p-4 border border-black/10 font-mono text-xs space-y-2">
                                    <div className="opacity-50 uppercase tracking-widest mb-1">Technical Specs</div>
                                    <div className="break-words">{m.description_tech}</div>
                                </div>
                            </div>

                            <div className="w-full md:w-96 flex flex-col gap-4 border-l-2 border-black/10 pl-8">
                                <div>
                                    <div className="text-xs font-bold uppercase opacity-40 mb-1">MCP Endpoint (For Sale)</div>
                                    <code className="block bg-black text-green-400 p-2 text-xs font-mono break-all select-all hover:bg-neutral-900 cursor-pointer">
                                        {m.mcp_endpoint}
                                    </code>
                                </div>
                                <div>
                                    <div className="text-xs font-bold uppercase opacity-40 mb-1">Internal API</div>
                                    <code className="block bg-neutral-200 p-2 text-xs font-mono break-all opacity-60">
                                        {m.api_endpoint}
                                    </code>
                                </div>

                                <div className="mt-auto pt-4">
                                    <div className="text-xs font-bold uppercase opacity-40 mb-1">Reference ID</div>
                                    <code className="font-mono text-xs select-all text-neutral-500">{m.key}</code>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }
        </div >
    );
}
