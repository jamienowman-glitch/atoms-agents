"use client";

import React, { useState } from "react";
import { CaidenceWordmark } from "./CaidenceWordmark";
import { CaidenceChatRail } from "./CaidenceChatRail";
import { CaidenceLaneView } from "./CaidenceLaneView";
import { CaidenceCalendarView } from "./CaidenceCalendarView";
import { CaidenceFileExplorerView } from "./CaidenceFileExplorerView";
import { FloatingIcon, Corner } from "../multi21/mobile/FloatingIcon";
import { FloatingToolbar } from "../multi21/mobile/FloatingToolbar";

export type CaidenceView = "lanes" | "calendar" | "files";

export const CaidenceShell = () => {
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
        <div className="flex flex-col h-screen w-full bg-[#030305] text-[#f7f7ff] overflow-hidden font-sans relative selection:bg-indigo-500/30">
            {/* Ambient Background Effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-cyan-900/10 rounded-full blur-[100px] mix-blend-screen" />
            </div>

            {/* Glass Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#030305]/60 backdrop-blur-xl shrink-0 z-20 relative">
                <div className="flex items-center gap-6">
                    <CaidenceWordmark />
                    <div className="h-4 w-[1px] bg-white/10" />
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                        <span className="text-xs font-medium text-white/40 tracking-wide">TENANT #0</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 relative overflow-hidden flex flex-col z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#030305]/50 pointer-events-none" />
                {view === "lanes" && <CaidenceLaneView />}
                {view === "calendar" && <CaidenceCalendarView />}
                {view === "files" && <CaidenceFileExplorerView />}
            </main>

            {/* Footer / Chat Rail */}
            <div className="shrink-0 z-30 relative">
                <CaidenceChatRail />
            </div>

            {/* Floating Controls */}
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
                    className={`p-3 rounded-full transition-colors ${view === "lanes" ? "bg-indigo-500 text-white shadow-lg" : "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400"}`}
                    title="Lanes"
                >
                    <LanesIcon />
                </button>
                <button
                    onClick={() => handleViewChange("calendar")}
                    className={`p-3 rounded-full transition-colors ${view === "calendar" ? "bg-indigo-500 text-white shadow-lg" : "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400"}`}
                    title="Calendar"
                >
                    <CalendarIcon />
                </button>
                <button
                    onClick={() => handleViewChange("files")}
                    className={`p-3 rounded-full transition-colors ${view === "files" ? "bg-indigo-500 text-white shadow-lg" : "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400"}`}
                    title="Files"
                >
                    <FilesIcon />
                </button>
            </FloatingToolbar>
        </div>
    );
};
