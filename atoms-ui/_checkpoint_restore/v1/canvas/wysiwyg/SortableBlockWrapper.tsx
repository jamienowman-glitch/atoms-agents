import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableBlockWrapperProps {
    id: string;
    isSelected?: boolean;
    onDelete?: () => void;
    children: React.ReactNode;
}

export function SortableBlockWrapper({ id, isSelected, onDelete, children }: SortableBlockWrapperProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        position: 'relative' as const,
        zIndex: isDragging ? 50 : (isSelected ? 40 : 1),
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} className="group/sortable relative">
            {/* Drag Handle (Left) */}
            <div
                {...listeners}
                className={`absolute -left-8 top-1/2 -translate-y-1/2 w-6 h-12 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded opacity-0 group-hover/sortable:opacity-100 transition-opacity ${isSelected ? 'opacity-100' : ''}`}
            >
                <svg className="w-4 h-4 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <circle cx="9" cy="9" r="1" />
                    <circle cx="9" cy="15" r="1" />
                    <circle cx="15" cy="9" r="1" />
                    <circle cx="15" cy="15" r="1" />
                </svg>
            </div>

            {/* Delete Handle (Right) - Only show if selected or hovering */}
            {onDelete && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className={`absolute -right-8 top-1/2 -translate-y-1/2 w-6 h-8 flex items-center justify-center cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 text-neutral-400 hover:text-red-500 rounded opacity-0 group-hover/sortable:opacity-100 transition-opacity ${isSelected ? 'opacity-100' : ''}`}
                    title="Delete Block"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M18 6L6 18" />
                        <path d="M6 6l12 12" />
                    </svg>
                </button>
            )}

            {children}
        </div>
    );
}
