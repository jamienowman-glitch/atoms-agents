import React, { useState, useEffect } from 'react';
import type { SCHEMA } from '../exposed_tokens/schema';

type AtomProps = {
    tokens: typeof SCHEMA;
    onUpdate?: (path: string[], value: any) => void;
};

export const View: React.FC<AtomProps> = ({ tokens, onUpdate }) => {
    // Hooks for animation
    const headingStyle = useTypographyAnimation(tokens.typography.heading);
    const subheadingStyle = useTypographyAnimation(tokens.typography.subheading);

    return (
        <div style={{
            backgroundImage: `url(${tokens.content.background_image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: tokens.size.height,
            width: '100%',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: tokens.layout.align as any,
            justifyContent: tokens.layout.justify,
            gap: tokens.spacing.gap,
            padding: `${tokens.spacing.padding.top} ${tokens.spacing.padding.right} ${tokens.spacing.padding.bottom} ${tokens.spacing.padding.left}`
        }}>
            {/* Overlay */}
            <div style={{
                position: 'absolute', inset: 0, backgroundColor: tokens.color.overlay, zIndex: 0
            }} />

            {/* Content */}
            <div style={{ zIndex: 1, textAlign: 'center' }}>
                <RichEditableText
                    value={tokens.content.heading}
                    onSave={(val: string) => onUpdate?.(['content', 'heading'], val)}
                    style={{
                        margin: 0,
                        fontSize: tokens.typography.heading.size,
                        color: tokens.typography.heading.color,
                        letterSpacing: tokens.typography.heading.letter_spacing,
                        ...headingStyle
                    }}
                    tag="h1"
                />
                <RichEditableText
                    value={tokens.content.subheading}
                    onSave={(val: string) => onUpdate?.(['content', 'subheading'], val)}
                    style={{
                        margin: '10px 0 0',
                        fontSize: tokens.typography.subheading.size,
                        color: tokens.typography.subheading.color,
                        letterSpacing: tokens.typography.subheading.letter_spacing,
                        ...subheadingStyle
                    }}
                    tag="p"
                />
                <button style={{
                    marginTop: 20,
                    padding: '12px 30px',
                    fontSize: 16,
                    fontWeight: 'bold',
                    backgroundColor: tokens.color.button_bg,
                    color: tokens.color.button_text,
                    border: 'none',
                    cursor: 'pointer'
                }}>
                    {tokens.content.cta_text}
                </button>
            </div>
            {/* Scroll Spacer for Testing Animation */}
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, height: '150vh', background: 'linear-gradient(to bottom, transparent, #eee)', pointerEvents: 'none', opacity: 0.5 }}>
                <div style={{ padding: 20, color: '#666' }}>Scroll down to test animation...</div>
            </div>
        </div>
    );
};

// ... useTypographyAnimation ...

// Rich Text Component
const RichEditableText = ({ value, style, tag: Tag = 'div', onSave }: any) => {
    const [isEditing, setIsEditing] = useState(false);
    const ref = React.useRef<HTMLElement>(null);
    const [toolbar, setToolbar] = React.useState<{ x: number, y: number, show: boolean, range: Range | null }>({ x: 0, y: 0, show: false, range: null });

    // Sync initial value (dangerouslySetInnerHTML is risky but standard for this level of prototype)
    useEffect(() => {
        if (ref.current && !isEditing) {
            ref.current.innerHTML = value;
        }
    }, [value, isEditing]);

    const handleSelect = () => {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) {
            setToolbar(prev => ({ ...prev, show: false }));
            return;
        }

        // Get bounds
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        // Show toolbar above selection
        setToolbar({
            x: rect.left + (rect.width / 2),
            y: rect.top - 10,
            show: true,
            range: range.cloneRange()
        });
    };

    const applyStyle = (axis: string, val: number) => {
        if (!toolbar.range) return;

        // Wrap selection in span
        const span = document.createElement('span');
        span.style.fontVariationSettings = `'${axis}' ${val}`;

        try {
            toolbar.range.surroundContents(span);
            // Clear selection
            window.getSelection()?.removeAllRanges();
            setToolbar(prev => ({ ...prev, show: false }));
        } catch (e) {
            console.error("Cant apply style to partial node", e);
        }
    };

    const handleBlur = () => {
        // Save content
        const html = ref.current?.innerHTML || '';
        if (onSave) onSave(html);
    };

    return (
        <>
            <Tag
                ref={ref}
                contentEditable
                suppressContentEditableWarning
                onBlur={handleBlur}
                onMouseUp={handleSelect}
                onKeyUp={handleSelect} // For keyboard selection
                style={{ ...style, outline: 'none', cursor: 'text' }}
            />

            {/* Floating Toolbar */}
            {toolbar.show && (
                <div style={{
                    position: 'fixed',
                    top: toolbar.y,
                    left: toolbar.x,
                    transform: 'translate(-50%, -100%)',
                    background: '#222',
                    padding: '8px 12px',
                    borderRadius: 24, // Round off corners
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    zIndex: 9999,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <label style={{ fontSize: 9, textTransform: 'uppercase', color: '#888', letterSpacing: 0.5 }}>Weight</label>
                        <input type="range" min="100" max="900" step="10" defaultValue="400"
                            onMouseDown={(e) => e.stopPropagation()}
                            onMouseUp={(e) => applyStyle('wght', Number((e.target as HTMLInputElement).value))}
                            style={{ width: 80, cursor: 'pointer', accentColor: 'white' }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <label style={{ fontSize: 9, textTransform: 'uppercase', color: '#888', letterSpacing: 0.5 }}>Slant</label>
                        <input type="range" min="-10" max="0" step="1" defaultValue="0"
                            onMouseDown={(e) => e.stopPropagation()}
                            onMouseUp={(e) => applyStyle('slnt', Number((e.target as HTMLInputElement).value))}
                            style={{ width: 80, cursor: 'pointer', accentColor: 'white' }}
                        />
                    </div>
                    {/* Close Action */}
                    <button
                        onClick={() => setToolbar(prev => ({ ...prev, show: false }))}
                        style={{
                            background: 'transparent', border: 'none', color: '#666',
                            fontSize: 14, cursor: 'pointer', padding: '0 0 0 8px',
                            marginLeft: 4, borderLeft: '1px solid #444'
                        }}
                    >×</button>
                </div>
            )}
        </>
    );
};

// Animation Hook
const useTypographyAnimation = (config: any) => {
    // Default static style (Variable Font Axes)
    const getStaticStyle = () => ({
        fontVariationSettings: `'wght' ${config.weight}, 'wdth' ${config.width}, 'slnt' ${config.slant}`,
        fontWeight: config.weight, // Fallback/Semantic
        transition: undefined as string | undefined
    });

    const [style, setStyle] = useState(getStaticStyle());

    // DEBUG STATE
    const [debugScroll, setDebugScroll] = useState(0);

    useEffect(() => {
        // Reset if config changes
        if (!config.animation?.animation_mode || config.animation.animation_mode === 'OFF') {
            setStyle(getStaticStyle());
            return;
        }

        const handleScroll = (e: Event) => {
            const target = e.target as HTMLElement | Document;
            // Robust scroll reading
            let scrollY = 0;
            if (target instanceof Document) {
                scrollY = window.scrollY;
            } else if (target instanceof HTMLElement) {
                scrollY = target.scrollTop;
            }

            // DEBUG
            setDebugScroll(scrollY);

            // SENSITIVITY: Effect maxes out at 300px (was 500) -> Faster change
            const ratio = Math.min(scrollY / 300, 1);

            let newWeight = config.weight;
            let newSlant = config.slant;

            switch (config.animation.animation_style) {
                case 'BREATHE_IN':
                    // Lose weight drasticly
                    // e.g. 900 -> 100
                    const wDeltaIn = 700 * ratio; // Bigger change
                    newWeight = Math.max(100, config.weight - wDeltaIn);
                    break;
                case 'BREATHE_OUT':
                    // Gain weight
                    const wDeltaOut = 700 * ratio; // Bigger change
                    newWeight = Math.min(900, config.weight + wDeltaOut);
                    break;
                case 'LEAN_BACK':
                    // Slant backwards
                    newSlant = Math.max(-10, config.slant - (ratio * 10));
                    break;
            }

            setStyle({
                fontVariationSettings: `'wght' ${newWeight}, 'wdth' ${config.width}, 'slnt' ${newSlant}`,
                fontWeight: newWeight,
                transition: 'font-variation-settings 0.05s linear' // Faster transition
            });
        };

        // ROBUST PARENT FINDER
        // Look up the tree for ANY element with overflow-y: auto/scroll
        const findScrollParent = (node: HTMLElement | null): HTMLElement | null => {
            if (!node) return null;
            const style = window.getComputedStyle(node);
            const overflowY = style.overflowY;
            if (overflowY === 'auto' || overflowY === 'scroll') return node;
            return findScrollParent(node.parentElement);
        };

        // Find the scroller starting from the root of this component if possible?
        // We don't have a ref to the component root here easily without refactor.
        // HACK: Use document.querySelector('.main-preview') as starting point and find its scroller child
        const mainPreview = document.querySelector('.main-preview');
        // The scroller is likely the direct child of mainPreview (PreviewCanvas wrapper)
        // Or recursively search down?
        // Let's attach to ALL potential scrollers we find in the workbench to be safe.
        const scrollers = document.querySelectorAll('div'); // Too aggressive?

        // Better: The user is stuck on mobile. The structure is fixed.
        // Workbench > MainPreview > PreviewCanvas(outer div=scroller)
        const candidates = [];
        candidates.push(window);
        if (mainPreview && mainPreview.firstElementChild) candidates.push(mainPreview.firstElementChild);

        candidates.forEach(c => c && c.addEventListener('scroll', handleScroll, { passive: true, capture: true }));

        return () => {
            candidates.forEach(c => c && c.removeEventListener('scroll', handleScroll));
        };
    }, [config, config.animation, config.weight, config.slant, config.width]);

    // Return style plus debug info attached? No, hook returns style.
    // We'll sneak the debug info into a CSS var or just rely on the style update.
    // Actually, I'll update the component to show the debug info if I can.
    // For now, returning style object.
    return style;
};

// Simple Editable Component
const EditableText = ({ value, style, tag: Tag = 'div' }: any) => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(value);

    useEffect(() => setText(value), [value]);

    const handleDouble = () => setIsEditing(true);

    // Long press logic
    const [timer, setTimer] = useState<any>(null);
    const startPress = () => setTimer(setTimeout(() => setIsEditing(true), 800));
    const endPress = () => clearTimeout(timer);

    const handleBlur = () => {
        setIsEditing(false);
        // Here we would call onUpdate(path, text)
        // Since we don't have the path or updater wired, we log for now.
        // We need to refactor App.tsx to pass `onUpdate`.
        console.log('Saved:', text);
        // Logic to bubble up change event would go here.
        // Trigger a custom event that App.tsx listens to? Or direct prop?
        window.dispatchEvent(new CustomEvent('atom-text-update', { detail: { value: text } }));
    };

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') handleBlur();
        if (e.key === 'Escape') {
            setText(value); // Reset
            setIsEditing(false);
        }
    };

    if (isEditing) {
        return (
            <input
                autoFocus
                value={text}
                onChange={e => setText(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                style={{ ...style, display: 'block', background: 'rgba(255,255,255,0.9)', color: 'black', border: 'none', textAlign: 'inherit', width: '100%' }}
            />
        );
    }

    return (
        <Tag
            style={style}
            onDoubleClick={handleDouble}
            onTouchStart={startPress}
            onTouchEnd={endPress}
        >
            {text}
        </Tag>
    );
};
