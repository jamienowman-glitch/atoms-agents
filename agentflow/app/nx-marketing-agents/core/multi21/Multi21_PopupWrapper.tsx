"use client";

import React, { useState, useEffect } from 'react';
import { useToolControl } from '../../../../context/ToolControlContext';

interface Multi21_PopupWrapperProps {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
}

export function Multi21_PopupWrapper({ children, isOpen, onClose }: Multi21_PopupWrapperProps) {
    const { useToolState } = useToolControl();
    const scope = { surfaceId: 'multi21.designer', entityId: 'page_popup' };

    const [trigger] = useToolState<string>({ target: { ...scope, toolId: 'popup.trigger' }, defaultValue: 'exit' });
    const [position] = useToolState<string>({ target: { ...scope, toolId: 'popup.position' }, defaultValue: 'center' });
    const [overlayOpacity] = useToolState<number>({ target: { ...scope, toolId: 'popup.overlay_opacity' }, defaultValue: 50 });

    // Teaser State
    const [teaserText] = useToolState<string>({ target: { ...scope, toolId: 'popup.teaser_text' }, defaultValue: 'Start Here' });
    const [teaserPos] = useToolState<string>({ target: { ...scope, toolId: 'popup.teaser_position' }, defaultValue: 'bottom_right' });

    const [isExpanded, setIsExpanded] = useState(true);

    // Sync expansion state with trigger mode changes
    useEffect(() => {
        if (trigger === 'manual_teaser') {
            setIsExpanded(false);
        } else {
            setIsExpanded(true);
        }
    }, [trigger]);

    if (!isOpen) return null;

    // --- TEASER VIEW ---
    if (trigger === 'manual_teaser' && !isExpanded) {
        const teaserPositionClasses = {
            'bottom_right': 'bottom-6 right-6',
            'bottom_left': 'bottom-6 left-6'
        }[teaserPos] || 'bottom-6 right-6';

        return (
            <div className="fixed inset-0 z-[100] pointer-events-none">
                <button
                    onClick={() => setIsExpanded(true)}
                    className={`absolute ${teaserPositionClasses} pointer-events-auto bg-black dark:bg-white text-white dark:text-black font-medium px-6 py-3 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 flex items-center gap-2`}
                >
                    <span>{teaserText}</span>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>
            </div>
        );
    }

    // --- MODAL VIEW ---

    // Positioning Logic
    const positionClasses = {
        'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
        'bottom_right': 'bottom-6 right-6',
        'slide_in_left': 'top-0 left-0 h-full w-[400px]',
    }[position] || 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';

    const animationClasses = {
        'center': 'animate-in fade-in zoom-in-95 duration-200',
        'bottom_right': 'animate-in slide-in-from-bottom-10 fade-in duration-300',
        'slide_in_left': 'animate-in slide-in-from-left duration-300',
    }[position] || '';

    const handleClose = () => {
        if (trigger === 'manual_teaser') {
            setIsExpanded(false);
        } else {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black transition-opacity duration-300 pointer-events-auto"
                style={{ opacity: overlayOpacity / 100 }}
                onClick={handleClose}
            />

            {/* Modal Container */}
            <div
                className={`absolute ${positionClasses} ${animationClasses} bg-white dark:bg-neutral-900 shadow-2xl border border-neutral-200 dark:border-neutral-800 pointer-events-auto overflow-hidden
                    ${position === 'slide_in_left' ? '' : 'rounded-2xl min-w-[320px] max-w-[90vw]'}
                    ${position === 'center' ? 'max-h-[85vh] overflow-y-auto' : ''}
                `}
            >
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-black dark:hover:text-white transition-colors z-50"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>

                {/* Content Canvas */}
                <div className="p-0 relative">
                    {children}
                </div>
            </div>
        </div>
    );
}
