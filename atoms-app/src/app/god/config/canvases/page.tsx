"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

// Full V2 Canvas Contract (The "Vario" Standard)
const DEFAULT_STRUCTURE = {
    contract_version: "2.0.0",
    meta: {
        name: "Infinite Whiteboard",
        description: "A free-form Vario canvas with dual-magnifier control."
    },
    viewport: {
        type: "infinite", // or "fixed"
        preset: "1080x1080", // for fixed
        bg_color: "#f5f5f5"
    },
    harness: {
        top_pill: {
            left: ["surface_switcher", "chat_toggle"],
            right: ["view_mode", "export", "settings"]
        },
        chat_rail: {
            enabled: true,
            position: "left",
            width: 320
        },
        tool_pop: {
            enabled: true,
            position: "bottom",
            magnifiers: {
                left: {
                    type: "category_selector", // The "Wheel" (Layout, Font, Type, Color)
                    default: "layout"
                },
                right: {
                    type: "tool_selector", // The "Sub-wheel" (Density, Spacing, Shape)
                    default: "density"
                }
            },
            sliders: {
                layout: ["grid.cols", "grid.gap", "grid.radius"],
                font: ["typo.size", "typo.weight", "typo.width"],
                type: ["typo.tracking", "typo.leading"],
                color: ["style.opacity", "style.blur"]
            }
        }
    },
    atoms: [
        {
            name: "Tile",
            props: {
                title: { type: "string", default: "Untitled" },
                variant: { type: "select", options: ["generic", "product", "video"] }
            },
            vario: {
                axes: ["weight", "width", "slant", "casual"],
                mappings: {
                    "weight": "font-variation-settings: 'wght' var(--v-weight)",
                    "width": "font-variation-settings: 'wdth' var(--v-width)"
                }
            }
        }
    ]
};

export default function CanvasesConfigPage() {
    const router = useRouter();
    const supabase = createClient();
    const [canvases, setCanvases] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState<'list' | 'forge'>('list');

    // Forge State
    const [forgeData, setForgeData] = useState({
        key: '',
        name: '',
        description: '',
        structure: JSON.stringify(DEFAULT_STRUCTURE, null, 2)
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) router.push('/login');
            else fetchCanvases();
        });
    }, []);

    const fetchCanvases = async () => {
        setLoading(true);
        const res = await fetch('/api/god/config/canvases');
        const data = await res.json();
        if (Array.isArray(data)) {
            setCanvases(data);
        }
        setLoading(false);
    };

    const handleForgeSave = async () => {
        setSaving(true);
        try {
            // Validate JSON
            const structureJson = JSON.parse(forgeData.structure);

            const res = await fetch('/api/god/config/canvases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    key: forgeData.key,
                    name: forgeData.name,
                    description: forgeData.description,
                    structure: structureJson
                })
            });

            if (res.ok) {
                setMode('list');
                fetchCanvases();
                // Reset form
                setForgeData({
                    key: '', name: '', description: '', structure: JSON.stringify(DEFAULT_STRUCTURE, null, 2)
                });
            } else {
                alert('Failed to save canvas.');
            }
        } catch (e) {
            alert('Invalid JSON Structure');
        }
        setSaving(false);
    };

    return (
        <div className="min-h-screen bg-graph-paper p-12 font-sans">
            <div className="max-w-6xl mx-auto bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-1">CANVASES REGISTRY</h1>
                        <p className="font-bold text-sm tracking-widest uppercase">UX TEMPLATES & CONTRACTS</p>
                    </div>
                    <div className="flex gap-4">
                        {mode === 'list' && (
                            <button
                                onClick={() => setMode('forge')}
                                className="px-6 py-2 bg-black text-white font-bold uppercase hover:opacity-80 transition-opacity"
                            >
                                + Forge New
                            </button>
                        )}
                        <button
                            onClick={() => mode === 'forge' ? setMode('list') : router.push('/god/config')}
                            className="px-6 py-2 border-2 border-black font-bold uppercase hover:bg-black hover:text-white transition-colors"
                        >
                            {mode === 'forge' ? 'Cancel' : '← Back'}
                        </button>
                    </div>
                </div>

                {/* CONTENT */}
                {mode === 'list' ? (
                    loading ? (
                        <div className="font-mono animate-pulse">LOADING CANVASES...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left font-mono text-sm">
                                <thead>
                                    <tr className="border-b-2 border-black">
                                        <th className="p-4 uppercase bg-black text-white">KEY</th>
                                        <th className="p-4 uppercase bg-black text-white">NAME</th>
                                        <th className="p-4 uppercase bg-black text-white">DESCRIPTION</th>
                                        <th className="p-4 uppercase bg-black text-white">STRUCTURE (JSON)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {canvases.length === 0 && (
                                        <tr><td colSpan={4} className="p-8 text-center opacity-50">NO CANVASES FOUND. FORGE ONE.</td></tr>
                                    )}
                                    {canvases.map((canvas) => (
                                        <tr key={canvas.id} className="border-b border-black/20 hover:bg-neutral-50">
                                            <td className="p-4 font-bold">{canvas.key}</td>
                                            <td className="p-4">{canvas.name}</td>
                                            <td className="p-4 opacity-70">{canvas.description}</td>
                                            <td className="p-4">
                                                <div className="text-xs bg-neutral-100 p-2 overflow-hidden truncate max-w-xs">{JSON.stringify(canvas.structure)}</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                ) : (
                    // FORGE MODE
                    <div className="space-y-6 max-w-2xl font-mono">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase mb-1">Key (Slug)</label>
                                <input
                                    className="w-full p-2 border-2 border-black bg-neutral-50 focus:outline-none focus:bg-white"
                                    value={forgeData.key}
                                    onChange={e => setForgeData({ ...forgeData, key: e.target.value })}
                                    placeholder="e.g. infinite_whiteboard"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase mb-1">Name</label>
                                <input
                                    className="w-full p-2 border-2 border-black bg-neutral-50 focus:outline-none focus:bg-white"
                                    value={forgeData.name}
                                    onChange={e => setForgeData({ ...forgeData, name: e.target.value })}
                                    placeholder="e.g. Infinite Whiteboard"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Description</label>
                            <input
                                className="w-full p-2 border-2 border-black bg-neutral-50 focus:outline-none focus:bg-white"
                                value={forgeData.description}
                                onChange={e => setForgeData({ ...forgeData, description: e.target.value })}
                                placeholder="Brief description of the UX contract"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Structure (JSON Contract)</label>
                            <textarea
                                className="w-full h-64 p-4 border-2 border-black bg-[#1e1e1e] text-[#d4d4d4] text-xs resize-none focus:outline-none"
                                value={forgeData.structure}
                                onChange={e => setForgeData({ ...forgeData, structure: e.target.value })}
                                spellCheck={false}
                            />
                        </div>
                        <div className="flex justify-end pt-4">
                            <button
                                onClick={handleForgeSave}
                                disabled={saving}
                                className="px-8 py-3 bg-green-600 text-white font-bold uppercase hover:bg-green-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all"
                            >
                                {saving ? 'Forging...' : 'FORGE CANVAS'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
