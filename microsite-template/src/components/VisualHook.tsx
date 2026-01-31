"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";

const handleScroll = () => {
    window.scrollTo({
        top: window.innerHeight * 2,
        behavior: "smooth",
    });
};

export default function VisualHook() {
    return (
        <section className="min-h-screen flex flex-col items-center justify-start bg-black text-white py-12 relative">

            {/* 1. Marketing Image (Top) */}
            <div className="w-full relative aspect-video md:aspect-[21/9] mb-8">
                <Image
                    src="/atoms-fam-marketing-agents.JPG"
                    alt="Atoms Fam Marketing Agents"
                    fill
                    className="object-cover"
                />
            </div>

            {/* 2. Quote */}
            <div className="px-6 text-center mb-8">
                <blockquote className="mb-2 max-w-lg mx-auto">
                    <p className="text-xl italic">
                        &quot;I&apos;m Atoms Fam to the bone marrow. Fuck a soul even God knows his body is hollow&quot;
                    </p>
                </blockquote>
                <p className="text-sm text-gray-400 italic">
                    Vast Aire, Cannibal Ox, Stress Rap, 2001
                </p>
            </div>

            {/* 3. YouTube Carousel (Slim Placeholder) */}
            <div className="w-full h-16 md:h-24 mb-8 overflow-x-auto bg-gray-900 border-y border-gray-800 flex items-center justify-center">
                {/* Placeholder for "mini very slim on mobile... YouTube videos" */}
                <p className="text-gray-500 animate-pulse text-sm">YouTube Playlist (Slim)</p>
            </div>

            {/* 4. Headline (Bottom of viewport intent) */}
            <h2 className="text-3xl md:text-5xl font-bold mb-20 font-roboto tracking-tight text-center px-6">
                Families of specialised agents tuned to your business.
            </h2>

            {/* Chevron to View 3 */}
            <button
                onClick={handleScroll}
                className="absolute bottom-20 animate-bounce text-white cursor-pointer hover:text-gray-300 transition-colors"
                aria-label="Scroll to Pitch"
            >
                <ChevronDown size={48} />
            </button>

        </section>
    );
}
