import Image from "next/image";
import Link from "next/link";
import MainSiteHeader from "@/components/MainSiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function TheFeeds() {
    const newsItems = [
        { title: "Agent Swarms: The Next Evolution", category: "Thought Leadership", date: "Oct 24, 2025" },
        { title: "Version 2.1 Release Notes", category: "Product Update", date: "Oct 20, 2025" },
        { title: "How Caidence Scaled to 1M Users", category: "Case Study", date: "Oct 15, 2025" },
        { title: "The Ethics of Autonomous Selling", category: "Philosophy", date: "Oct 10, 2025" },
        { title: "Meet the Makers: Engineering Spotlight", category: "Culture", date: "Oct 05, 2025" },
        { title: "Optimizing Context Windows for Cost", category: "Tutorial", date: "Oct 01, 2025" },
    ];

    return (
        <main className="bg-black min-h-screen text-white">
            <MainSiteHeader />

            {/* Header with Ticker */}
            <section className="pt-32 pb-12 border-b border-white/10">
                <div className="container mx-auto px-6">
                    <h1 className="text-6xl font-black uppercase mb-6">The Feeds</h1>
                    <div className="w-full bg-red-600 text-black py-2 overflow-hidden flex font-bold uppercase tracking-wider text-sm">
                        <span className="animate-marquee whitespace-nowrap">
                            Breaking: New Agent Framework Released • Join the Discord for Live Updates • Early Access for Enterprise Partners • Breaking: New Agent Framework Released
                        </span>
                    </div>
                </div>
            </section>

            {/* Featured Article */}
            <section className="py-12 container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-zinc-900 rounded-xl overflow-hidden group cursor-pointer hover:bg-zinc-800 transition-colors">
                    <div className="relative h-[400px]">
                        <Image src="/MANYSOWLRDS.png" alt="Featured" fill className="object-cover" />
                    </div>
                    <div className="p-12 flex flex-col justify-center">
                        <span className="text-red-500 font-bold uppercase tracking-widest text-xs mb-4">Featured Story</span>
                        <h2 className="text-4xl font-black uppercase mb-6 leading-tight group-hover:underline">
                            The Death of the Dashboard
                        </h2>
                        <p className="text-gray-400 mb-8 text-lg">
                            Why the future of software interaction isn't pointing and clicking, but conversation and delegation. A deep dive into the conversational UI paradigm.
                        </p>
                        <span className="text-white border-b border-white inline-block pb-1 font-bold">Read Article →</span>
                    </div>
                </div>
            </section>

            {/* News Grid */}
            <section className="py-12 container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {newsItems.map((item, i) => (
                        <div key={i} className="border-t border-white/10 pt-6 group cursor-pointer">
                            <div className="flex justify-between text-xs text-gray-500 uppercase tracking-wider mb-2">
                                <span>{item.category}</span>
                                <span>{item.date}</span>
                            </div>
                            <h3 className="text-xl font-bold uppercase leading-snug group-hover:text-red-500 transition-colors">
                                {item.title}
                            </h3>
                        </div>
                    ))}
                </div>
            </section>

            {/* Subscription */}
            <section className="py-24 text-center bg-zinc-900 mt-12">
                <div className="container mx-auto px-6 max-w-xl">
                    <h2 className="text-2xl font-bold uppercase mb-4">Jack In.</h2>
                    <p className="text-gray-400 mb-8">Get the latest intelligence directly to your inbox. No spam, just signal.</p>
                    <div className="flex gap-2">
                        <input type="email" placeholder="ENTER EMAIL" className="bg-black border border-white/20 p-4 text-white flex-1 focus:outline-none focus:border-red-500" />
                        <button className="bg-white text-black font-bold uppercase px-8 hover:bg-gray-200 transition-colors">
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>

            <SiteFooter />
        </main>
    );
}
