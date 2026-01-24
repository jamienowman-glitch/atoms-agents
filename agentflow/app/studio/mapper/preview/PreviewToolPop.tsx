"use client";

import React, { useState, useEffect, useRef } from 'react';
/* 
   PREVIEW VERSION OF BOTTOM CONTROLS PANEL 
   - Replaced context with local state for Mapper visualization
*/

// --- Shared UI Components ---
interface UniversalSliderProps {
    value: number;
    min: number;
    max: number;
    step?: number;
    onChange: (v: number) => void;
}
const UniversalSlider: React.FC<UniversalSliderProps> = ({ value, min, max, step = 1, onChange }) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const handleInteract = (e: React.MouseEvent | React.TouchEvent) => {
        if ('touches' in e && e.cancelable) { e.preventDefault(); e.stopPropagation(); }
        if (!trackRef.current) return;
        const rect = trackRef.current.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        let percentage = (clientX - rect.left) / rect.width;
        percentage = Math.max(0, Math.min(1, percentage));
        let rawValue = min + percentage * (max - min);
        let stepped = Math.round(rawValue / step) * step;
        stepped = Math.max(min, Math.min(max, stepped));
        onChange(stepped);
    };
    return (
        <div ref={trackRef} onClick={handleInteract} onTouchMove={handleInteract} onTouchStart={handleInteract} className="relative w-full h-8 flex items-center group cursor-pointer touch-none select-none">
            <div className="absolute w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full overflows-hidden">
                <div className="h-full bg-neutral-400 dark:bg-neutral-600 rounded-full" style={{ width: `${((value - min) / (max - min)) * 100}%` }} />
            </div>
            <div className="absolute w-4 h-4 bg-black dark:bg-white rounded-full shadow-sm transform -translate-x-1/2 pointer-events-none transition-transform duration-75" style={{ left: `${((value - min) / (max - min)) * 100}%` }} />
        </div>
    );
};

export function PreviewToolPop() {
    // --- Local State Mocking Context ---
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Magnifier State
    const [activeMode, setActiveMode] = useState<'layout' | 'font' | 'type' | 'colour'>('layout');
    const [activeLayoutTool, setActiveLayoutTool] = useState<string>('density');
    const [aspectRatioStr, setAspectRatioStr] = useState<string>('16:9');

    // Layout Tools
    const [colsDesktop, setColsDesktop] = useState(6);
    const [gapXDesktop, setGapXDesktop] = useState(16);
    const [gapYDesktop, setGapYDesktop] = useState(16);
    const [limitDesktop, setLimitDesktop] = useState(12);
    const [radiusDesktop, setRadiusDesktop] = useState(8);

    // Font Tools
    const [activeFontTool, setActiveFontTool] = useState('size');
    const [fontSizeDesktop, setFontSizeDesktop] = useState(16);
    const [fontFamily, setFontFamily] = useState(0);
    const [axisWeight, setAxisWeight] = useState(400);

    // Type Tools
    const [activeTypeTool, setActiveTypeTool] = useState('align');
    const [textAlign, setTextAlign] = useState('left');
    const [lineHeight, setLineHeight] = useState(1.5);
    const [letterSpacing, setLetterSpacing] = useState(0);

    // Colour Tools
    const [activeColourTool, setActiveColourTool] = useState('palette');
    const [opacity, setOpacity] = useState(100);
    const [blur, setBlur] = useState(0);


    // --- Helpers ---
    const renderBtnGroup = (options: { label: string, value: string }[], current: string, onChange: (v: string) => void) => (
        <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1 gap-1">
            {options.map((opt) => (
                <button
                    key={opt.value}
                    onClick={() => onChange(opt.value)}
                    className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1.5 ${current === opt.value ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm' : 'bg-transparent text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );

    // --- Renders ---
    return (
        <div className=" relative w-full max-w-[500px] mx-auto bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden select-none">

            {/* HEAD: Dual Magnifier */}
            <div className="flex items-center justify-center p-2 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 h-[72px]">
                {/* Left Magnifier (Categories) */}
                <div className="flex items-center gap-1 bg-neutral-200/50 dark:bg-neutral-800/50 p-1 rounded-full mr-2">
                    {[
                        { id: 'layout', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg> },
                        { id: 'font', icon: <span className="text-[10px] font-bold">Aa</span> },
                        { id: 'type', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="16" y2="12" /><line x1="4" y1="18" x2="18" y2="18" /></svg> },
                        { id: 'colour', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></svg> }
                    ].map(m => (
                        <button key={m.id} onClick={() => setActiveMode(m.id as any)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${activeMode === m.id ? 'bg-black text-white shadow-lg scale-110' : 'text-neutral-400 hover:bg-white'}`}>
                            {m.icon}
                        </button>
                    ))}
                </div>

                {/* Right Magnifier (Tools) */}
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide px-2 border-l border-neutral-200 pl-4">
                    {activeMode === 'layout' && (
                        <>
                            <button onClick={() => setActiveLayoutTool('density')} className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${activeLayoutTool === 'density' ? 'bg-black text-white' : 'text-neutral-500'}`}>Grid</button>
                            <button onClick={() => setActiveLayoutTool('spacing')} className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${activeLayoutTool === 'spacing' ? 'bg-black text-white' : 'text-neutral-500'}`}>Space</button>
                            <button onClick={() => setActiveLayoutTool('geometry')} className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${activeLayoutTool === 'geometry' ? 'bg-black text-white' : 'text-neutral-500'}`}>Shape</button>
                        </>
                    )}
                    {activeMode === 'font' && (
                        <>
                            <button onClick={() => setActiveFontTool('size')} className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${activeFontTool === 'size' ? 'bg-black text-white' : 'text-neutral-500'}`}>Size</button>
                            <button onClick={() => setActiveFontTool('identity')} className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${activeFontTool === 'identity' ? 'bg-black text-white' : 'text-neutral-500'}`}>Font</button>
                        </>
                    )}
                    {activeMode === 'type' && (
                        <>
                            <button onClick={() => setActiveTypeTool('align')} className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${activeTypeTool === 'align' ? 'bg-black text-white' : 'text-neutral-500'}`}>Align</button>
                            <button onClick={() => setActiveTypeTool('space')} className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${activeTypeTool === 'space' ? 'bg-black text-white' : 'text-neutral-500'}`}>Spacing</button>
                        </>
                    )}
                    {activeMode === 'colour' && (
                        <>
                            <button onClick={() => setActiveColourTool('palette')} className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${activeColourTool === 'palette' ? 'bg-black text-white' : 'text-neutral-500'}`}>Palette</button>
                            <button onClick={() => setActiveColourTool('effects')} className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${activeColourTool === 'effects' ? 'bg-black text-white' : 'text-neutral-500'}`}>Effects</button>
                        </>
                    )}
                </div>
            </div>

            {/* BODY: Controls */}
            <div className="p-4 bg-white dark:bg-neutral-900 min-h-[160px]">
                {activeMode === 'layout' && activeLayoutTool === 'density' && (
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-bold text-neutral-400 uppercase"><span>Columns</span> <span>{colsDesktop}</span></div>
                            <UniversalSlider value={colsDesktop} min={1} max={12} onChange={setColsDesktop} />
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-bold text-neutral-400 uppercase"><span>Limit</span> <span>{limitDesktop}</span></div>
                            <UniversalSlider value={limitDesktop} min={1} max={20} onChange={setLimitDesktop} />
                        </div>
                    </div>
                )}
                {activeMode === 'layout' && activeLayoutTool === 'spacing' && (
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-bold text-neutral-400 uppercase"><span>Gap X</span> <span>{gapXDesktop}px</span></div>
                            <UniversalSlider value={gapXDesktop} min={0} max={64} onChange={setGapXDesktop} />
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-bold text-neutral-400 uppercase"><span>Gap Y</span> <span>{gapYDesktop}px</span></div>
                            <UniversalSlider value={gapYDesktop} min={0} max={64} onChange={setGapYDesktop} />
                        </div>
                    </div>
                )}
                {activeMode === 'font' && activeFontTool === 'size' && (
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-bold text-neutral-400 uppercase"><span>Size</span> <span>{fontSizeDesktop}px</span></div>
                            <UniversalSlider value={fontSizeDesktop} min={12} max={96} onChange={setFontSizeDesktop} />
                        </div>
                    </div>
                )}
                {/* Fallback for other modes to keep preview clean */}
                {activeMode === 'colour' && (
                    <div className="flex items-center justify-center h-full text-xs text-neutral-400 italic">
                        Colour Controls (Simplified for Preview)
                    </div>
                )}
            </div>

        </div>
    );
}
