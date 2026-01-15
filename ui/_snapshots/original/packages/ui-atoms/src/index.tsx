import React from 'react';
import { motion } from 'framer-motion';

// --- Types ---

export interface AtomProps {
    id: string;
    properties: Record<string, any>;
    children?: React.ReactNode;
    isSelected?: boolean;
    onClick?: (e: React.MouseEvent) => void;
    onUpdate?: (id: string, prop: string, value: any) => void;
}

// --- Primitive Styles ---
// Helper to strip units if needed, but we expect data to come in clean or we clean it in render.

// --- Components ---

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
                // We need to defer focus slightly or rely on autoFocus behavior in a different way,
                // but for a simple contentEditable, clicking usually sets focus.
                // We'll use a ref if needed, but let's try simple props first.
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

export const ImageBlock: React.FC<AtomProps> = ({ id, properties, isSelected, onClick }) => {
    return (
        <div
            onClick={(e) => { e.stopPropagation(); onClick?.(e); }}
            style={{
                margin: '16px 0',
                border: isSelected ? '2px solid #005bd3' : '2px solid transparent',
                display: 'inline-block'
            }}
        >
            {properties.src ? (
                <img
                    src={properties.src}
                    alt={properties.alt}
                    style={{
                        width: `${properties.width}%`, // Actually this should probably be max-width or width relative to container
                        maxWidth: '100%',
                        height: 'auto',
                        display: 'block'
                    }}
                />
            ) : (
                <div style={{
                    width: '100%',
                    height: '200px',
                    background: '#eee',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#999'
                }}>
                    No Image Selected
                </div>
            )}
        </div>
    );
};

// ... Legacy ...
export const BoxAtom: React.FC<AtomProps> = ({ id, properties, children, isSelected, onClick }) => (
    <div onClick={onClick} style={{ padding: properties.padding, background: properties.background, border: isSelected ? '2px solid blue' : '1px solid #eee' }}>{children}</div>
);

// --- Registry ---

export const AtomRegistry: Record<string, React.FC<AtomProps>> = {
    'hero-section': HeroSection,
    'text-section': TextSection,
    'headline-block': HeadlineBlock,
    'text-block': TextBlock,
    'button-block': ButtonBlock,
    'image-block': ImageBlock,
    // Compat
    'box': BoxAtom,
    'text': TextBlock
};
