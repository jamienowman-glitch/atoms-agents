import React from 'react';

export const GraphTokenEditor = ({ tokens, onChange, metadata }: any) => {
    return (
        <pre className="text-xs font-mono p-2 bg-neutral-100 rounded overflow-auto max-h-[300px]">
            {JSON.stringify(tokens, null, 2)}
        </pre>
    );
};
