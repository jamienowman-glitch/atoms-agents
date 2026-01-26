"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { isGodUser } from '@/lib/god';

// NAVIGATION ITEMS (Updated for Hierarchy)
const MENU_ITEMS = [
    { id: 'surfaces', label: 'SURFACES', action: 'navigate', path: '/dashboard/surfaces' },
    { id: 'canvases', label: 'CANVASES', action: 'navigate', path: '/dashboard/canvases' },
    { id: 'typography', label: 'TYPOGRAPHY', action: 'navigate', path: '/dashboard/typography' },
    { id: 'infra', label: 'INFRASTRUCTURE', action: 'navigate', path: '/dashboard/infra' },
    { id: 'memory', label: 'MEMORY (NEXUS)', action: 'navigate', path: '/dashboard/memory' },
    { id: 'domain', label: 'DOMAIN', action: 'editor', configType: 'domain' },
    { id: 'cogs', label: 'COGS', action: 'navigate', path: '/dashboard/cogs', disabled: true },
    { id: 'ui_atoms', label: 'UI ATOMS', action: 'navigate', path: '/dashboard/ui-atoms', disabled: true },
    { id: 'email', label: 'EMAIL', action: 'editor', configType: 'domain' }
];

export default function Dashboard() {
    const router = useRouter();
    const supabase = createClient();
    const [user, setUser] = useState<any>(null);
    const [accessDenied, setAccessDenied] = useState(false);

    // Editors & State
    const [activeEditor, setActiveEditor] = useState<string | null>(null);
    const [editorContent, setEditorContent] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) {
                router.push('/login');
            } else {
                if (!isGodUser(user.email)) {
                    setAccessDenied(true);
                    return;
                }
                setUser(user);
            }
        });
    }, []);

    const handleAction = async (item: any) => {
        if (item.action === 'navigate') {
            router.push(item.path);
        } else if (item.action === 'editor') {
            setActiveEditor(item.configType);
            const res = await fetch(`/api/god/config/${item.configType}`);
            const data = await res.json();
            if (data.content) setEditorContent(data.content);
        }
    };

    const saveConfig = async () => {
        if (!activeEditor) return;
        setSaving(true);
        await fetch(`/api/god/config/${activeEditor}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: editorContent })
        });
        setSaving(false);
        setActiveEditor(null);
    };

    if (accessDenied) {
        return (
            <div className="min-h-screen bg-black text-red-600 font-mono flex items-center justify-center p-12">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">ACCESS DENIED</h1>
                    <button onClick={() => supabase.auth.signOut().then(() => router.push('/login'))} className="border border-red-600 px-6 py-2">EJECT</button>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4 md:p-12 font-sans">

            {/* SETTINGS CARD */}
            <div className="w-full max-w-5xl min-h-[70vh] bg-graph-paper border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-12 flex flex-col relative">

                {/* HEADER */}
                <div className="mb-12 border-b-4 border-black pb-4">
                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-2">(A)TOMS-FAM</h1>
                    <p className="font-bold text-lg tracking-[0.2em] uppercase">SYSTEM DASHBOARD</p>
                </div>

                {/* MENU LIST */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-12 content-start">
                    <ul className="space-y-6">
                        {MENU_ITEMS.map((item) => (
                            <li key={item.id} className="flex flex-col">
                                <button
                                    onClick={() => handleAction(item)}
                                    className="text-left text-3xl md:text-4xl font-bold text-black hover:text-blue-600 hover:tracking-wide transition-all flex items-center gap-4 group uppercase"
                                >
                                    {item.label}
                                    {item.action === 'navigate' && <span className="opacity-0 group-hover:opacity-100 transition-opacity text-2xl">→</span>}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="hidden md:block border-l-2 border-black/10 pl-12 pt-2">
                        <p className="font-mono text-sm text-neutral-500 uppercase tracking-widest mb-4">Context info</p>
                        <div className="text-lg font-medium leading-relaxed">
                            Welcome to the Mainframe. Configure registries, forge surfaces, and manage the OS.
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t-2 border-black flex justify-between items-center">
                    <span className="text-xs font-mono uppercase text-neutral-400">
                        {user.email} • God Mode
                    </span>
                </div>
            </div>

            {/* MODAL EDITOR */}
            {activeEditor && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 md:p-12">
                    <div className="bg-white w-full max-w-6xl h-[80vh] flex flex-col border-4 border-white shadow-2xl relative">
                        <div className="bg-black text-white p-6 flex justify-between items-center">
                            <h3 className="text-2xl font-black font-mono uppercase tracking-tighter">{activeEditor} CONFIG</h3>
                            <button onClick={() => setActiveEditor(null)} className="hover:text-red-500 font-bold text-xl">CLOSE</button>
                        </div>
                        <textarea
                            value={editorContent}
                            onChange={(e) => setEditorContent(e.target.value)}
                            className="w-full h-full p-8 font-mono text-base bg-[#1e1e1e] text-[#d4d4d4] resize-none focus:outline-none leading-relaxed"
                            spellCheck={false}
                        />
                        <div className="p-6 border-t-4 border-black flex justify-end gap-6 bg-white">
                            <button onClick={saveConfig} className="px-8 py-3 bg-black text-white font-bold uppercase hover:opacity-80 text-sm tracking-widest">
                                {saving ? 'Saving...' : 'Save Configuration'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
