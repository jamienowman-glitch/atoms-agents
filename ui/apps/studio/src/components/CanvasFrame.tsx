import React, { ReactNode } from 'react';

export const CanvasFrame = ({
    children,
    deviceMode
}: {
    children: ReactNode;
    deviceMode: 'desktop' | 'tablet' | 'mobile';
}) => {
    const width = deviceMode === 'mobile' ? '375px' : deviceMode === 'tablet' ? '768px' : '100%';
    const height = deviceMode === 'desktop' ? '100%' : 'calc(100% - 40px)';

    return (
        <div style={{
            flex: 1,
            background: '#e4e5e7',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'auto',
            padding: '20px'
        }}>
            <div style={{
                width,
                height,
                background: '#fff',
                boxShadow: '0 0 20px rgba(0,0,0,0.1)',
                transition: 'width 0.3s ease',
                overflowY: 'auto',
                overflowX: 'hidden',
                position: 'relative'
            }}>
                {children}
            </div>
        </div>
    );
};
