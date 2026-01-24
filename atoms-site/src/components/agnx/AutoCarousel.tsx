"use client";

import { useEffect, useRef, useState } from "react";

export default function AutoCarousel() {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let scrollAmount = 0;
        const scrollStep = 1; // Pixels per frame
        const scrollDelay = 3000; // Wait time (if we were page-snapping, but smooth auto-scroll is better for "auto scroll")

        // User requested: "AUTO SCROLL EVERY THREE SECONDS" 
        // This implies a paging mechanic. 

        // Let's implementation a snap-scroll interval.
        const interval = setInterval(() => {
            if (scrollContainer) {
                const width = scrollContainer.offsetWidth; // Viewport width relative to container
                // Scroll by roughly 1/3 of the screen width on desktop, full width on mobile?
                // "desktop you'd want to have it at about the middle third of the screen"
                // Let's assume the children have specific widths.

                scrollContainer.scrollBy({
                    left: width, // simple page scroll
                    behavior: 'smooth'
                });

                // Reset if at end? 
                if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 10) {
                    scrollContainer.scrollTo({ left: 0, behavior: 'instant' });
                    // Smooth reset is tricky without cloning. Instant reset is safer for MVP.
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const [activeIndex, setActiveIndex] = useState(0);

    const handleScrollEvent = () => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        const width = scrollContainer.offsetWidth;
        const index = Math.round(scrollContainer.scrollLeft / width);
        // Simple approximation for demo purposes
    };

    return (
        <div className="w-full flex flex-col items-center gap-4">
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto w-full md:w-1/2 mx-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-4"
                onScroll={handleScrollEvent}
            >
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex-none w-[90vw] md:w-[25vw] aspect-video bg-gray-200 snap-center flex items-center justify-center relative">
                        <span className="text-gray-400">Image {i} Placeholder</span>
                        <div className="absolute bottom-2 left-2 bg-white/80 px-2 py-1 text-xs text-black">
                            Landscape Image {i}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Dots */}
            <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((i, idx) => (
                    <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-colors ${idx === activeIndex ? 'bg-black' : 'bg-gray-300'}`}
                    />
                ))}
            </div>
        </div>
    );
}
