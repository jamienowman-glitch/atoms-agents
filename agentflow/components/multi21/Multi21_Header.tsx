"use client";

import React, { useMemo } from 'react';
import { useToolControl } from '../../context/ToolControlContext';
import { SEED_MENUS } from '../../lib/data/seed-menus';

// Header Implementation focused on SEO & Trust
interface Multi21_HeaderProps {
    // Style Props (passed from parent or context)
    styleBgColor?: string;
    styleTextColor?: string;
    styleAccentColor?: string;
    styleBorderColor?: string;
    styleBorderWidth?: number;
    styleOpacity?: number;
    styleBlur?: number;
    fontFamily?: number;
    isMobileView: boolean;
}

export const Multi21_Header: React.FC<Multi21_HeaderProps> = ({
    styleBgColor,
    styleTextColor,
    styleAccentColor,
    styleBorderColor,
    styleBorderWidth,
    styleOpacity,
    styleBlur,
    fontFamily,
    isMobileView,
}) => {
    // We bind to the tool state here, scoped to the entity usually, but Header might be singular?
    // User requested "Condition: activeBlockType === 'header'", so it's a block.
    // We need to know the 'id' to scope tools properly, but for now we'll assume the parent ConnectedBlock sets the scope provider if we used it,
    // OR we just use the props pattern.
    // Wait, ConnectedBlock passes props for Texts but manages state inside itself.
    // Let's assume ConnectedBlock will NOT pass these specific header props, so we must useToolControl here with the Context Scope inferred?
    // No, ConnectedBlock explicitly scopes tools by ID.
    // So we should probably let ConnectedBlock handle the state and pass it down, OR use the context directly if we knew the ID.
    // BUT ConnectedBlock renders this component. 
    // Best pattern: Move state logic to ConnectedBlock (traffic controller) OR pass the ID prop here.
    // Let's pass the ID prop to be safe and consistent with Multi21 patterns.

    // Actually, looking at Multi21_Text, it receives props.
    // I'll update ConnectedBlock to read the header tokens and pass them.
    // For now, I'll define the props interface assuming they come in.
    return null;
};

// Re-defining with Props pattern
export const Multi21_Header_Impl: React.FC<Multi21_HeaderProps & {
    layout: 'logo_left' | 'logo_center' | 'logo_split';
    trustSignal: 'none' | 'secure_icon' | 'rating_star' | 'verified_badge';
    contactPriority: 'hidden' | 'standard' | 'highlight';
    ctaMode: 'conversion' | 'expertise';
    navStructure: 'flat' | 'nested';
    menuSource: string;
    sticky: boolean;
}> = ({
    layout,
    trustSignal,
    contactPriority,
    ctaMode,
    navStructure,
    menuSource,
    sticky,
    styleBgColor,
    styleTextColor,
    styleAccentColor,
    styleBorderColor,
    styleBorderWidth,
    styleOpacity,
    styleBlur,
    isMobileView
}) => {

        const menuItems = SEED_MENUS[menuSource as keyof typeof SEED_MENUS] || SEED_MENUS['main_site'];

        // --- Components ---
        const Logo = () => (
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-black">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                </div>
                <span>Brand</span>
            </div>
        );

        const TrustWidget = () => {
            if (trustSignal === 'none') return null;
            return (
                <div className="flex items-center gap-1.5 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-full text-neutral-600 dark:text-neutral-300">
                    {trustSignal === 'secure_icon' && (
                        <><svg className="w-3 h-3 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg> Secure</>
                    )}
                    {trustSignal === 'rating_star' && (
                        <><span className="text-orange-400">★★★★★</span> 4.9</>
                    )}
                    {trustSignal === 'verified_badge' && (
                        <><svg className="w-3 h-3 text-blue-500 fill-current" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg> Verified</>
                    )}
                </div>
            );
        };

        const NavItems = () => (
            <nav className={`flex ${isMobileView ? 'hidden' : 'gap-6'} items-center`}>
                {menuItems.filter((item: any) => !item.highlight).map((item: any, i: number) => (
                    <a key={i} href={item.url} className="text-sm font-medium hover:text-blue-500 transition-colors opacity-80 hover:opacity-100">
                        {item.label}
                    </a>
                ))}
            </nav>
        );

        const Actions = () => (
            <div className="flex items-center gap-3">
                {contactPriority !== 'hidden' && (
                    <button className={`text-sm font-medium px-4 py-2 rounded-lg transition-all ${contactPriority === 'highlight'
                        ? 'bg-black text-white dark:bg-white dark:text-black hover:opacity-90'
                        : 'bg-transparent border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                        }`}>
                        {ctaMode === 'conversion' ? 'Buy Now' : 'Book Call'}
                    </button>
                )}
            </div>
        );


        // --- Layout Logic ---
        const containerClasses = `
        w-full p-4 flex items-center justify-between
        ${sticky ? 'sticky top-0 z-50' : 'relative'}
        transition-all duration-300
    `;

        const style = {
            backgroundColor: styleBgColor !== 'transparent' ? styleBgColor : undefined,
            color: styleTextColor !== 'inherit' ? styleTextColor : undefined,
            borderColor: styleBorderColor,
            borderBottomWidth: styleBorderWidth ? `${styleBorderWidth}px` : undefined,
            backdropFilter: styleBlur ? `blur(${styleBlur}px)` : undefined,
            opacity: styleOpacity ? styleOpacity / 100 : 1,
        };

        // Background handling if transparent but blured
        const bgClass = styleBgColor === 'transparent' && styleBlur ? 'bg-white/80 dark:bg-black/80' : '';


        if (layout === 'logo_center') {
            return (
                <header className={`${containerClasses} ${bgClass}`} style={style} aria-label="Main Navigation">
                    <NavItems />
                    <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                        <Logo />
                        <TrustWidget />
                    </div>
                    <Actions />
                </header>
            );
        }

        // Default & Split
        return (
            <header className={`${containerClasses} ${bgClass}`} style={style} aria-label="Main Navigation">
                <div className="flex items-center gap-4">
                    <Logo />
                    <TrustWidget />
                </div>

                {layout !== 'logo_split' && <NavItems />}

                <div className="flex items-center gap-4">
                    {layout === 'logo_split' && <NavItems />}
                    <Actions />
                </div>
            </header>
        );
    }
