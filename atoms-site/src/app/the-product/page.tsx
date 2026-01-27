import Image from "next/image";
import Link from "next/link";
import MainSiteHeader from "@/components/MainSiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Cpu, Wifi, Database } from "lucide-react";

export default function TheProduct() {
    return (
        <main className="bg-black min-h-screen text-white">
            <MainSiteHeader />

            {/* Product Hero */}
            <section className="pt-32 pb-16 container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="relative aspect-square bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-white/10 p-12 flex items-center justify-center group">
                    <div className="absolute inset-0 bg-radial-gradient from-blue-500/10 to-transparent opacity-50" />
                    <Image
                        src="/atoms-fam-agent-orchestration-system.png"
                        alt="System Architecture"
                        fill
                        className="object-contain p-8 group-hover:scale-105 transition-transform duration-500"
                    />
                </div>
                <div>
                    <div className="flex items-center gap-4 mb-6">
                        <span className="bg-blue-600 text-white px-3 py-1 text-xs font-bold uppercase rounded-full">v2.1 Stable</span>
                        <span className="text-green-500 text-xs font-mono">● System Online</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-none">
                        Orchestrator<br />Core
                    </h1>
                    <p className="text-xl text-gray-400 mb-8 border-l-4 border-blue-600 pl-6">
                        The central nervous system for your digital workforce. Managing context, memory, and execution flow across infinite agents.
                    </p>

                    <div className="flex gap-4 mb-12">
                        <Link href="/the-offer" className="bg-white text-black px-8 py-3 font-bold uppercase hover:bg-gray-200 transition-colors">
                            Get Access
                        </Link>
                        <Link href="/the-knowledge" className="border border-white px-8 py-3 font-bold uppercase hover:bg-white hover:text-black transition-colors">
                            View Docs
                        </Link>
                    </div>

                    <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
                        <div className="text-center">
                            <Cpu className="mx-auto mb-2 text-gray-500" />
                            <div className="font-bold text-sm">Multi-Threaded</div>
                        </div>
                        <div className="text-center">
                            <Wifi className="mx-auto mb-2 text-gray-500" />
                            <div className="font-bold text-sm">Low Latency</div>
                        </div>
                        <div className="text-center">
                            <Database className="mx-auto mb-2 text-gray-500" />
                            <div className="font-bold text-sm">Vector Store</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Technical Specs */}
            <section className="py-24 bg-zinc-900">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="text-3xl font-bold uppercase mb-12 border-b border-white/20 pb-4">Specifications</h2>

                    <div className="space-y-6 font-mono text-sm">
                        <div className="grid grid-cols-2 border-b border-white/5 pb-4">
                            <span className="text-gray-500">Core Runtime</span>
                            <span className="text-white">Northstar Engine v4 (Rust/Python)</span>
                        </div>
                        <div className="grid grid-cols-2 border-b border-white/5 pb-4">
                            <span className="text-gray-500">Context Window</span>
                            <span className="text-white">128k - 1M Tokens (Adaptive)</span>
                        </div>
                        <div className="grid grid-cols-2 border-b border-white/5 pb-4">
                            <span className="text-gray-500">Memory Architecture</span>
                            <span className="text-white">Hierarchical (Short/Long/Episodic)</span>
                        </div>
                        <div className="grid grid-cols-2 border-b border-white/5 pb-4">
                            <span className="text-gray-500">Integration</span>
                            <span className="text-white">REST, GraphQL, WebSocket</span>
                        </div>
                        <div className="grid grid-cols-2 border-b border-white/5 pb-4">
                            <span className="text-gray-500">Security</span>
                            <span className="text-white">SOC2 Compliant, E2E Encryption</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Integration Marquee */}
            <section className="py-24 overflow-hidden">
                <h3 className="text-center text-gray-500 text-sm uppercase tracking-widest mb-12">Integrates with everything you use</h3>
                {/* Static Grid for now, Marquee later if needed */}
                <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-6 gap-8 text-center opacity-50">
                    <div className="border border-white/20 p-4 rounded">Slack</div>
                    <div className="border border-white/20 p-4 rounded">Discord</div>
                    <div className="border border-white/20 p-4 rounded">Gmail</div>
                    <div className="border border-white/20 p-4 rounded">Shopify</div>
                    <div className="border border-white/20 p-4 rounded">Stripe</div>
                    <div className="border border-white/20 p-4 rounded">Notion</div>
                </div>
            </section>

            <SiteFooter />
        </main>
    );
}
