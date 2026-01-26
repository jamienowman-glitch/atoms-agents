"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu } from "lucide-react";
import MegaMenu from "@/components/shared/MegaMenu";
import InteractivePills from "@/components/agnx/InteractivePills";

export default function Vo2EnduranceAgent() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <MegaMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} theme="light" />

            <main className="min-h-screen bg-white text-black pb-20 overflow-x-hidden relative">
                {/* 
                   Custom Teal Menu 
                   User requested "turquoise blue teal". 
                   Using a specific hex #00E5FF (Bright Cyan/Teal) to pop against the image.
                */}
                <button
                    onClick={() => setIsMenuOpen(true)}
                    className="absolute top-6 left-6 text-[#00E5FF] hover:text-[#00B8CC] transition-colors z-[100] drop-shadow-md"
                    aria-label="Open Menu"
                >
                    <Menu size={32} />
                </button>

                {/* Hero Image Section */}
                <div className="w-full flex items-center justify-center pt-0 pb-12 px-6 md:px-4">
                    <div className="w-full max-w-[80%] md:max-w-xl relative">
                        <Image
                            src="/vo2-agent-endurance-coach.jpeg"
                            alt="VO2 Endurance Agent"
                            width={0}
                            height={0}
                            sizes="(max-width: 768px) 80vw, 50vw"
                            className="w-full h-auto object-contain"
                            priority
                        />
                    </div>
                </div>

                {/* Content Structure */}
                <section className="flex flex-col items-center pb-12">
                    <div className="mt-8 text-center px-6">
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Agentic Endurance App</p>
                        <p className="text-sm max-w-md mx-auto text-gray-600">
                            Optimizing human performance through algorithmic pacing and recovery analysis.
                        </p>
                    </div>
                </section>

                {/* Tagline Section */}
                <section className="py-20 px-6 text-center bg-gray-50 mx-4 rounded-3xl">
                    <h2 className="text-3xl md:text-5xl font-black mb-8 tracking-tighter text-black">
                        PLAN. ADAPT. GAIN.
                    </h2>
                    <p className="max-w-2xl mx-auto text-gray-600 leading-relaxed">
                        VO² Agents monitor biometrics in real-time, adjusting training loads dynamically to ensure peak adaptation without overtraining.
                    </p>
                </section>

                {/* Interactive Section */}
                <InteractivePills theme="light" />

            </main>
        </>
    );
}
