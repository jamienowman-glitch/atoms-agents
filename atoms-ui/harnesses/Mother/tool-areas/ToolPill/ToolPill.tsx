"use client";

import React, { useState, useRef } from 'react';

// Category Icons as SVG components
const CopyIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M4 7V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-5.5" />
        <path d="M14 2v6h6" />
        <path d="M4 13h12" />
        <path d="M4 17h12" />
    </svg>
);

const ImageIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
    </svg>
);

const FeedsIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M4 11a9 9 0 0 1 9 9" />
        <path d="M4 4a16 16 0 0 1 16 16" />
        <circle cx="5" cy="19" r="1" />
    </svg>
);

const CTAIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <rect x="3" y="8" width="18" height="8" rx="2" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
    </svg>
);

// Category and Atom definitions
type Category = 'copy' | 'image' | 'feeds' | 'cta';

interface AtomDefinition {
    id: string;
    label: string;
    type: string;
}

const CATEGORY_CONFIG: Record<Category, { icon: React.FC; label: string; atoms: AtomDefinition[] }> = {
    copy: {
        icon: CopyIcon,
        label: 'Copy',
        atoms: [
            { id: 'jumbo', label: 'Jumbo', type: 'text' },
            { id: 'headline', label: 'Headline', type: 'text' },
            { id: 'subtitle', label: 'Subtitle', type: 'text' },
            { id: 'body', label: 'Body', type: 'text' }
        ]
    },
    image: {
        icon: ImageIcon,
        label: 'Image',
        atoms: [
            { id: 'hero', label: 'Hero', type: 'hero' },
            { id: 'bleeding_hero', label: 'Bleeding', type: 'bleeding_hero' },
            { id: 'media', label: 'Media', type: 'media' }
        ]
    },
    feeds: {
        icon: FeedsIcon,
        label: 'Feeds',
        atoms: [
            { id: 'news', label: 'News', type: 'generic' },
            { id: 'products', label: 'Products', type: 'generic' }
        ]
    },
    cta: {
        icon: CTAIcon,
        label: 'CTA',
        atoms: [
            { id: 'button', label: 'Button', type: 'cta' },
            { id: 'link', label: 'Link', type: 'cta' }
        ]
    }
};

interface ToolPillProps {
    onAddAtom: (atomType: string, atomId: string) => void;
}

export function ToolPill({ onAddAtom }: ToolPillProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<Category | null>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const isDragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const initialPos = useRef({ x: 0, y: 0 });
    const [hasMoved, setHasMoved] = useState(false);

    const handlePointerDown = (e: React.PointerEvent) => {
        isDragging.current = true;
        dragStart.current = { x: e.clientX, y: e.clientY };
        initialPos.current = { ...position };
        setHasMoved(false);
        (e.currentTarget as Element).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging.current) return;
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) setHasMoved(true);
        setPosition({ x: initialPos.current.x + dx, y: initialPos.current.y + dy });
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!isDragging.current) return;
        isDragging.current = false;
        (e.target as Element).releasePointerCapture(e.pointerId);
        if (!hasMoved) {
            setIsOpen(!isOpen);
            setActiveCategory(null);
        }
    };

    const handleCategoryClick = (category: Category) => {
        setActiveCategory(activeCategory === category ? null : category);
    };

    const handleAtomClick = (atom: AtomDefinition) => {
        onAddAtom(atom.type, atom.id);
        setIsOpen(false);
        setActiveCategory(null);
    };

    return (
        <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                touchAction: 'none'
            }}
            className="fixed bottom-32 right-4 z-[200] flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
        >
            {/* Level 1: Vertical Category Lozenge */}
            {isOpen && (
                <div className="absolute bottom-full mb-4 flex flex-col gap-2 pointer-events-auto"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}>
                    {(Object.keys(CATEGORY_CONFIG) as Category[]).map((category) => {
                        const config = CATEGORY_CONFIG[category];
                        const Icon = config.icon;
                        return (
                            <button
                                key={category}
                                onClick={() => handleCategoryClick(category)}
                                className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${activeCategory === category
                                    ? 'bg-black text-white scale-110'
                                    : 'bg-white text-black hover:scale-105'
                                    }`}
                                aria-label={config.label}
                            >
                                <Icon />
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Level 2: Horizontal Atom Side-Pop */}
            {activeCategory && (
                <div className="absolute right-full mr-4 flex gap-2 pointer-events-auto"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}>
                    {CATEGORY_CONFIG[activeCategory].atoms.map((atom) => (
                        <button
                            key={atom.id}
                            onClick={() => handleAtomClick(atom)}
                            className="w-12 h-12 bg-white text-black rounded-full shadow-lg flex items-center justify-center text-[10px] font-bold uppercase hover:scale-105 transition-transform"
                            title={atom.label}
                        >
                            {atom.label.charAt(0)}
                        </button>
                    ))}
                </div>
            )}

            {/* The Trigger Button */}
            <button
                className="w-12 h-12 bg-white text-black rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex items-center justify-center active:scale-95 transition-transform duration-100"
                aria-label="Add Item"
            >
                <svg className={`w-6 h-6 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            </button>
        </div>
    );
}
