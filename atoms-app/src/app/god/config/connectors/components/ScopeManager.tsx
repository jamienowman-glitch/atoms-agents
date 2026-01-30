"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { ConnectorScope, ScopeCategory, FirearmType } from '../types';

interface ScopeManagerProps {
    providerId: string;
}

export const ScopeManager: React.FC<ScopeManagerProps> = ({ providerId }) => {
    const supabase = createClient();
    const [scopes, setScopes] = useState<ConnectorScope[]>([]);
    const [categories, setCategories] = useState<ScopeCategory[]>([]);
    const [firearmTypes, setFirearmTypes] = useState<FirearmType[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const loadData = useCallback(async () => {
        const [scopeRes, catRes, firearmRes] = await Promise.all([
            supabase.from('connector_scopes').select('*').eq('provider_id', providerId).order('scope_name', { ascending: true }),
            supabase.from('connector_scope_categories').select('*').eq('provider_id', providerId).order('name', { ascending: true }),
            supabase.from('firearm_types').select('*').order('name', { ascending: true }),
        ]);

        setScopes((scopeRes.data as ConnectorScope[]) || []);
        setCategories((catRes.data as ScopeCategory[]) || []);
        setFirearmTypes((firearmRes.data as FirearmType[]) || []);
    }, [providerId, supabase]);

    useEffect(() => {
        if (providerId) {
            loadData();
        }
    }, [providerId, loadData]);

    const updateScope = async (scope: ConnectorScope, changes: Partial<ConnectorScope>) => {
        const { error } = await supabase.from('connector_scopes').update(changes).eq('scope_id', scope.scope_id);
        if (error) {
            alert(error.message);
        } else {
            loadData();
        }
    };

    const addScopeCategory = async () => {
        const name = prompt('Scope category name (e.g., Analytics, Content)');
        if (!name) return;
        await supabase.from('connector_scope_categories').insert({
            provider_id: providerId,
            name
        });
        loadData();
    };

    const addScope = async () => {
        const scope_name = prompt('Scope name');
        if (!scope_name) return;
        const scope_type = prompt('Scope type (oauth_scope, api_scope, etc.)') || null;
        const description = prompt('Description') || null;
        await supabase.from('connector_scopes').insert({
            provider_id: providerId,
            scope_name,
            scope_type,
            description,
            requires_firearm: false,
            firearm_type_id: null
        });
        loadData();
    };

    const addFirearmType = async () => {
        const name = prompt('Firearm type name');
        if (!name) return;
        const description = prompt('Description') || null;
        await supabase.from('firearm_types').insert({ name, description });
        loadData();
    };

    return (
        <div className="border-2 border-black">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center px-4 py-3 bg-white uppercase font-black tracking-tight text-lg hover:bg-neutral-50"
            >
                <span>Scopes & Firearms</span>
                <span>{isOpen ? '[-]' : '[+]'}</span>
            </button>

            {isOpen && (
                <div className="px-4 py-4 text-sm border-t-2 border-black bg-neutral-50 space-y-4">
                    <div className="flex gap-2 flex-wrap">
                        <button onClick={addScopeCategory} className="px-3 py-1 border-2 border-black font-bold uppercase text-xs hover:bg-black hover:text-white transition-colors">+ Category</button>
                        <button onClick={addScope} className="px-3 py-1 border-2 border-black font-bold uppercase text-xs hover:bg-black hover:text-white transition-colors">+ Scope</button>
                        <button onClick={addFirearmType} className="px-3 py-1 border-2 border-black font-bold uppercase text-xs hover:bg-black hover:text-white transition-colors">+ Firearm Type</button>
                    </div>

                    <div className="space-y-2">
                        {scopes.map((s) => (
                            <div key={s.scope_id} className="border-2 border-black p-3 bg-white space-y-2">
                                <div className="flex flex-wrap gap-3 items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="font-bold uppercase text-xs">{s.scope_name}</span>
                                        <span className="text-[10px] text-neutral-500 uppercase">{s.scope_type}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                         <span className={`text-[10px] font-bold px-1 ${s.requires_firearm ? 'bg-red-500 text-white' : 'bg-green-100 text-green-800'}`}>
                                            {s.requires_firearm ? 'LOCKED' : 'OPEN'}
                                         </span>
                                    </div>
                                </div>
                                <div className="text-xs text-neutral-600 border-b border-neutral-200 pb-2 mb-2">{s.description || 'No description'}</div>

                                <div className="grid md:grid-cols-3 gap-2">
                                    <select
                                        className="border-2 border-black px-2 py-1 text-xs bg-white"
                                        value={s.category_id || ''}
                                        onChange={(e) => updateScope(s, { category_id: e.target.value || null })}
                                    >
                                        <option value="">Uncategorized</option>
                                        {categories.map((c) => (
                                            <option key={c.category_id} value={c.category_id}>{c.name}</option>
                                        ))}
                                    </select>

                                    <label className="flex items-center gap-2 text-xs font-bold border-2 border-transparent hover:border-neutral-200 p-1 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={s.requires_firearm}
                                            onChange={(e) => updateScope(s, { requires_firearm: e.target.checked })}
                                            className="w-4 h-4 accent-black"
                                        />
                                        REQUIRES FIREARM
                                    </label>

                                    <select
                                        className="border-2 border-black px-2 py-1 text-xs bg-white disabled:opacity-50"
                                        value={s.firearm_type_id || ''}
                                        disabled={!s.requires_firearm}
                                        onChange={(e) => updateScope(s, { firearm_type_id: e.target.value || null })}
                                    >
                                        <option value="">Select Firearm Type</option>
                                        {firearmTypes.map((f) => (
                                            <option key={f.firearm_type_id} value={f.firearm_type_id}>{f.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ))}
                        {scopes.length === 0 && (
                            <div className="text-xs uppercase text-neutral-500 italic">No scopes defined yet.</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
