import React, { useRef, useEffect } from 'react';

export interface MagnetItem {
    id: string;
    icon: React.ReactNode;
    label: string;
}

interface MagnetWheelProps {
    items: MagnetItem[];
    activeId: string;
    onSelect: (id: string) => void;
    side?: 'left' | 'right';
}

export const MagnetWheel: React.FC<MagnetWheelProps> = ({ items, activeId, onSelect, side = 'left' }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
    const isScrollingRef = useRef(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Physics Config - Side based sizing
    // Left side (Mode) is slightly dominant (50px vs 44px base)
    const baseSize = side === 'left' ? 50 : 44;
    const activeScale = 1.3;

    // Initial Scroll to Active
    useEffect(() => {
        const container = scrollRef.current;
        const item = itemRefs.current.get(activeId);
        if (container && item && !isScrollingRef.current) {
            const containerCenter = container.offsetWidth / 2;
            const itemCenter = item.offsetLeft + item.offsetWidth / 2;
            container.scrollTo({
                left: itemCenter - containerCenter,
                behavior: 'smooth'
            });
        }
    }, [activeId]);

    const handleScroll = React.useCallback(() => {
        if (!scrollRef.current) return;
        isScrollingRef.current = true;

        const container = scrollRef.current;
        const containerCenter = container.scrollLeft + container.offsetWidth / 2;

        let closestId = '';
        let minDistance = Infinity;

        // Visual Updates (Scale) & Find Closest
        items.forEach((item) => {
            const el = itemRefs.current.get(item.id);
            if (el) {
                const itemCenter = el.offsetLeft + el.offsetWidth / 2;
                const distance = Math.abs(containerCenter - itemCenter);

                // Physics Config
                const maxDistance = 60; // Influence radius

                // Scale Calculator
                const scale = Math.max(0.7, activeScale - (distance / maxDistance) * 0.8);
                const opacity = Math.max(0.3, 1 - (distance / maxDistance) * 0.8);

                el.style.transform = `scale(${scale})`;
                el.style.opacity = `${opacity}`;
                el.style.zIndex = distance < 15 ? '20' : '10';

                // Snap Detection
                if (distance < minDistance) {
                    minDistance = distance;
                    closestId = item.id;
                }
            }
        });

        // Debounce selection update ("Stop to select")
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            if (closestId && closestId !== activeId) {
                onSelect(closestId);
            }
            isScrollingRef.current = false;
        }, 50);

    }, [items, activeId, onSelect, baseSize, activeScale]);

    // Initial visual setup
    useEffect(() => {
        handleScroll();
    }, []);

    // Get Active Label
    const activeItem = items.find(i => i.id === activeId);

    return (
        <div className="relative flex flex-col items-center justify-center -space-y-1">
            {/* Wheel Container */}
            <div className={`relative ${side === 'left' ? 'w-[110px]' : 'w-[100px]'} h-12 flex items-center shrink-0 select-none`}>
                <div
                    ref={scrollRef}
                    className="flex items-center gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-none w-full h-full px-[50%]"
                    onScroll={handleScroll}
                    style={{
                        scrollPaddingInline: '50%',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                    }}
                >
                    <style jsx>{`
                        div::-webkit-scrollbar { display: none; }
                    `}</style>

                    {items.map(item => (
                        <button
                            key={item.id}
                            ref={el => { if (el) itemRefs.current.set(item.id, el); }}
                            onClick={() => {
                                onSelect(item.id);
                                // Force Snap logic...
                                const container = scrollRef.current;
                                const el = itemRefs.current.get(item.id);
                                if (container && el) {
                                    const containerCenter = container.offsetWidth / 2;
                                    const itemCenter = el.offsetLeft + el.offsetWidth / 2;
                                    container.scrollTo({ left: itemCenter - containerCenter, behavior: 'smooth' });
                                }
                            }}
                            className={`
                                flex-shrink-0 snap-center flex items-center justify-center 
                                rounded-full transition-transform duration-75 ease-linear 
                                bg-neutral-100 dark:bg-neutral-800 
                                text-neutral-800 dark:text-neutral-200 
                                shadow-sm border border-neutral-200 dark:border-neutral-700
                                ${activeId === item.id ? 'ring-2 ring-blue-500/50 dark:ring-blue-400/50' : ''}
                                touch-manipulation
                            `}
                            style={{
                                minWidth: `${baseSize}px`,
                                minHeight: `${baseSize}px`,
                                width: `${baseSize}px`,
                                height: `${baseSize}px`
                            }}
                            title={item.label}
                        >
                            {/* Wrapper to control icon scale inside the larger button */}
                            <div className={`${side === 'left' ? 'w-6 h-6' : 'w-5 h-5'} flex items-center justify-center`}>
                                {item.icon}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Label Moved External */}

            {/* Soft Fade Edges */}
            <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white dark:from-neutral-900 to-transparent pointer-events-none z-30" />
            <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white dark:from-neutral-900 to-transparent pointer-events-none z-30" />
        </div>
    );
};

interface DualMagnifierProps {
    activeMode: string;
    onModeSelect: (mode: string) => void;
    activeTool: string;
    onToolSelect: (tool: string) => void;
    toolOptions: MagnetItem[];
    modeOptions?: MagnetItem[]; // New Prop
}

export function DualMagnifier({ activeMode, onModeSelect, activeTool, onToolSelect, toolOptions, modeOptions }: DualMagnifierProps) {

    // Default Modes (Design)
    const defaultModes: MagnetItem[] = [
        { id: 'layout', label: 'Layout', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg> },
        { id: 'typography', label: 'Typography', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 7V4h16v3M9 20h6M12 4v16" /></svg> },
        { id: 'style', label: 'Style', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></svg> },
    ];

    const modesToUse = modeOptions || defaultModes;

    // Label Lookups
    const activeModeLabel = modesToUse.find(m => m.id === activeMode)?.label || '';
    const activeToolLabel = toolOptions.find(t => t.id === activeTool)?.label || '';

    return (
        <div className="flex flex-col items-center gap-1">
            {/* The Control Pill */}
            <div className="flex bg-white dark:bg-neutral-800 rounded-full shadow-sm border border-neutral-200 dark:border-neutral-700 p-1 gap-2 z-20 relative">

                {/* Left Wheel: Mode Selector */}
                <MagnetWheel
                    items={modesToUse}
                    activeId={activeMode}
                    onSelect={onModeSelect}
                    side="left"
                />

                {/* Divider */}
                <div className="w-px bg-neutral-200 dark:bg-neutral-700 my-2" />

                {/* Right Wheel: Tool Selector */}
                <MagnetWheel
                    items={toolOptions}
                    activeId={activeTool}
                    onSelect={onToolSelect}
                    side="right"
                />
            </div>

            {/* External Labels Row */}
            <div className="flex gap-2 text-[9px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 select-none z-10 w-full justify-center">
                {/* Mode Label Area */}
                <div className="w-[110px] flex justify-center">
                    <span className="animate-fadeIn">{activeModeLabel}</span>
                </div>

                {/* Divider Spacer */}
                <div className="w-px" />

                {/* Tool Label Area */}
                <div className="w-[100px] flex justify-center">
                    <span className="animate-fadeIn">{activeToolLabel}</span>
                </div>
            </div>
        </div>
    );
}
