"use client";

import React, { useEffect } from 'react';
import { disableDragAndDrop, enableDoubleTapEdit } from '../../../canvas/wysiwyg/utils/interactionUtils';

export interface HeaderAtomProps {
    id: string;
    heading?: string;
    subheading?: string;
    axisWeight?: number;
    axisSlant?: number;
    axisWidth?: number; // New
    positionX?: number;
    positionY?: number;
    styleBlockBg?: string; // New
    styleText?: string;    // New
    onUpdate?: (id: string, updates: any) => void;
}

export function HeaderAtom({
    id,
    heading = "Welcome to Your Canvas",
    subheading = "Start building by adding atoms with the + button",
    axisWeight = 600,
    axisSlant = 0,
    axisWidth = 100, // Default Normal
    positionX = 0,
    positionY = 0,
    styleBlockBg = 'transparent',
    styleText = 'inherit',
    onUpdate
}: HeaderAtomProps) {

    // Disable drag on mount
    useEffect(() => {
        const element = document.getElementById(id);
        if (element) {
            disableDragAndDrop(element);
        }
    }, [id]);

    // Enable double-tap edit
    useEffect(() => {
        // Heading
        enableDoubleTapEdit(`${id}-heading`, (text: string) => {
            if (onUpdate) onUpdate(id, { 'content.heading': text });
        });

        // Subheading
        enableDoubleTapEdit(`${id}-subheading`, (text: string) => {
            if (onUpdate) onUpdate(id, { 'content.subheading': text });
        });
    }, [id, onUpdate]);

    return (
        <header
            id={id}
            style={{
                position: 'absolute',
                left: `${positionX}px`,
                top: `${positionY}px`,
                fontVariationSettings: `"wght" ${axisWeight}, "slnt" ${axisSlant}, "wdth" ${axisWidth}`,
                width: '100%',
                maxWidth: '600px',
                padding: '24px',
                zIndex: 10,
                backgroundColor: styleBlockBg, // Applied
                color: styleText // Applied
            }}
            className="pointer-events-auto transition-colors duration-200 rounded-xl"
        >
            <h1
                id={`${id}-heading`}
                className="text-4xl font-bold mb-4 outline-none"
            >
                {heading}
            </h1>
            <p
                id={`${id}-subheading`}
                className="text-lg opacity-80 outline-none" // Use opacity for text color inheritance
            >
                {subheading}
            </p>
        </header>
    );
}
