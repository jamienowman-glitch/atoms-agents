import React from 'react';
import { CatalogResponse } from '@northstar/agent-driver';
import '../../ui_kit/button.css';

interface ToolpopProps {
    catalog: CatalogResponse | null;
    selectedAtomKind: string | null;
    onUpdateToken: (token: string, value: any) => void;
}

export const Toolpop: React.FC<ToolpopProps> = ({ catalog, selectedAtomKind, onUpdateToken }) => {
    // EMERGENCY: Fallback for missing catalog (common on mobile local dev)
    const effectiveCatalog = catalog || { manifests: {} } as any;

    if (!selectedAtomKind) return (
        <div style={{ padding: '16px', color: '#666', fontSize: '13px' }}>Select an element to see tools</div>
    );

    let manifest = effectiveCatalog.manifests?.[selectedAtomKind];

    if (!manifest) return (
        <div style={{ padding: '16px', color: '#666', fontSize: '13px' }}>No tools for this element</div>
    );

    return (
        <div className="Toolpop-container" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: '#888', letterSpacing: '0.05em' }}>
                {manifest.label} Tools
            </div>
            {/* Tool buttons removed as they were part of Multi-21. Re-implementation pending. */}
            <div style={{ fontSize: '13px', color: '#999', fontStyle: 'italic' }}>
                Tools temporarily unavailable.
            </div>
        </div>
    );
};
