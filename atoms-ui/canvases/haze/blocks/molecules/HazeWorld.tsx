'use client';

import React, { useRef, useEffect } from 'react';
import { HazeNode } from '@canvases/haze/blocks/atoms/HazeNode';

interface HazeWorldProps {
    deltaForward: number;
    deltaTurn: number;
}

export const HazeWorld: React.FC<HazeWorldProps> = ({ deltaForward, deltaTurn }) => {
    // Pure Visual Component - No Hooks for Data Fetching
    // In a real implementation this would use WebGL (Three.js/R3F)
    // For now we use CSS 3D Transforms to prove the concept

    return (
        <div
            className="w-full h-full flex items-center justify-center perspective-[1000px]"
            style={{
                perspective: '1000px',
                background: `radial-gradient(circle at center, #1a1a1a 0%, #000000 100%)`
            }}
        >
            <div
                className="relative w-full h-full transform-style-3d transition-transform duration-75 ease-linear"
                style={{
                    transform: `rotateY(${deltaTurn}deg) translateZ(${deltaForward * 10}px)`
                }}
            >
                {/* Mock Data Grid */}
                {Array.from({ length: 9 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute top-1/2 left-1/2 transform-style-3d"
                        style={{
                            transform: `translate(-50%, -50%) rotateY(${i * 40}deg) translateZ(300px)`
                        }}
                    >
                        <HazeNode label={`Memory Node ${i + 1}`} />
                    </div>
                ))}
            </div>

            {/* HUD */}
            <div className="absolute top-4 left-4 text-xs font-mono text-green-500/50 pointer-events-none">
                <div>FORWARD: {deltaForward.toFixed(1)}</div>
                <div>TURN: {deltaTurn.toFixed(1)}°</div>
            </div>
        </div>
    );
};
