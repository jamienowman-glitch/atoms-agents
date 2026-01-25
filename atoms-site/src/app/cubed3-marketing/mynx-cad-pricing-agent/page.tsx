"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu } from "lucide-react";
import MegaMenu from "@/components/shared/MegaMenu";
import InteractivePills from "@/components/agnx/InteractivePills";

export default function MynxCadPricingAgent() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <MegaMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} theme="dark" />

            <main className="min-h-screen bg-black text-white pb-20 overflow-x-hidden relative">
                {/* 
                   Custom Red Menu for CUBED3 branding
                */}
                <button
                    onClick={() => setIsMenuOpen(true)}
                    className="absolute top-6 left-6 text-red-600 hover:text-red-500 transition-colors z-[100] drop-shadow-md"
                    aria-label="Open Menu"
                >
                    <Menu size={32} />
                </button>

                {/* Hero Image Section */}
                <div className="w-full flex items-center justify-center pt-0 pb-12 px-6 md:px-4">
                    <div className="w-full max-w-[80%] md:max-w-xl relative">
                        <Image
                            src="/mynx-cad-pricing-agents.png"
                            alt="Mynx CAD Pricing Agent"
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
                        <p className="text-xs text-red-500 uppercase tracking-widest mb-2">CAD Intelligence</p>
                        <p className="text-sm max-w-md mx-auto text-gray-400">
                            Automated engineering economy analysis and component pricing for complex assemblies.
                        </p>
                    </div>
                </section>

                {/* Tagline Section */}
                <section className="py-20 px-6 text-center bg-white/5 mx-4 rounded-3xl border border-white/10">
                    <h2 className="text-3xl md:text-5xl font-black mb-8 tracking-tighter text-white">
                        ENGINEER. PRICE. BUILD.
                    </h2>
                    <p className="max-w-2xl mx-auto text-gray-400 leading-relaxed">
                        Mynx Agents scan CAD models in real-time, identifying cost drivers and sourcing components to optimize your BOM instantly.
                    </p>
                </section>

                {/* Interactive Section */}
                <InteractivePills theme="dark" />

            </main>
        </>
    );
}
