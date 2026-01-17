import React, { useState, useEffect } from 'react';
import { RegistryItem } from '@/lib/registry/useRegistry';

interface MuscleConfig {
    cost_per_second: number;
    currency: string;
}

interface MuscleConfigModalProps {
    muscle?: RegistryItem;
    onClose: () => void;
    onSave: (config: MuscleConfig) => void;
}

export const MuscleConfigModal: React.FC<MuscleConfigModalProps> = ({ muscle, onClose, onSave }) => {
    const [activeTab, setActiveTab] = useState<'settings' | 'test'>('settings');
    const [cost, setCost] = useState<number>(0);
    const [currency, setCurrency] = useState<string>('USD');

    const getMaturityBadge = (maturity?: string) => {
        switch (maturity) {
            case 'production': return <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-800 border border-green-200">Production</span>;
            case 'production_lite': return <span className="px-2 py-0.5 rounded text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200">Lite</span>;
            case 'demo': return <span className="px-2 py-0.5 rounded text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200">Demo</span>;
            case 'concept': return <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-800 border border-red-200">Concept</span>;
            default: return null;
        }
    };

    // In a real app, fetch existing config here
    useEffect(() => {
        // Mock existing config loading
        if (muscle) {
            setCost(0.002); // Mock default
        }
    }, [muscle]);

    const handleSave = () => {
        onSave({
            cost_per_second: cost,
            currency: currency
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col">

                {/* Header */}
                <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold text-black">
                                    {muscle ? `Configure ${muscle.title}` : 'New Muscle'}
                                </h3>
                                {muscle && getMaturityBadge(muscle.maturity)}
                            </div>
                            <p className="text-sm text-zinc-500">
                                Configure muscle pricing and capabilities.
                            </p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-4 border-b border-zinc-200">
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`pb-2 text-sm font-medium transition-colors ${
                                activeTab === 'settings'
                                ? 'text-black border-b-2 border-black'
                                : 'text-zinc-500 hover:text-zinc-700'
                            }`}
                        >
                            Settings
                        </button>
                        <button
                            onClick={() => setActiveTab('test')}
                            className={`pb-2 text-sm font-medium transition-colors ${
                                activeTab === 'test'
                                ? 'text-black border-b-2 border-black'
                                : 'text-zinc-500 hover:text-zinc-700'
                            }`}
                        >
                            Test Connection
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 min-h-[300px]">

                    {activeTab === 'test' ? (
                        <div className="space-y-4">
                            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                                <h4 className="text-sm font-bold text-blue-900 mb-1">Developer Mode</h4>
                                <p className="text-xs text-blue-700">
                                    Copy this config into your external Agent (VSCode/Claude) to test this muscle remotely.
                                </p>
                            </div>

                            <div className="relative group">
                                <pre className="bg-zinc-900 text-zinc-100 p-4 rounded-lg text-xs font-mono overflow-x-auto">
{JSON.stringify({
   "mcpServers": {
     [muscle?.id || "my-muscle"]: {
       "url": `https://api.northstar.com/mcp/gateway?tool=${muscle?.id || "unknown"}`,
       "headers": { "Authorization": "Bearer TEST_KEY_123" }
     }
   }
}, null, 2)}
                                </pre>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Next Steps / Maturity Checklist */}
                            {muscle?.next_steps && muscle.next_steps.length > 0 && (
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                                To-Do List
                            </label>
                            <div className="bg-white border border-zinc-200 rounded-md p-3">
                                <p className="text-xs text-zinc-400 mb-2">To achieve Production status:</p>
                                <ul className="space-y-1">
                                    {muscle.next_steps.map((step, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-zinc-600">
                                            <div className="w-4 h-4 border border-zinc-300 rounded flex-shrink-0" />
                                            <span>{step}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                            {/* Capabilities - Read Only */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                                    Capabilities (Read-only)
                                </label>
                                <div className="bg-zinc-100 p-3 rounded-md text-sm text-zinc-700 font-mono">
                                    {/* Mock capabilities or pull from muscle object if available */}
                                    <ul className="list-disc pl-4 space-y-1">
                                        <li>video_generation</li>
                                        <li>frame_interpolation</li>
                                        <li>upscale_4k</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Cost Settings */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4">
                                    Cost Settings
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] text-zinc-400 mb-1">Cost Per Second</label>
                                        <input
                                            type="number"
                                            step="0.001"
                                            value={cost}
                                            onChange={(e) => setCost(parseFloat(e.target.value))}
                                            className="w-full border border-zinc-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-zinc-400 mb-1">Currency</label>
                                        <select
                                            value={currency}
                                            onChange={(e) => setCurrency(e.target.value)}
                                            className="w-full border border-zinc-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none block bg-white"
                                        >
                                            <option value="USD">USD</option>
                                            <option value="EUR">EUR</option>
                                            <option value="GBP">GBP</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

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
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
};
