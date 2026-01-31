"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

// The 13 Presets (Thin -> Extra Black)
const PRESETS = [
    { name: 'Thin', weight: 100, italic: false },
    { name: 'Thin Italic', weight: 100, italic: true },
    { name: 'Extra Light', weight: 200, italic: false },
    { name: 'Extra Light Italic', weight: 200, italic: true },
    { name: 'Light', weight: 300, italic: false },
    { name: 'Light Italic', weight: 300, italic: true },
    { name: 'Regular', weight: 400, italic: false },
    { name: 'Regular Italic', weight: 400, italic: true },
    { name: 'Medium', weight: 500, italic: false },
    { name: 'Medium Italic', weight: 500, italic: true },
    { name: 'Bold', weight: 700, italic: false },
    { name: 'Bold Italic', weight: 700, italic: true },
    { name: 'Extra Black', weight: 900, italic: false },
    { name: 'Extra Black Italic', weight: 900, italic: true },
];

export default function TypographyRegistry() {
    const router = useRouter();
    const supabase = createClient();

    // State
    const [fonts, setFonts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFont, setSelectedFont] = useState<any>(null);

    useEffect(() => {
        async function fetchFonts() {
            setLoading(true);
            const { data, error } = await supabase
                .from('font_families')
                .select('*')
                .order('name');
            if (data) {
                setFonts(data);
                if (data.length > 0) setSelectedFont(data[0]);
            }
            setLoading(false);
        }
        fetchFonts();
    }, []);

    return (
        <div className="min-h-screen bg-neutral-100 p-4 md:p-12 font-sans text-black">
            <div className="max-w-7xl mx-auto bg-graph-paper border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col min-h-[80vh]">

                {/* HEADER */}
                <header className="p-8 border-b-4 border-black bg-white flex justify-between items-center">
                    <div>
                        <h1 className="text-6xl font-black uppercase tracking-tighter mb-1">Typography</h1>
                        <p className="font-mono text-sm uppercase tracking-widest opacity-60">System Registry • Vario Presets</p>
                    </div>
                    <button onClick={() => router.push('/god/config')} className="font-bold uppercase border-2 border-black px-6 py-2 hover:bg-black hover:text-white transition-colors">
                        ← Back to Config
                    </button>
                </header>

                <div className="flex-1 flex flex-col md:flex-row">

                    {/* SIDEBAR: FONT LIST */}
                    <div className="w-full md:w-64 border-r-4 border-black bg-white p-4 overflow-y-auto">
                        <h3 className="font-bold uppercase text-xs mb-4 opacity-50">Installed Families</h3>
                        {loading ? (
                            <div className="animate-pulse">Loading...</div>
                        ) : (
                            <ul className="space-y-2">
                                {fonts.map(font => (
                                    <li key={font.id}>
                                        <button
                                            onClick={() => setSelectedFont(font)}
                                            className={`w-full text-left px-4 py-2 font-bold uppercase text-sm border-2 ${selectedFont?.id === font.id ? 'bg-black text-white border-black' : 'border-transparent hover:border-black'}`}
                                        >
                                            {font.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* MAIN: PRESETS VIEW */}
                    <div className="flex-1 p-8 md:p-12 overflow-y-auto bg-white">
                        {selectedFont && (
                            <>
                                {/* Dynamic Style Injection */}
                                <style jsx global>{`
                                    ${selectedFont.variable_name && selectedFont.variable_name.startsWith('http') ? `
                                        @font-face {
                                            font-family: '${selectedFont.name}';
                                            src: url('${selectedFont.variable_name}');
                                        }
                                    ` : ''}
                                `}</style>

                                <div className="mb-12">
                                    <h2 className="text-4xl font-black uppercase mb-2">{selectedFont.name}</h2>
                                    <div className="flex gap-4 text-xs font-mono uppercase opacity-60">
                                        <span>Source: {selectedFont.source}</span>
                                        <span>Type: {selectedFont.type}</span>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    {PRESETS.map((preset, i) => {
                                        // Construct Style
                                        const style = {
                                            fontFamily: selectedFont.variable_name?.startsWith('http')
                                                ? `'${selectedFont.name}'`
                                                : `var(${selectedFont.variable_name}, sans-serif)`,
                                            fontWeight: preset.weight,
                                            fontStyle: preset.italic ? 'italic' : 'normal',
                                            // Assume variable axes for now if supported
                                            fontVariationSettings: `'wght' ${preset.weight}`
                                        };

                                        return (
                                            <div key={i} className="group hover:bg-neutral-50 p-4 border-b border-black/10 flex items-baseline gap-8">
                                                <div className="w-32 text-xs font-mono uppercase opacity-40 shrink-0">
                                                    {preset.name}
                                                    <br />
                                                    {preset.weight} {preset.italic && 'Italic'}
                                                </div>
                                                <div className="flex-1">
                                                    <p style={style} className="text-4xl md:text-5xl whitespace-nowrap overflow-hidden text-ellipsis">
                                                        The quick brown fox jumps over the lazy dog.
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
