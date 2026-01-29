"use client";

import React from 'react';
import { ToolControlProvider } from 'atoms-ui/harness/context/ToolControlContext';
import { HazeCanvas } from 'atoms-ui/canvases/haze';

export default function SurfacePage({ params }: { params: { slug: string } }) {
    // Dynamic canvas loading based on slug
    if (params.slug === 'haze') {
        return <HazeCanvas />;
    }

    // Default fallback
    return (
        <ToolControlProvider>
            <div className="w-full h-screen bg-neutral-900 flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2 uppercase tracking-widest">{params.slug}</h1>
                    <p className="text-neutral-500">Surface Loaded. Canvas Injection Pending.</p>
                </div>
            </div>
        </ToolControlProvider>
    );
}
