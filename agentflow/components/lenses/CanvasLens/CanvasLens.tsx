import React from 'react';
import { CanvasType } from '../../../lib/CanvasRegistry';
import { VideoCanvas } from '../../canvases/VideoCanvas/VideoCanvas';
import { PageCanvas } from '../../canvases/PageCanvas/PageCanvas';
import { RecapCanvas } from '../../canvases/RecapCanvas/RecapCanvas';

interface CanvasLensProps {
    activeCanvas: CanvasType;
}

export const CanvasLens: React.FC<CanvasLensProps> = ({ activeCanvas }) => {
    const renderCanvas = () => {
        switch (activeCanvas) {
            case 'video_canvas':
                return <VideoCanvas />;
            case 'page_canvas':
                return <PageCanvas />;
            case 'recap_canvas':
                return <RecapCanvas />;
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
