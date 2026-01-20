import React from 'react';

interface RightToolbarProps {
    previewMode: 'desktop' | 'mobile';
    setPreviewMode: (v: 'desktop' | 'mobile') => void;
    align: 'left' | 'center' | 'right';
    setAlign: (v: 'left' | 'center' | 'right') => void;
    aspectRatio: 'square' | 'portrait' | 'landscape';
    setAspectRatio: (v: 'square' | 'portrait' | 'landscape') => void;
    tileVariant: 'generic' | 'product' | 'kpi' | 'text';
    setTileVariant: (v: 'generic' | 'product' | 'kpi' | 'text') => void;
    showTitle: boolean;
    setShowTitle: (v: boolean) => void;
    showMeta: boolean;
    setShowMeta: (v: boolean) => void;
    showBadge: boolean;
    setShowBadge: (v: boolean) => void;
    showCtaLabel: boolean;
    setShowCtaLabel: (v: boolean) => void;
    showCtaArrow: boolean;
    setShowCtaArrow: (v: boolean) => void;
}

const Segmented = <T extends string>({ options, value, onSelect }: { options: readonly T[]; value: T; onSelect: (v: T) => void }) => (
    <div className="flex rounded-md bg-neutral-100 dark:bg-neutral-800 p-0.5">
        {options.map(opt => (
            <button
                key={opt}
                onClick={() => onSelect(opt)}
                className={`px-2 py-1 rounded text-xs capitalize ${value === opt ? 'bg-white dark:bg-neutral-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
            >
                {opt}
            </button>
        ))}
    </div>
);

export function RightToolbar({
    previewMode,
    setPreviewMode,
    align,
    setAlign,
    aspectRatio,
    setAspectRatio,
    tileVariant,
    setTileVariant,
    showTitle,
    setShowTitle,
    showMeta,
    setShowMeta,
    showBadge,
    setShowBadge,
    showCtaLabel,
    setShowCtaLabel,
    showCtaArrow,
    setShowCtaArrow,
}: RightToolbarProps) {
    const labelClass = 'font-semibold text-xs uppercase tracking-wider text-neutral-500';

    return (
        <aside className="hidden md:flex fixed top-0 right-0 h-screen w-[280px] bg-white/95 dark:bg-neutral-900/95 border-l border-neutral-200 dark:border-neutral-800 shadow-lg z-40 p-4 overflow-y-auto">
            <div className="flex flex-col gap-4 w-full pt-6 pb-8 text-neutral-900 dark:text-neutral-100">
                <div className="flex flex-col gap-2">
                    <span className={labelClass}>View</span>
                    <Segmented options={['desktop', 'mobile'] as const} value={previewMode} onSelect={setPreviewMode} />
                </div>

                <div className="flex flex-col gap-2">
                    <span className={labelClass}>Layout</span>
                    <Segmented options={['left', 'center', 'right'] as const} value={align} onSelect={setAlign} />
                    <Segmented options={['square', 'portrait', 'landscape'] as const} value={aspectRatio} onSelect={setAspectRatio} />
                </div>

                <div className="flex flex-col gap-2">
                    <span className={labelClass}>Content</span>
                    <Segmented options={['generic', 'product', 'kpi', 'text'] as const} value={tileVariant} onSelect={setTileVariant} />
                </div>

                <div className="flex flex-col gap-2">
                    <span className={labelClass}>Visibility</span>
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input type="checkbox" checked={showTitle} onChange={e => setShowTitle(e.target.checked)} className="rounded border-gray-300" />
                            <span className="text-sm">Title</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input type="checkbox" checked={showMeta} onChange={e => setShowMeta(e.target.checked)} className="rounded border-gray-300" />
                            <span className="text-sm">Meta</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input type="checkbox" checked={showBadge} onChange={e => setShowBadge(e.target.checked)} className="rounded border-gray-300" />
                            <span className="text-sm">Badge</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input type="checkbox" checked={showCtaLabel} onChange={e => setShowCtaLabel(e.target.checked)} className="rounded border-gray-300" />
                            <span className="text-sm">CTA Label</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input type="checkbox" checked={showCtaArrow} onChange={e => setShowCtaArrow(e.target.checked)} className="rounded border-gray-300" />
                            <span className="text-sm">CTA Arrow</span>
                        </label>
                    </div>
                </div>
            </div>
        </aside>
    );
}
