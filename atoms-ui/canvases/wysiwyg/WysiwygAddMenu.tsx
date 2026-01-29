"use client";

import React from 'react';

interface WysiwygAddMenuProps {
    onAdd: (type: 'media' | 'text' | 'copy' | 'cta' | 'row' | 'header', columns?: number) => void;
}

export function WysiwygAddMenu({ onAdd }: WysiwygAddMenuProps) {
    return (
        <div className="flex flex-col gap-2">
            {/* Main Tools */}
            <AddButton onClick={() => onAdd('text')} label="T" color="orange" title="Add Text" />
            <AddButton onClick={() => onAdd('copy')} label="C" color="amber" title="Add Copy" />
            <AddButton onClick={() => onAdd('media')} icon={<MediaIcon />} color="blue" title="Add Media" />
            <AddButton onClick={() => onAdd('cta')} icon={<ButtonIcon />} color="purple" title="Add CTA" />

            {/* Divider */}
            <div className="h-px w-8 bg-neutral-200 dark:bg-neutral-800 my-1" />

            {/* Layout Tools */}
            <AddButton onClick={() => onAdd('row', 1)} label="[I]" color="neutral" title="1 Column" fontSize="xs" />
            <AddButton onClick={() => onAdd('row', 2)} label="[II]" color="neutral" title="2 Columns" fontSize="xs" />
            <AddButton onClick={() => onAdd('row', 3)} label="[III]" color="neutral" title="3 Columns" fontSize="xs" />
        </div>
    );
}

function AddButton({ onClick, label, icon, color, title, fontSize = "lg" }: any) {
    const colorClasses: Record<string, string> = {
        orange: "bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
        amber: "bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
        blue: "bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
        purple: "bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
        neutral: "bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
    };

    return (
        <button
            onClick={onClick}
            title={title}
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-transform active:scale-95 ${colorClasses[color] || colorClasses.neutral}`}
        >
            {icon ? icon : <span className={`font-serif font-bold ${fontSize === 'xs' ? 'text-xs font-mono' : 'text-lg'}`}>{label}</span>}
        </button>
    );
}

const MediaIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
    </svg>
);

const ButtonIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <rect x="4" y="8" width="16" height="8" rx="2" />
        <path d="M10 8V8" />
    </svg>
);
