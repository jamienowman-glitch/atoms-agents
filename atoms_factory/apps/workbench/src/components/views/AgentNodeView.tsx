import React from 'react';
import { AssetRegistry } from '../../logic/AssetRegistry';

export const AgentNodeView: React.FC<any> = ({ onClick }) => {
    return (
        <div
            onClick={onClick}
            style={{
                cursor: 'pointer',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid transparent', // Ready for selection state if needed passed down
                transition: 'transform 0.1s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
            <img
                src={AssetRegistry.icons.northstar_agent}
                alt="Agent"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
        </div>
    );
};
