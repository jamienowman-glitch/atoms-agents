import React from 'react';

interface PreviewProps {
    deviceMode: 'desktop' | 'mobile';
    children: React.ReactNode;
}

export const PreviewCanvas: React.FC<PreviewProps> = ({ deviceMode, children }) => {
    const styles: React.CSSProperties = {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: deviceMode === 'mobile' ? '#ffffff' : '#e5e5e5', // Match canvas on mobile
        overflow: 'hidden', // Let canvas-wrapper handle scroll
        padding: deviceMode === 'mobile' ? 0 : '40px'
    };

    const canvasStyles: React.CSSProperties = {
        background: '#ffffff',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        width: deviceMode === 'mobile' ? '100%' : '1000px', // Fluid width on mobile
        maxWidth: deviceMode === 'mobile' ? '450px' : 'none',
        height: deviceMode === 'mobile' ? '100%' : '600px',
        minHeight: '400px',
        position: 'relative',
        overflowY: 'auto', // Enable vertical scrolling
        WebkitOverflowScrolling: 'touch', // Smooth scroll on iOS
        border: deviceMode === 'mobile' ? 'none' : undefined, // Remove border on mobile
        boxShadow: deviceMode === 'mobile' ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)', // Remove shadow on mobile for native feel
    };

    if (deviceMode === 'desktop') {
        canvasStyles.height = 'auto';
        canvasStyles.minHeight = '600px';
        // Desktop usually full width in real world, but fixed container here
    }

    return (
        <div style={styles}>
            <div className="canvas-wrapper" style={canvasStyles}>
                {children}
            </div>
        </div>
    );
};
