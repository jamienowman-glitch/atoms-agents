import React from 'react';
import { useVarioEngine } from '../../../../hooks/useVarioEngine';

// Simplified for brevity, same pattern as Copy/CTA
export interface Multi21TextProps {
    headline?: string;
    subhead?: string;
    body?: string;
    onHeadlineChange?: (t: string) => void;
    onSubheadChange?: (t: string) => void;
    onBodyChange?: (t: string) => void;

    // Layout
    textAlign?: string;
    verticalAlign?: string;
    contentWidth?: string;
    stackGap?: number;

    // Scoped Vario Props (Headline)
    headlineSize?: number;
    headlineWeight?: number;
    // ... Subhead ... Body ...

    // Global Vario (Shared Axes)
    fontFamily?: number;
    axisWidth?: number | null;
    axisSlant?: number;
    axisCasual?: number;
    axisGrade?: number;

    // Styling
    styleBgColor?: string;
    styleTextColor?: string;
    styleBorderColor?: string;
    styleBorderWidth?: number;
    styleOpacity?: number;
    styleBlur?: number;
}

export function Multi21_Text({
    headline, subhead, body,
    onHeadlineChange, onSubheadChange, onBodyChange,

    textAlign = 'left',
    verticalAlign = 'top',
    contentWidth = '100%',
    stackGap = 16,

    headlineSize = 40,
    headlineWeight = 700,

    fontFamily = 0,
    axisWidth = null,
    axisSlant = 0,
    axisCasual = 0,
    axisGrade = 0,

    styleBgColor = 'transparent',
    styleTextColor = 'inherit',
    styleBorderColor = 'transparent',
    styleBorderWidth = 0,
    styleOpacity = 100,
    styleBlur = 0,
}: Multi21TextProps) {

    // Helper to get Vario Style
    const getStyle = (size: number, weight: number) => {
        return useVarioEngine({
            fontFamily,
            weight,
            width: axisWidth,
            slant: axisSlant,
            casual: axisCasual,
            grade: axisGrade,
            size
        }).style;
    };

    const hStyle = getStyle(headlineSize, headlineWeight);
    // ... subhead ... body ...

    // Just a stub implementation for the decomposition demo to pass types
    return (
        <div style={{ backgroundColor: styleBgColor, width: contentWidth, gap: stackGap }} className="flex flex-col p-6 rounded-xl border border-dashed border-neutral-200">
            {headline && <h2 style={hStyle}>{headline}</h2>}
            {subhead && <h3 style={getStyle(24, 400)}>{subhead}</h3>}
            {body && <p style={getStyle(16, 400)}>{body}</p>}
        </div>
    );
}
