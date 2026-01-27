import React, { useEffect, useState, useMemo } from 'react';
import { useToolControl } from '../../harness/context/ToolControlContext';
import { RegistryClient, RegistryEntry } from '../../harness/registry/client';
import { ChatRail } from '../../harness/components/ChatRail';

// Layout Components (Stubbed inline for now to ensure structure)
const Panel = ({ children, title, className = '' }: { children: React.ReactNode, title: string, className?: string }) => (
    <div className={`flex flex-col bg-[#111] border-r border-white/10 ${className}`}>
        <div className="h-10 flex items-center px-4 border-b border-white/10 text-xs font-bold text-neutral-400 uppercase tracking-wider">
            {title}
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            {children}
        </div>
    </div>
);

const RegistryItem = ({ item, onSelect }: { item: RegistryEntry, onSelect: () => void }) => (
    <div
        onClick={onSelect}
        className="p-3 border-b border-white/5 hover:bg-white/5 cursor-pointer group transition-colors"
    >
        <div className="text-sm font-medium text-white group-hover:text-blue-400">{item.name}</div>
        <div className="text-xs text-neutral-500 mt-1 line-clamp-2">{item.summary || 'No description'}</div>
        <div className="mt-2 flex gap-1">
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-neutral-400 font-mono">{item.namespace}</span>
            {item.maturity && <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono">{item.maturity}</span>}
        </div>
    </div>
);

export default function ForgeCanvas() {
    const { transport } = useToolControl();
    const [muscles, setMuscles] = useState<RegistryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initialize Client
    const client = useMemo(() => transport ? new RegistryClient(transport) : null, [transport]);

    useEffect(() => {
        if (!client) return;

        const load = async () => {
            try {
                setLoading(true);
                // Load critical registries
                const [m, c, a] = await Promise.all([
                    client.getMuscles(),
                    client.getConnectors(),
                    client.getAtoms() // Will be empty until seeded, but harmless
                ]);
                // Merge for the library view? Or keep separate?
                // Merging for "All Capabilities" list
                setMuscles([...m, ...c]);
            } catch (err: any) {
                console.error("Registry Load Failed", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [client]);

    return (
        <div className="w-full h-full flex bg-black text-white overflow-hidden">
            {/* Left Rail: The Library (Muscles & Connectors) */}
            <Panel title="Registry" className="w-[300px] shrink-0 z-10">
                {loading && <div className="p-4 text-xs text-neutral-500">Loading Registry...</div>}
                {error && <div className="p-4 text-xs text-red-500">Error: {error}</div>}

                {!loading && muscles.length === 0 && (
                    <div className="p-4 text-xs text-neutral-500 italic">No Registry Entries Found</div>
                )}

                {muscles.map(m => (
                    <RegistryItem key={m.id} item={m} onSelect={() => console.log('Selected', m)} />
                ))}
            </Panel>

            {/* Center: The Graph / Visual Editor */}
            <div className="flex-1 relative bg-neutral-900 flex flex-col items-center justify-center">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]"></div>

                <div className="relative z-10 text-center space-y-4">
                    <div className="w-24 h-24 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl mx-auto mb-6">
                        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    </div>
                    <h1 className="text-3xl font-light tracking-tight">Contract Builder</h1>
                    <p className="text-neutral-500 max-w-md mx-auto">
                        Drag muscles from the registry to build a new Canvas Contract.
                        <br />Ask the Agent below to assist.
                    </p>
                </div>
            </div>

            {/* Right Rail: Properties (Stub) */}
            <Panel title="Properties" className="w-[300px] shrink-0 border-l border-white/10 border-r-0">
                <div className="p-4 text-xs text-neutral-500">
                    Select a node to configure inputs.
                </div>
            </Panel>

            {/* Chat Rail: Always Present */}
            <ChatRail />
        </div>
    );
}
