"use client";

import { useState, useEffect, ReactNode } from "react";
import { Menu } from "lucide-react";
import MegaMenu from "@/components/shared/MegaMenu";

interface MicrositeHeaderProps {
    logo: ReactNode;
    subhead?: ReactNode;
    initialTemp?: number;
    bgColor?: string;
    textColor?: string;
    borderColor?: string;
    menuHoverColor?: string;
}

export default function MicrositeHeader({
    logo,
    subhead,
    initialTemp = 72,
    bgColor = "bg-white",
    textColor = "text-black",
    borderColor = "border-black",
    menuHoverColor = "hover:text-gray-600"
}: MicrositeHeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [temp, setTemp] = useState(initialTemp);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const updateTemp = () => {
            setTemp(prev => {
                const change = Math.random() > 0.5 ? 1 : -1;
                const newTemp = prev + change;
                // Clamp within +/- 5 degrees
                if (newTemp > initialTemp + 5) return prev - 1;
                if (newTemp < initialTemp - 5) return prev + 1;
                return newTemp;
            });

            // Random interval between 15s and 30s
            const nextDelay = Math.floor(Math.random() * 15000) + 15000;
            timeoutId = setTimeout(updateTemp, nextDelay);
        };

        const firstDelay = Math.floor(Math.random() * 15000) + 15000;
        timeoutId = setTimeout(updateTemp, firstDelay);

        return () => clearTimeout(timeoutId);
    }, [initialTemp]);

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

                {/* Center: Branding */}
                <div className="flex-[2] flex flex-col items-center justify-center text-center">
                    {logo}
                    {subhead && <div className="mt-1">{subhead}</div>}
                </div>

                {/* Right: Temp Gauge */}
                <div className="flex-1 flex justify-end">
                    <div className="flex items-center gap-1">
                        <span className="text-2xl font-light" style={{ fontFamily: 'var(--font-roboto-flex)', fontVariationSettings: '"wght" 300' }}>{temp}</span>
                        <span className="text-lg mb-4" style={{ fontFamily: 'var(--font-roboto-flex)', fontVariationSettings: '"wght" 300' }}>°</span>
                    </div>
                </div>
            </header>
        </>
    );
}
