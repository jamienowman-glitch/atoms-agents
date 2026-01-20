"use client";

import React from 'react';
import { usePageControl } from '../../../../context/PageControlContext';

function ExportPill({ children }: { children: React.ReactNode }) {
    return (
        <button
            className="px-3 py-1.5 rounded-full border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors"
            type="button"
        >
            {children}
        </button>
    );
}

export function ExportPanel() {
    const { isExportOpen, setExportOpen } = usePageControl();

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[70] transition-opacity duration-300 ${isExportOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setExportOpen(false)}
            />

            {/* Drawer Panel */}
            <div className={`fixed top-0 right-0 h-full w-[420px] bg-white shadow-2xl z-[80] transition-transform duration-300 transform ${isExportOpen ? 'translate-x-0' : 'translate-x-full'} border-l border-neutral-200 flex flex-col`}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-neutral-100">
                    <h2 className="text-lg font-semibold">Export</h2>
                    <button
                        onClick={() => setExportOpen(false)}
                        className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                        type="button"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                        <div className="text-sm font-semibold text-neutral-900">Export to Shopify</div>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-wrap gap-2">
                                <ExportPill>HTML Page</ExportPill>
                                <ExportPill>Liquid</ExportPill>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <ExportPill>HTML Github</ExportPill>
                                <ExportPill>CLOUDRUN</ExportPill>
                                <ExportPill>FTP</ExportPill>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <ExportPill>TSX Github</ExportPill>
                                <ExportPill>CLOUDRUN</ExportPill>
                                <ExportPill>FTP</ExportPill>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <ExportPill>Download TSX</ExportPill>
                                <ExportPill>LIQUID</ExportPill>
                                <ExportPill>HTML</ExportPill>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="text-center text-xs font-semibold tracking-[0.2em] text-neutral-500">AGENT TOUCH</div>
                        <div className="text-center text-sm text-neutral-700">Kickoff a new Agentflow with this as the contextlens</div>
                        <div className="flex flex-wrap justify-center gap-2">
                            <ExportPill>DiscordFlow</ExportPill>
                            <ExportPill>DMFlow</ExportPill>
                            <ExportPill>Pintrestflow</ExportPill>
                        </div>
                        <div className="text-xs text-neutral-500 whitespace-pre-line text-center">
                            I don&apos;t want everything to be made easy for me
                            {"\n"}Fast ain&apos;t always better than slow, you know
                            {"\n"}A home run every time would start to get boring after a while
                            {"\n"}I hope I never forget how to bleed
                            {"\n"}Buck 65, 50 Gallon Drum, 2003
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
