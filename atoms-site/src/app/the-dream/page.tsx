import Image from "next/image";
import Link from "next/link";
import MainSiteHeader from "@/components/MainSiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function TheDream() {
    return (
        <main className="bg-black min-h-screen text-white">
            <MainSiteHeader />

            {/* Hero Section */}
            <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
                <Image
                    src="/MANYSOWLRDS.png"
                    alt="The Dream"
                    fill
                    className="object-cover opacity-60 animate-pulse-slow"
                />
                <div className="relative z-10 text-center px-6">
                    <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-4 mix-blend-difference">
                        IMAGINE...
                    </h1>
                    <p className="text-xl md:text-3xl font-light tracking-widest text-red-500 uppercase">
                        A world without friction.
                    </p>
                </div>
            </section>

            {/* Narrative Block */}
            <section className="py-24 px-6 container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 text-lg leading-relaxed">
                <div className="text-gray-400">
                    <h3 className="text-red-600 font-bold uppercase tracking-widest mb-4">The Old Way</h3>
                    <p>
                        Grinding gears. Endless meetings. The slow decay of creativity as administrative burden eats away at your soul. You build systems to manage systems. The signal is lost in the noise.
                    </p>
                </div>
                <div className="text-right text-white">
                    <h3 className="text-blue-500 font-bold uppercase tracking-widest mb-4">The New Way</h3>
                    <p>
                        Pure flow. Agents handle the entropy. You direct the symphony. Code executes strategy in real-time. The barrier between thought and action dissolves.
                    </p>
                </div>
            </section>

            {/* Visual Abstract */}
            <section className="w-full h-[60vh] relative grayscale hover:grayscale-0 transition-all duration-1000">
                <Image src="/atoms-fam-agent-orchestration-system.png" alt="Abstract System" fill className="object-cover" />
            </section>

            {/* Pull Quote */}
            <section className="py-32 px-6 text-center bg-zinc-900">
                <blockquote className="text-3xl md:text-5xl font-thin italic text-gray-300 max-w-4xl mx-auto">
                    &quot;The future belongs to those who can outsource the mundane to the machine, effectively reclaiming their humanity.&quot;
                </blockquote>
            </section>

            {/* Video & CTA */}
            <section className="py-24 container mx-auto text-center px-6">
                <div className="aspect-video w-full max-w-4xl mx-auto bg-black border border-white/10 mb-12 flex items-center justify-center relative group">
                    <span className="text-gray-600 font-mono">[ CINEMATIC CONCEPTS VIDEO ]</span>
                    <Image src="/MANYSOWLRDS.png" alt="Video Cover" fill className="object-cover opacity-20 group-hover:opacity-10 transition-opacity" />
                </div>

                <Link href="/the-product" className="inline-block bg-white text-black px-12 py-4 font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
                    Realize The Dream
                </Link>
            </section>

            {/* Atmosphere Transition */}
            <section className="py-24 bg-gradient-to-b from-black to-red-950 text-center px-6">
                <h2 className="text-4xl font-bold mb-12">WHAT IF...</h2>
                <ul className="space-y-6 text-xl text-gray-300 max-w-2xl mx-auto">
                    <li>• Your workforce scaled infinitely?</li>
                    <li>• Your marketing optimized itself while you slept?</li>
                    <li>• You never wrote another email from scratch?</li>
                </ul>
            </section>

            {/* Bridge */}
            <section className="py-24 text-center">
                <p className="text-gray-500 uppercase tracking-widest mb-6">From Dream to Reality</p>
                <Link href="/the-story" className="text-2xl font-bold border-b-2 border-white pb-1 hover:text-blue-500 hover:border-blue-500 transition-colors">
                    See How We Built It →
                </Link>
            </section>

            <SiteFooter />
        </main>
    );
}
