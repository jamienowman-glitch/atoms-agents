import React from 'react';
import { useToolControl } from '../../context/ToolControlContext';

interface TilePopupProps {
    tileId: string;
}

export function TilePopup({ tileId }: TilePopupProps) {
    const { useToolState } = useToolControl();
    const [locked, setLocked] = useToolState<boolean>({
        target: { surfaceId: 'multi21.tile', scope: 'tile', entityId: tileId, toolId: 'tile.toggleLock' },
        defaultValue: false,
    });

    return (
        <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-sm font-semibold">Tile {tileId}</div>
                    <div className="text-xs text-neutral-500">Strategy Lock</div>
                </div>
                <button
                    onClick={() => setLocked(!locked)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${locked ? 'bg-emerald-600 text-white' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200'}`}
                >
                    {locked ? 'Locked' : 'Unlocked'}
                </button>
            </div>
        </div>
    );
}
