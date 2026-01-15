"use client";

import React, { useState } from "react";
import { CaidenceWordmarkThemeA } from "./CaidenceWordmarkThemeA";
import { CaidenceChatRailThemeA } from "./CaidenceChatRailThemeA";
import { CaidenceLaneViewThemeA } from "./CaidenceLaneViewThemeA";
import { CaidenceCalendarViewThemeA } from "./CaidenceCalendarViewThemeA";
import { CaidenceFileExplorerViewThemeA } from "./CaidenceFileExplorerViewThemeA";
import { FloatingIcon, Corner } from "../../multi21/mobile/FloatingIcon";
import { FloatingToolbar } from "../../multi21/mobile/FloatingToolbar";

export type CaidenceView = "lanes" | "calendar" | "files";

export const CaidenceShellThemeA = () => {
    const [view, setView] = useState<CaidenceView>("lanes");

    // Floating UI State
    const [corner, setCorner] = useState<Corner>("BR");
    const [isToolbarOpen, setIsToolbarOpen] = useState(false);
    const [iconRect, setIconRect] = useState<DOMRect | null>(null);

    const handleViewChange = (newView: CaidenceView) => {
        setView(newView);
        setIsToolbarOpen(false);
    };

    // Icons
    const ViewIcon = () => (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    );

    const LanesIcon = () => (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
    );

    const CalendarIcon = () => (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    );

    const FilesIcon = () => (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v8a2 2 0 01-2 2H5z" />
        </svg>
    );

    return (
        <div className="flex flex-col h-screen w-full bg-[#F7F5F2] text-[#050608] overflow-hidden font-sans relative selection:bg-[#FF6829]/30">
            {/* NO Ambient Background Effects for Theme A - Clean Flat Look */}

            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-black/5 bg-white shrink-0 z-20 relative">
                <div className="flex items-center gap-6">
                    <CaidenceWordmarkThemeA />
                    <div className="h-4 w-[1px] bg-black/10" />
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#046E8C]" />
                        <span className="text-xs font-medium text-[#050608]/40 tracking-wide">TENANT #0</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 relative overflow-hidden flex flex-col z-0">
                {view === "lanes" && <CaidenceLaneViewThemeA />}
                {view === "calendar" && <CaidenceCalendarViewThemeA />}
                {view === "files" && <CaidenceFileExplorerViewThemeA />}
            </main>

            {/* Footer / Chat Rail */}
            <div className="shrink-0 z-30 relative">
                <CaidenceChatRailThemeA />
            </div>

            {/* Floating Controls */}
            {/* Note: FloatingIcon and FloatingToolbar might have hardcoded dark styles. 
                If so, they might clash. But per instructions "Do not delete, move or rename any existing components",
                I should use them as is or wrap them. 
                However, FloatingIcon/Toolbar are from `../multi21/mobile/` which implies they are shared.
                I will assume they are neutral or I can't change them easily without affecting others.
                Wait, I can pass styles if they accept className, or just accept they might be dark.
                Let's check if I can style them. The original Shell passed no styles.
                I'll leave them as is for functionality, but maybe wrapper div can help? No, they are portals likely or fixed.
                Actually, looking at the imports, they are from `../multi21/mobile/`.
                I will use them as is.
            */}
            <FloatingIcon
                id="caidence-view-toggle"
                icon={<ViewIcon />}
                corner={corner}
                isToolbarOpen={isToolbarOpen}
                onTap={() => setIsToolbarOpen(!isToolbarOpen)}
                onCornerChange={setCorner}
                onRectChange={setIconRect}
            />

            <FloatingToolbar
                anchorIconRect={iconRect}
                corner={corner}
                isOpen={isToolbarOpen}
            >
                <button
                    onClick={() => handleViewChange("lanes")}
                    className={`p-3 rounded-full transition-colors ${view === "lanes" ? "bg-[#FF6829] text-white shadow-md" : "hover:bg-black/5 text-black/50"}`}
                    title="Lanes"
                >
                    <LanesIcon />
                </button>
                <button
                    onClick={() => handleViewChange("calendar")}
                    className={`p-3 rounded-full transition-colors ${view === "calendar" ? "bg-[#FF6829] text-white shadow-md" : "hover:bg-black/5 text-black/50"}`}
                    title="Calendar"
                >
                    <CalendarIcon />
                </button>
                <button
                    onClick={() => handleViewChange("files")}
                    className={`p-3 rounded-full transition-colors ${view === "files" ? "bg-[#FF6829] text-white shadow-md" : "hover:bg-black/5 text-black/50"}`}
                    title="Files"
                >
                    <FilesIcon />
                </button>
            </FloatingToolbar>
        </div>
    );
};
