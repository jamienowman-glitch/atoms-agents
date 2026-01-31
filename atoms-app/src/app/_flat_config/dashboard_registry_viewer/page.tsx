"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

export default function RegistryViewerPage() {
    const supabase = createClient();
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState<string>('all');

    useEffect(() => {
        fetchRegistry();
    }, []);

    const fetchRegistry = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('registry_components')
            .select('*')
            .order('type', { ascending: true })
            .order('alias', { ascending: true });

        if (data) setItems(data);
        setLoading(false);
    };

    const grouped = items.reduce((acc: any, item: any) => {
        const type = item.type.toUpperCase();
        if (!acc[type]) acc[type] = [];
        acc[type].push(item);
        return acc;
    }, {});

    const types = Object.keys(grouped).sort();

    return (
        <div className="min-h-screen bg-neutral-100 p-8 font-sans">
            <div className="max-w-7xl mx-auto bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">

                <header className="mb-8 border-b-4 border-black pb-6 flex justify-between items-end">
                    <div>
                        <h1 className="text-5xl font-black uppercase tracking-tighter">THE PHONEBOOK</h1>
                        <p className="font-mono text-sm uppercase tracking-widest text-neutral-500">Global Registry Viewer (Read-Only)</p>
                    </div>
                    <button onClick={fetchRegistry} className="bg-black text-white px-4 py-2 font-bold uppercase hover:bg-neutral-800">
                        Refresh
                    </button>
                </header>

                {loading ? (
                    <div className="font-mono animate-pulse">Scanning Universe...</div>
                ) : (
                    <div className="space-y-8">
                        {types.map(type => (
                            <div key={type} className="border-2 border-black">
                                <div className="bg-black text-white p-4 font-black uppercase flex justify-between">
                                    <span>{type}</span>
                                    <span className="bg-white text-black px-2 rounded-full text-xs flex items-center">{grouped[type].length}</span>
                                </div>
                                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-neutral-50">
                                    {grouped[type].map((item: any) => (
                                        <div key={item.id} className="bg-white border border-black p-4 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-sm truncate" title={item.product_name || item.alias}>
                                                    {item.product_name || item.alias}
                                                </h3>
                                                <div className="flex gap-1">
                                                    {item.has_skill && <span className="w-2 h-2 bg-blue-500 rounded-full" title="Has Skill"></span>}
                                                    {item.has_connector && <span className="w-2 h-2 bg-green-500 rounded-full" title="Has Connector"></span>}
                                                </div>
                                            </div>
                                            <code className="block text-[10px] bg-neutral-100 p-1 mb-2 truncate text-neutral-500 font-mono">
                                                {item.alias}
                                            </code>
                                            <p className="text-xs text-neutral-600 line-clamp-2 h-8">
                                                {item.description || 'No description found.'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
