import React from 'react';
import { motion } from 'framer-motion';
import { AtomProps } from '@northstar/builder-registry';

export const HeadlineBlock: React.FC<AtomProps> = ({ id, properties, isSelected, onClick, onUpdate }) => {
    const sizeMap: Record<string, string> = { small: '1.5rem', medium: '2.5rem', large: '3.5rem', xl: '4.5rem' };
    const [isEditing, setIsEditing] = React.useState(false);

    const handleBlur = (e: React.FocusEvent<HTMLHeadingElement>) => {
        setIsEditing(false);
        if (onUpdate && e.currentTarget.textContent !== properties.text) {
            onUpdate(id, 'text', e.currentTarget.textContent || '');
        }
    };

    return (
        <motion.h2
            layoutId={id}
            onClick={(e) => { e.stopPropagation(); onClick?.(e); }}
            onDoubleClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
                setTimeout(() => {
                    const el = document.getElementById(`editable-${id}`);
                    el?.focus();
                }, 0);
            }}
            id={`editable-${id}`}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={handleBlur}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    e.currentTarget.blur();
                }
            }}
            style={{
                fontSize: sizeMap[properties.size] || sizeMap.medium,
                color: properties.color || '#000',
                backgroundColor: properties.background || 'transparent',
                padding: properties.background && properties.background !== 'transparent' ? '8px' : '0',
                borderRadius: '4px',
                margin: '0 0 16px 0',
                lineHeight: 1.2,
                border: isEditing ? '2px solid #005bd3' : (isSelected ? '2px solid #005bd3' : '2px solid transparent'),
                display: 'inline-block',
                minWidth: '50px',
                maxWidth: '100%',
                wordWrap: 'break-word',
                cursor: 'text',
                outline: 'none'
            }}
        >
            {properties.text || 'Heading'}
        </motion.h2>
    );
};

export const TextBlock: React.FC<AtomProps> = ({ id, properties, isSelected, onClick, onUpdate }) => {
    const [isEditing, setIsEditing] = React.useState(false);

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        setIsEditing(false);
        if (onUpdate && e.currentTarget.innerText !== properties.text) {
            onUpdate(id, 'text', e.currentTarget.innerText || '');
        }
    };

    return (
        <motion.div
            layoutId={id}
            onClick={(e) => { e.stopPropagation(); onClick?.(e); }}
            onDoubleClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
                setTimeout(() => {
                    const el = document.getElementById(`editable-${id}`);
                    el?.focus();
                }, 0);
            }}
            id={`editable-${id}`}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={handleBlur}
            style={{
                color: properties.color || '#4a4a4a',
                backgroundColor: properties.background || 'transparent',
                padding: properties.background && properties.background !== 'transparent' ? '8px' : '0',
                borderRadius: '4px',
                fontSize: '1rem',
                margin: '0 0 16px 0',
                lineHeight: 1.6,
                border: isEditing ? '2px solid #005bd3' : (isSelected ? '2px solid #005bd3' : '2px solid transparent'),
                whiteSpace: 'pre-wrap',
                maxWidth: '100%',
                wordWrap: 'break-word',
                outline: 'none',
                minHeight: '1.6em',
                cursor: 'text'
            }}
        >
            {properties.text || 'Block text'}
        </motion.div>
    );
};

export const ButtonBlock: React.FC<AtomProps> = ({ id, properties, isSelected, onClick }) => {
    return (
        <div style={{ margin: '16px 0' }} onClick={(e) => { e.stopPropagation(); onClick?.(e); }}>
            <a
                href={properties.url}
                onClick={(e) => e.preventDefault()} // prevent nav
                style={{
                    display: 'inline-block',
                    padding: '12px 24px',
                    backgroundColor: properties.background || '#000',
                    color: properties.color || '#fff',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    fontWeight: 500,
                    border: isSelected ? '2px solid #005bd3' : '2px solid transparent',
                    cursor: 'pointer'
                }}
            >
                {properties.label || 'Button'}
            </a>
        </div>
    );
};
