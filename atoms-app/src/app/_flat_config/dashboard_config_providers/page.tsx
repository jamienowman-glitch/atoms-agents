"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client'; // Assuming standard utils path

interface Provider {
    id: string;
    name: string;
    driver: string;
    created_at: string;
}

export default function ProvidersConfigPage() {
    const [providers, setProviders] = useState<Provider[]>([]);
    const [name, setName] = useState('');
    const [driver, setDriver] = useState('cloudflare_registrar');
    const [secretKey, setSecretKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState('');

    const supabase = createClient();

    useEffect(() => {
        fetchProviders();
    }, []);

    const fetchProviders = async () => {
        const { data, error } = await supabase
            .from('infrastructure_providers')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setProviders(data);
        if (error) console.error('Error fetching providers:', error);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus('Securing key...');

        try {
            const res = await fetch('/api/vault/write', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, driver, secret_key: secretKey }),
            });

            if (!res.ok) {
                throw new Error('Failed to save provider');
            }

            setStatus('Success! Key secured in Vault.');
            setName('');
            setSecretKey('');
            fetchProviders(); // Refresh list

            setTimeout(() => setStatus(''), 3000);

        } catch (error) {
            console.error(error);
            setStatus('Error saving provider.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto text-white">
            <h1 className="text-3xl font-bold mb-8">Infrastructure Providers</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Add New Provider Form */}
                <div className="bg-[#111] border border-gray-800 p-6 rounded-lg">
                    <h2 className="text-xl font-bold mb-4">Add New Provider</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs uppercase text-gray-400 mb-1">Provider Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. My Cloudflare Account"
                                className="w-full bg-black border border-gray-700 p-3 rounded text-sm text-white focus:border-blue-500 outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs uppercase text-gray-400 mb-1">Driver</label>
                            <select
                                value={driver}
                                onChange={(e) => setDriver(e.target.value)}
                                className="w-full bg-black border border-gray-700 p-3 rounded text-sm text-white focus:border-blue-500 outline-none"
                            >
                                <option value="cloudflare_registrar">Cloudflare Registrar</option>
                                <option value="namecheap">Namecheap</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs uppercase text-gray-400 mb-1">API Key / Token</label>
                            <input
                                type="password"
                                value={secretKey}
                                onChange={(e) => setSecretKey(e.target.value)}
                                placeholder="sk-..."
                                className="w-full bg-black border border-gray-700 p-3 rounded text-sm text-white focus:border-blue-500 outline-none"
                                required
                            />
                            <p className="text-[10px] text-gray-500 mt-1">
                                Security Note: This key is never stored in the database. It is written to disk in <code>~/northstar-keys/</code> via a secure API.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Encrypting & Saving...' : 'Securely Add Provider'}
                        </button>

                        {status && <p className="text-center text-sm mt-2">{status}</p>}
                    </form>
                </div>

                {/* Existing Providers List */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Active Providers</h2>
                    <div className="space-y-2">
                        {providers.length === 0 && <p className="text-gray-500">No providers configured.</p>}
                        {providers.map((p) => (
                            <div key={p.id} className="bg-[#111] border border-gray-800 p-4 rounded flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold">{p.name}</h3>
                                    <div className="text-xs text-gray-500 font-mono">{p.driver}</div>
                                    <div className="text-[10px] text-gray-600 font-mono mt-1">ID: {p.id}</div>
                                </div>
                                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
