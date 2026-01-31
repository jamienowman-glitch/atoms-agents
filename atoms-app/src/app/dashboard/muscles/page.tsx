"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

// Simple Icons (Lucide names, but using emoji/text fallback if needed, but assuming Lucide is standard)
// I'll stick to Emoji for absolute robustness as decided.
// 📦 Package, 🟢 Green, 🟡 Yellow, 🔴 Red, ➕ Plus, 🔄 Sync

interface Muscle {
    key: string;
    name: string;
    category: string;
    status: string; // 'prod', 'dev'
    description: string;
    created_at: string;
}

export default function MusclesPage() {
    const [muscles, setMuscles] = useState<Muscle[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newName, setNewName] = useState('');
    const [newCategory, setNewCategory] = useState('audio');
    const [newDesc, setNewDesc] = useState('');
    const [scaffoldResult, setScaffoldResult] = useState<string | null>(null);

    const supabase = createClient();

    useEffect(() => {
        fetchMuscles();
    }, []);

    const fetchMuscles = async () => {
        setIsLoading(true);
        const { data } = await supabase
            .from('muscles')
            .select('*')
            .order('category', { ascending: true });

        if (data) setMuscles(data);
        setIsLoading(false);
    };

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            await fetch('/api/muscles/sync', { method: 'POST' });
            await fetchMuscles();
        } catch (e) {
            console.error(e);
        } finally {
            setIsSyncing(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setScaffoldResult(null);
        try {
            const res = await fetch('/api/muscles/scaffold', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName, category: newCategory, description: newDesc })
            });
            const json = await res.json();

            if (json.success) {
                setScaffoldResult(`✅ PR Ready! Created feat/muscle-${newName}, injected service.py, mcp.py, SKILL.md.`);
                // Run sync to show it in list
                await handleSync();
                setNewName('');
                setNewDesc('');
                // Don't close modal immediately so they see the success message?
                // Or close and show toast. Let's keep modal open with success msg.
            } else {
                setScaffoldResult(`❌ Error: ${json.error}`);
            }
        } catch (e: any) {
            setScaffoldResult(`❌ Error: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusIndicator = (status: string) => {
        if (status === 'prod' || status === 'sale_ready') return <span title="Ready for Sale">🟢</span>;
        if (status === 'dev') return <span title="In Development (No Skill/MCP)">🟡</span>;
        return <span title="Unknown Status">🔴</span>;
    };

    return (
        <div className="p-8 max-w-6xl mx-auto text-white">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">🏭 Muscle Factory</h1>
                    <p className="text-gray-400 mt-1">Manage High-Value Compute Units</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={handleSync}
                        disabled={isSyncing}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded transition-colors disabled:opacity-50"
                    >
                        {isSyncing ? '🔄 Syncing...' : '🔄 Sync Registry'}
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-bold transition-colors"
                    >
                        ➕ Create Muscle
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {muscles.map((m) => (
                    <div key={m.key} className="bg-[#111] border border-gray-800 rounded-lg p-6 hover:border-gray-600 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-zinc-900 text-xs uppercase px-2 py-1 rounded text-gray-400 font-mono">
                                {m.category}
                            </div>
                            <div className="text-lg">
                                {getStatusIndicator(m.status)}
                            </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{m.name}</h3>
                        <p className="text-gray-500 text-sm mb-4 min-h-[40px]">{m.description || 'No description provided.'}</p>

                        <div className="border-t border-gray-800 pt-4 flex justify-between items-center text-xs text-gray-400 font-mono">
                            <span>{m.key}</span>
                        </div>
                    </div>
                ))}
            </div>

            {muscles.length === 0 && !isLoading && (
                <div className="text-center text-gray-500 py-20">
                    No muscles found. Try syncing or create one.
                </div>
            )}

            {/* CREATE MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="bg-[#111] border border-gray-700 rounded-lg p-8 max-w-lg w-full relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            ✕
                        </button>
                        <h2 className="text-2xl font-bold mb-6">Scaffold New Muscle</h2>

                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-xs uppercase text-gray-400 mb-1">Name (snake_case)</label>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="e.g. video_transcoder"
                                    className="w-full bg-black border border-gray-700 p-3 rounded text-white focus:border-blue-500 outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs uppercase text-gray-400 mb-1">Category</label>
                                <select
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    className="w-full bg-black border border-gray-700 p-3 rounded text-white focus:border-blue-500 outline-none"
                                >
                                    <option value="audio">Audio</option>
                                    <option value="video">Video</option>
                                    <option value="cad">CAD</option>
                                    <option value="ai">AI</option>
                                    <option value="data">Data</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs uppercase text-gray-400 mb-1">Description</label>
                                <textarea
                                    value={newDesc}
                                    onChange={(e) => setNewDesc(e.target.value)}
                                    placeholder="What does it do?"
                                    className="w-full bg-black border border-gray-700 p-3 rounded text-white focus:border-blue-500 outline-none h-24"
                                />
                            </div>

                            {scaffoldResult && (
                                <div className={`p-3 rounded text-sm ${scaffoldResult.startsWith('✅') ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                                    {scaffoldResult}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition-colors disabled:opacity-50"
                            >
                                {isLoading ? 'Manfuacturing...' : 'Initialize Muscle'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
