import Image from "next/image";
import Link from "next/link";
import MainSiteHeader from "@/components/MainSiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Star, CheckCircle } from "lucide-react";

export default function TheProof() {
    return (
        <main className="bg-black min-h-screen text-white">
            <MainSiteHeader />

            {/* Hero */}
            <section className="py-32 px-6 text-center">
                <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-4">
                    DON'T TRUST US.
                </h1>
                <p className="text-xl md:text-2xl text-red-500 font-bold uppercase tracking-widest">
                    TRUST THE RESULTS.
                </p>
            </section>

            {/* Metric Tiles */}
            <section className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-6 mb-24">
                {[
                    { label: "Hours Saved", value: "10M+" },
                    { label: "Agents Deployed", value: "50k" },
                    { label: "Revenue Gen", value: "$2B" },
                    { label: "Uptime", value: "99.9%" }
                ].map((stat, i) => (
                    <div key={i} className="bg-zinc-900 border border-white/10 p-8 text-center rounded-xl">
                        <h3 className="text-4xl font-black text-white mb-2">{stat.value}</h3>
                        <p className="text-gray-500 uppercase tracking-wider text-xs">{stat.label}</p>
                    </div>
                ))}
            </section>

            {/* Wall of Love (Testimonial Grid) */}
            <section className="py-24 bg-white text-black">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-black uppercase mb-16 text-center">The Community Speaks</h2>

                    <div className="columns-1 md:columns-3 gap-8 space-y-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="break-inside-avoid bg-gray-50 p-8 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
                                <div className="flex text-yellow-500 mb-4">
                                    <Star fill="currentColor" size={16} />
                                    <Star fill="currentColor" size={16} />
                                    <Star fill="currentColor" size={16} />
                                    <Star fill="currentColor" size={16} />
                                    <Star fill="currentColor" size={16} />
                                </div>
                                <p className="italic text-gray-700 mb-6 leading-relaxed">
                                    &quot;I used to spend 4 hours a day on admin. Now my agent does it in 4 milliseconds. The atoms family stack is legitimate wizardry.&quot;
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden relative">
                                        <Image src="/vo2-agent-endurance-coach.jpeg" alt="Avatar" fill className="object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">Verified User {i}</h4>
                                        <div className="text-xs text-green-600 flex items-center gap-1">
                                            <CheckCircle size={10} /> Verified Purchase
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Case Study Feature */}
            <section className="py-24 container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="relative aspect-[4/5] md:aspect-square">
                    <Image src="/mynx-cad-pricing-agents.png" alt="Case Study" fill className="object-contain" />
                </div>
                <div>
                    <span className="bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase mb-4 inline-block">Case Study</span>
                    <h2 className="text-4xl font-bold uppercase mb-6">Scaling to Infinity</h2>
                    <p className="text-gray-400 text-lg mb-8">
                        How a solo founder used the Mynx Pricing Agent to outmaneuver a Fortune 500 competitor in real-time.
                    </p>
                    <Link href="/the-story" className="text-white border-b border-white pb-1 font-bold hover:text-red-500 hover:border-red-500 transition-colors">
                        Read the Full Story →
                    </Link>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 text-center border-t border-white/10 bg-zinc-900">
                <h2 className="text-3xl font-bold mb-8">Seen Enough?</h2>
                <Link href="/the-offer" className="inline-block bg-white text-black px-12 py-4 font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
                    Deploy Now
                </Link>
            </section>

            <SiteFooter />
        </main>
    );
}
