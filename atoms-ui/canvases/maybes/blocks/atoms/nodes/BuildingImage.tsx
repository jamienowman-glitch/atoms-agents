import React from 'react';
import { NodeProps } from 'reactflow';

export const BuildingImage = ({ data }: { data: NodeProps['data'] }) => {
    return (
        <div className="building-image" style={{
            width: '100%',
            height: '150px',
            background: '#eee',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999'
        }}>
            <span>Camera Disabled</span>
        </div>
    );
};
