import React from 'react';
import { ToolConfig, ToolOption } from '../../../types/multi21-tools';

interface ToolOptionsPopupProps {
    tool: ToolConfig;
    options: ToolOption[];
    activeOptionId?: string;
    onSelect: (optionId: string) => void;
    onClose: () => void;
}

export function ToolOptionsPopup({ tool, options, activeOptionId, onSelect, onClose }: ToolOptionsPopupProps) {
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 max-w-sm w-[320px] max-h-[70vh] overflow-y-auto p-4"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{tool.label || tool.id}</span>
                    <button className="text-xs text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100" onClick={onClose} aria-label="Close options">
                        Close
                    </button>
                </div>
                <div className="flex flex-col gap-2">
                    {options.map(opt => {
                        const active = activeOptionId ? opt.id === activeOptionId : !!opt.isDefault;
                        return (
                            <button
                                key={opt.id}
                                className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-left ${active ? 'border-neutral-800 dark:border-neutral-200 bg-neutral-100 dark:bg-neutral-800' : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-850'}`}
                                onClick={() => onSelect(opt.id)}
                            >
                                <div className="flex-shrink-0 mt-0.5">
                                    <span className={`inline-flex w-3 h-3 rounded-full border ${active ? 'bg-neutral-900 dark:bg-neutral-100 border-neutral-900 dark:border-neutral-100' : 'border-neutral-400 dark:border-neutral-600'}`} />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{opt.label}</div>
                                    {opt.description && <div className="text-xs text-neutral-600 dark:text-neutral-300">{opt.description}</div>}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
