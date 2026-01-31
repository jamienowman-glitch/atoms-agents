"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { isGodUser } from '@/lib/god';

export default function SurfacesConfigPage() {
    const router = useRouter();
    const supabase = createClient();
    const [surfaces, setSurfaces] = useState<any[]>([]);
    const [spaces, setSpaces] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Check Auth (basic)
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) router.push('/login');
            else {
                fetchSurfaces();
                fetchSpaces();
            }
        });
    }, []);

    const fetchSpaces = async () => {
        const res = await fetch('/api/god/config/spaces');
        const data = await res.json();
        if (Array.isArray(data)) setSpaces(data);
    };

    const fetchSurfaces = async () => {
        setLoading(true);
        const res = await fetch('/api/god/config/surfaces');
        const data = await res.json();
        if (Array.isArray(data)) {
            setSurfaces(data);
        }
        setLoading(false);
    };

    const handleSpaceUpdate = async (surfaceKey: string, newSpaceKey: string) => {
        await fetch('/api/god/config/surfaces', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: surfaceKey, space_key: newSpaceKey })
        });
        fetchSurfaces(); // Refresh to confirm
    };

    return (
        <div className="min-h-screen bg-graph-paper p-12 font-sans">
            <div className="max-w-6xl mx-auto bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-1">SURFACES REGISTRY</h1>
                        <p className="font-bold text-sm tracking-widest uppercase">NX-MARKETING // MC2-HEALTH</p>
                    </div>
                    <button
                        onClick={() => router.push('/god/config')}
                        className="px-6 py-2 border-2 border-black font-bold uppercase hover:bg-black hover:text-white transition-colors"
                    >
                        ← Back
                    </button>
                </div>

                {loading ? (
                    <div className="font-mono animate-pulse">LOADING REGISTRY...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left font-mono text-sm">
                            <thead>
                                <tr className="border-b-2 border-black">
                                    <th className="p-4 uppercase bg-black text-white">KEY</th>
                                    <th className="p-4 uppercase bg-black text-white">NAME</th>
                                    <th className="p-4 uppercase bg-black text-white">SPACE (CONTEXT)</th>
                                    <th className="p-4 uppercase bg-black text-white">CONFIG</th>
                                </tr>
                            </thead>
                            <tbody>
                                {surfaces.map((surface) => (
                                    <tr key={surface.id} className="border-b border-black/20 hover:bg-neutral-50">
                                        <td className="p-4 font-bold">{surface.key}</td>
                                        <td className="p-4">{surface.name}</td>
                                        <td className="p-4">
                                            <select
                                                className="border-2 border-black p-1 font-mono uppercase text-xs"
                                                value={surface.space_key || ''}
                                                onChange={(e) => handleSpaceUpdate(surface.key, e.target.value)}
                                            >
                                                <option value="">-- No Space --</option>
                                                {spaces.map(s => (
                                                    <option key={s.key} value={s.key}>{s.name}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="p-4">
                                            <pre className="text-xs bg-neutral-100 p-2 overflow-auto max-w-xs max-h-24">
                                                {JSON.stringify(surface.config, null, 2)}
                                            </pre>
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
