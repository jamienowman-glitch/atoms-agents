import React from 'react';
import { useToolControl } from '../../../../context/ToolControlContext';

interface Multi21BlockProps {
    blockId: string;
}

export function Multi21Block({ blockId }: Multi21BlockProps) {
    const { useToolState } = useToolControl();
    const [spanDesktop, setSpanDesktop] = useToolState<number>({
        target: { surfaceId: 'multi21.block', scope: 'block', entityId: blockId, toolId: 'block.setSpanDesktop' },
        defaultValue: 6,
    });
    const [spanMobile, setSpanMobile] = useToolState<number>({
        target: { surfaceId: 'multi21.block', scope: 'block', entityId: blockId, toolId: 'block.setSpanMobile' },
        defaultValue: 2,
    });
    const [variant, setVariant] = useToolState<string>({
        target: { surfaceId: 'multi21.block', scope: 'block', entityId: blockId, toolId: 'block.setTileVariant' },
        defaultValue: 'generic',
    });

    return (
        <div className="p-4 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg flex flex-col gap-2 bg-white/70 dark:bg-neutral-900/70">
            <div className="text-sm font-semibold">Block {blockId}</div>
            <label className="text-xs text-neutral-600 dark:text-neutral-300">
                Desktop Span: {spanDesktop}
                <input type="range" min={1} max={12} value={spanDesktop} onChange={e => setSpanDesktop(Number(e.target.value))} className="w-full accent-black dark:accent-white" />
            </label>
            <label className="text-xs text-neutral-600 dark:text-neutral-300">
                Mobile Span: {spanMobile}
                <input type="range" min={1} max={6} value={spanMobile} onChange={e => setSpanMobile(Number(e.target.value))} className="w-full accent-black dark:accent-white" />
            </label>
            <div className="flex gap-2 text-xs">
                {['generic', 'product', 'kpi', 'text'].map(opt => (
                    <button
                        key={opt}
                        onClick={() => setVariant(opt)}
                        className={`px-2 py-1 rounded border ${variant === opt ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900' : 'border-neutral-300 dark:border-neutral-700'}`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
}
