import React, { useEffect, useState, useMemo } from 'react';
import { RegistryClient, RegistryEntry } from '../registry/client';
import { SurfaceCard } from './SurfaceCard';
import { CanvasTransport } from '../transport';

// Config (Should be injected or context, but hardcoding bridge for now)
const TRANSPORT_CONFIG = {
    httpHost: 'http://localhost:8000', // The Bridge
    wsHost: 'ws://localhost:8000',
    token: 'mock_token', // We'll inject real token later if we use ToolControlContext
    context: {
        tenant_id: 't_system',
        mode: 'saas' as const,
        project_id: 'console',
        request_id: 'launcher',
        user_id: 'console_user'
    }
};

export const LauncherGrid = ({ onLaunch }: { onLaunch: (slug: string) => void }) => {
    const [surfaces, setSurfaces] = useState<RegistryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Standalone client for the launcher
    const client = useMemo(() => new RegistryClient(new CanvasTransport(TRANSPORT_CONFIG)), []);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const list = await client.getSurfaces();
                setSurfaces(list);
            } catch (e: any) {
                console.error("Launcher Load Error", e);
                setError(e.message);
                // Fallback for Demo until Registry is fully mounted?
                // setSurfaces([
                //     { id: '1', namespace: 'surfaces', key: 'agnx', name: 'AGNˣ Marketing', summary: 'AI Marketing Agents', config: {} },
                //     { id: '2', namespace: 'surfaces', key: 'mc2', name: '=mc2 Health', summary: 'Personal Energy Optimization', config: {} }
                // ]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [client]);

    if (loading) return <div className="text-neutral-500 text-sm animate-pulse">Loading Surfaces...</div>;
    if (error) return <div className="text-red-500 text-sm">Error connecting to OS: {error}</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto p-6">
            {/* Hardcoded Contract Builder Card for Phase 10 access */}
            <div
                onClick={() => onLaunch('contract-builder')}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer border border-blue-500/30 hover:border-blue-500 transition-all duration-300 bg-blue-900/10"
            >
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <div>
                        <div className="text-xs font-mono text-blue-400 mb-2 uppercase tracking-widest">System</div>
                        <h3 className="text-2xl font-light text-white tracking-tight">Contract Builder</h3>
                    </div>
                    <p className="text-sm text-blue-200/60">Canvas Contract Editor</p>
                </div>
            </div>

            {surfaces.map(s => (
                <SurfaceCard
                    key={s.id}
                    surface={s}
                    onClick={() => onLaunch(s.key)}
                />
            ))}
        </div>
    );
};
