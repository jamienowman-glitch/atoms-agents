"use client";

import React, { useState, useEffect } from 'react';

interface SecretDef {
    key: string;
    label: string;
    description?: string;
}

interface ConnectorManifest {
    slug: string;
    provider_slug: string;
    name: string;
    secrets?: SecretDef[];
    scopes?: string[];
    requires_firearm?: boolean;
}

interface FirearmType {
    id: number;
    label: string;
}
interface KPI {
    id: number;
    key: string;
    label: string;
}

export default function ConnectorsPage() {
    const [view, setView] = useState<'connectors' | 'metadata'>('connectors');

    const [connectors, setConnectors] = useState<ConnectorManifest[]>([]);
    const [selected, setSelected] = useState<ConnectorManifest | null>(null);
    const [tenant, setTenant] = useState('default');
    const [secretValues, setSecretValues] = useState<Record<string, string>>({});
    const [status, setStatus] = useState<string>('');

    // Metadata State
    const [firearms, setFirearms] = useState<FirearmType[]>([]);
    const [kpis, setKpis] = useState<KPI[]>([]);
    const [loadingMeta, setLoadingMeta] = useState(false);

    // Form State
    const [newFirearmLabel, setNewFirearmLabel] = useState('');
    const [newKpiKey, setNewKpiKey] = useState('');
    const [newKpiLabel, setNewKpiLabel] = useState('');

    useEffect(() => {
        // Fetch Connectors
        fetch('/api/connectors/local')
            .then(res => res.json())
            .then(data => {
                if (data.success) setConnectors(data.connectors);
            })
            .catch(err => console.error(err));

        // Fetch Metadata
        fetchMetadata();
    }, []);

    const fetchMetadata = () => {
        setLoadingMeta(true);
        fetch('/api/connectors/metadata')
            .then(res => res.json())
            .then(data => {
                if (data.firearms) setFirearms(data.firearms);
                if (data.kpis) setKpis(data.kpis);
                setLoadingMeta(false);
            })
            .catch(e => { console.error(e); setLoadingMeta(false); });
    };

    const handleSaveSecret = async (secretKey: string) => {
        if (!selected) return;
        const value = secretValues[secretKey];
        if (!value) return;

        setStatus(`Saving ${secretKey}...`);
        try {
            const res = await fetch('/api/connectors/vault', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tenant,
                    provider: selected.provider_slug,
                    field: secretKey,
                    value
                })
            });
            const json = await res.json();
            if (json.success) setStatus(`✅ Saved: ${json.key}`);
            else setStatus(`❌ Error: ${json.error}`);
        } catch (e: any) {
            setStatus(`❌ Error: ${e.message}`);
        }
    };

    const handleAddFirearm = async () => {
        if (!newFirearmLabel) return;
        try {
            await fetch('/api/connectors/metadata', {
                method: 'POST',
                body: JSON.stringify({ type: 'firearm', label: newFirearmLabel })
            });
            setNewFirearmLabel('');
            fetchMetadata();
        } catch (e) { console.error(e); }
    };

    const handleAddKPI = async () => {
        if (!newKpiKey || !newKpiLabel) return;
        try {
            await fetch('/api/connectors/metadata', {
                method: 'POST',
                body: JSON.stringify({ type: 'kpi', key: newKpiKey, label: newKpiLabel })
            });
            setNewKpiKey('');
            setNewKpiLabel('');
            fetchMetadata();
        } catch (e) { console.error(e); }
    };

    return (
        <div className="flex h-screen bg-black text-white">
            {/* Sidebar List */}
            <div className="w-1/4 border-r border-gray-800 flex flex-col">
                <div className="p-4 border-b border-gray-800">
                    <h2 className="text-xl font-bold mb-4">🏭 Factory</h2>
                    <div className="flex gap-2 bg-zinc-900 rounded p-1">
                        <button
                            onClick={() => setView('connectors')}
                            className={`flex-1 py-1 px-2 rounded text-sm ${view === 'connectors' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            Connectors
                        </button>
                        <button
                            onClick={() => setView('metadata')}
                            className={`flex-1 py-1 px-2 rounded text-sm ${view === 'metadata' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            Metadata
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {view === 'connectors' ? (
                        <>
                            {connectors.map(c => (
                                <button
                                    key={c.slug}
                                    onClick={() => { setSelected(c); setStatus(''); }}
                                    className={`w-full text-left p-3 rounded ${selected?.slug === c.slug ? 'bg-blue-900 border border-blue-500' : 'bg-zinc-900 hover:bg-zinc-800'}`}
                                >
                                    <div className="font-bold">{c.name}</div>
                                    <div className="text-xs text-gray-400">{c.provider_slug}</div>
                                </button>
                            ))}
                            {connectors.length === 0 && <div className="text-gray-500 text-sm">Scanning...</div>}
                        </>
                    ) : (
                        <div className="text-sm text-gray-500 italic">
                            Configure global definitions for Firearms and KPIs.
                        </div>
                    )}
                </div>
            </div>

            {/* Main Config Area */}
            <div className="flex-1 p-8 overflow-y-auto bg-[#0a0a0a]">
                {view === 'connectors' ? (
                    selected ? (
                        <div className="max-w-3xl mx-auto">
                            <div className="mb-8 border-b border-gray-800 pb-4">
                                <h1 className="text-3xl font-bold mb-2">{selected.name} <span className="text-gray-500 text-lg font-normal">({selected.provider_slug})</span></h1>
                                {selected.requires_firearm && (
                                    <span className="bg-red-900/50 text-red-400 px-2 py-1 rounded text-xs border border-red-800 uppercase font-bold tracking-wider">Requires Firearm</span>
                                )}
                            </div>

                            {/* Tenant Selection */}
                            <div className="mb-8 bg-zinc-900/50 p-6 rounded-lg border border-gray-800">
                                <label className="block text-gray-400 text-xs uppercase mb-2">Target Tenant</label>
                                <input
                                    type="text"
                                    value={tenant}
                                    onChange={e => setTenant(e.target.value)}
                                    className="bg-black border border-gray-700 p-2 rounded text-white w-full max-w-xs font-mono"
                                />
                                <p className="text-gray-500 text-xs mt-2">Secrets will be prefixed with <code>{tenant.toUpperCase()}_</code></p>
                            </div>

                            {/* Secrets Manager */}
                            <div className="mb-8">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">🔑 Secrets Vault</h3>
                                {!selected.secrets || selected.secrets.length === 0 ? (
                                    <div className="text-gray-500 italic">No secrets defined in manifest.yaml.</div>
                                ) : (
                                    <div className="space-y-6">
                                        {selected.secrets.map(sec => (
                                            <div key={sec.key} className="bg-[#111] p-4 rounded border border-gray-800 flex gap-4 items-end">
                                                <div className="flex-1">
                                                    <label className="block text-sm font-bold mb-1">{sec.label || sec.key}</label>
                                                    <div className="text-xs text-gray-500 mb-2 font-mono">
                                                        Key: {tenant.toUpperCase()}_{selected.provider_slug.toUpperCase()}_{sec.key.toUpperCase()}
                                                    </div>
                                                    <input
                                                        type="password"
                                                        value={secretValues[sec.key] || ''}
                                                        onChange={e => setSecretValues({ ...secretValues, [sec.key]: e.target.value })}
                                                        placeholder={`Enter ${sec.key}...`}
                                                        className="w-full bg-black border border-gray-700 p-2 rounded text-white focus:border-blue-500 outline-none"
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => handleSaveSecret(sec.key)}
                                                    className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded h-[42px] border border-gray-700 transition-colors whitespace-nowrap"
                                                >
                                                    Save Securely
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {status && (
                                <div className="fixed bottom-8 right-8 bg-zinc-900 border border-gray-700 p-4 rounded shadow-2xl z-50">
                                    {status}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">Select a connector to configure.</div>
                    )
                ) : (
                    // Metadata View
                    <div className="max-w-4xl mx-auto space-y-12">
                        <div>
                            <h1 className="text-3xl font-bold mb-8">Metadata Persistence</h1>

                            {/* Firearms */}
                            <div className="mb-12">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-500">🔫 Firearm Registry</h3>
                                <div className="bg-[#111] border border-gray-800 rounded-lg p-6">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                                        {firearms.map((f: any) => (
                                            <div key={f.id} className="bg-zinc-900 p-3 rounded text-center border border-zinc-700">
                                                {f.label}
                                            </div>
                                        ))}
                                        {firearms.length === 0 && <div className="text-gray-500 text-sm">No firearms defined.</div>}
                                    </div>

                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newFirearmLabel}
                                            onChange={e => setNewFirearmLabel(e.target.value)}
                                            placeholder="New Firearm Type (e.g. Pistol)"
                                            className="flex-1 bg-black border border-gray-700 p-2 rounded"
                                        />
                                        <button onClick={handleAddFirearm} className="bg-red-900 hover:bg-red-800 text-white px-4 py-2 rounded transition-colors">
                                            + Add Type
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* KPIs */}
                            <div>
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-500">📊 Global KPIs</h3>
                                <div className="bg-[#111] border border-gray-800 rounded-lg p-6">
                                    <table className="w-full text-left text-sm mb-6">
                                        <thead className="text-gray-500 border-b border-gray-800">
                                            <tr>
                                                <th className="pb-2">Key</th>
                                                <th className="pb-2">Label</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-800">
                                            {kpis.map((k: any) => (
                                                <tr key={k.id}>
                                                    <td className="py-2 font-mono text-blue-400">{k.key}</td>
                                                    <td className="py-2">{k.label}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newKpiKey}
                                            onChange={e => setNewKpiKey(e.target.value)}
                                            placeholder="kpi_key (snake_case)"
                                            className="flex-1 bg-black border border-gray-700 p-2 rounded font-mono text-sm"
                                        />
                                        <input
                                            type="text"
                                            value={newKpiLabel}
                                            onChange={e => setNewKpiLabel(e.target.value)}
                                            placeholder="Label"
                                            className="flex-1 bg-black border border-gray-700 p-2 rounded"
                                        />
                                        <button onClick={handleAddKPI} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded transition-colors">
                                            + Add KPI
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
