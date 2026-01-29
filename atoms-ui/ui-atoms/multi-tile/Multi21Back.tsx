import React from 'react';

interface Multi21BackProps {
    variant: string;
    onFlipBack: () => void;
    onUtmChange: (params: any) => void;
}

export const Multi21Back = ({ variant, onFlipBack, onUtmChange }: Multi21BackProps) => {
    return (
        <div className="w-full h-full bg-white dark:bg-neutral-800 p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h3 className="font-bold">Settings</h3>
                <button onClick={onFlipBack} className="text-sm underline">Done</button>
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-xs font-medium">UTM Source</label>
                <input
                    type="text"
                    className="border rounded px-2 py-1 text-sm bg-transparent"
                    onChange={(e) => onUtmChange((prev: any) => ({ ...prev, source: e.target.value }))}
                />
            </div>
        </div>
    );
};
