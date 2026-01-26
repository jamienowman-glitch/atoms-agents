"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

export default function HeroSplash() {
    const [opacity, setOpacity] = useState("opacity-0");
    const [text, setText] = useState("");
    const fullText = "AUTOMATED. ATOMIC. AGENTS.";

    useEffect(() => {
        // Logo Fade In
        const logoTimer = setTimeout(() => {
            setOpacity("opacity-100");
        }, 100); // Start reasonably quickly

        // Typewriter
        // Wait for logo (1000ms fade) + 500ms wait = 1500ms + initial offset
        // Let's say logo starts at 100ms, takes 1000ms to fade. Total 1100ms.
        // Wait 500ms. Start at 1600ms.
        const startTyping = 1600;

        let charIndex = 0;
        const typeWriter = setInterval(() => {
            const now = Date.now();
            // This is a simple implementation, but checking time is better. 
            // Instead, let's just use a timeout chain or interval after the delay.
        }, 50);

        // Better simple approach for typewriter
        const typeTimer = setTimeout(() => {
            const interval = setInterval(() => {
                setText((prev) => {
                    if (prev.length < fullText.length) {
                        return fullText.slice(0, prev.length + 1);
                    } else {
                        clearInterval(interval);
                        return prev;
                    }
                });
            }, 100); // Solving for speed
            return () => clearInterval(interval);
        }, 1600);

        return () => {
            clearTimeout(logoTimer);
            clearTimeout(typeTimer);
        };
    }, []);

    const handleScroll = () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: "smooth",
        });
    };

    return (
        <div className="h-screen flex flex-col items-center justify-start pt-[30vh] bg-black relative">
            {/* Logo */}
            <div className={`transition-opacity duration-1000 ${opacity} w-full px-4 md:w-auto`}>
                <Image
                    src="/atoms-fam-agent-orchestration-system.png"
                    alt="Atoms Fam Agent Orchestration System"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-auto md:max-w-xl mx-auto"
                    priority
                />
            </div>

            {/* 75% Down Text */}
            <div className="absolute top-[75%] font-roboto font-semibold text-white/80 tracking-widest text-lg md:text-2xl text-center px-4 w-full">
                {text}
                <span className="animate-pulse">|</span>
            </div>

            {/* Bottom Icon */}
            <button
                onClick={handleScroll}
                className="absolute bottom-20 animate-bounce text-white cursor-pointer hover:text-gray-300 transition-colors"
                aria-label="Scroll down"
            >
                <ChevronDown size={48} />
            </button>
        </div>
    );
}
