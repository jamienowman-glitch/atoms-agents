'use client';

import dynamic from 'next/dynamic';

const MaybesCanvas = dynamic(
    () => import('atoms-ui/canvases/maybes/MaybesCanvas').then(mod => ({ default: mod.MaybesCanvas })),
    { ssr: false }
);

export default function MaybesPage() {
    return (
        <div className="w-screen h-screen">
            <MaybesCanvas />
        </div>
    );
}
