import React from 'react';

/**
 * RegistryCard
 * Visual: White background, Black border (1px), Flat design (no shadow).
 * Font: Roboto Flex (via font-sans).
 */

interface RegistryCardProps {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    status?: string;
    onEdit?: () => void;
    onDelete?: () => void;
}

export const RegistryCard: React.FC<RegistryCardProps> = ({
    title,
    subtitle,
    icon,
    status,
    onEdit,
    onDelete
}) => {
    return (
        <div className="bg-white border border-black p-4 flex flex-col justify-between font-sans min-h-[160px] relative group transition-all duration-200 hover:border-2">

            {/* Top Row: Icon + Status */}
            <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 border border-black flex items-center justify-center text-black">
                    {icon || (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    )}
                </div>
                {status && (
                    <span className="text-xs font-bold uppercase tracking-wider text-black border border-black px-2 py-1">
                        {status}
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="flex-grow">
                <h3 className="text-xl font-bold text-black leading-tight mb-1">{title}</h3>
                <p className="text-sm text-neutral-600 line-clamp-2">{subtitle}</p>
            </div>

            {/* Actions (Visible on hover or always?) User didn't specify, keeping simple */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                {onEdit && (
                    <button
                        onClick={onEdit}
                        className="p-1 hover:bg-black hover:text-white border border-transparent hover:border-black transition-colors"
                        title="Edit"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={onDelete}
                        className="p-1 hover:bg-black hover:text-white border border-transparent hover:border-black transition-colors text-red-600 hover:text-white"
                        title="Delete"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};
