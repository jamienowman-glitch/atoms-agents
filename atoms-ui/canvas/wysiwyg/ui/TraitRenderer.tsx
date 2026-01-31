"use client";

import React, { useMemo } from 'react';
import { UniversalSlider } from './UniversalSlider';
import { ColorRibbon } from '../ui/ColorRibbon';
import { AtomTrait, AtomTraitProperty } from '@atoms/multi-tile/MultiTile.config';

// Re-using the types from ToolPop but making them generic
interface TraitRendererProps {
    traits: AtomTrait[];
    toolState: Record<string, any>;
    onUpdate: (key: string, value: any) => void;
    activeCategory: string; // 'layout', 'typography', 'style'
    activeSubGroup?: string; // NEW: 'density', 'spacing', 'geometry'
    isMobileView: boolean;
}

export const TraitRenderer: React.FC<TraitRendererProps> = ({
    traits,
    toolState,
    onUpdate,
    activeCategory,
    activeSubGroup, // NEW: Filter by Right Magnifier
    isMobileView
}) => {

    const activeTrait = useMemo(() =>
        traits.find(t => t.type === activeCategory),
        [traits, activeCategory]);

    if (!activeTrait) {
        return <div className="p-4 text-xs text-neutral-400">No controls for {activeCategory}</div>;
    }

    // Filter by SubGroup if provided
    const visibleProperties = useMemo(() => {
        if (!activeSubGroup) return activeTrait.properties;
        return activeTrait.properties.filter(p => p.subGroup === activeSubGroup);
    }, [activeTrait, activeSubGroup]);

    return (
        <div className="flex flex-col gap-3 animate-fadeIn">
            {visibleProperties.map((prop: AtomTraitProperty) => {

                // 1. Resolve Property Key (Desktop/Mobile split)
                let valueKey = prop.targetProp || prop.id;
                let effectiveLabel = prop.label;

                if (prop.responsive) {
                    const suffix = isMobileView ? '_mobile' : '_desktop';
                    // Example: grid.cols -> grid.cols_desktop
                    // If targetProp is 'grid.cols', append. 
                    valueKey = `${valueKey}${suffix}`;
                    effectiveLabel = `${prop.label} (${isMobileView ? 'Mob' : 'Desk'})`;
                }

                const currentValue = toolState[valueKey];

                // 2. Render Control based on Type

                // SLIDER
                if (prop.type === 'slider') {
                    return (
                        <div key={prop.id} className="flex flex-col gap-0.5">
                            <div className="flex justify-between items-center text-[10px] text-neutral-500 font-medium">
                                <span>{effectiveLabel}</span>
                                <span className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                                    {typeof currentValue === 'number' ? currentValue.toFixed(0) : currentValue}
                                </span>
                            </div>
                            <UniversalSlider
                                value={Number(currentValue) || prop.min || 0}
                                min={prop.min || 0}
                                max={prop.max || 100}
                                step={prop.step || 1}
                                onChange={(v) => onUpdate(valueKey, v)}
                            />
                        </div>
                    );
                }

                // COLOR
                if (prop.type === 'color') {
                    return (
                        <div key={prop.id} className="flex flex-col gap-2">
                            <div className="text-[10px] text-neutral-500 font-medium">{effectiveLabel}</div>
                            <ColorRibbon
                                value={currentValue}
                                onChange={(c) => onUpdate(valueKey, c)}
                            />
                        </div>
                    );
                }

                // SELECT / TOGGLE (Future)
                if (prop.type === 'select') {
                    return (
                        <div key={prop.id} className="flex flex-col gap-1">
                            <div className="text-[10px] text-neutral-500 font-medium">{effectiveLabel}</div>
                            <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1 gap-1">
                                {prop.options?.map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => onUpdate(valueKey, opt)}
                                        className={`flex-1 py-1 px-2 text-[10px] rounded transition-all ${currentValue === opt ? 'bg-white shadow text-black' : 'text-neutral-500 hover:text-black'}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                }

                return null;
            })}
        </div>
    );
};
