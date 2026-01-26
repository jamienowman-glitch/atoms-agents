"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default function TypographyRegistry() {
    const router = useRouter();
    const supabase = createClient();

    // State
    const [fonts, setFonts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        async function fetchFonts() {
            setLoading(true);
            const { data, error } = await supabase
                .from('font_families')
                .select('*')
                .order('name');

            if (error) {
                console.error("Error fetching fonts:", error);
            } else {
                setFonts(data || []);
            }
            setLoading(false);
        }

        fetchFonts();
    }, []);

    return (
        <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4 md:p-12 font-sans text-black">
            <div className="w-full max-w-6xl min-h-[80vh] bg-graph-paper border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col relative">

                {/* HEAD */}
                <header className="p-12 border-b-4 border-black bg-white">
                    <h1 className="text-6xl font-black uppercase tracking-tighter mb-2">Typography</h1>
                    <p className="font-mono text-sm uppercase tracking-widest opacity-60">System Registry (Supabase) • Font Management</p>
                </header>

                <div className="flex-1 p-12">
                    <div className="flex justify-between items-end mb-8">
                        <h2 className="text-2xl font-bold uppercase border-b-2 border-black pb-2">Installed Families ({fonts.length})</h2>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-black text-white px-6 py-2 font-bold uppercase text-sm hover:bg-blue-600 transition-colors"
                        >
                            + Install New Font
                        </button>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center text-4xl font-black animate-pulse uppercase tracking-widest opacity-50">Loading Registry...</div>
                    ) : (
                        <div className="grid gap-4">
                            {/* Dynamic Style Injection for Uploaded Fonts */}
                            <style jsx global>{`
                                ${fonts.filter(f => f.variable_name && f.variable_name.startsWith('http')).map(f => `
                                    @font-face {
                                        font-family: '${f.name}';
                                        src: url('${f.variable_name}');
                                    }
                                `).join('\n')}
                            `}</style>

                            {fonts.map(font => {
                                const isUpload = font.variable_name?.startsWith('http');
                                const style = isUpload
                                    ? { fontFamily: `'${font.name}'` }
                                    : { fontFamily: font.variable_name ? `var(${font.variable_name})` : 'sans-serif' };

                                return (
                                    <div key={font.id} className={`border-2 border-black p-6 bg-white flex justify-between items-center`}>
                                        <div>
                                            <h3 className="text-4xl" style={style}>
                                                {font.name}
                                            </h3>
                                            <div className="text-xs font-mono mt-2 space-x-4">
                                                <span className="bg-black text-white px-2 py-0.5">{font.type}</span>
                                                <span className="uppercase opacity-60">Source: {font.source}</span>
                                                <span className="uppercase opacity-60">Range: {font.weights}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-5xl font-thin tracking-tighter" style={style}>Aa</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* INSTALL MODAL */}
                    {showModal && (
                        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
                            <div className="bg-white max-w-2xl w-full border-4 border-white p-8 animate-in fade-in zoom-in duration-200">
                                <h3 className="text-4xl font-black uppercase mb-6">Install New Font</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* GOOGLE FONTS */}
                                    <div className="border-4 border-black p-8 text-center hover:bg-neutral-100 group">
                                        <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🔍</div>
                                        <div className="font-bold uppercase">Google Fonts</div>
                                        <p className="text-xs mono opacity-60 mt-2 mb-4">Find variable fonts</p>
                                        <a
                                            href="https://fonts.google.com/?vfonly=true"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block bg-black text-white py-2 font-bold uppercase text-sm hover:bg-neutral-800"
                                        >
                                            Browse External
                                        </a>
                                    </div>

                                    {/* UPLOAD */}
                                    <div className="border-4 border-black p-8 flex flex-col">
                                        <div className="text-4xl mb-2 text-center">📂</div>
                                        <h4 className="font-bold uppercase text-center mb-4">Upload File</h4>

                                        <form onSubmit={async (e) => {
                                            e.preventDefault();
                                            const form = e.target as HTMLFormElement;
                                            const fileInput = form.elements.namedItem('fontFile') as HTMLInputElement;
                                            const nameInput = form.elements.namedItem('fontName') as HTMLInputElement;
                                            const file = fileInput.files?.[0];
                                            if (!file || !nameInput.value) return;

                                            setLoading(true);
                                            // 1. Upload
                                            const fileExt = file.name.split('.').pop();
                                            const fileName = `${Date.now()}.${fileExt}`;
                                            const { error: uploadError } = await supabase.storage.from('fonts').upload(fileName, file);

                                            if (uploadError) {
                                                alert("Upload Failed: " + uploadError.message);
                                                setLoading(false);
                                                return;
                                            }

                                            // 2. Get URL
                                            const { data: { publicUrl } } = supabase.storage.from('fonts').getPublicUrl(fileName);

                                            // 3. Register
                                            const { error: dbError } = await supabase.from('font_families').insert({
                                                name: nameInput.value,
                                                type: 'Upload',
                                                source: 'Local Upload',
                                                weights: 'Variable', // Assume variable or fill later
                                                variable_name: publicUrl // Storing URL in variable_name column for now (Refactor needed)
                                            });

                                            if (dbError) {
                                                alert("DB Error: " + dbError.message);
                                            } else {
                                                setShowModal(false);
                                                window.location.reload(); // Quick refresh to load
                                            }
                                            setLoading(false);
                                        }} className="space-y-4 flex-1 flex flex-col justify-end">

                                            <div>
                                                <label className="text-xs font-bold uppercase block mb-1">Family Name</label>
                                                <input name="fontName" type="text" required placeholder="e.g. My Custom Font" className="w-full border-2 border-black p-2 font-mono text-sm" />
                                            </div>

                                            <div>
                                                <label className="text-xs font-bold uppercase block mb-1">Font File (.ttf/.woff2)</label>
                                                <input name="fontFile" type="file" required accept=".ttf,.woff2,.otf" className="w-full font-mono text-xs" />
                                            </div>

                                            <button type="submit" disabled={loading} className="w-full bg-black text-white py-2 font-bold uppercase text-sm hover:bg-neutral-800 disabled:opacity-50">
                                                {loading ? 'Uploading...' : 'Upload & Register'}
                                            </button>
                                        </form>
                                    </div>
                                </div>

                                <div className="flex justify-end mt-8">
                                    <button onClick={() => setShowModal(false)} className="font-bold uppercase hover:text-red-500">Close</button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-12 bg-[#ffffeb] border-2 border-black p-6">
                        <h4 className="font-bold uppercase text-sm mb-2">📝 Note</h4>
                        <p className="font-mono text-xs leading-relaxed">
                            Typography is managed globally via <code>public.font_families</code>. Adding a font here updates the <code>layout.tsx</code> injection and CSS variables.
                        </p>
                    </div>
                </div>

                {/* FOOTER NAV */}
                <div className="p-8 border-t-4 border-black bg-white flex justify-between">
                    <button onClick={() => router.push('/dashboard')} className="font-bold uppercase tracking-widest hover:underline">
                        ← System Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
