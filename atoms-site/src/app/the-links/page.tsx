import Link from "next/link";
import MainSiteHeader from "@/components/MainSiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { ArrowUpRight } from "lucide-react";

export default function TheLinks() {
    const links = [
        { label: "The House (Home)", href: "/" },
        { label: "The Offers (Pricing)", href: "/the-offer" },
        { label: "The Dream (Vision)", href: "/the-dream" },
        { label: "The Knowledge (Docs)", href: "/the-knowledge" },
        { label: "The Feeds (News)", href: "/the-feeds" },
        { label: "Join Discord Community", href: "https://discord.gg" },
        { label: "Follow on X", href: "https://x.com" },
        { label: "Watch on YouTube", href: "https://youtube.com" }
    ];

    return (
        <main className="bg-black min-h-screen text-white flex flex-col">
            <MainSiteHeader />

            <section className="flex-1 flex flex-col items-center justify-center py-32 px-6">
                <div className="w-full max-w-md">
                    <div className="text-center mb-12">
                        <div className="w-24 h-24 bg-white rounded-full mx-auto mb-6 flex items-center justify-center text-black font-black text-3xl">
                            A
                        </div>
                        <h1 className="text-2xl font-bold uppercase tracking-widest">Atoms Family</h1>
                        <p className="text-gray-500">The Orchestration Layer</p>
                    </div>

                    <div className="space-y-4">
                        {links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.href}
                                className="block bg-zinc-900 border border-white/10 p-4 rounded-lg text-center font-bold uppercase hover:bg-white hover:text-black transition-all hover:scale-105 flex items-center justify-center gap-2 group"
                            >
                                {link.label}
                                <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <SiteFooter />
        </main>
    );
}
