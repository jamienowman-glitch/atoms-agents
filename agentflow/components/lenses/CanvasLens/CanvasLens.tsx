import React, { useEffect, useMemo } from 'react';
import { CanvasType } from '../../../lib/CanvasRegistry';
import { VideoCanvas } from '../../canvases/VideoCanvas/VideoCanvas';
import { PageCanvas } from '../../canvases/PageCanvas/PageCanvas';
import { RecapCanvas } from '../../canvases/RecapCanvas/RecapCanvas';
import { useWorkbenchTransport } from '../../workbench/useWorkbenchTransport';
import { CanvasTransport } from '@/lib/gate3/transport';

interface CanvasLensProps {
    activeCanvas: CanvasType;
}

export const CanvasLens: React.FC<CanvasLensProps> = ({ activeCanvas }) => {
    const transportContext = useMemo(() => ({ surface_id: activeCanvas }), [activeCanvas]);

    const transport: CanvasTransport | null = useWorkbenchTransport(`canvas-${activeCanvas}`, transportContext);

    useEffect(() => {
        if (!transport) return;
        const tools = ['select', 'text', 'media'];
        const payload = { canvas_type: activeCanvas, tools };
        const timer = setTimeout(() => transport.sendCanvasReady(payload), 300);
        return () => clearTimeout(timer);
    }, [transport, activeCanvas]);

    const renderCanvas = () => {
        switch (activeCanvas) {
            case 'video_canvas':
                return <VideoCanvas transport={transport} />;
            case 'page_canvas':
                return <PageCanvas transport={transport} canvasId={`canvas-${activeCanvas}`} canvasType={activeCanvas} />;
            case 'recap_canvas':
                return <RecapCanvas transport={transport} />;
            default:
                return (
                    <div className="flex items-center justify-center h-full text-neutral-500">
                        Unknown Canvas Type: {activeCanvas}
                    </div>
                );
        }
    };

    return (
        <div className="w-full h-full relative bg-white dark:bg-neutral-950">
            {/* The Frame / OS Chrome could go here */}
            {renderCanvas()}
        </div>
    );
};
