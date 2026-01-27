"use client";

import Link from "next/link";
import { X } from "lucide-react";

interface MegaMenuProps {
    isOpen: boolean;
    onClose: () => void;
    theme?: "light" | "dark";
}

export default function MegaMenu({ isOpen, onClose, theme = "light" }: MegaMenuProps) {
    if (!isOpen) return null;

    const isDark = theme === "dark";
    const bgClass = isDark ? "bg-black text-white" : "bg-white text-black";
    const borderClass = isDark ? "border-white" : "border-black";
    const closeBtnClass = isDark ? "text-white hover:text-gray-300" : "text-black hover:text-gray-600";
    const subTextClass = isDark ? "text-gray-400 group-hover:text-white" : "text-gray-500 group-hover:text-black";

    const NAV_ITEMS = [
        { label: "(A)TOMS-FAM", sub: "ORCHESTRATION SYSTEM", href: "/", branding: "font-black" },
        { label: "AGNˣ", sub: "MARKETING AGENT FLOWS", href: "/agnx-marketing-agents", branding: "font-black" },
        { label: "=MC²", sub: "PERSONAL ENERGY AGENTS", href: "/mc2-personal-energy", branding: "font-semibold italic" },
        { label: "P²", sub: "WEALTH CREATION AGENTS", href: "/p2-wealth-creation", branding: "font-normal" },
        { label: "CUBED³", sub: "MARKETING IN THE THIRD", href: "/cubed3-marketing", branding: "font-bold" },
        {
            label: (
                <span>
                    <span className="font-semibold">MANY</span>
                    <span className="font-normal">Ψ</span>
                    <span className="font-extralight italic">ORLDS</span>
                </span>
            ),
            sub: "AGENTIC QUANTUM RESEARCH",
            href: "/many-worlds",
            branding: ""
        },
        { label: "THE 12 WORLDS", sub: "FULL ECOSYSTEM DIRECTORY", href: "/the-links", branding: "font-black text-red-600" },
    ];

    return (
        <div className={`fixed inset-0 z-[60] flex flex-col p-6 animate-in fade-in duration-200 ${bgClass}`}>
            {/* Close Button */}
            <div className="flex justify-start mb-8">
                <button onClick={onClose} className={`${closeBtnClass} transition-colors`}>
                    <X size={32} />
                </button>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 overflow-y-auto flex flex-col gap-0">
                {[
                    { label: "THE HOUSE", href: "/" },
                    { label: "THE STORY", href: "/the-story" },
                    { label: "THE HISTORY", href: "/the-history" },
                    { label: "THE BENEFITS", href: "/the-benefits" },
                    { label: "THE KNOWLEDGE", href: "/the-knowledge" },
                    { label: "THE PROOF", href: "/the-proof" },
                ].map((item, index) => (
                    <Link
                        key={index}
                        href={item.href}
                        onClick={onClose}
                        className={`group flex items-center py-4 border-b first:border-t-0 ${borderClass}`}
                    >
                        <span className="text-3xl md:text-5xl font-black tracking-tighter hover:text-red-500 transition-colors" style={{ fontFamily: 'var(--font-roboto-flex)' }}>
                            {item.label}
                        </span>
                    </Link>
                ))}
            </nav>

            {/* Bottom: AGENTFlows Slider */}
            <div className="mt-auto pt-8">
                <h3 className="text-xl mb-4" style={{ fontFamily: 'var(--font-roboto-flex)' }}>
                    <span className="font-semibold">AGENT</span>
                    <span className="font-extralight italic">Flows</span>
                </h3>

                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4" style={{ WebkitOverflowScrolling: 'touch' }}>
                    {[
                        { title: "AGNˣ", img: "/aftertime-agent-video-editing.png", href: "/agnx-marketing-agents" },
                        { title: "=MC²", img: "/vo2-agent-endurance-coach.jpeg", href: "/mc2-personal-energy" },
                        { title: "CUBED³", img: "/mynx-cad-pricing-agents.png", href: "/cubed3-marketing" }
                    ].map((flow, i) => (
                        <Link key={i} href={flow.href} onClick={onClose} className="flex-none w-24 h-24 relative bg-gray-800 rounded-lg overflow-hidden border border-white/20">
                            <img src={flow.img} alt={flow.title} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center text-white font-black text-xs drop-shadow-md">
                                {flow.title}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
