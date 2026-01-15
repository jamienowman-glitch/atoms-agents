import React from 'react';
import { AtomProps } from '@northstar/builder-registry';

export const ButtonBlock: React.FC<AtomProps> = ({ properties, isSelected, onClick }) => {
    const label = properties['content.label'] || 'Click Me';
    const href = properties['action.href'] || '#';
    const variant = properties['style.variant'] || 'primary';

    const baseStyle: React.CSSProperties = {
        padding: '10px 20px',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 600,
        textDecoration: 'none',
        display: 'inline-block',
        textAlign: 'center',
        opacity: variant === 'disabled' ? 0.5 : 1
    };

    let variantStyle: React.CSSProperties = {};
    switch (variant) {
        case 'secondary':
            variantStyle = { background: '#eee', color: '#333' };
            break;
        case 'outline':
            variantStyle = { background: 'transparent', border: '1px solid #333', color: '#333' };
            break;
        case 'primary':
        default:
            variantStyle = { background: '#000', color: '#fff' };
            break;
    }

    return (
        <div
            onClick={onClick}
            style={{
                margin: '12px 0',
                border: isSelected ? '2px solid #005bd3' : '2px solid transparent',
                display: 'flex'
            }}
        >
            <a href={href} style={{ ...baseStyle, ...variantStyle }} onClick={e => e.preventDefault()}>
                {label}
            </a>
        </div>
    );
};
