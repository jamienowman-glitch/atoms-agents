import Image from "next/image";
import Link from "next/link";
import MainSiteHeader from "@/components/MainSiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function TheStory() {
    return (
        <main className="bg-black min-h-screen text-white">
            <MainSiteHeader />

            {/* Hero: Founder/Team */}
            <section className="relative h-[80vh] w-full">
                <Image
                    src="/vo2-agent-endurance-coach.jpeg"
                    alt="Founder"
                    fill
                    className="object-cover grayscale contrast-125"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mix-blend-overlay">
                        ORIGIN
                    </h1>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="py-24 container mx-auto px-6">
                <h2 className="text-3xl font-bold uppercase tracking-widest border-b border-white/20 pb-4 mb-12">How It Started</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-24">
                    <div>
                        <span className="text-4xl font-black text-red-600 block mb-2">2023</span>
                        <p className="text-gray-400">The Epiphany.</p>
                    </div>
                    <div>
                        <span className="text-4xl font-black text-red-600 block mb-2">2024</span>
                        <p className="text-gray-400">First Agent Deployed.</p>
                    </div>
                    <div>
                        <span className="text-4xl font-black text-red-600 block mb-2">2025</span>
                        <p className="text-gray-400">The Orchestration Layer.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                    <div className="prose prose-invert lg:prose-xl">
                        <p>
                            It started in a garage, logically. But not with a car. With a server rack and a refusal to accept the status quo. We saw the noise. The inefficiency. The sheer waste of human potential on tasks that machines could do better.
                        </p>
                        <Image src="/atoms-fam-marketing-agents.JPG" alt="Archival" width={600} height={400} className="grayscale my-8 rounded-lg" />
                        <p>
                            The breakthrough wasn't the AI. It was the orchestration. The ability to make them talk to each other. To create a family of atoms.
                        </p>
                    </div>
                    <div className="bg-zinc-900 p-8 rounded-xl border border-white/10">
                        <h3 className="text-xl font-bold uppercase mb-6">Credentials</h3>
                        <div className="flex gap-4 flex-wrap opacity-70">
                            <div className="bg-black px-4 py-2 text-xs font-mono border border-white/20">YC ALUM</div>
                            <div className="bg-black px-4 py-2 text-xs font-mono border border-white/20">FORBES 30U30</div>
                            <div className="bg-black px-4 py-2 text-xs font-mono border border-white/20">AGENTIC PIONEER</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Human */}
            <section className="py-24 bg-white text-black px-6">
                <div className="container mx-auto">
                    <h2 className="text-5xl font-black uppercase mb-12">THE HUMAN ELEMENT</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="aspect-video bg-black relative">
                            {/* Video Placeholder */}
                            <div className="absolute inset-0 flex items-center justify-center text-white font-mono">
                                [ FOUNDER VIDEO ]
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <h3 className="text-2xl font-bold mb-4">My Philosophy</h3>
                            <p className="text-lg leading-relaxed mb-6">
                                We don't build AI to replace humans. We build AI to elevate them. To remove the friction so the spark can ignite.
                            </p>
                            <div className="mt-8 font-serif text-4xl italic">
                                Jay Nowman
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Grid */}
            <section className="py-24 container mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold uppercase mb-16">The Architects</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex flex-col items-center">
                            <div className="w-48 h-48 rounded-full bg-gray-800 mb-6 overflow-hidden relative grayscale">
                                <Image src="/vo2-agent-endurance-coach.jpeg" alt="Team Member" fill className="object-cover" />
                            </div>
                            <h4 className="text-xl font-bold">Agent {i}</h4>
                            <p className="text-gray-500 text-sm mt-2">Systems Architect</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-32 text-center bg-zinc-900 border-t border-white/10">
                <h2 className="text-4xl font-bold mb-8">Be Part of History</h2>
                <Link href="/the-offer" className="inline-block bg-red-600 text-white px-12 py-4 font-bold uppercase tracking-widest hover:bg-red-700 transition-colors">
                    Join Our Journey
                </Link>
            </section>

            <SiteFooter />
        </main>
    );
}
