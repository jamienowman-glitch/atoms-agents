import React from 'react';
import { ConnectorProvider } from '@god/config/connectors/types';

interface ConnectorSidebarProps {
    providers: ConnectorProvider[];
    selected: ConnectorProvider | null;
    onSelect: (provider: ConnectorProvider) => void;
    onAdd: () => void;
}

export const ConnectorSidebar: React.FC<ConnectorSidebarProps> = ({ providers, selected, onSelect, onAdd }) => {
    return (
        <div className="border-2 border-black h-full flex flex-col">
            <div className="bg-black text-white px-4 py-3 font-black uppercase text-sm flex justify-between items-center">
                <span>CONNECTORS</span>
                <button
                    onClick={onAdd}
                    className="text-xs border border-white px-2 py-1 hover:bg-white hover:text-black transition-colors"
                >
                    + ADD
                </button>
            </div>
            <div className="divide-y-2 divide-black overflow-y-auto flex-1">
                {providers.map((p) => (
                    <button
                        key={p.provider_id}
                        onClick={() => onSelect(p)}
                        className={`w-full text-left px-4 py-3 uppercase font-bold tracking-tight transition-colors ${
                            selected?.provider_id === p.provider_id ? 'bg-neutral-100' : 'hover:bg-neutral-50'
                        }`}
                    >
                        {p.display_name || p.platform_slug}
                    </button>
                ))}
                {providers.length === 0 && (
                    <div className="p-4 text-xs uppercase text-neutral-500">No connectors yet.</div>
                )}
            </div>
        </div>
    );
};
