import React from 'react';
import { motion } from 'framer-motion';

interface LoggingLensProps {
    onClose: () => void;
}

// MOCK DATA for Visualization
const MOCK_NODES = [
    { id: '1', type: 'agent', name: 'Researcher', role: 'Data Mining', logs: Array.from({ length: 15 }).map((_, i) => `Found relevant paper regarding quantum resistance #${i + 1}`) },
    { id: '2', type: 'blackboard', name: 'Context Board', role: 'Shared Memory', logs: ['Researcher wrote: Quantum Paper', 'Analyst read: Quantum Paper', 'Critic wrote: Verify sources'] },
    { id: '3', type: 'agent', name: 'Analyst', role: 'Synthesis', logs: Array.from({ length: 12 }).map((_, i) => `Synthesizing data points for coherent strategy... step ${i}`) },
    { id: '4', type: 'framework', name: 'Review Team', role: 'Vetting', logs: ['Started review process', 'Flagged citation 3', 'Approved layout'] },
];

export function LoggingLens({ onClose }: LoggingLensProps) {
    return (
        <div className="fixed inset-0 z-[60] bg-neutral-50 dark:bg-neutral-900 flex flex-col animate-in fade-in duration-300">

            {/* HERDER / NAV */}
            <div className="h-14 border-b border-neutral-200 dark:border-white/10 flex items-center justify-between px-4 bg-white dark:bg-black shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-mono text-sm font-bold uppercase tracking-wider">Logging Lens (Live)</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-xs text-neutral-400">Run ID: <span className="font-mono text-black dark:text-white">8f-29a</span></div>
                    <button onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex overflow-hidden relative">

                {/* 1. TIMELINE RAIL (Fixed Left) */}
                <div className="w-12 border-r border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-black/50 shrink-0 flex flex-col items-center py-4 gap-1">
                    <div className="text-[9px] font-mono text-neutral-400 -rotate-90 w-12 h-12 flex items-center justify-center mb-4">TIME</div>
                    {/* Time Markers */}
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-1 h-[60px]">
                            <div className="w-px h-full bg-neutral-200 dark:bg-white/10" />
                            <div className="w-2 h-[1px] bg-neutral-300 dark:bg-white/20" />
                            <span className="text-[8px] font-mono text-neutral-300">{i}s</span>
                        </div>
                    ))}
                </div>

                {/* 2. NODE VIEWPORT (Responsive Layout) */}
                {/* 
                    MOBILE: flex-col (Vertical Stack), overflow-y-auto
                    DESKTOP: flex-row (Horizontal Swimlanes), overflow-x-auto
                */}
                <div className="flex-1 flex flex-col md:flex-row overflow-x-hidden md:overflow-x-auto overflow-y-auto md:overflow-y-hidden md:items-stretch bg-neutral-100 dark:bg-neutral-950/50 p-4 gap-4">

                    {MOCK_NODES.map((node) => (
                        <div
                            key={node.id}
                            className={`
                                shrink-0 flex flex-col 
                                w-full h-[300px] md:w-[320px] md:h-full
                                rounded-xl border border-neutral-200 dark:border-white/10 
                                bg-white dark:bg-black shadow-sm overflow-hidden
                            `}
                        >
                            {/* Node Header */}
                            <div className={`
                                h-10 px-3 flex items-center justify-between border-b border-neutral-100 dark:border-white/10
                                ${node.type === 'blackboard' ? 'bg-neutral-900 text-white dark:bg-white dark:text-black' : 'bg-white dark:bg-neutral-900'}
                            `}>
                                <div className="flex items-center gap-2">
                                    {/* Icon based on type */}
                                    {node.type === 'agent' && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                                    {node.type === 'framework' && <div className="w-2 h-2 bg-purple-500 rounded-sm rotate-45" />}
                                    {node.type === 'blackboard' && <div className="w-2 h-2 bg-orange-500 rounded-none" />}

                                    <span className="text-xs font-bold uppercase truncate max-w-[150px]">{node.name}</span>
                                </div>
                                <span className="text-[9px] opacity-60 font-mono">{node.type}</span>
                            </div>

                            {/* Node Scrollable Content (Independent Window) */}
                            <div className="flex-1 overflow-y-auto p-2 space-y-2 font-mono text-xs">
                                {node.logs.map((log, i) => (
                                    <div key={i} className="p-2 rounded bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-white/5">
                                        <div className="opacity-70">{log}</div>
                                        {/* Mock Artifact Link occasionally */}
                                        {i % 4 === 0 && (
                                            <div className="mt-1 flex items-center gap-1 text-[9px] text-blue-500 cursor-pointer hover:underline">
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102 1.101" transform="rotate(180 12 12)" /></svg>
                                                <span>view_artifact.json</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* End Spacer for desktop scroll */}
                    <div className="w-8 shrink-0 md:block hidden" />
                </div>

            </div>
        </div>
    );
}
