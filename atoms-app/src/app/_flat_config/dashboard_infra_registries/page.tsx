"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegistriesManager() {
    const router = useRouter();
    const [showSqlModal, setShowSqlModal] = useState(false);
    const [sqlQuery, setSqlQuery] = useState('');
    const [executing, setExecuting] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const REGISTRIES = [
        { id: 'typography', name: 'Typography', table: 'public.font_families', path: '/dashboard/infra/registries/typography' },
        { id: 'surfaces', name: 'Surfaces', table: 'public.surfaces', path: '/dashboard/infra/registries/surfaces' },
        { id: 'canvases', name: 'Canvases', table: 'public.canvases', path: '/dashboard/infra/registries/canvases' },
        { id: 'muscles', name: 'Muscles', table: 'public.muscles', path: '/dashboard/infra/registries/muscles', disabled: true },
        { id: 'agents', name: 'Agents', table: 'public.agents', path: '/dashboard/infra/registries/agents', disabled: true },
    ];

    const runSql = async () => {
        setExecuting(true);
        setResult(null);
        try {
            const res = await fetch('/api/god/sql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sql: sqlQuery })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setResult(JSON.stringify(data, null, 2));
            // Maybe refresh list if we tracked them dynamically
        } catch (e: any) {
            setResult(`ERROR: ${e.message}`);
        }
        setExecuting(false);
    };

    return (
        <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4 md:p-12 font-sans text-black">
            <div className="w-full max-w-6xl min-h-[80vh] bg-graph-paper border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col relative">

                {/* HEAD */}
                <header className="p-12 border-b-4 border-black bg-white flex justify-between items-end">
                    <div>
                        <h1 className="text-6xl font-black uppercase tracking-tighter mb-2">REGISTRIES</h1>
                        <p className="font-mono text-sm uppercase tracking-widest opacity-60">System of Record • Single Source of Truth</p>
                    </div>
                </header>

                <div className="flex-1 p-12">

                    {/* TOOLBAR */}
                    <div className="flex justify-between items-center mb-12">
                        <div className="font-mono text-xs uppercase bg-black text-white px-3 py-1">
                            ACTIVE REGISTRIES: {REGISTRIES.filter(r => !r.disabled).length}
                        </div>
                        <button
                            onClick={() => setShowSqlModal(true)}
                            className="bg-black text-white px-6 py-3 font-bold uppercase hover:bg-green-600 transition-colors flex items-center gap-2"
                        >
                            <span>+</span>
                            <span>Create New Registry</span>
                        </button>
                    </div>

                    {/* LIST */}
                    <div className="grid gap-4">
                        {REGISTRIES.map((r) => (
                            <div key={r.id} className={`border-2 border-black bg-white p-6 flex justify-between items-center ${r.disabled ? 'opacity-50 grayscale' : 'hover:translate-x-2 transition-transform'}`}>
                                <div>
                                    <h3 className="text-2xl font-black uppercase mb-1">{r.name}</h3>
                                    <code className="text-xs bg-neutral-200 px-2 py-0.5">{r.table}</code>
                                </div>
                                <div>
                                    <button
                                        onClick={() => !r.disabled && router.push(r.path)}
                                        disabled={r.disabled}
                                        className="font-bold border-2 border-black px-6 py-2 uppercase text-sm hover:bg-black hover:text-white transition-colors"
                                    >
                                        {r.disabled ? 'Coming Soon' : 'Manage'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* MODAL: CREATE REGISTRY (SQL) */}
                {showSqlModal && (
                    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
                        <div className="bg-white max-w-4xl w-full h-[80vh] border-4 border-white flex flex-col shadow-2xl">
                            <div className="p-6 bg-black text-white flex justify-between items-center">
                                <h3 className="text-2xl font-black font-mono">SQL CONSOLE: CREATE REGISTRY</h3>
                                <button onClick={() => setShowSqlModal(false)} className="hover:text-red-500 font-bold">CLOSE</button>
                            </div>

                            <div className="flex-1 flex flex-col relative">
                                <textarea
                                    value={sqlQuery}
                                    onChange={(e) => setSqlQuery(e.target.value)}
                                    placeholder="CREATE TABLE public.new_registry (...);"
                                    className="flex-1 bg-[#1e1e1e] text-[#d4d4d4] p-8 font-mono text-sm resize-none focus:outline-none"
                                    spellCheck={false}
                                />
                                {result && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-neutral-900 border-t-2 border-white p-4 overflow-auto font-mono text-xs text-green-400">
                                        <pre>{result}</pre>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border-t-4 border-black bg-neutral-100 flex justify-end gap-4">
                                <button onClick={() => setSqlQuery('')} className="px-6 py-3 font-bold uppercase text-sm hover:bg-white border-2 border-transparent">
                                    Clear
                                </button>
                                <button
                                    onClick={runSql}
                                    disabled={executing || !sqlQuery}
                                    className="px-8 py-3 bg-black text-white font-bold uppercase hover:bg-green-600 disabled:opacity-50"
                                >
                                    {executing ? 'Executing...' : 'Run SQL'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* FOOTER */}
                <div className="p-8 border-t-4 border-black bg-white flex justify-between">
                    <button onClick={() => router.push('/dashboard/infra')} className="font-bold uppercase tracking-widest hover:underline">
                        ← Infrastructure
                    </button>
                </div>
            </div>
        </div>
    );
}
