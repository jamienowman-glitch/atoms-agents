"use client";

import React from 'react';
import { useConsoleContext } from '@/components/workbench/ConsoleContext';

export const GraphTokenEditor = ({ tokens, onChange, metadata, edgeId, edge }: any) => {
    const { whiteboardWrites, blackboardWrites, runId } = useConsoleContext();
    const whiteboardEntries = Object.values(whiteboardWrites);
    const edgeGroups = Object.entries(blackboardWrites);

    return (
        <div className="flex flex-col gap-2">
            {edgeId && (
                <div className="p-2 bg-blue-50 border border-blue-100 rounded text-xs">
                    <div className="font-bold text-blue-800 mb-1">EDGE BLACKBOARD</div>
                    <div className="font-mono text-neutral-600 mb-1">ID: {edgeId}</div>
                    <div className="font-mono text-neutral-400">Src: {edge?.source}</div>
                    <div className="font-mono text-neutral-400">Tgt: {edge?.target}</div>
                </div>
            )}
            {!edgeId && <div className="font-bold text-xs text-neutral-500 uppercase tracking-wider mb-1">Node Memory</div>}

            <div className="space-y-2">
                <div className="bg-neutral-900/60 border border-white/10 rounded p-2 text-[11px] text-neutral-200">
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-wide text-neutral-400">
                        <span>Run Memory {runId ? `(run ${runId.slice(0, 8)})` : ''}</span>
                        <span>{whiteboardEntries.length} whiteboard entr{whiteboardEntries.length === 1 ? 'y' : 'ies'}</span>
                    </div>
                    {whiteboardEntries.length === 0 ? (
                        <p className="text-xs text-neutral-500 mt-2">No whiteboard writes have been observed.</p>
                    ) : (
                        <ul className="mt-2 space-y-1">
                            {whiteboardEntries.map(record => (
                                <li key={`${record.key}-${record.eventId}`} className="flex justify-between gap-3">
                                    <div>
                                        <div className="font-mono text-white text-[12px]">{record.key}</div>
                                        <div className="text-[10px] text-neutral-500">edge={record.edgeId} · src={record.sourceNodeId || 'unknown'}</div>
                                    </div>
                                    <span className="text-[10px] text-neutral-400">v{record.version ?? '?'}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="bg-neutral-900/60 border border-white/10 rounded p-2 text-[11px] text-neutral-200">
                    <div className="text-[10px] uppercase tracking-wide text-neutral-400">Edge Blackboard</div>
                    {edgeGroups.length === 0 ? (
                        <p className="text-xs text-neutral-500 mt-2">Waiting for edge-scoped turns.</p>
                    ) : (
                        <div className="mt-2 space-y-2">
                            {edgeGroups.map(([edgeKey, records]) => {
                                const entries = Object.values(records);
                                if (entries.length === 0) return null;
                                return (
                                    <div key={edgeKey} className="text-[11px]">
                                        <div className="text-[10px] text-neutral-400 mb-1 uppercase tracking-wide">{edgeKey}</div>
                                        <ul className="list-disc list-inside space-y-1 text-neutral-200">
                                            {entries.map(record => (
                                                <li key={`${edgeKey}-${record.key}-${record.eventId}`} className="flex justify-between items-center gap-2">
                                                    <span className="font-mono text-[11px]">{record.key}</span>
                                                    <span className="text-[10px] text-neutral-500 ml-2">v{record.version ?? '?'}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <pre className="text-xs font-mono p-2 bg-neutral-100 rounded overflow-auto max-h-[300px]">
                {JSON.stringify(tokens || {}, null, 2)}
            </pre>
        </div>
    );
};
