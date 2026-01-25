import MicrositeHeader from "@/components/shared/MicrositeHeader";
import AutoCarousel from "@/components/agnx/AutoCarousel";
import InteractivePills from "@/components/agnx/InteractivePills";

export default function Mc2PersonalEnergy() {
    return (
        <main className="bg-white min-h-screen text-black pb-20">
            <MicrositeHeader
                logo={
                    <h1 className="text-4xl tracking-tight italic" style={{ fontFamily: 'var(--font-roboto-flex)', fontVariationSettings: '"wght" 600, "slnt" -10' }}>
                        =MC<sup className="text-2xl top-[-0.5em]">2</sup>
                    </h1>
                }
                subhead={
                    <div className="text-sm md:text-base tracking-[0.2em]" style={{ fontFamily: 'var(--font-roboto-flex)', fontVariationSettings: '"wght" 200, "slnt" -10', fontStyle: 'italic' }}>
                        PERSONAL ENERGY AGENTS
                    </div>
                }
            />

            {/* Hero Section */}
            <section className="flex flex-col items-center pt-2 pb-12">
                <h2 className="text-sm md:text-base tracking-[0.2em] mb-12 text-center" style={{ fontFamily: 'var(--font-roboto-flex)', fontVariationSettings: '"wght" 200, "slnt" -10', fontStyle: 'italic' }}>
                    PERSONAL ENERGY AGENTS
                </h2>

                <AutoCarousel tiles={[
                    {
                        id: 1,
                        type: 'image',
                        src: '/vo2-agent-endurance-coach.jpeg',
                        href: '/mc2-personal-energy/vo2-endurance-agent',
                        alt: 'VO2 Agent',
                        headline: 'Vo² Agent',
                        description: 'The Agentic Endurance App. Plan. Adapt. Gain.',
                        ctaLabel: 'View App'
                    },
                    {
                        id: 2,
                        type: 'image',
                        src: '/b2-nutritional-guidance-agents.png',
                        href: '/mc2-personal-energy/b2-nutritional-guidance-agent',
                        alt: 'B2 Nutritional Guidance',
                        headline: 'B² Agent',
                        description: 'Nutritional Guidance. Fuel for the engine.',
                        ctaLabel: 'View App'
                    },
                    { id: 3, type: 'text', label: 'Metric Tracking', headline: 'Metrics', description: 'Real-time performance tracking.', ctaLabel: 'View Data' },
                    { id: 4, type: 'text', label: 'Biometrics', headline: 'Biometrics', description: 'Advanced health monitoring integration.', ctaLabel: 'Connect' },
                    { id: 5, type: 'text', label: 'Sleep Data', headline: 'Sleep Cycle', description: 'Optimization for recovery and rest.', ctaLabel: 'Optimize' },
                    { id: 6, type: 'text', label: 'Neural Link', headline: 'Neural Link', description: 'Direct interface protocols.', ctaLabel: 'COMING SOON' },
                ]} />

                <div className="mt-8 text-center px-6">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Automated Optimization</p>
                    <p className="text-sm max-w-md mx-auto">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </div>
            </section>

            {/* Tagline Section */}
            <section className="py-20 px-6 text-center bg-gray-50">
                <h2 className="text-3xl md:text-5xl font-black mb-8 tracking-tighter">
                    ANALYSE. AMPLIFY. ADAPT.
                </h2>
                <p className="max-w-2xl mx-auto text-gray-600 leading-relaxed">
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
            </section>

            {/* Interactive Section */}
            <InteractivePills />

        </main>
    );
}
