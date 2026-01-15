import React from 'react';
import { AtomProps } from '@northstar/builder-registry';

export const VectorBlock: React.FC<AtomProps> = ({ properties, isSelected, onClick }) => {
    const d = properties['path.d'] || 'M10 10 L90 90 M90 10 L10 90'; // Default X
    const strokeWidth = properties['style.strokeWidth'] || 2;
    const color = properties['style.color'] || '#000';

    return (
        <div
            onClick={onClick}
            style={{
                margin: '16px 0',
                border: isSelected ? '2px solid #005bd3' : '2px solid transparent',
                display: 'flex',
                justifyContent: 'center'
            }}
        >
            <svg width="100" height="100" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
                <path
                    d={d}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
};
