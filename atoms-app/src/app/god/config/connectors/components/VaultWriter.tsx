"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { DevAccount } from '../types';

interface VaultWriterProps {
    providerId: string;
}

export const VaultWriter: React.FC<VaultWriterProps> = ({ providerId }) => {
    const supabase = createClient();
    const [devAccount, setDevAccount] = useState<DevAccount | null>(null);
    const [clientId, setClientId] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const loadData = useCallback(async () => {
        const { data } = await supabase.from('connector_dev_accounts').select('*').eq('provider_id', providerId).maybeSingle();
        if (data) {
            setDevAccount(data as DevAccount);
            const keys = (data as DevAccount).tenant_owned_keys || {};
            setClientId(keys.client_id || '');
            setClientSecret(keys.client_secret || '');
        } else {
            setDevAccount(null);
            setClientId('');
            setClientSecret('');
        }
    }, [providerId, supabase]);

    useEffect(() => {
        if (providerId) {
            loadData();
        }
    }, [providerId, loadData]);

    const saveKeys = async () => {
        setLoading(true);
        const updatePayload = {
            provider_id: providerId,
            system_dev_username: devAccount?.system_dev_username || null,
            vault_key_hint: devAccount?.vault_key_hint || null,
            tenant_owned_keys: {
                 ...(devAccount?.tenant_owned_keys || {}), // Merge? Or overwrite?
                 // If I want to be specific about Client ID/Secret, I should overwrite them but keep others.
                 client_id: clientId,
                 client_secret: clientSecret
            },
            secondary_information: devAccount?.secondary_information ?? []
        };

        const { error } = await supabase.from('connector_dev_accounts').upsert(updatePayload, { onConflict: 'provider_id' });

        if (error) {
            alert('Failed to save keys: ' + error.message);
        } else {
            alert('Keys saved securely to DB.');
            loadData();
        }
        setLoading(false);
    };

    return (
        <div className="border-2 border-black">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center px-4 py-3 bg-white uppercase font-black tracking-tight text-lg hover:bg-neutral-50"
            >
                <span>Dev Account (Vault Writer)</span>
                <span>{isOpen ? '[-]' : '[+]'}</span>
            </button>

            {isOpen && (
                <div className="px-4 py-4 text-sm border-t-2 border-black bg-neutral-50 space-y-4">
                    <div className="p-3 bg-yellow-100 border-2 border-yellow-400 text-yellow-900 text-xs font-bold uppercase mb-4">
                        ⚠️ Warning: You are writing System Dev Keys. These will be stored in the DB (tenant_owned_keys).
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs uppercase font-bold mb-1">Client ID</label>
                            <input
                                className="w-full border-2 border-black px-3 py-2 font-mono text-sm"
                                value={clientId}
                                onChange={(e) => setClientId(e.target.value)}
                                placeholder="CLIENT_ID"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase font-bold mb-1">Client Secret</label>
                            <input
                                type="password"
                                className="w-full border-2 border-black px-3 py-2 font-mono text-sm"
                                value={clientSecret}
                                onChange={(e) => setClientSecret(e.target.value)}
                                placeholder="••••••••••••••••"
                            />
                        </div>

                        <button
                            onClick={saveKeys}
                            disabled={loading}
                            className="w-full py-3 bg-black text-white font-bold uppercase hover:bg-neutral-800 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Keys'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
