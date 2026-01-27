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
            <nav className="flex flex-col gap-0">
                {NAV_ITEMS.map((item, index) => (
                    <Link
                        key={typeof item.label === 'string' ? item.label : index}
                        href={item.href}
                        onClick={onClose}
                        className={`group flex flex-col py-6 border-b first:border-t-0 ${borderClass}`}
                    >
                        <span className={`text-4xl md:text-6xl mb-2 ${item.branding}`} style={{ fontFamily: 'var(--font-roboto-flex)' }}>
                            {item.label}
                        </span>
                        <span className={`text-sm md:text-base tracking-widest font-light italic transition-colors ${subTextClass}`}>
                            {item.sub}
                        </span>
                    </Link>
                ))}
            </nav>
        </div>
    );
}
