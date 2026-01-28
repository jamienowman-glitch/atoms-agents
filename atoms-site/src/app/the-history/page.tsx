import Image from "next/image";
import Link from "next/link";
import MainSiteHeader from "@/components/MainSiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function TheHistory() {
    const events = [
        {
            year: "2023",
            title: "The Epiphany",
            desc: "It started in a garage with a server rack and a refusal to accept the status quo. We realized that 90% of creative work was actually administrative friction.",
            media: "/atoms-fam-marketing-agents.JPG",
            mediaType: "image"
        },
        {
            year: "2024",
            title: "First Contact",
            desc: "The first agent, 'Mynx', was deployed. It successfully negotiated a contract without human intervention. The prototype lived.",
            media: null, // Text only
            mediaType: "text"
        },
        {
            year: "2025",
            title: "The Swarm",
            desc: "We scaled from one agent to one thousand. The Orchestration Layer was born to manage the entropy. Northstar Protocol v1 released.",
            media: "/atoms-fam-agent-orchestration-system.png",
            mediaType: "video_placeholder"
        },
        {
            year: "2026",
            title: "Global Scale",
            desc: "Atoms Family goes global. The 12 Worlds are established. We are no longer just software; we are a new way of working.",
            media: "/MANYSOWLRDS.png",
            mediaType: "image"
        }
    ];

    return (
        <main className="bg-black min-h-screen text-white">
            <MainSiteHeader />

            <section className="pt-32 pb-12 px-6 text-center border-b border-white/10 mb-12">
                <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-4">
                    HISTORY
                </h1>
                <p className="text-gray-500 uppercase tracking-widest text-sm">
                    The Official Timeline
                </p>
            </section>

            <section className="container mx-auto px-6 max-w-2xl mb-32 relative">
                {/* THE TUBE LINE */}
                <div className="absolute left-6 md:left-0 top-0 bottom-0 w-0.5 bg-zinc-800" />

                <div className="space-y-24">
                    {events.map((event, i) => (
                        <div key={i} className="relative pl-12 md:pl-16">
                            {/* The Station Node */}
                            <div className="absolute left-[20px] md:left-[-6px] top-2 w-4 h-4 rounded-full bg-red-600 border-4 border-black box-content z-10" />

                            {/* Date */}
                            <div className="text-6xl font-black text-red-600 leading-none mb-6 -ml-1">
                                {event.year}
                            </div>

                            {/* Content Card */}
                            <div className="bg-zinc-900/50 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm">
                                {event.media && event.mediaType === "image" && (
                                    <div className="relative aspect-video w-full">
                                        <Image src={event.media} alt={event.title} fill className="object-cover" />
                                    </div>
                                )}

                                {event.mediaType === "video_placeholder" && (
                                    <div className="relative aspect-video w-full bg-black flex items-center justify-center group cursor-pointer">
                                        <span className="font-mono text-xs text-gray-500">[ VIDEO ARCHIVE ]</span>
                                        <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors" />
                                        <div className="w-16 h-16 rounded-full border border-white flex items-center justify-center pl-1">
                                            ▶
                                        </div>
                                    </div>
                                )}

                                <div className="p-8">
                                    <h3 className="text-2xl font-bold uppercase mb-4">{event.title}</h3>
                                    <p className="text-gray-400 text-lg leading-relaxed border-l-2 border-red-500 pl-4">
                                        {event.desc}
                                    </p>
                                </div>
                            </div>

                            {/* Connector Line visual hook (The 'Lake' bit) */}
                            <div className="absolute left-[24px] md:left-[-2px] top-[30px] w-8 h-0.5 bg-red-600/50 -z-10 hidden" />
                        </div>
                    ))}
                </div>

                {/* End Node */}
                <div className="relative pl-12 md:pl-16 pt-24">
                    <div className="absolute left-[20px] md:left-[-6px] top-24 w-4 h-4 rounded-full bg-white border-4 border-black box-content z-10 animate-pulse" />
                    <div className="text-4xl font-black text-white leading-none mb-2">NOW</div>
                    <p className="text-gray-500 uppercase tracking-widest text-sm">We are just getting started.</p>
                </div>
            </section>

            <SiteFooter />
        </main>
    );
}
