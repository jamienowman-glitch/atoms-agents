'use client';

import React from 'react';
import { ConnectedHaze } from './blocks/ConnectedHaze';

export function HazeCanvas() {
    return (
        <div className="w-full h-full bg-black relative overflow-hidden">
            {/* The Haze World Controller */}
            <ConnectedHaze />
        </div>
    );
}
