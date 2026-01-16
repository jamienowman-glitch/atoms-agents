"use client";

import React, { useState, useEffect, useRef } from 'react';

// -- Constants --
const SWATCHES = [
    '#ffffff', // White
    '#000000', // Black
    '#3b82f6', // Brand Blue
    '#ef4444', // Red
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#6366f1', // Indigo
    '#14b8a6', // Teal
    '#f43f5e', // Rose
    '#84cc16', // Lime
    '#06b6d4', // Cyan
    '#a855f7', // Purple
    '#d946ef', // Fuchsia
    '#e11d48', // Rose Red
    '#f97316', // Orange
    '#64748b', // Slate
];

// -- Utilities --

// Hex to HSL (Simple)
const hexToHSL = (hex: string): { h: number, s: number, l: number } => {
    let r = 0, g = 0, b = 0;
    // Strip # if present
    hex = hex.replace('#', '');

    if (hex.length === 3) {
        r = parseInt("0x" + hex[0] + hex[0]);
        g = parseInt("0x" + hex[1] + hex[1]);
        b = parseInt("0x" + hex[2] + hex[2]);
    } else if (hex.length === 6) {
        r = parseInt("0x" + hex.substring(0, 2));
        g = parseInt("0x" + hex.substring(2, 4));
        b = parseInt("0x" + hex.substring(4, 6));
    }

    r /= 255; g /= 255; b /= 255;
    const cmin = Math.min(r, g, b), cmax = Math.max(r, g, b), delta = cmax - cmin;
    let h = 0, s = 0, l = 0;

    if (delta === 0) h = 0;
    else if (cmax === r) h = ((g - b) / delta) % 6;
    else if (cmax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return { h, s, l };
};

// HSL to Hex
const hslToHex = (h: number, s: number, l: number): string => {
    s /= 100;
    l /= 100;
    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
        m = l - c / 2,
        r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) { r = c; g = x; b = 0; }
    else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
    else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
    else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
    else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
    else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    const toHex = (n: number) => {
        const hex = n.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };
    return "#" + toHex(r) + toHex(g) + toHex(b);
};

interface ColorRibbonProps {
    value: string;
    onChange: (hex: string) => void;
}

export const ColorRibbon: React.FC<ColorRibbonProps> = ({ value, onChange }) => {
    const [mode, setMode] = useState<'spectrum' | 'grid'>('spectrum');
    const [localHex, setLocalHex] = useState(value);

    // Sync external value to local state
    useEffect(() => {
        setLocalHex(value);
    }, [value]);

    const hsl = React.useMemo(() => hexToHSL(value || '#000000'), [value]);

    const updateHue = (newHue: number) => {
        // If sat is 0 (grayscale), boost it to 100 so user sees color
        const s = hsl.s === 0 ? 100 : hsl.s;
        const l = (hsl.l === 0 || hsl.l === 100) ? 50 : hsl.l;

        onChange(hslToHex(newHue, s, l));
    };

    const handleHexSubmit = () => {
        let hex = localHex;
        if (!hex.startsWith('#')) hex = '#' + hex;
        // Simple validation
        if (/^#[0-9A-F]{6}$/i.test(hex) || /^#[0-9A-F]{3}$/i.test(hex)) {
            onChange(hex);
        } else {
            setLocalHex(value); // Revert on bad input
        }
    };

    return (
        <div className="w-full flex flex-col gap-2">

            {/* Mode: Spectrum Slider & Hex */}
            {mode === 'spectrum' && (
                <div className="flex items-center gap-2 h-[44px]">
                    {/* Spectrum Slider */}
                    <div className="flex-1 h-full relative group rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-800">
                        {/* Gradient Background */}
                        <div
                            className="absolute inset-0 w-full h-full pointer-events-none"
                            style={{ background: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)' }}
                        />
                        {/* Slider Input */}
                        <input
                            type="range"
                            min="0"
                            max="360"
                            value={hsl.h}
                            onChange={(e) => updateHue(parseInt(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer touch-none"
                            style={{ touchAction: 'none' }}
                        />
                        {/* Thumb Indicator (Visual Only) */}
                        <div
                            className="absolute top-0 bottom-0 w-1.5 bg-white border border-black/20 shadow-sm pointer-events-none"
                            style={{ left: `${(hsl.h / 360) * 100}%`, transform: 'translateX(-50%)' }}
                        />
                    </div>

                    {/* Hex Input */}
                    <input
                        type="text"
                        value={localHex}
                        onChange={(e) => setLocalHex(e.target.value)}
                        onBlur={handleHexSubmit}
                        onKeyDown={(e) => e.key === 'Enter' && handleHexSubmit()}
                        className="w-20 h-full text-center text-xs font-mono border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                        spellCheck={false}
                    />

                    {/* Grid Toggle */}
                    <button
                        onClick={() => setMode('grid')}
                        className="w-[44px] h-[44px] flex items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors shrink-0"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                    </button>
                </div>
            )}

            {/* Mode: Preset Grid */}
            {mode === 'grid' && (
                <div className="relative flex flex-col gap-2 p-1 animate-fadeIn pt-5">
                    <button
                        onClick={() => setMode('spectrum')}
                        className="absolute -top-2 right-0 p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>

                    <div className="flex flex-wrap gap-3 justify-center">
                        {SWATCHES.map((color) => {
                            const isActive = value.toLowerCase() === color.toLowerCase();
                            return (
                                <button
                                    key={color}
                                    onClick={() => onChange(color)}
                                    className={`w-9 h-9 rounded-full shrink-0 border border-black/10 transition-transform active:scale-95 ${isActive ? 'ring-2 ring-neutral-400 ring-offset-2 dark:ring-offset-neutral-900 scale-105' : ''}`}
                                    style={{ backgroundColor: color }}
                                />
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
