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
    const [cost, setCost] = useState<number>(0);
    const [currency, setCurrency] = useState<string>('USD');

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
                <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
                    <div>
                        <h3 className="text-lg font-bold text-black">
                            {muscle ? `Configure ${muscle.title}` : 'New Muscle'}
                        </h3>
                        <p className="text-sm text-zinc-500">
                            Configure muscle pricing and capabilities.
                        </p>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">

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
