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
    const { onForward } = useCanvasActions();

    const renderContent = () => {
        switch (data.type) {
            case 'text':
            case 'building_text':
                return <BuildingText data={data} />;
            case 'audio':
            case 'building_audio':
                return <BuildingAudio data={data} />;
            case 'image':
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
            transition: 'box-shadow 0.2s ease',
            position: 'relative',
        }}>
            <Handle type="target" position={Position.Top} style={{ visibility: 'hidden' }} />

            {renderContent()}

            {/* Forward Button */}
            <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    className="nodrag"
                    onClick={() => onForward(data.id, data.content)}
                    style={{
                        fontSize: '11px',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        background: '#000',
                        color: '#fff',
                        cursor: 'pointer',
                        fontWeight: 500,
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#333';
                        e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#000';
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                >
                    Forward →
                </button>
            </div>

            <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} />
        </div>
    );
});
