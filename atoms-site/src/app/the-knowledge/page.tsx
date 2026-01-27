import Image from "next/image";
import Link from "next/link";
import MainSiteHeader from "@/components/MainSiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function TheKnowledge() {
    return (
        <main className="bg-black min-h-screen text-white">
            <MainSiteHeader />

            <section className="pt-32 pb-12 px-6 container mx-auto text-center border-b border-white/10">
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">
                    MASTER YOUR GEAR
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Deployment is just the beginning. True power comes from deep integration. Learn the workflows of the elite.
                </p>
            </section>

            {/* Video Feature */}
            <section className="py-12 container mx-auto px-6">
                <div className="aspect-video w-full bg-zinc-900 rounded-lg overflow-hidden relative mb-12 border border-white/10">
                    <div className="absolute inset-0 flex items-center justify-center font-mono text-gray-500">
                        [ TUTORIAL: GETTING STARTED ]
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-zinc-900 p-8 rounded-xl border border-white/10">
                    <div>
                        <h3 className="text-2xl font-bold uppercase mb-6">Quick Start Guide</h3>
                        <ol className="list-decimal list-inside space-y-4 text-gray-300">
                            <li>Initialize the Agent Kernel.</li>
                            <li>Connect your Data Sources (API/CSV).</li>
                            <li>Define orbit parameters.</li>
                            <li>Launch first swarm.</li>
                            <li>Monitor via the Dashboard.</li>
                        </ol>
                        <Link href="#" className="inline-block mt-8 text-red-500 text-sm uppercase font-bold tracking-widest border-b border-red-500 pb-1">
                            Download PDF Manual
                        </Link>
                    </div>
                    <div className="border border-white/10 p-6 rounded-lg bg-black text-center">
                        <span className="text-xs font-bold uppercase text-gray-500 block mb-4">You'll need this</span>
                        <div className="relative w-32 h-32 mx-auto mb-4">
                            <Image src="/mynx-cad-pricing-agents.png" alt="Tool" fill className="object-contain" />
                        </div>
                        <h4 className="font-bold mb-2">Mynx Core</h4>
                        <button className="bg-white text-black px-6 py-2 text-xs font-bold uppercase hover:bg-gray-200">
                            View Specs
                        </button>
                    </div>
                </div>
            </section>

            {/* Troubleshooting Accordion */}
            <section className="py-24 container mx-auto px-6 max-w-4xl">
                <h2 className="text-3xl font-bold uppercase mb-8 text-center">Protocol Maintenance</h2>
                <div className="space-y-4">
                    {[
                        "Error 404: Agent Not Found",
                        "Latency Optimization Techniques",
                        "Memory Leak Prevention",
                        "Swarm Coordination Conflicts"
                    ].map((item, i) => (
                        <details key={i} className="group border border-white/10 bg-zinc-900 rounded select-none">
                            <summary className="cursor-pointer p-6 font-bold flex justify-between items-center group-open:bg-white/5 transition-colors">
                                {item}
                                <span className="text-red-500 group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <div className="p-6 text-gray-400 border-t border-white/10">
                                To resolve this issue, ensure your environment variables are correctly set in the .env file and restart the orchestration container.
                            </div>
                        </details>
                    ))}
                </div>
            </section>

            {/* Upsell / Benefits */}
            <section className="py-24 bg-white text-black text-center px-6">
                <h2 className="text-4xl font-black uppercase mb-8">Optimize Your Stack</h2>
                <p className="max-w-xl mx-auto mb-12">
                    Our agents work best when clustered. Explore the full family.
                </p>
                <Link href="/the-benefits" className="inline-block border-2 border-black px-12 py-4 font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                    Explore Benefits
                </Link>
            </section>

            <SiteFooter />
        </main>
    );
}
