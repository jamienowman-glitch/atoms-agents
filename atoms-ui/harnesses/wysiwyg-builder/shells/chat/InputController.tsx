import React, { useRef, useEffect, useState } from 'react';

export const InputController = ({ autoFocus = false }: { autoFocus?: boolean }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isAttachmentsOpen, setIsAttachmentsOpen] = useState(false);

    useEffect(() => {
        if (autoFocus) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [autoFocus]);

    return (
        <div className="px-3 py-3 border-t border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 pb-safe w-full max-w-full relative">

            {/* Attachments Vertical Lozenge */}
            {isAttachmentsOpen && (
                <div className="absolute bottom-20 left-4 flex flex-col items-center gap-3 p-2 bg-white dark:bg-neutral-800 rounded-full border border-neutral-200 dark:border-neutral-700 shadow-xl animate-in slide-in-from-bottom-4 fade-in duration-200 z-[60]">
                    <button className="p-2 bg-neutral-100 dark:bg-neutral-700 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-900 dark:text-neutral-100 transition-colors" title="File">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                    </button>
                    <button className="p-2 bg-neutral-100 dark:bg-neutral-700 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-900 dark:text-neutral-100 transition-colors" title="Camera">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
                    </button>
                    <button className="p-2 bg-neutral-100 dark:bg-neutral-700 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-900 dark:text-neutral-100 transition-colors" title="Mic">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
                    </button>
                </div>
            )}

            <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 rounded-full px-4 py-2 focus-within:border-neutral-500 transition-colors w-full max-w-full">
                {/* Brand Identity: Agent Streetwear (Attachment Trigger) */}
                <button
                    onClick={() => setIsAttachmentsOpen(!isAttachmentsOpen)}
                    className="shrink-0 focus:outline-none active:scale-95 transition-transform"
                    title="Add Attachment"
                >
                    <img src="/assets/AGENT_STREETWEAR_BLACK.png" alt="Agent" className="h-6 w-6 object-contain dark:hidden" />
                    <img src="/assets/AGENT_STREETWEAR_WHITE.png" alt="Agent" className="h-6 w-6 object-contain hidden dark:block" />
                </button>

                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Message agent..."
                    className="flex-1 bg-transparent border-none outline-none text-base text-neutral-900 dark:text-white placeholder-neutral-500 h-8 min-w-0"
                />
                <button className="p-1.5 bg-black dark:bg-white text-white dark:text-black rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shrink-0">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                </button>
            </div>
        </div>
    );
};
