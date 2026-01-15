import React, { useState, useEffect } from 'react';
import { useToolControl } from '../../context/ToolControlContext';

export type PanelState = 'collapsed' | 'compact' | 'full';
type SliderTarget = 'colsDesktop' | 'colsMobile' | 'tileGap' | 'tileRadius' | 'itemCount';

interface UniversalSliderProps {
    value: number;
    min: number;
    max: number;
    step?: number;
    onChange: (v: number) => void;
}

const UniversalSlider: React.FC<UniversalSliderProps> = ({ value, min, max, step = 1, onChange }) => (
    <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-black dark:accent-white"
    />
);

/**
 * BottomControlsPanel – a 3‑state collapsible control panel.
 *
 * PanelState values are persisted in localStorage under the key
 * "multi2_panel_state". Valid values are "collapsed", "compact", "full".
 * On mount we read the stored value (defaulting to "compact").
 */
export const BottomControlsPanel: React.FC = () => {
    const { useToolState } = useToolControl();
    const [colsDesktop, setColsDesktop] = useToolState<number>({ target: { surfaceId: 'multi21.designer', toolId: 'colsDesktop' }, defaultValue: 6 });
    const [colsMobile, setColsMobile] = useToolState<number>({ target: { surfaceId: 'multi21.designer', toolId: 'colsMobile' }, defaultValue: 2 });
    const [tileGap, setTileGap] = useToolState<number>({ target: { surfaceId: 'multi21.designer', toolId: 'tileGap' }, defaultValue: 16 });
    const [tileRadius, setTileRadius] = useToolState<number>({ target: { surfaceId: 'multi21.designer', toolId: 'tileRadius' }, defaultValue: 8 });
    const [itemCount, setItemCount] = useToolState<number>({ target: { surfaceId: 'multi21.designer', toolId: 'itemCount' }, defaultValue: 12 });
    const [panelState, setPanelState] = useState<PanelState>('compact');
    const [lastNonCollapsed, setLastNonCollapsed] = useState<PanelState>('compact');
    const [activeSlider, setActiveSlider] = useState<SliderTarget>('colsDesktop');

    // Load persisted state on mount
    useEffect(() => {
        const stored = localStorage.getItem('multi2_panel_state') as PanelState | null;
        if (stored && ['collapsed', 'compact', 'full'].includes(stored)) {
            setPanelState(stored);
            if (stored !== 'collapsed') setLastNonCollapsed(stored);
        } else {
            setPanelState('compact');
            setLastNonCollapsed('compact');
        }
    }, []);

    // Persist state on change
    useEffect(() => {
        localStorage.setItem('multi2_panel_state', panelState);
        if (panelState !== 'collapsed') setLastNonCollapsed(panelState);
    }, [panelState]);

    const expand = () => setPanelState(lastNonCollapsed);
    const collapse = () => setPanelState('collapsed');
    const goCompact = () => setPanelState('compact');
    const goFull = () => setPanelState('full');

    const sliderConfig: Record<SliderTarget, { min: number; max: number; step: number; value: number; setter: (v: number) => void; label: string; icon: React.ReactNode }> = {
        colsDesktop: {
            min: 1,
            max: 12,
            step: 1,
            value: colsDesktop,
            setter: setColsDesktop,
            label: 'Desktop Columns',
            icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="12" rx="2" ry="2" /><line x1="12" y1="16" x2="12" y2="20" /><line x1="8" y1="20" x2="16" y2="20" /></svg>,
        },
        colsMobile: {
            min: 1,
            max: 6,
            step: 1,
            value: colsMobile,
            setter: setColsMobile,
            label: 'Mobile Columns',
            icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="7" y="2" width="10" height="20" rx="2" ry="2" /></svg>,
        },
        tileGap: {
            min: 0,
            max: 24,
            step: 1,
            value: tileGap,
            setter: setTileGap,
            label: 'Gap',
            icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="20" y2="12" /><polyline points="15 8 20 12 15 16" /></svg>,
        },
        tileRadius: {
            min: 0,
            max: 32,
            step: 1,
            value: tileRadius,
            setter: setTileRadius,
            label: 'Radius',
            icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="8" ry="8" /></svg>,
        },
        itemCount: {
            min: 1,
            max: 48,
            step: 1,
            value: itemCount,
            setter: setItemCount,
            label: 'Items',
            icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>,
        },
    };

    const activeConfig = sliderConfig[activeSlider];

    const renderSliderControls = () => (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <span className="font-semibold text-xs uppercase tracking-wider text-neutral-500">Adjust</span>
                <span className="text-xs text-neutral-700 dark:text-neutral-300">{activeConfig.label}: {activeConfig.value}</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto">
                {(Object.keys(sliderConfig) as SliderTarget[]).map(key => {
                    const isActive = activeSlider === key;
                    return (
                        <button
                            key={key}
                            onClick={() => setActiveSlider(key)}
                            className={`flex items-center justify-center w-10 h-10 rounded-md border ${isActive ? 'bg-white dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 shadow-sm' : 'border-transparent bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
                            aria-label={sliderConfig[key].label}
                        >
                            {sliderConfig[key].icon}
                        </button>
                    );
                })}
            </div>
            <UniversalSlider
                value={activeConfig.value}
                min={activeConfig.min}
                max={activeConfig.max}
                step={activeConfig.step}
                onChange={activeConfig.setter}
            />
        </div>
    );

    // Render based on panelState
    const renderContent = () => {
        if (panelState === 'collapsed') {
            return (
                <div className="flex items-center justify-between px-4 py-1 cursor-pointer" onClick={expand}>
                    <span className="text-sm font-medium">MULTI² controls</span>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                </div>
            );
        }
        // Determine height class based on state
        const heightClass = panelState === 'compact' ? 'h-44' : 'h-auto';
        return (
            <div className={`flex flex-col transition-all duration-300 ease-in-out ${heightClass}`}>
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-200 dark:border-neutral-800">
                    <h2 className="text-sm font-medium">MULTI² Designer</h2>
                    <div className="flex gap-2">
                        {panelState === 'compact' && (
                            <button onClick={goFull} className="text-xs text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100">Expand</button>
                        )}
                        {panelState === 'full' && (
                            <button onClick={goCompact} className="text-xs text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100">Compact</button>
                        )}
                        <button onClick={collapse} className="text-xs text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100">Collapse</button>
                    </div>
                </div>
                <div className="p-4 overflow-y-auto max-h-[50vh]">
                    {renderSliderControls()}
                </div>
            </div>
        );
    };

    return (
        <div
            className={`fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 z-50 shadow-lg transition-transform duration-300 ease-in-out`}
        >
            {renderContent()}
        </div>
    );
};
