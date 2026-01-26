"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { isGodUser } from '@/lib/god';

// NAVIGATION ITEMS (Atoms-Fam V1)
const MENU_ITEMS = [
    { id: 'infra', label: 'INFRASTRUCTURE', action: 'navigate', path: '/god/config/infra' }, // Placeholder
    { id: 'cogs', label: 'COGS', action: 'navigate', path: '/god/config/cogs' }, // Placeholder
    { id: 'surfaces', label: 'SURFACES', action: 'navigate', path: '/god/config/surfaces' },
    { id: 'canvases', label: 'CANVASES', action: 'navigate', path: '/god/config/canvases' },
    { id: 'muscles', label: 'MUSCLES', action: 'navigate', path: '/god/config/muscles' },
    { id: 'typography', label: 'TYPOGRAPHY', action: 'navigate', path: '/god/config/typography' },
    { id: 'ui_atoms', label: 'UI ATOMS', action: 'navigate', path: '/god/config/ui-atoms' }, // Placeholder
    { id: 'domain', label: 'DOMAIN', action: 'editor', configType: 'domain' },
    { id: 'email', label: 'EMAIL', action: 'editor', configType: 'domain' } // Aliased to domain for now as they are in same file
];

export default function GodConfigHub() {
    const router = useRouter();
    const supabase = createClient();
    const [user, setUser] = useState<any>(null);
    const [accessDenied, setAccessDenied] = useState(false);

    // Editors & State
    const [activeEditor, setActiveEditor] = useState<string | null>(null); // 'domain' | null
    const [editorContent, setEditorContent] = useState('');
    const [saving, setSaving] = useState(false);

    // UI Atoms Expansion
    const [expandedItem, setExpandedItem] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }: { data: { user: any } }) => {
            if (!user) router.push('/login');
            else setUser(user);
        });
    }, []);

    const handleAction = async (item: any) => {
        if (item.action === 'navigate') {
            router.push(item.path);
        } else if (item.action === 'editor') {
            setActiveEditor(item.configType);
            // Fetch Config
            const res = await fetch(`/api/god/config/${item.configType}`);
            const data = await res.json();
            if (data.content) setEditorContent(data.content);
        } else if (item.action === 'expand') {
            setExpandedItem(expandedItem === item.id ? null : item.id);
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
                    <p className="text-white mb-8">IDENTITY VERIFICATION FAILED.</p>
                    <button onClick={() => supabase.auth.signOut().then(() => router.push('/login'))} className="mt-8 border border-red-600 text-red-600 px-6 py-2 hover:bg-red-600 hover:text-black transition-colors">EJECT</button>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-graph-paper flex flex-col md:flex-row items-start justify-center p-4 md:p-12 font-sans">

            {/* SETTINGS CARD */}
            <div className="w-full max-w-md bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8">

                {/* HEADER */}
                <div className="mb-8">
                    <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-1">(A)TOMS-FAM</h1>
                    <p className="font-bold text-sm tracking-widest uppercase">SYSTEM SETTINGS:</p>
                </div>

                {/* MENU LIST */}
                <ul className="space-y-4">
                    {MENU_ITEMS.map((item) => (
                        <li key={item.id} className="flex flex-col">
                            <button
                                onClick={() => handleAction(item)}
                                className="text-left text-xl font-medium hover:font-black tracking-tight uppercase transition-all flex items-center gap-2 group"
                            >
                                {item.label}
                                {item.action === 'navigate' && <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* MODAL EDITOR (Re-used for Domain/Email) */}
            {activeEditor && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 md:p-12">
                    <div className="bg-white w-full max-w-4xl h-[70vh] flex flex-col border-2 border-white shadow-2xl">
                        <div className="bg-black text-white p-4 flex justify-between items-center">
                            <h3 className="font-bold font-mono uppercase">{activeEditor} CONFIG</h3>
                            <button onClick={() => setActiveEditor(null)} className="hover:text-red-500 font-bold">CLOSE</button>
                        </div>
                        <div className="flex-1 p-0 relative">
                            <textarea
                                value={editorContent}
                                onChange={(e) => setEditorContent(e.target.value)}
                                className="w-full h-full p-6 font-mono text-sm bg-[#1e1e1e] text-[#d4d4d4] resize-none focus:outline-none"
                                spellCheck={false}
                            />
                        </div>
                        <div className="p-4 border-t-2 border-black flex justify-end gap-4 bg-white">
                            <button
                                onClick={() => setActiveEditor(null)}
                                className="px-6 py-2 border-2 border-black font-bold uppercase hover:bg-neutral-100 text-black text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveConfig}
                                disabled={saving}
                                className="px-6 py-2 bg-black text-white font-bold uppercase hover:opacity-80 text-sm"
                            >
                                {saving ? 'Saving...' : 'Save Configuration'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* BACK LINK */}
            <div className="fixed bottom-8 left-8">
                <button onClick={() => router.push('/god')} className="text-xs font-mono font-bold uppercase tracking-widest hover:underline">
                    ← Back to System
                </button>
            </div>
        </div>
    );
}
