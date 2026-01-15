import React from 'react';
import { AtomProps } from '@northstar/builder-registry';

export const HeroSection: React.FC<AtomProps> = ({ id, properties, children, isSelected, onClick }) => {
    return (
        <section
            onClick={onClick}
            style={{
                backgroundColor: properties.background || '#f4f4f4',
                backgroundImage: properties.image ? `url(${properties.image})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                paddingTop: `${properties.padding || 60}px`,
                paddingBottom: `${properties.padding || 60}px`,
                minHeight: `${properties.height || 50}vh`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: properties.alignment || 'center',
                border: isSelected ? '2px solid #005bd3' : '2px solid transparent',
                position: 'relative',
                width: '100%',
                boxSizing: 'border-box',
                overflow: 'hidden' // prevented bleed
            }}
        >
            {properties.image && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', zIndex: 1 }} />
            )}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 2, boxSizing: 'border-box', width: '100%' }}>
                {children || <div style={{ padding: 20, border: '1px dashed #ccc', color: properties.image ? '#fff' : 'inherit' }}>Empty Hero Section</div>}
            </div>
        </section>
    );
};

export const TextSection: React.FC<AtomProps> = ({ id, properties, children, isSelected, onClick }) => {
    const maxWidth = properties.width === 'wide' ? '1200px' : '800px';
    return (
        <section
            onClick={onClick}
            style={{
                backgroundColor: properties.background || '#ffffff',
                padding: '40px 20px',
                border: isSelected ? '2px solid #005bd3' : '2px solid transparent',
                width: '100%',
                boxSizing: 'border-box'
            }}
        >
            <div style={{ maxWidth, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
                {children || <div style={{ padding: 20, border: '1px dashed #ccc' }}>Empty Text Section</div>}
            </div>
        </section>
    );
};
