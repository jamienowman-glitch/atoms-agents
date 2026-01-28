import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { BuildingText } from './nodes/BuildingText';
import { BuildingAudio } from './nodes/BuildingAudio';
import { BuildingImage } from './nodes/BuildingImage';
import { useCanvasActions } from '../../logic/CanvasActionContext';


// This wrapper handles the common building "shell" (selection state, handles)
// and renders the specific content based on data.type

export const MaybesNode = memo(({ data, selected }: NodeProps) => {
    // data.type determines the implementation
    // data.content holds the state

    const renderContent = () => {
        switch (data.type) {
            case 'building_text':
                return <BuildingText data={data} />;
            case 'building_audio':
                return <BuildingAudio data={data} />;
            case 'building_image':
                return <BuildingImage data={data} />;
            default:
                return <div>Unknown Building Type</div>;
        }
    };

    return (
        <div style={{
            padding: '10px',
            borderRadius: '12px',
            background: '#fff',
            boxShadow: selected ? '0 0 0 2px #000' : '0 4px 12px rgba(0,0,0,0.1)',
            minWidth: '200px',
            transition: 'box-shadow 0.2s ease'
        }}>
            <Handle type="target" position={Position.Top} style={{ visibility: 'hidden' }} />

            {renderContent()}

            <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} />
        </div>
    );
});
