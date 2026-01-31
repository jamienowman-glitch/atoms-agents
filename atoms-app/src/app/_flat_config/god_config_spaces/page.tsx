"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default function SpacesConfigPage() {
    const router = useRouter();
    const supabase = createClient();
    const [spaces, setSpaces] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newSpace, setNewSpace] = useState({ key: '', name: '', description: '' });

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) router.push('/login');
            else fetchSpaces();
        });
    }, []);

    const fetchSpaces = async () => {
        setLoading(true);
        const res = await fetch('/api/god/config/spaces');
        const data = await res.json();
        if (Array.isArray(data)) setSpaces(data);
        setLoading(false);
    };

    const handleCreate = async () => {
        if (!newSpace.key || !newSpace.name) return;

        await fetch('/api/god/config/spaces', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSpace)
        });

        setIsCreating(false);
        setNewSpace({ key: '', name: '', description: '' });
        fetchSpaces();
    };

    return (
        <div className="min-h-screen bg-graph-paper p-12 font-sans">
            <div className="max-w-6xl mx-auto bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-1">SPACES REGISTRY</h1>
                        <p className="font-bold text-sm tracking-widest uppercase text-grape-500">THE SHARED CONTEXT</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setIsCreating(true)}
                            className="px-6 py-2 bg-black text-white font-bold uppercase hover:bg-grape-500 transition-colors"
                        >
                            + Create Space
                        </button>
                        <button
                            onClick={() => router.push('/god/config')}
                            className="px-6 py-2 border-2 border-black font-bold uppercase hover:bg-black hover:text-white transition-colors"
                        >
                            ← Back
                        </button>
                    </div>
                </div>

                {/* Create Modal (Inline for speed) */}
                {isCreating && (
                    <div className="mb-8 p-6 bg-neutral-100 border-2 border-black">
                        <h3 className="font-bold uppercase mb-4">New Space</h3>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <input
                                placeholder="key (e.g. 'health')"
                                className="border-2 border-black p-2 font-mono"
                                value={newSpace.key}
                                onChange={e => setNewSpace({ ...newSpace, key: e.target.value })}
                            />
                            <input
                                placeholder="Name (e.g. 'Health & Vitality')"
                                className="border-2 border-black p-2 font-mono"
                                value={newSpace.name}
                                onChange={e => setNewSpace({ ...newSpace, name: e.target.value })}
                            />
                            <input
                                placeholder="Description"
                                className="border-2 border-black p-2 font-mono"
                                value={newSpace.description}
                                onChange={e => setNewSpace({ ...newSpace, description: e.target.value })}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handleCreate} className="px-4 py-2 bg-black text-white font-bold uppercase text-sm">Save</button>
                            <button onClick={() => setIsCreating(false)} className="px-4 py-2 border-2 border-black font-bold uppercase text-sm">Cancel</button>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="font-mono animate-pulse">LOADING SPACES...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left font-mono text-sm">
                            <thead>
                                <tr className="border-b-2 border-black">
                                    <th className="p-4 uppercase bg-black text-white">KEY</th>
                                    <th className="p-4 uppercase bg-black text-white">NAME</th>
                                    <th className="p-4 uppercase bg-black text-white">DESCRIPTION</th>
                                    <th className="p-4 uppercase bg-black text-white">SURFACES (Count)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {spaces.map((space) => (
                                    <tr key={space.id} className="border-b border-black/20 hover:bg-neutral-50">
                                        <td className="p-4 font-bold text-grape-600">{space.key}</td>
                                        <td className="p-4">{space.name}</td>
                                        <td className="p-4 opacity-70">{space.description}</td>
                                        <td className="p-4 opacity-50 italic">
                                            {/* TODO: Join count */}
                                            --
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
