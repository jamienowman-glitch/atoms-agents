import React from 'react';

interface AtomPickerProps<T> {
    label: string;
    items: T[];
    selectedId?: string;
    onSelect: (item: T) => void;
    renderItem: (item: T) => React.ReactNode;
    getKey: (item: T) => string;
    placeholder?: string;
}

export function AtomPicker<T>({
    label,
    items,
    selectedId,
    onSelect,
    renderItem,
    getKey,
    placeholder = "Select..."
}: AtomPickerProps<T>) {
    return (
        <div className="flex flex-col gap-1 w-full">
            <label className="text-xs font-mono uppercase text-gray-500">{label}</label>
            <div className="relative">
                <select
                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm text-gray-200 appearance-none focus:border-blue-500 focus:outline-none"
                    value={selectedId || ""}
                    onChange={(e) => {
                        const item = items.find(i => getKey(i) === e.target.value);
                        if (item) onSelect(item);
                    }}
                >
                    <option value="" disabled>{placeholder}</option>
                    {items.map(item => (
                        <option key={getKey(item)} value={getKey(item)}>
                           {/* Select options only support text, so we rely on renderItem logic
                               being simplified or we just use text here.
                               For a custom UI (modal), we would use a different structure.
                               For this iteration (Wireframe Prep), a styled select is functional.
                           */}
                           {/* We extract the text content from the renderItem result if possible,
                               but easier to just use a text extractor prop or assume generic usage.
                               Actually, let's just assume we want simple text in options for now.
                           */}
                           {getKey(item)} {/* Fallback, usually overridden by specific pickers */}
                        </option>
                    ))}
                </select>
                {/* Custom arrow or styling can go here */}
            </div>
        </div>
    );
}
