import Link from "next/link";
import MainSiteHeader from "@/components/MainSiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function TheAnswers() {
    const faqs = [
        {
            q: "Do I need coding skills to use Atoms?",
            a: "No. Our visual builder and natural language interface allow you to construct complex agent swarms without writing a single line of code. However, for power users, we offer full Typescript/Python extensibility."
        },
        {
            q: "Is my data secure?",
            a: "Absolutely. We run on a SOC2 Type II compliant infrastructure. All agent memory is encrypted at rest and in transit. Validated by top-tier security firms."
        },
        {
            q: "Can I host this on my own servers?",
            a: "Yes. The Enterprise plan includes a Docker container that you can deploy to your own private cloud (AWS, Azure, GCP) or on-premise hardware."
        },
        {
            q: "How do the agents communicate?",
            a: "We use a proprietary protocol called 'Northstar' which allows high-frequency, low-latency state synchronization between agents, ensuring they act as a cohesive unit."
        }
    ];

    return (
        <main className="bg-black min-h-screen text-white">
            <MainSiteHeader />

            <section className="py-32 px-6 text-center">
                <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-4">
                    INTEL
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    You have questions. The system has answers. Query the database directly.
                </p>
            </section>

            {/* Search Simulation */}
            <section className="container mx-auto px-6 max-w-3xl mb-24">
                <div className="relative">
                    <input type="text" placeholder="SEARCH KNOWLEDGE BASE..." className="w-full bg-zinc-900 border border-white/20 p-6 text-white font-mono focus:outline-none focus:border-red-500 rounded-lg text-lg placeholder:text-gray-600" />
                    <div className="absolute right-6 top-6 text-gray-600 font-mono text-sm">
                        CMD+K
                    </div>
                </div>
            </section>

            {/* FAQ Grid */}
            <section className="container mx-auto px-6 max-w-4xl py-12">
                <div className="space-y-6">
                    {faqs.map((faq, i) => (
                        <details key={i} className="group border-b border-white/10 pb-6">
                            <summary className="cursor-pointer text-xl font-bold flex justify-between items-center group-hover:text-red-500 transition-colors list-none">
                                {faq.q}
                                <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
                            </summary>
                            <div className="pt-4 text-gray-400 leading-relaxed">
                                {faq.a}
                            </div>
                        </details>
                    ))}
                </div>
            </section>

            {/* Support CTA */}
            <section className="py-24 text-center">
                <div className="container mx-auto px-6 bg-zinc-900 p-12 rounded-2xl border border-white/10 max-w-4xl">
                    <h2 className="text-3xl font-bold uppercase mb-4">Still seeking signal?</h2>
                    <p className="text-gray-400 mb-8">Our support agents are online 24/7/365.</p>
                    <div className="flex justify-center gap-4">
                        <button className="bg-white text-black px-8 py-3 font-bold uppercase hover:bg-gray-200">
                            Open Ticket
                        </button>
                        <button className="border border-white text-white px-8 py-3 font-bold uppercase hover:bg-white hover:text-black">
                            Join Discord
                        </button>
                    </div>
                </div>
            </section>

            <SiteFooter />
        </main>
    );
}
