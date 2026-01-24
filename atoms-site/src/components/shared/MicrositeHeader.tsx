"use client";

import { useState, ReactNode } from "react";
import { Menu } from "lucide-react";
import MegaMenu from "@/components/shared/MegaMenu";

interface MicrositeHeaderProps {
    logo: ReactNode;
    temperature?: string;
    bgColor?: string;
    textColor?: string;
    borderColor?: string;
    menuHoverColor?: string;
}

export default function MicrositeHeader({
    logo,
    temperature = "72",
    bgColor = "bg-white",
    textColor = "text-black",
    borderColor = "border-black",
    menuHoverColor = "hover:text-gray-600"
}: MicrositeHeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <MegaMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
            <header className={`w-full flex items-center justify-between px-6 py-6 sticky top-0 z-50 border-b ${bgColor} ${borderColor} ${textColor}`}>
                {/* Left: Hamburger */}
                <div className="flex-1 flex justify-start">
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className={`transition-colors ${textColor} ${menuHoverColor}`}
                    >
                        <Menu size={32} />
                    </button>
                </div>

                {/* Center: Logo */}
                <div className="flex-1 flex flex-col items-center">
                    {logo}
                </div>

                {/* Right: Temp Gauge */}
                <div className="flex-1 flex justify-end">
                    <div className="flex items-center gap-1">
                        <span className="text-2xl font-light" style={{ fontFamily: 'var(--font-roboto-flex)', fontVariationSettings: '"wght" 300' }}>{temperature}</span>
                        <span className="text-lg mb-4" style={{ fontFamily: 'var(--font-roboto-flex)', fontVariationSettings: '"wght" 300' }}>°</span>
                    </div>
                </div>
            </header>
        </>
    );
}
