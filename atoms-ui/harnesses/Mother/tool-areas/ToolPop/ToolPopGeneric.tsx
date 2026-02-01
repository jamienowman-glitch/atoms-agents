"use client";

import React, { useState, useEffect, useRef } from 'react';
import { DualMagnifier, MagnetItem } from '@harnesses/Mother/tool-areas/ToolPop/DualMagnifier';
import { AtomContract, ControlDefinition } from '@ui-types/AtomContract';
import { ColorRibbon } from '@tool-areas/ui/ColorRibbon';

// --- Simplified Slider Component (Copied from ToolPop.tsx to preserve Sacred Visuals) ---
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
        // Prevent default touch actions (scrolling/selection)
        if ('touches' in e && e.cancelable) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (!trackRef.current) return;
        const rect = trackRef.current.getBoundingClientRect();

        // Use pageX/clientX carefully. ClientX is consistent with getBoundingClientRect
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;

        let percentage = (clientX - rect.left) / rect.width;
        percentage = Math.max(0, Math.min(1, percentage));

        const rawValue = min + percentage * (max - min);
        // Snap to step
        let stepped = Math.round(rawValue / step) * step;

        // Clamp result due to JS floating point
        stepped = Math.max(min, Math.min(max, stepped));

        onChange(stepped);
    };

    return (
        <div
            ref={trackRef}
            onClick={handleInteract}
            onTouchMove={handleInteract}
            onTouchStart={handleInteract}
            className="relative w-full h-8 flex items-center group cursor-pointer touch-none select-none"
        >
            {/* Track bg */}
            <div className="absolute w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full overflows-hidden">
                {/* Progress Fill (Optional polish) */}
                <div
                    className="h-full bg-neutral-400 dark:bg-neutral-600 rounded-full"
                    style={{ width: `${((value - min) / (max - min)) * 100}%` }}
                />
            </div>

            {/* Thumb */}
            <div
                className="absolute w-4 h-4 bg-black dark:bg-white rounded-full shadow-sm transform -translate-x-1/2 pointer-events-none transition-transform duration-75"
                style={{ left: `${((value - min) / (max - min)) * 100}%` }}
            />
        </div>
    );
};

// --- Generic ToolPop Component ---
interface ToolPopGenericProps {
    activeAtomContract: AtomContract;
    toolState: Record<string, any>;
    onToolUpdate: (key: string, value: any) => void;
    onClose: () => void;
    isMobileView?: boolean;
}

export function ToolPopGeneric({
    activeAtomContract,
    toolState,
    onToolUpdate,
    onClose,
    isMobileView = false
}: ToolPopGenericProps) {
    // 1. Navigation State
    const [activeTraitId, setActiveTraitId] = useState<string>('');
    const [activeGroupId, setActiveGroupId] = useState<string>('');
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Initialize defaults when contract changes
    useEffect(() => {
        if (activeAtomContract?.traits?.length > 0) {
            const firstTrait = activeAtomContract.traits[0];
            setActiveTraitId(firstTrait.id);
            if (firstTrait.subGroups?.length > 0) {
                setActiveGroupId(firstTrait.subGroups[0].id);
            }
        }
    }, [activeAtomContract]);

    // Handle Trait Switch
    const handleTraitSelect = (id: string) => {
        setActiveTraitId(id);
        const trait = activeAtomContract.traits.find(t => t.id === id);
        if (trait && trait.subGroups.length > 0) {
            setActiveGroupId(trait.subGroups[0].id);
        } else {
            setActiveGroupId('');
        }
    };

    // Derived: Mode Options (Left Magnifier) -> Trait Mapping
    const modeOptions: MagnetItem[] = activeAtomContract?.traits?.map(t => {
        let icon = <div className="w-2 h-2 rounded-full bg-current" />;

        // Icon Mapping (Layout, Typography, Appearance, Motion)
        if (t.id === 'layout') icon = <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>;
        if (t.id === 'typography') icon = <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="16" y2="12" /><line x1="4" y1="18" x2="18" y2="18" /></svg>;
        if (t.id === 'appearance') icon = <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></svg>;
        // Motion Icon (Running Man / Film Strip)
        if (t.id === 'motion') icon = <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>;

        return {
            id: t.id || 'unknown',
            label: t.id ? (t.id.charAt(0).toUpperCase() + t.id.slice(1)) : 'Unknown',
            icon
        };
    }) || [];

    // Derived: Tool Options (Right Magnifier) -> SubGroups of active Trait
    const activeTrait = activeAtomContract?.traits?.find(t => t.id === activeTraitId);
    const toolOptions: MagnetItem[] = activeTrait?.subGroups.map(g => ({
        id: g.id || 'unknown',
        label: g.id ? (g.id.charAt(0).toUpperCase() + g.id.slice(1)) : 'Unknown',
        icon: <div className="w-1.5 h-1.5 rounded-full border border-current" />
    })) || [];

    // Helper: Button Group (for Select/Toggle)
    const renderBtnGroup = (options: { label: string, value: string }[], current: any, onChange: (v: any) => void) => (
        <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1 gap-1">
            {options.map((opt) => (
                <button
                    key={opt.value}
                    type="button"
                    onPointerDown={(e) => {
                        e.preventDefault();
                        onChange(opt.value);
                    }}
                    className={`
                        flex-1 py-1.5 px-2 text-xs font-medium rounded-md transition-all
                        flex items-center justify-center gap-1.5
                        ${current === opt.value
                            ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                            : 'bg-transparent text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                        }
                    `}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );

    // Render Logic for Controls
    const renderControls = () => {
        if (!activeTrait) return <div className="p-4 text-center text-xs text-neutral-400">No Traits Found</div>;
        const activeGroup = activeTrait.subGroups.find(g => g.id === activeGroupId);
        if (!activeGroup) return <div className="p-4 text-center text-xs text-neutral-400">Select a tool group</div>;

        return (
            <div className="flex flex-col gap-4 animate-fadeIn pt-2">
                {activeGroup.controls.map((control) => {
                    const currentValue = toolState[control.targetVar] ?? 0; // Default 0 if missing

                    return (
                        <div key={control.id} className="flex flex-col gap-1">
                            {/* Label Row */}
                            {control.type !== 'toggle' && control.type !== 'select' && (
                                <div className="flex justify-between items-center text-[10px] text-neutral-500 font-medium">
                                    <span>{control.label}</span>
                                    {control.axisLabels ? (
                                        <span className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded text-[9px]">
                                            {typeof currentValue === 'number' && control.min !== undefined && control.max !== undefined
                                                ? currentValue > (control.min + control.max) / 2
                                                    ? control.axisLabels.increase
                                                    : control.axisLabels.decrease
                                                : currentValue}
                                        </span>
                                    ) : (
                                        <span className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                                            {typeof currentValue === 'number' ? currentValue.toFixed(control.step && control.step < 1 ? 2 : 0) : currentValue}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Control Input */}
                            {control.type === 'slider' && (
                                <UniversalSlider
                                    value={Number(currentValue)}
                                    min={control.min || 0}
                                    max={control.max || 100}
                                    step={control.step || 1}
                                    onChange={(v) => onToolUpdate(control.targetVar, v)}
                                />
                            )}

                            {control.type === 'toggle' && (
                                <div className="flex justify-between items-center bg-neutral-100 dark:bg-neutral-800 p-2 rounded-lg">
                                    <span className="text-xs font-medium">{control.label}</span>
                                    <button
                                        onClick={() => onToolUpdate(control.targetVar, !currentValue)}
                                        className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${currentValue ? 'bg-black dark:bg-white' : 'bg-neutral-300 dark:bg-neutral-600'}`}
                                    >
                                        <div className={`w-4 h-4 rounded-full bg-white dark:bg-black transform transition-transform ${currentValue ? 'translate-x-4' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                            )}

                            {control.type === 'select' && (
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] text-neutral-500 font-medium">{control.label}</span>
                                    {/* Mock options for now since Contract doesn't specify options yet. 
                                         In real implementation, Contract should have 'options' array. 
                                         Using placeholder. */}
                                    <div className="text-xs text-red-500">Select Options Missing</div>
                                </div>
                            )}

                            {control.type === 'joystick' && (
                                <div className="h-24 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
                                    <span className="text-[10px] uppercase font-bold text-neutral-400">Joystick</span>
                                </div>
                            )}

                            {control.type === 'trigger' && (
                                <div key={control.id} className="flex flex-col gap-1">
                                    {/* Trigger: Simple Action Button */}
                                    <button
                                        className="w-full flex items-center justify-center gap-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 active:scale-95 transition-all text-xs font-semibold py-3 rounded-xl border border-neutral-200 dark:border-neutral-700"
                                        onClick={() => onToolUpdate(control.targetVar, true)} // Simple trigger signal
                                    >
                                        {/* Icon placehoder if needed */}
                                        {control.label}
                                    </button>
                                </div>
                            )}

                            {control.type === 'color_ribbon' && (
                                <div key={control.id} className="flex flex-col gap-1">
                                    <span className="text-[10px] text-neutral-500 font-medium">{control.label}</span>
                                    <ColorRibbon
                                        value={String(currentValue)}
                                        onChange={(color) => onToolUpdate(control.targetVar, color)}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    // Styling from ToolPop.tsx
    const placementClass = 'fixed left-0 right-0 bottom-0';
    const borderClass = 'border-t';
    const visibilityClass = 'translate-y-0 opacity-100 pointer-events-auto'; // Assume always visible when mounted via Harness

    return (
        <div className={`${placementClass} bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl ${borderClass} border-neutral-200 dark:border-neutral-800 rounded-2xl z-[100] shadow-[0_-5px_20px_rgba(0,0,0,0.08)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${visibilityClass}`}>
            <div className={`flex flex-col transition-all duration-300 ${isCollapsed ? 'h-[60px]' : 'h-auto max-h-[280px]'}`}>
                {/* HEAD: Dual Magnifier */}
                <div className="flex items-center justify-center p-2 border-b border-neutral-100 dark:border-neutral-800 relative bg-neutral-50/50 dark:bg-neutral-900/50 shrink-0 h-[72px] rounded-t-2xl z-20">

                    {/* Dual Magnifier */}
                    <DualMagnifier
                        activeMode={activeTraitId}
                        onModeSelect={handleTraitSelect}
                        activeTool={activeGroupId}
                        onToolSelect={(id) => setActiveGroupId(id)}
                        modeOptions={modeOptions}
                        toolOptions={toolOptions}
                    />

                    {/* Collapse & Close Controls (Right) */}
                    <div className="absolute right-4 flex items-center gap-2">
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-full text-neutral-400 hover:text-red-500 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>

                {/* BODY: Controls */}
                <div className={`flex-1 overflow-y-auto px-4 pt-4 pb-4 transition-opacity duration-200 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <div className="max-w-md mx-auto">
                        {renderControls()}
                    </div>
                </div>
            </div>
        </div>
    );
}
