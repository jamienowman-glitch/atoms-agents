"use client";

import React from 'react';
import { useToolControl } from '../../harness/ToolControlProvider';

interface HazeToolPopProps {
    onClose: () => void;
}

export function HazeToolPop({ onClose }: HazeToolPopProps) {
    const { useToolState } = useToolControl();

    // HAZE Navigation State
    const [forward, setForward] = useToolState<number>('nav.forward', 0);
    const [turn, setTurn] = useToolState<number>('nav.turn', 0);

    return (
        <div
            className="fixed bottom-[60px] left-0 right-0 bg-neutral-900/98 backdrop-blur-xl border-t border-white/10 z-40 transition-all duration-300 ease-out"
            style={{
                boxShadow: '0 -4px 20px rgba(0,0,0,0.3)'
            }}
        >
            <div className="flex flex-col gap-4 p-4 max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="text-xs font-mono text-white/50 uppercase tracking-wider">
                        Navigation Controls
                    </div>
                    <button
                        onClick={onClose}
                        className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-white/50 text-xs transition-colors"
                    >
                        ×
                    </button>
                </div>

                {/* Controls */}
                <div className="flex gap-4">
                    {/* Forward/Backward Control */}
                    <div className="flex-1 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider">
                                Forward / Back
                            </label>
                            <span className="text-[10px] font-mono text-green-400 bg-green-500/10 px-2 py-0.5 rounded">
                                {forward.toFixed(1)}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="-100"
                            max="100"
                            step="1"
                            value={forward}
                            onChange={(e) => setForward(parseFloat(e.target.value))}
                            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer
                                [&::-webkit-slider-thumb]:appearance-none
                                [&::-webkit-slider-thumb]:w-5
                                [&::-webkit-slider-thumb]:h-5
                                [&::-webkit-slider-thumb]:rounded-full
                                [&::-webkit-slider-thumb]:bg-green-500
                                [&::-webkit-slider-thumb]:cursor-pointer
                                [&::-webkit-slider-thumb]:shadow-lg
                                [&::-webkit-slider-thumb]:shadow-green-500/50"
                        />
                    </div>

                    {/* Left/Right Control */}
                    <div className="flex-1 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider">
                                Left / Right
                            </label>
                            <span className="text-[10px] font-mono text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded">
                                {turn.toFixed(1)}°
                            </span>
                        </div>
                        <input
                            type="range"
                            min="-180"
                            max="180"
                            step="1"
                            value={turn}
                            onChange={(e) => setTurn(parseFloat(e.target.value))}
                            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer
                                [&::-webkit-slider-thumb]:appearance-none
                                [&::-webkit-slider-thumb]:w-5
                                [&::-webkit-slider-thumb]:h-5
                                [&::-webkit-slider-thumb]:rounded-full
                                [&::-webkit-slider-thumb]:bg-orange-500
                                [&::-webkit-slider-thumb]:cursor-pointer
                                [&::-webkit-slider-thumb]:shadow-lg
                                [&::-webkit-slider-thumb]:shadow-orange-500/50"
                        />
                    </div>

                    {/* Reset Button */}
                    <button
                        onClick={() => {
                            setForward(0);
                            setTurn(0);
                        }}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-400 text-xs font-bold uppercase tracking-wider transition-colors self-end"
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
}
