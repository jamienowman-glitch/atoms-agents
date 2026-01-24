"use client";

import React from 'react';

/* PREVIEW VERSION OF WORKBENCH DOCK (TOOL PILL) */

const Segmented = ({ options, value }: { options: string[], value: string }) => (
    <div className="flex rounded bg-neutral-100 p-0.5 gap-0.5">
        {options.map(opt => (
            <div key={opt} className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${value === opt ? 'bg-white shadow text-black' : 'text-neutral-400'}`}>
                {opt}
            </div>
        ))}
    </div>
);

export function PreviewToolPill() {
    return (
        <div className="w-[280px] bg-white rounded-xl shadow-2xl border border-neutral-200 p-4 font-sans">
            <div className="space-y-4">

                <div className="space-y-1">
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">View</div>
                    <Segmented options={['desktop', 'mobile']} value="desktop" />
                </div>

                <div className="space-y-1">
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Layout</div>
                    <Segmented options={['left', 'center', 'right']} value="left" />
                </div>

                <div className="space-y-1">
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Tile Variant</div>
                    <Segmented options={['generic', 'product', 'kpi']} value="generic" />
                </div>

                <div className="space-y-2 pt-2 border-t border-neutral-100">
                    {['Title', 'Meta', 'Badge', 'CTA Label'].map(label => (
                        <div key={label} className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded border border-neutral-300 bg-black text-white flex items-center justify-center text-[10px]">✓</div>
                            <span className="text-xs font-bold text-neutral-600">{label}</span>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
