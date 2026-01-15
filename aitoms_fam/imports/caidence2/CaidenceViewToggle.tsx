"use client";

import React from "react";

export type CaidenceView = "lanes" | "calendar" | "files";

interface CaidenceViewToggleProps {
    view: CaidenceView;
    onChange: (view: CaidenceView) => void;
}

export const CaidenceViewToggle = ({ view, onChange }: CaidenceViewToggleProps) => {
    const options: { id: CaidenceView; label: string; icon: string }[] = [
        { id: "lanes", label: "Lanes", icon: "M4 6h16M4 12h16M4 18h16" },
        { id: "calendar", label: "Calendar", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
        { id: "files", label: "Files", icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" },
    ];

    return (
        <div className="flex items-center p-1 bg-white/5 rounded-full border border-white/5 backdrop-blur-md shadow-inner">
            {options.map((option) => {
                const isActive = view === option.id;
                return (
                    <button
                        key={option.id}
                        onClick={() => onChange(option.id)}
                        className={`
              relative px-5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-2
              ${isActive
                                ? "text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]"
                                : "text-white/40 hover:text-white/80 hover:bg-white/5"
                            }
            `}
                    >
                        {isActive && (
                            <div className="absolute inset-0 bg-indigo-600 rounded-full -z-10 animate-in fade-in zoom-in duration-200" />
                        )}
                        {/* Simple SVG Icon */}
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={option.icon} />
                        </svg>
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
};
