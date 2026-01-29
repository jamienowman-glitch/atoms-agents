"use client";

import React from 'react';

interface ToolPillProps {
    children?: React.ReactNode;
}

export function ToolPill({ children }: ToolPillProps) {
    return (
        <div className="fixed right-4 bottom-32 z-50 flex flex-col items-center gap-2">
            {children}
        </div>
    );
}
