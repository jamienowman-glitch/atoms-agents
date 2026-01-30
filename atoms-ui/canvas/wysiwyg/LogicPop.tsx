import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LogicPopProps {
    onClose?: () => void;
    onToggleLogging?: () => void;
}

export function LogicPop({ onClose, onToggleLogging }: LogicPopProps) {
    // 0 = Page 1 (Tools), 1 = Page 2 (Feeds)
    const [page, setPage] = useState(0);

    const paginate = (newDirection: number) => {
        let nextPage = page + newDirection;
        if (nextPage < 0) nextPage = 0;
        if (nextPage > 1) nextPage = 1;
        setPage(nextPage);
    };

    // Swipe Threshold
    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    return (
        <div className="w-full h-[80px] bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-t-2xl border-t border-x border-neutral-200 dark:border-white/10 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] overflow-hidden relative">

            {/* Pager Indicator (Optional, helpful for UX) */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                <div className={`w-1 h-1 rounded-full transition-colors ${page === 0 ? 'bg-black dark:bg-white' : 'bg-neutral-300 dark:bg-neutral-700'}`} />
                <div className={`w-1 h-1 rounded-full transition-colors ${page === 1 ? 'bg-black dark:bg-white' : 'bg-neutral-300 dark:bg-neutral-700'}`} />
            </div>

            <AnimatePresence initial={false} custom={page}>
                <motion.div
                    key={page}
                    custom={page}
                    variants={{
                        enter: (direction: number) => ({
                            x: direction > 0 ? '100%' : '-100%',
                            opacity: 0
                        }),
                        center: {
                            zIndex: 1,
                            x: 0,
                            opacity: 1
                        },
                        exit: (direction: number) => ({
                            zIndex: 0,
                            x: direction < 0 ? '100%' : '-100%',
                            opacity: 0
                        })
                    }}
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = swipePower(offset.x, velocity.x);

                        if (swipe < -swipeConfidenceThreshold) {
                            paginate(1);
                        } else if (swipe > swipeConfidenceThreshold) {
                            paginate(-1);
                        }
                    }}
                    className="absolute inset-0 flex items-center justify-around px-2 w-full h-full"
                >
                    {page === 0 ? (
                        /* --- PAGE 1: AGENT TOOLS --- */
                        <>
                            {/* 1. LOGGING */}
                            <button
                                onClick={onToggleLogging}
                                className="flex flex-col items-center justify-center w-14 h-14 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors group"
                            >
                                <div className="w-6 h-6 flex items-center justify-center bg-black dark:bg-white text-white dark:text-black rounded-lg mb-0.5 group-hover:scale-110 transition-transform">
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                                </div>
                                <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-500">Log</span>
                            </button>

                            {/* 2. HAZE */}
                            <button className="flex flex-col items-center justify-center w-14 h-14 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors group">
                                <div className="w-6 h-6 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 rounded-lg mb-0.5 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700 transition-colors">
                                    <svg className="w-4 h-4 text-neutral-600 dark:text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19c0-1.7-1.3-3-3-3h-11c-1.7 0-3 1.3-3 3v1h17v-1z" /><path d="M19 16c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4" /><path d="M5 16c-2.2 0-4-1.8-4-4s1.8-4 4-4c.4 0 .7.1 1.1.2" /><path d="M5 8c0-2.2 1.8-4 4-4s4 1.8 4 4" /></svg>
                                </div>
                                <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-500">Haze</span>
                            </button>

                            {/* 3. MAYBES */}
                            <button className="flex flex-col items-center justify-center w-14 h-14 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors group">
                                <div className="w-6 h-6 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 rounded-lg mb-0.5 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700 transition-colors">
                                    <svg className="w-4 h-4 text-neutral-600 dark:text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                                </div>
                                <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-500">Maybe</span>
                            </button>

                            {/* 4. ACTIVE */}
                            <button className="flex flex-col items-center justify-center w-14 h-14 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors group">
                                <div className="w-6 h-6 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 rounded-lg mb-0.5 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700 transition-colors">
                                    <svg className="w-4 h-4 text-neutral-600 dark:text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" /></svg>
                                </div>
                                <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-500">Active</span>
                            </button>

                            {/* 5. DLVR */}
                            <button className="flex flex-col items-center justify-center w-14 h-14 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors group">
                                <div className="w-6 h-6 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 rounded-lg mb-0.5 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700 transition-colors">
                                    <svg className="w-4 h-4 text-neutral-600 dark:text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
                                </div>
                                <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-500">Dlvr</span>
                            </button>
                        </>
                    ) : (
                        /* --- PAGE 2: FEEDS --- */
                        <>
                            {/* 1. FEEDS (Placeholder) */}
                            <button className="flex flex-col items-center justify-center w-14 h-14 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors group bg-neutral-50 dark:bg-white/5 border border-dashed border-neutral-300 dark:border-white/20">
                                <div className="w-6 h-6 flex items-center justify-center rounded-lg mb-0.5 text-neutral-400">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M4 11a9 9 0 0 1 9 9" /><path d="M4 4a16 16 0 0 1 16 16" /><circle cx="5" cy="19" r="1" /></svg>
                                </div>
                                <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Feeds</span>
                            </button>

                            {/* Spacers to maintain grid alignment if needed, or left empty for now */}
                            <div className="w-14 h-14" />
                            <div className="w-14 h-14" />
                            <div className="w-14 h-14" />
                            <div className="w-14 h-14" />
                        </>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
