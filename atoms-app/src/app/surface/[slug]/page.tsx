"use client";

import React from 'react';
import { ToolControlProvider } from 'atoms-ui/harness/context/ToolControlContext';

// We would dynamically load the Canvas based on params.slug in the future
// For now, we mount a generic "Surface Harness"
export default function SurfacePage({ params }: { params: { slug: string } }) {
    return (
        <ToolControlProvider>
            <div className="w-full h-screen bg-neutral-900 flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2 uppercase tracking-widest">{params.slug}</h1>
                    <p className="text-neutral-500">Surface Loaded. Canvas Injection Pending.</p>
                    {/* Here we would render <CanvasLoader surfaceId={params.slug} /> */}
                </div>
            </div>
        </ToolControlProvider>
    );
}
