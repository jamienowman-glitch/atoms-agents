"use client";

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { ConnectorProvider } from '@/app/_flat_config/god_config_connectors/types';
import { ConnectorSidebar } from '@/app/_flat_config/god_config_connectors/components/ConnectorSidebar';
import { ScopeManager } from '@/app/_flat_config/god_config_connectors/components/ScopeManager';
import { KpiMapper } from '@/app/_flat_config/god_config_connectors/components/KpiMapper';
import { VaultWriter } from '@/app/_flat_config/god_config_connectors/components/VaultWriter';
import { ApproveButton } from '@/app/_flat_config/god_config_connectors/components/ApproveButton';

export default function ConnectorsConfigPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [providers, setProviders] = useState<ConnectorProvider[]>([]);
    const [selected, setSelected] = useState<ConnectorProvider | null>(null);

    const fetchProviders = useCallback(async () => {
        setLoading(true);
        const { data } = await supabase
            .from('connector_providers')
            .select('*')
            .order('platform_slug', { ascending: true });
        if (data) {
            setProviders(data as ConnectorProvider[]);
            if (!selected && data.length > 0) {
                setSelected(data[0] as ConnectorProvider);
            }
        }
        setLoading(false);
    }, [supabase, selected]);

    useEffect(() => {
        const checkUser = async () => {
             const { data: { user } } = await supabase.auth.getUser();
             if (!user) router.push('/login');
             else fetchProviders();
        };
        checkUser();
    }, [fetchProviders, router, supabase.auth]);

    const addConnector = async () => {
        const slug = prompt('Provider slug (e.g., shopify, tiktok, youtube)');
        if (!slug) return;
        const display = prompt('Display name (e.g., Shopify)');
        if (!display) return;
        const payload = {
            provider_id: slug,
            platform_slug: slug,
            display_name: display,
            naming_rule: 'PROVIDER_{PLATFORM}_KEY'
        };
        const { error } = await supabase.from('connector_providers').insert(payload);
        if (error) {
            alert(error.message);
            return;
        }
        await fetchProviders();
    };

    const selectedTitle = useMemo(() => {
        if (!selected) return 'CONNECTORS';
        return `${selected.display_name || selected.platform_slug}`.toUpperCase();
    }, [selected]);

    return (
        <div className="min-h-screen bg-graph-paper p-6 md:p-12 font-sans">
            <div className="max-w-7xl mx-auto bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 md:p-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-1">CONNECTOR FACTORY — GOD CONFIG</h1>
                        <p className="font-bold text-xs tracking-widest uppercase text-neutral-500">FLAT SECTIONS • MOBILE FIRST • FIREARMS ONLY</p>
                    </div>
                    <div className="flex gap-3">
                         <button
                            onClick={() => router.push('/god/config')}
                            className="px-6 py-2 border-2 border-black font-bold uppercase hover:bg-black hover:text-white transition-colors"
                        >
                            ← Back
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="font-mono animate-pulse">LOADING CONNECTORS...</div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
                        <ConnectorSidebar
                            providers={providers}
                            selected={selected}
                            onSelect={setSelected}
                            onAdd={addConnector}
                        />

                        <div className="border-2 border-black">
                            <div className="bg-black text-white px-4 py-3 font-black uppercase text-sm flex justify-between items-center">
                                <span>{selectedTitle}</span>
                                {selected && <ApproveButton providerId={selected.provider_id} />}
                            </div>

                            {selected && (
                                <div className="p-4 md:p-6 space-y-4">
                                    <VaultWriter providerId={selected.provider_id} />
                                    <ScopeManager providerId={selected.provider_id} />
                                    <KpiMapper providerId={selected.provider_id} />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
