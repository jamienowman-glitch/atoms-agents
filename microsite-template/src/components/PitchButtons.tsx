"use client";

export default function PitchButtons() {
    return (
        <section className="min-h-screen flex flex-col items-center justify-center px-6 bg-black text-center text-white py-20 relative">
            {/* Body */}
            <p className="max-w-2xl leading-relaxed text-lg mb-12 text-gray-300">
                At Atoms-fam we reject the idea of the generalist God Agent. The
                multi-purpose LLM waiting for you to command its vast knowledge through
                specific crafted prompts. Our agents are specialists. Updating their
                priors at every run. Contextually shifting according to the reality
                today. This is not a deterministic app builder. This is a reasoning
                family of atomic agents set in pre-built agentflows that you just
                connect &gt; load &gt; run.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-6">
                <button className="bg-white text-black px-8 py-3 font-bold hover:bg-gray-200 transition-colors uppercase tracking-wider">
                    Join The Atoms Family
                </button>
                <button className="bg-black text-white border border-white px-8 py-3 font-bold hover:bg-white hover:text-black transition-colors uppercase tracking-wider">
                    Learn More
                </button>
            </div>
        </section>
    );
}
