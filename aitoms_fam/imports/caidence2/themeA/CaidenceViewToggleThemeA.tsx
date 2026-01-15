"use client";

import React from "react";

export type CaidenceView = "lanes" | "calendar" | "files";

interface CaidenceViewToggleProps {
    view: CaidenceView;
    onChange: (view: CaidenceView) => void;
}

export const CaidenceViewToggleThemeA = ({ view, onChange }: CaidenceViewToggleProps) => {
    const options: { id: CaidenceView; label: string; icon: string }[] = [
        { id: "lanes", label: "Lanes", icon: "M4 6h16M4 12h16M4 18h16" },
        { id: "calendar", label: "Calendar", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
        { id: "files", label: "Files", icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" },
    ];

    return (
        <div className="flex items-center gap-1 p-1 bg-[#F7F5F2] rounded-lg border border-black/5">
            {options.map((option) => {
                const isActive = view === option.id;
                return (
                    <button
                        key={option.id}
                        onClick={() => onChange(option.id)}
                        className={`
              relative px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 border
              ${isActive
                                ? "bg-white text-[#050608] border-black/10 shadow-sm"
                                : "bg-transparent text-[#050608]/40 border-transparent hover:text-[#050608]/80 hover:bg-black/5"
                            }
            `}
                    >
                        {/* Simple SVG Icon */}
                        <svg className={`w-4 h-4 ${isActive ? "text-[#FF6829]" : "currentColor"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={option.icon} />
                        </svg>
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
};
