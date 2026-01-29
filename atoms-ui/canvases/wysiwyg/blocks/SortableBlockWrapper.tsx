"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableBlockWrapperProps {
    id: string;
    isSelected: boolean;
    onDelete: () => void;
    children: React.ReactNode;
}

export function SortableBlockWrapper({ id, isSelected, onDelete, children }: SortableBlockWrapperProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : undefined,
        position: 'relative' as const,
    };

    return (
        <div ref={setNodeRef} style={style} className={`group relative transition-transform ${isDragging ? 'opacity-80 scale-[1.02] shadow-xl' : ''}`}>

            {/* HUD: Only visible on Desktop Hover or when Selected (Mobile Friendly) */}
            <div className={`absolute -top-3 left-0 right-0 z-[60] flex justify-between px-0 pointer-events-none opacity-0 group-hover:opacity-100 ${isSelected ? 'opacity-100' : ''} transition-opacity duration-200`}>

                {/* Drag Handle (Top Left) */}
                <div
                    ref={setActivatorNodeRef}
                    {...attributes}
                    {...listeners}
                    className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded shadow-sm p-1.5 cursor-grab active:cursor-grabbing pointer-events-auto touch-none"
                    title="Drag to Reorder"
                >
                    <svg className="w-4 h-4 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="12" r="1" />
                        <circle cx="9" cy="5" r="1" />
                        <circle cx="9" cy="19" r="1" />
                        <circle cx="15" cy="12" r="1" />
                        <circle cx="15" cy="5" r="1" />
                        <circle cx="15" cy="19" r="1" />
                    </svg>
                </div>

                {/* Delete Action (Top Right) */}
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent block selection
                        if (window.confirm("Are you sure you want to delete this block?")) {
                            onDelete();
                        }
                    }}
                    className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded shadow-sm p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer pointer-events-auto transition-colors"
                    title="Delete Block"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                </button>
            </div>

            {children}
        </div>
    );
}
