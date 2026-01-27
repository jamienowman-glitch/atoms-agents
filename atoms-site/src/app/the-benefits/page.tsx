import Image from "next/image";
import Link from "next/link";
import MainSiteHeader from "@/components/MainSiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Zap, Shield, Brain } from "lucide-react";

export default function TheBenefits() {
    return (
        <main className="bg-black min-h-screen text-white">
            <MainSiteHeader />

            {/* Hero */}
            <section className="relative h-[60vh] w-full flex items-end pb-12 px-6">
                <Image src="/atoms-fam-marketing-agents.JPG" alt="Benefits" fill className="object-cover opacity-50" />
                <div className="relative z-10 max-w-4xl">
                    <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
                        WHY THIS<br />CHANGES EVERYTHING
                    </h1>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="py-24 container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="bg-zinc-900 p-8 rounded-xl border border-white/10 group hover:border-red-500 transition-colors">
                    <Zap className="w-12 h-12 text-yellow-500 mb-6" />
                    <h3 className="text-2xl font-bold uppercase mb-4">Instant Velocity</h3>
                    <p className="text-gray-400 mb-4">
                        Deploy in seconds, not weeks. Pre-configured templates mean zero setup time.
                    </p>
                    <p className="text-white font-bold italic">
                        Run faster than the competition can think.
                    </p>
                </div>
                <div className="bg-zinc-900 p-8 rounded-xl border border-white/10 group hover:border-blue-500 transition-colors">
                    <Shield className="w-12 h-12 text-blue-500 mb-6" />
                    <h3 className="text-2xl font-bold uppercase mb-4">Bulletproof Core</h3>
                    <p className="text-gray-400 mb-4">
                        Rust-based engine ensures memory safety and zero-panic runtime stability.
                    </p>
                    <p className="text-white font-bold italic">
                        Sleep soundly while your agents work.
                    </p>
                </div>
                <div className="bg-zinc-900 p-8 rounded-xl border border-white/10 group hover:border-purple-500 transition-colors">
                    <Brain className="w-12 h-12 text-purple-500 mb-6" />
                    <h3 className="text-2xl font-bold uppercase mb-4">Adaptive IQ</h3>
                    <p className="text-gray-400 mb-4">
                        Agents learn from user feedback loops, optimizing their own prompts over time.
                    </p>
                    <p className="text-white font-bold italic">
                        software that gets smarter with age.
                    </p>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="py-24 bg-zinc-900 border-y border-white/10">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-black uppercase text-center mb-16">Us vs. Them</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-white">
                                    <th className="py-4 text-xl">Metric</th>
                                    <th className="py-4 text-xl text-red-500 font-black">ATOMS FAM</th>
                                    <th className="py-4 text-xl text-gray-500">Legacy AI</th>
                                </tr>
                            </thead>
                            <tbody className="text-lg">
                                <tr className="border-b border-white/10">
                                    <td className="py-6 font-bold">Deployment Time</td>
                                    <td className="py-6 text-green-400">Instant (CLI)</td>
                                    <td className="py-6 text-gray-500">Weeks (Integration)</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-6 font-bold">Memory Overhead</td>
                                    <td className="py-6 text-green-400">Minimal (Rust)</td>
                                    <td className="py-6 text-gray-500">Bloated (Python)</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-6 font-bold">Self-Healing</td>
                                    <td className="py-6 text-green-400">Native Protocol</td>
                                    <td className="py-6 text-gray-500">Manual Restart</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Exploded View / Visual */}
            <section className="py-24 container mx-auto px-6 text-center">
                <h2 className="text-gray-500 uppercase tracking-widest text-sm mb-8">System Architecture</h2>
                <div className="relative w-full h-[50vh]">
                    <Image src="/atoms-fam-agent-orchestration-system.png" alt="Exploded View" fill className="object-contain" />
                </div>
            </section>

            {/* Sticky CTA */}
            <div className="fixed bottom-6 right-6 z-50">
                <Link href="/the-offer" className="bg-red-600 text-white px-8 py-4 font-bold uppercase tracking-widest hover:bg-red-700 shadow-2xl transition-all rounded-full flex items-center gap-2 animate-bounce-slow">
                    Get Yours Now <span className="text-xl">→</span>
                </Link>
            </div>

            <SiteFooter />
        </main>
    );
}
