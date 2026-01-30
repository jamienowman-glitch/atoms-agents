"use client";

import React, { useCallback, useState } from 'react';
// import { CanvasTransport } from '@/lib/gate3/transport';

type SliderKey = 'width' | 'height' | 'opacity';

interface ToolPopProps {
    atomId: string;
    // transport?: CanvasTransport | null;
    initialWidth?: number;
    initialHeight?: number;
    initialOpacity?: number;
    onValuesChange?: (values: { width: number; height: number; opacity: number }) => void;
}

const SliderRow = ({
    label,
    value,
    min,
    max,
    step,
    onChange
}: {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    onChange: (next: number) => void;
}) => (
    <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-xs font-medium text-neutral-700 dark:text-neutral-200">
            <span>{label}</span>
            <span className="tabular-nums">{value}</span>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            step={step || 1}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full accent-black dark:accent-white"
        />
    </div>
);

export const ToolPop: React.FC<ToolPopProps> = ({
    atomId,
    // transport,
    initialWidth = 320,
    initialHeight = 180,
    initialOpacity = 100,
    onValuesChange,
}) => {
    const [width, setWidth] = useState(initialWidth);
    const [height, setHeight] = useState(initialHeight);
    const [opacity, setOpacity] = useState(initialOpacity);

    const emitSpatialUpdate = useCallback((nextWidth: number, nextHeight: number, nextOpacity: number) => {
        // Stub bridge: forward slider changes over CanvasTransport as SPATIAL_UPDATE
        // transport?.sendSpatialUpdate({
        //     atom_id: atomId,
        //     bounds: { x: 0, y: 0, w: nextWidth, h: nextHeight },
        //     atom_metadata: { opacity: nextOpacity }
        // });
        console.log('ToolPop emitSpatialUpdate', { nextWidth, nextHeight, nextOpacity });
    }, [atomId]);

    const onSliderChange = useCallback((key: SliderKey, value: number) => {
        const nextWidth = key === 'width' ? value : width;
        const nextHeight = key === 'height' ? value : height;
        const nextOpacity = key === 'opacity' ? value : opacity;

        if (key === 'width') setWidth(value);
        if (key === 'height') setHeight(value);
        if (key === 'opacity') setOpacity(value);

        emitSpatialUpdate(nextWidth, nextHeight, nextOpacity);
        onValuesChange?.({ width: nextWidth, height: nextHeight, opacity: nextOpacity });
    }, [emitSpatialUpdate, height, onValuesChange, opacity, width]);

    return (
        <div className="w-auto inline-flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 shadow-sm px-3 py-1.5 backdrop-blur-md pointer-events-none">
            <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-50 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                Selected
            </span>
            {/* Sliders moved to Bottom Toolbar */}
        </div>
    );
};
