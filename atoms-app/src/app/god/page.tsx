"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { getSystemSurfaces } from '@/lib/registry';
import { isGodUser } from '@/lib/god';

// Definition of God Tools
const GOD_TOOLS = [
    {
        id: 'forge',
        title: 'Contract Builder',
        description: 'Visual Contract Editor. Build and Modify Canvases.',
        path: '/forge',
        locked: false
    },
    {
        id: 'config',
        title: 'System Config',
        description: 'Global Settings, Surfaces, Pricing & Feeds.',
        path: '/god/config',
        locked: false
    },
    {
        id: 'agnx',
        title: 'AGNˣ Marketing',
        description: 'Open the Marketing Surface (Tenant Context).',
        path: '/surface/agnx',
        locked: false
    },
    {
        id: 'mc2',
        title: '=mc²',
        description: 'Open the Health & Energy Surface.',
        path: '/surface/mc2',
        locked: false
    },
    {
        id: 'registry',
        title: 'Registry Browser',
        description: 'Direct Database Inspection.',
        path: '/registry',
        locked: true
    },
    {
        id: 'health',
        title: 'System Health',
        description: 'Real-time OS status and heartbeat.',
        path: '/system/health',
        locked: false
    }
];

export default function GodConsole() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [surfaces, setSurfaces] = useState<any[]>([]);
    const [accessDenied, setAccessDenied] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
            } else {
                if (!isGodUser(user.email)) {
                    setAccessDenied(true);
                    return;
                }

                setUser(user);
                // Fetch Registry Surfaces
                const items = await getSystemSurfaces(supabase);
                setSurfaces(items);
            }
        };
        init();
    }, [router, supabase]);

    if (accessDenied) {
        return (
            <div className="min-h-screen bg-black text-red-600 font-mono flex items-center justify-center p-12">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">ACCESS DENIED</h1>
                    <p className="text-white mb-8">IDENTITY VERIFICATION FAILED.</p>
                    <p className="text-neutral-500 text-xs">This incident has been logged.</p>
                    <button
                        onClick={() => supabase.auth.signOut().then(() => router.push('/login'))}
                        className="mt-8 border border-red-600 text-red-600 px-6 py-2 hover:bg-red-600 hover:text-black transition-colors"
                    >
                        EJECT
                    </button>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-graph-paper p-12 md:p-24 text-black">
            <header className="mb-16 border-b-2 border-black pb-4 flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-black tracking-tighter uppercase mb-2">Atoms-Fam</h1>
                    <p className="text-sm font-mono uppercase tracking-widest text-neutral-500">System Admin • God Mode</p>
                </div>
                <div className="text-right">
                    <p className="text-xs font-mono mb-1">{user.email}</p>
                    <button
                        onClick={() => supabase.auth.signOut().then(() => router.refresh())}
                        className="text-xs underline hover:text-red-600 font-bold"
                    >
                        LOGOUT
                    </button>
                </div>
            </header>

            <main className="max-w-4xl">
                <div className="space-y-12">
                    {GOD_TOOLS.map(tool => (
                        <div
                            key={tool.id}
                            onClick={() => !tool.locked && router.push(tool.path)}
                            className={`group block border-l-4 pl-6 py-2 transition-all duration-200 ${tool.locked ? 'border-gray-200 opacity-50 cursor-not-allowed' : 'border-black cursor-pointer hover:border-l-8 hover:pl-8'}`}
                        >
                            <h2 className="text-3xl font-bold mb-1 group-hover:underline decoration-2 underline-offset-4">{tool.title}</h2>
                            <p className="text-neutral-600 text-lg font-light leading-snug max-w-xl">{tool.description}</p>
                        </div>
                    ))}

                    {/* DYNAMIC REGISTRY SURFACES */}
                    <div className="pt-8 border-t-2 border-dashed border-black/20">
                        <h3 className="text-sm font-mono uppercase text-neutral-400 mb-6">Active Surfaces (DB)</h3>
                        {surfaces.map(surface => (
                            <div
                                key={surface.id}
                                onClick={() => router.push(`/surface/${surface.key}`)}
                                className="group block border-l-4 border-blue-600 pl-6 py-2 mb-8 transition-all duration-200 cursor-pointer hover:border-l-8 hover:pl-8"
                            >
                                <h2 className="text-3xl font-bold mb-1 group-hover:underline decoration-2 underline-offset-4 text-blue-900">{surface.name}</h2>
                                <p className="text-neutral-600 text-lg font-light leading-snug max-w-xl">{surface.description}</p>
                                {surface.config?.blurb && (
                                    <p className="text-xs font-mono text-blue-500 mt-2">"{surface.config.blurb}"</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <footer className="fixed bottom-8 right-12 text-right">
                <div className="text-[10px] font-mono text-neutral-400">
                    V2.0.1 SYSTEM ONLINE<br />
                    LATENCY: 12ms
                </div>
            </footer>
        </div>
    );
}
