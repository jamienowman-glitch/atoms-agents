"use client";

import React, { useState } from "react";

type ChatMode = "nano" | "micro" | "standard" | "full";

export const CaidenceChatRailThemeA = () => {
    const [mode, setMode] = useState<ChatMode>("micro");
    const [input, setInput] = useState("");

    // Mock data
    const lastAgentMessage =
        "Got you, I’ll just continue it cleanly from where it cut and keep going in the same style.";

    const handleSend = () => {
        console.log("Send:", input);
        setInput("");
    };

    const toggleMode = (newMode: ChatMode) => {
        setMode(newMode);
    };

    // Icons - Consistent Arrows
    const IconArrowUp = () => (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
    );
    const IconArrowDown = () => (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    );
    const IconClose = () => (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    );

    // Nano Mode - NO INPUT, just message
    if (mode === "nano") {
        return (
            <div className="w-full flex flex-col items-center pb-4 px-4 relative">
                {/* Expand Button at TOP RIGHT */}
                <div className="absolute top-0 right-4 z-10">
                    <button
                        className="p-1 bg-white border border-black/10 rounded-full text-black/40 hover:text-black transition-colors shadow-sm"
                        onClick={() => toggleMode("micro")}
                        title="Expand"
                    >
                        <IconArrowUp />
                    </button>
                </div>

                <div
                    className="w-full max-w-2xl bg-white border border-black/10 rounded-full px-4 py-2 flex items-center gap-3 shadow-sm mt-6 cursor-pointer hover:border-black/20 transition-colors"
                    onClick={() => toggleMode("micro")}
                >
                    <div className="w-5 h-5 rounded-full bg-[#FF6829] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                        AI
                    </div>
                    <div className="text-sm text-[#050608]/80 truncate font-normal flex-1">
                        {lastAgentMessage}
                    </div>
                </div>
            </div>
        );
    }

    // Micro Mode
    if (mode === "micro") {
        return (
            <div className="w-full flex flex-col items-center pb-6 px-4 relative">
                {/* Expand/Collapse Buttons at TOP RIGHT */}
                <div className="absolute top-0 right-4 z-10 flex items-center gap-1.5">
                    <button
                        onClick={() => toggleMode("standard")}
                        className="p-1 bg-white border border-black/10 rounded-full text-black/40 hover:text-black transition-colors shadow-sm"
                        title="Expand"
                    >
                        <IconArrowUp />
                    </button>
                    <button
                        onClick={() => toggleMode("nano")}
                        className="p-1 bg-white border border-black/10 rounded-full text-black/40 hover:text-black transition-colors shadow-sm"
                        title="Collapse"
                    >
                        <IconArrowDown />
                    </button>
                </div>

                <div className="w-full max-w-3xl bg-white border border-black/10 rounded-xl shadow-xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300 mt-8">
                    {/* Message Area */}
                    <div className="px-5 py-4 text-sm text-[#050608] border-b border-black/5 bg-[#F7F5F2]">
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-[#FF6829] flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5">
                                AI
                            </div>
                            <div className="leading-relaxed font-normal tracking-normal">{lastAgentMessage}</div>
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="px-4 py-3 flex items-center gap-3 bg-white">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Reply to AI..."
                            className="flex-1 bg-transparent border border-black/10 rounded-lg px-4 py-2.5 text-base text-[#050608] placeholder-black/30 focus:outline-none focus:border-[#FF6829] focus:ring-1 focus:ring-[#FF6829]/20 transition-all"
                            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                        />
                    </div>
                </div>
            </div>
        );
    }

    // Standard or Full Mode
    const isFull = mode === "full";
    const containerClass = isFull
        ? "fixed inset-0 z-50 bg-[#F7F5F2] flex flex-col animate-in zoom-in-95 duration-200"
        : "w-full h-[60vh] bg-[#F7F5F2] border-t border-black/10 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.05)] animate-in slide-in-from-bottom-10 duration-300";

    return (
        <div className={containerClass}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 bg-white">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#FF6829]" />
                    <span className="font-bold text-[#050608] tracking-tight">CAIDENCE² Chat</span>
                </div>

                {/* Controls - Top Right */}
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => toggleMode("micro")}
                        className="p-1 text-black/40 hover:text-black hover:bg-black/5 rounded-md transition-colors"
                        title="Minimize"
                    >
                        <IconArrowDown />
                    </button>
                    <button
                        onClick={() => toggleMode(isFull ? "standard" : "full")}
                        className="p-1 text-black/40 hover:text-black hover:bg-black/5 rounded-md transition-colors"
                        title={isFull ? "Restore" : "Maximize"}
                    >
                        {isFull ? <IconArrowDown /> : <IconArrowUp />}
                    </button>
                    {isFull && (
                        <button
                            onClick={() => toggleMode("standard")}
                            className="p-1 text-black/40 hover:text-black hover:bg-black/5 rounded-md transition-colors"
                            title="Close Full Screen"
                        >
                            <IconClose />
                        </button>
                    )}
                </div>
            </div>

            {/* History Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar bg-[#F7F5F2]">
                {/* Mock History */}
                <div className="flex justify-end">
                    <div className="bg-white border border-black/5 text-[#050608] px-5 py-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm text-sm leading-relaxed">
                        Show me the latest plan for the Q3 campaign.
                    </div>
                </div>
                <div className="flex justify-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#FF6829] flex items-center justify-center text-xs font-bold text-white shrink-0">
                        AI
                    </div>
                    <div className="flex flex-col gap-3 max-w-[85%]">
                        <div className="bg-white border border-black/10 text-[#050608] px-6 py-4 rounded-2xl rounded-tl-sm shadow-sm">
                            <p className="leading-relaxed font-normal">{lastAgentMessage}</p>
                        </div>

                        {/* Strategy Buttons - Icon Only, No Text */}
                        <div className="flex flex-wrap gap-3 mt-1 pl-1">
                            <ActionButton icon={<LockIcon />} tooltip="Strategy Lock" primary />
                            <ActionButton icon={<SaveIcon />} tooltip="Save" />
                            <ActionButton icon={<ScaleIcon />} tooltip="3-Wise" />
                            <ActionButton icon={<BellIcon />} tooltip="Remind" />
                            <ActionButton icon={<UndoIcon />} tooltip="Undo" />
                            <ActionButton icon={<CheckIcon />} tooltip="To-do" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-black/5 bg-white">
                <div className="relative group">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="relative w-full bg-[#F7F5F2] border border-black/10 rounded-lg px-5 py-4 pr-32 text-base text-[#050608] placeholder-black/30 focus:outline-none focus:border-[#FF6829] focus:ring-1 focus:ring-[#FF6829]/20 transition-all resize-none h-28"
                    />
                    <div className="absolute bottom-4 right-4 flex items-center gap-3">
                        <button
                            onClick={handleSend}
                            className="bg-[#050608] hover:bg-[#050608]/80 text-white px-5 py-2 rounded-md text-sm font-medium transition-all shadow-sm active:scale-95"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// SVG Icons for Actions
const LockIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const SaveIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>;
const ScaleIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>;
const BellIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const UndoIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>;
const CheckIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;

const ActionButton = ({
    icon,
    tooltip,
    primary = false,
}: {
    icon: React.ReactNode;
    tooltip: string;
    primary?: boolean;
}) => (
    <button
        className={`
      flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200 border
      ${primary
                ? "bg-[#FF6829]/10 text-[#FF6829] border-[#FF6829]/30 hover:bg-[#FF6829]/20"
                : "bg-white text-black/50 border-black/10 hover:bg-black/5 hover:text-black hover:border-black/20"
            }
    `}
        title={tooltip}
        onClick={() => console.log(`Clicked ${tooltip}`)}
    >
        {icon}
    </button>
);
