"use client";

import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import MegaMenu from "@/components/shared/MegaMenu";

export default function MainSiteHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showBranding, setShowBranding] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show branding if scrolled past ~80% of the viewport (exiting Hero)
            setShowBranding(window.scrollY > window.innerHeight * 0.8);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <MegaMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} theme="dark" />

            <header className="fixed top-0 left-0 w-full z-40 p-6 flex items-start justify-between pointer-events-none">
                {/* Pointer events none on container lets clicks pass through to underlying elements, 
            but we need pointer-events-auto on buttons/content. */}

                {/* Left: Hamburger (Always Visible) */}
                <div className="flex-1 pointer-events-auto">
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="text-white hover:text-gray-300 transition-colors"
                        aria-label="Open Menu"
                    >
                        <Menu size={32} />
                    </button>
                </div>

                {/* Center: Branding (Visible from Scene 2+) */}
                <div
                    className={`flex-1 flex flex-col items-center transition-opacity duration-500 transform ${showBranding ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                        }`}
                >
                    <div className="pointer-events-auto text-center">
                        <h1 className="text-xl md:text-2xl font-black text-white tracking-tight" style={{ fontFamily: 'var(--font-roboto-flex)', fontVariationSettings: '"wght" 900' }}>
                            (A)TOMS-FAM
                        </h1>
                        <p className="text-[10px] md:text-xs text-white uppercase tracking-widest font-light italic" style={{ fontFamily: 'var(--font-roboto-flex)', fontVariationSettings: '"wght" 200, "slnt" -10' }}>
                            ORCHESTRATION SYSTEM
                        </p>
                    </div>
                </div>

                {/* Right: Spacer to balance layout */}
                <div className="flex-1"></div>

            </header>
        </>
    );
}
