"use client";

import React, { useEffect } from 'react';
import { disableDragAndDrop, enableDoubleTapEdit } from '../../../canvas/wysiwyg/utils/interactionUtils';

export interface HeaderAtomProps {
    id: string;
    heading?: string;
    subheading?: string;
    axisWeight?: number;
    axisSlant?: number;
    positionX?: number;
    positionY?: number;
    onUpdate?: (id: string, updates: any) => void;
}

export function HeaderAtom({
    id,
    heading = "Welcome to Your Canvas",
    subheading = "Start building by adding atoms with the + button",
    axisWeight = 600,
    axisSlant = 0,
    positionX = 0,
    positionY = 0,
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
                fontVariationSettings: `"wght" ${axisWeight}, "slnt" ${axisSlant}`,
                width: '100%',
                maxWidth: '600px',
                padding: '24px',
                zIndex: 10
            }}
            className="pointer-events-auto"
        >
            <h1
                id={`${id}-heading`}
                className="text-4xl font-bold mb-4 outline-none"
            >
                {heading}
            </h1>
            <p
                id={`${id}-subheading`}
                className="text-lg text-neutral-600 outline-none"
            >
                {subheading}
            </p>
        </header>
    );
}
