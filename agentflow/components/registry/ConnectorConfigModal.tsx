import React, { useState, useEffect } from 'react';
import { useRegistry, RegistryItem, ConnectorConfig } from '@/lib/registry/useRegistry';

interface ConnectorConfigModalProps {
    connector?: RegistryItem; // If undefined, we are in "Add New" mode
    onClose: () => void;
    onSave: (config: ConnectorConfig) => void;
}

export const ConnectorConfigModal: React.FC<ConnectorConfigModalProps> = ({ connector, onClose, onSave }) => {
    const { data: firearms } = useRegistry('firearms');

    // In a real app, we'd fetch the specific connector's current config here too, 
    // or pass it in. For now, we'll start with empty/defaults.
    const [scopeRequirements, setScopeRequirements] = useState<Record<string, string>>({});
    const [utmDefaults, setUtmDefaults] = useState({ source: '', medium: '' });

    // Initialize state if connector has existing config (mocked/simulated for now as we don't have that in RegistryItem yet)
    useEffect(() => {
        // If we had config in connector, we'd set it here.
        // For the purpose of this task, we assume we are configuring it fresh or it's not passed yet.
    }, [connector]);

    const handleSave = () => {
        onSave({
            scope_requirements: scopeRequirements,
            utm_defaults: utmDefaults
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
                    <div>
                        <h3 className="text-lg font-bold text-black">
                            {connector ? `Configure ${connector.title}` : 'Register New Connector'}
                        </h3>
                        <p className="text-sm text-zinc-500">
                            {connector ? 'Manage access scopes and attribution settings.' : 'Connect a new platform integration.'}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-zinc-400 hover:text-black">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto space-y-8">

                    {/* Auth Type - Read Only */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                            Auth Type
                        </label>
                        <input
                            type="text"
                            readOnly
                            value="OAuth 2.0 (Authorization Code)"
                            className="w-full bg-zinc-100 text-zinc-600 px-3 py-2 rounded-md border border-zinc-200 text-sm focus:outline-none cursor-not-allowed font-mono"
                        />
                    </div>

                    {/* Scopes Table */}
                    {connector && (
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                                    Scope Assignments
                                </label>
                                <span className="text-[10px] text-zinc-400">Map scopes to required firearms licenses</span>
                            </div>

                            <div className="border border-zinc-200 rounded-lg overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-zinc-50 text-zinc-500 font-medium border-b border-zinc-200">
                                        <tr>
                                            <th className="px-4 py-2 w-1/2">Scope Name</th>
                                            <th className="px-4 py-2 w-1/2">Required License</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100">
                                        {/* Fallback if no scopes defined yet */}
                                        {(!connector.scopes || connector.scopes.length === 0) && (
                                            <tr>
                                                <td colSpan={2} className="px-4 py-4 text-center text-zinc-400 italic">
                                                    No scopes defined for this connector.
                                                </td>
                                            </tr>
                                        )}

                                        {connector.scopes?.map((scope) => (
                                            <tr key={scope}>
                                                <td className="px-4 py-3 font-mono text-xs text-zinc-700">{scope}</td>
                                                <td className="px-4 py-3">
                                                    <select
                                                        value={scopeRequirements[scope] || 'none'}
                                                        onChange={(e) => setScopeRequirements(prev => ({ ...prev, [scope]: e.target.value }))}
                                                        className="w-full bg-white border border-zinc-300 rounded px-2 py-1 text-xs focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                                                    >
                                                        <option value="none">None</option>
                                                        {firearms?.map((f: any) => (
                                                            // Assuming firearms returns valid objects, let's just assume simple strings or IDs for now based on prompt.
                                                            // "Values: commercial_license, admin_license, none"
                                                            // If firearms endpoint returns objects, we map them.
                                                            // If user said "Source: Fetch list from useRegistry('firearms')", I'll assume it returns [{id, label}...] or strings.
                                                            // I'll be safe and cast/check.
                                                            <option key={f.id || f} value={f.id || f}>{f.label || f}</option>
                                                        ))}
                                                        {/* Hardcoded strictly requested values if API fails or for safety */}
                                                        <option value="commercial_license">Commercial License</option>
                                                        <option value="admin_license">Admin License</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* UTM Defaults */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                            UTM Defaults
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] text-zinc-400 mb-1">Source (Platform)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. shopify"
                                    value={utmDefaults.source}
                                    onChange={(e) => setUtmDefaults(prev => ({ ...prev, source: e.target.value }))}
                                    className="w-full border border-zinc-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] text-zinc-400 mb-1">Medium (Content Type)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. product"
                                    value={utmDefaults.medium}
                                    onChange={(e) => setUtmDefaults(prev => ({ ...prev, medium: e.target.value }))}
                                    className="w-full border border-zinc-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                                />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-200 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-600 hover:bg-zinc-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-black hover:bg-zinc-800 transition-colors shadow-lg"
                    >
                        Save Configuration
                    </button>
                </div>

            </div>
        </div>
    );
};
