"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';

/**
 * INFRASTRUCTURE REGISTRY
 * 
 * This is a MEMORY LAYER, not a Connector. 
 * It tracks "what services are we using for what" so you don't forget.
 * 
 * NO API KEYS HERE. Keys go through Connectors + Junior Agent Security.
 */

interface InfrastructureEntry {
    id: string;
    service_name: string;
    purpose: string;
    tier: string;
    notes: string;
    created_at: string;
}

const TIER_OPTIONS = ['Free', 'Paid', 'Trial', 'Enterprise'];

export default function InfrastructureRegistryPage() {
    const [entries, setEntries] = useState<InfrastructureEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newEntry, setNewEntry] = useState({ service_name: '', purpose: '', tier: 'Free', notes: '' });

    const supabase = createClient();

    useEffect(() => {
        loadEntries();
    }, []);

    const loadEntries = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('infrastructure_registry')
            .select('*')
            .order('service_name');

        if (!error && data) {
            setEntries(data);
        }
        setIsLoading(false);
    };

    const handleAdd = async () => {
        if (!newEntry.service_name || !newEntry.purpose) return;

        const { error } = await supabase
            .from('infrastructure_registry')
            .insert({
                service_name: newEntry.service_name,
                purpose: newEntry.purpose,
                tier: newEntry.tier,
                notes: newEntry.notes
            });

        if (!error) {
            setNewEntry({ service_name: '', purpose: '', tier: 'Free', notes: '' });
            setIsAdding(false);
            loadEntries();
        }
    };

    const handleDelete = async (id: string) => {
        const { error } = await supabase
            .from('infrastructure_registry')
            .delete()
            .eq('id', id);

        if (!error) loadEntries();
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black uppercase tracking-tight mb-2">
                        🏗️ Infrastructure Registry
                    </h1>
                    <p className="text-gray-400">
                        What services are we using for what? A simple memory layer.
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                        📝 This is for <strong>notes only</strong>. API keys are managed in{' '}
                        <a href="/_flat_config/god_config_connectors" className="text-blue-400 underline">Connectors</a>.
                    </p>
                </div>

                {/* Add Button */}
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="mb-6 bg-white text-black px-4 py-2 font-bold uppercase hover:bg-gray-200 transition-colors"
                    >
                        + Add Service
                    </button>
                )}

                {/* Add Form */}
                {isAdding && (
                    <div className="mb-6 bg-gray-900 p-4 border border-gray-700">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1 uppercase">Service Name</label>
                                <input
                                    type="text"
                                    value={newEntry.service_name}
                                    onChange={(e) => setNewEntry({ ...newEntry, service_name: e.target.value })}
                                    placeholder="e.g., Cloudflare Pages"
                                    className="w-full bg-black border border-gray-600 p-2 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1 uppercase">Purpose</label>
                                <input
                                    type="text"
                                    value={newEntry.purpose}
                                    onChange={(e) => setNewEntry({ ...newEntry, purpose: e.target.value })}
                                    placeholder="e.g., Hosting websites"
                                    className="w-full bg-black border border-gray-600 p-2 text-white"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1 uppercase">Tier</label>
                                <select
                                    value={newEntry.tier}
                                    onChange={(e) => setNewEntry({ ...newEntry, tier: e.target.value })}
                                    className="w-full bg-black border border-gray-600 p-2 text-white"
                                >
                                    {TIER_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1 uppercase">Notes</label>
                                <input
                                    type="text"
                                    value={newEntry.notes}
                                    onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                                    placeholder="Optional notes..."
                                    className="w-full bg-black border border-gray-600 p-2 text-white"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleAdd}
                                className="bg-green-600 text-white px-4 py-2 font-bold uppercase hover:bg-green-700"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setIsAdding(false)}
                                className="bg-gray-700 text-white px-4 py-2 font-bold uppercase hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* List */}
                {isLoading ? (
                    <div className="text-gray-500 animate-pulse">Loading...</div>
                ) : entries.length === 0 ? (
                    <div className="text-gray-500 text-center py-12 border border-dashed border-gray-700">
                        No infrastructure registered yet. Add your first service above.
                    </div>
                ) : (
                    <div className="space-y-2">
                        {entries.map((entry) => (
                            <div
                                key={entry.id}
                                className="bg-gray-900 border border-gray-800 p-4 flex items-center justify-between group hover:border-gray-600 transition-colors"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-lg">{entry.service_name}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded ${entry.tier === 'Free' ? 'bg-green-900 text-green-300' :
                                                entry.tier === 'Trial' ? 'bg-yellow-900 text-yellow-300' :
                                                    entry.tier === 'Paid' ? 'bg-blue-900 text-blue-300' :
                                                        'bg-purple-900 text-purple-300'
                                            }`}>
                                            {entry.tier}
                                        </span>
                                    </div>
                                    <div className="text-gray-400 text-sm mt-1">{entry.purpose}</div>
                                    {entry.notes && (
                                        <div className="text-gray-600 text-xs mt-1 italic">{entry.notes}</div>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleDelete(entry.id)}
                                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 transition-opacity px-2"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Summary */}
                {entries.length > 0 && (
                    <div className="mt-8 text-xs text-gray-600 border-t border-gray-800 pt-4">
                        <strong>Summary:</strong>{' '}
                        {entries.filter(e => e.tier === 'Free').length} Free,{' '}
                        {entries.filter(e => e.tier === 'Trial').length} Trial,{' '}
                        {entries.filter(e => e.tier === 'Paid').length} Paid,{' '}
                        {entries.filter(e => e.tier === 'Enterprise').length} Enterprise
                    </div>
                )}
            </div>
        </div>
    );
}
