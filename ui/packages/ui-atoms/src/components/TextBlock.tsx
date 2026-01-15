import React, { useState, useEffect } from 'react';
import { AtomProps } from '@northstar/builder-registry';

export const TextBlock: React.FC<AtomProps> = ({ id, properties, isSelected, onClick }) => {
    const text = properties['content.text'] || 'Start typing...';
    const typography = properties['style.typography'] || 'body';

    // In a real implementation this would use a content-editable or a rich text editor.
    // For P0 we simulate inline editing with a simple textarea that appears on click/selection.
    const [isEditing, setIsEditing] = useState(false);
    const [localText, setLocalText] = useState(text);

    useEffect(() => {
        setLocalText(text);
    }, [text]);

    // Construct style based on typography token
    let style: React.CSSProperties = {
        outline: 'none',
        fontFamily: 'inherit',
        maxWidth: '100%',
        margin: '0',
        lineHeight: '1.4'
    };

    switch (typography) {
        case 'h1': style = { ...style, fontSize: '32px', fontWeight: 700, margin: '16px 0' }; break;
        case 'h2': style = { ...style, fontSize: '24px', fontWeight: 600, margin: '12px 0' }; break;
        case 'h3': style = { ...style, fontSize: '18px', fontWeight: 600, margin: '8px 0' }; break;
        case 'body':
        default:
            style = { ...style, fontSize: '16px', fontWeight: 400 }; break;
    }

    if (isEditing && isSelected) {
        return (
            <div style={{ margin: '8px 0' }}>
                <textarea
                    autoFocus
                    value={localText}
                    onChange={(e) => setLocalText(e.target.value)}
                    onBlur={() => {
                        setIsEditing(false);
                        // In a real app we'd fire an update op here via a context callback
                        // e.g. onUpdate(id, 'content.text', localText);
                        // But AtomProps doesn't have onUpdate standardized in this specific repo slice yet.
                        // Assuming the parent handles updates via another mechanism or we treat this as read-only for now beyond local state.
                        console.log('Would persist:', id, localText);
                    }}
                    style={{ ...style, width: '100%', border: '1px dashed #ccc', background: '#fafafa', resize: 'vertical' }}
                />
            </div>
        );
    }

    return (
        <div
            onClick={(e) => {
                onClick?.(e);
                setIsEditing(true);
            }}
            style={{
                ...style,
                border: isSelected ? '2px solid #005bd3' : '2px solid transparent',
                cursor: 'text',
                minHeight: '1em'
            }}
        >
            {localText}
        </div>
    );
};
