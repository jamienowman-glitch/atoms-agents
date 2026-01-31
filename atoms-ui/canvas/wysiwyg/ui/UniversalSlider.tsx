"use client";

import React, { useState, useRef } from 'react';

interface UniversalSliderProps {
    value: number;
    min: number;
    max: number;
    step?: number;
    onChange: (v: number) => void;
}

export const UniversalSlider: React.FC<UniversalSliderProps> = ({ value, min, max, step = 1, onChange }) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const updateValue = (clientX: number) => {
        if (!trackRef.current) return;
        const rect = trackRef.current.getBoundingClientRect();
        let percentage = (clientX - rect.left) / rect.width;
        percentage = Math.max(0, Math.min(1, percentage));

        const rawValue = min + percentage * (max - min);
        let stepped = Math.round(rawValue / step) * step;
        stepped = Math.max(min, Math.min(max, stepped));

        // Avoid precision floating point noise
        stepped = Number(stepped.toFixed(2));

        onChange(stepped);
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
        trackRef.current?.setPointerCapture(e.pointerId);
        updateValue(e.clientX);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
            updateValue(e.clientX);
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        trackRef.current?.releasePointerCapture(e.pointerId);
    };

    return (
        <div
            ref={trackRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="relative w-full h-8 flex items-center group cursor-pointer touch-none select-none"
        >
            <div className="absolute w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div
                    className="h-full bg-neutral-400 dark:bg-neutral-600 rounded-full transition-all duration-75 ease-out"
                    style={{ width: `${((value - min) / (max - min)) * 100}%` }}
                />
            </div>
            <div
                className={`absolute w-4 h-4 bg-black dark:bg-white rounded-full shadow-sm transform -translate-x-1/2 transition-transform duration-75 ${isDragging ? 'scale-125' : 'scale-100'}`}
                style={{ left: `${((value - min) / (max - min)) * 100}%` }}
            />
        </div>
    );
};
