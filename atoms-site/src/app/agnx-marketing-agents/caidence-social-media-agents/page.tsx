"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu } from "lucide-react";
import MegaMenu from "@/components/shared/MegaMenu";
import AutoCarousel from "@/components/agnx/AutoCarousel";
import InteractivePills from "@/components/agnx/InteractivePills";

export default function CaidenceAgents() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <MegaMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} theme="light" />

            <main className="min-h-screen bg-white text-black pb-20 overflow-x-hidden relative">
                {/* Hamburger (Absolute Top Left - Overlays Image) */}
                {/* User requested Orange menu */}
                <button
                    onClick={() => setIsMenuOpen(true)}
                    className="absolute top-6 left-6 text-orange-500 hover:text-orange-600 transition-colors z-[100] drop-shadow-md"
                    aria-label="Open Menu"
                >
                    <Menu size={32} />
                </button>

                {/* Hero Image Section - Same layout as MANYΨORLDS */}
                <div className="w-full flex items-center justify-center pt-0 pb-12 px-0 md:px-4">
                    <div className="w-full max-w-xl relative">
                        <Image
                            src="/caidence-social-media-tile.png"
                            alt="Caidence Social Media"
                            width={0}
                            height={0}
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="w-full h-auto object-contain"
                            priority
                        />
                    </div>
                </div>

                {/* Standard Content Structure */}
                <section className="flex flex-col items-center pb-12">
                    {/* Carousel Removed */}

                    <div className="mt-8 text-center px-6">
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Automated Optimization</p>
                        <p className="text-sm max-w-md mx-auto text-gray-600">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                    </div>
                </section>

                {/* Tagline Section */}
                <section className="py-20 px-6 text-center bg-gray-50 mx-4 rounded-3xl">
                    <h2 className="text-3xl md:text-5xl font-black mb-8 tracking-tighter text-black">
                        ANALYSE. AMPLIFY. ADAPT.
                    </h2>
                    <p className="max-w-2xl mx-auto text-gray-600 leading-relaxed">
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    </p>
                </section>

                {/* Interactive Section */}
                <InteractivePills theme="light" />

            </main>
        </>
    );
}
