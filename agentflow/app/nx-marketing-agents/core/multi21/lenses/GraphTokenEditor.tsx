import React from 'react';

export const GraphTokenEditor = ({ tokens, onChange, metadata, edgeId, edge }: any) => {
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

            <pre className="text-xs font-mono p-2 bg-neutral-100 rounded overflow-auto max-h-[300px]">
                {JSON.stringify(tokens || {}, null, 2)}
            </pre>
        </div>
    );
};
