import MicrositeHeader from "@/components/shared/MicrositeHeader";
import AutoCarousel from "@/components/agnx/AutoCarousel";
import InteractivePills from "@/components/agnx/InteractivePills";

export default function AgnxMarketingAgents() {
    return (
        <main className="bg-white min-h-screen text-black pb-20">
            <MicrositeHeader
                logo={
                    <h1 className="text-4xl font-black tracking-tight" style={{ fontFamily: 'var(--font-roboto-flex)', fontVariationSettings: '"wght" 900' }}>
                        AGN<sup className="text-2xl top-[-0.5em]">ˣ</sup>
                    </h1>
                }
                subhead={
                    <h2 className="text-sm md:text-base tracking-[0.2em] mb-12 text-center" style={{ fontFamily: 'var(--font-roboto-flex)', fontVariationSettings: '"wght" 200, "slnt" -10', fontStyle: 'italic' }}>
                        MARKETING AGENT FLOWS
                    </h2>
                }
            />

            {/* Hero Section */}
            <section className="flex flex-col items-center pt-2 pb-12">

                <AutoCarousel tiles={[
                    {
                        id: 1,
                        type: 'image',
                        src: '/caidence-social-media-tile.png',
                        href: '/agnx-marketing-agents/caidence-social-media-agents',
                        alt: 'Caidence Social Media',
                        headline: 'CAIDENCE²',
                        description: 'Autonomous social media management. Plan, post, and amplify your brand voice.',
                        ctaLabel: 'View Agent'
                    },
                    {
                        id: 2,
                        type: 'image',
                        src: '/ai-customised-shopify-assistants.JPG',
                        href: '/agnx-marketing-agents/shopify-sales-ai-agents',
                        alt: 'Shopify Sales Agents',
                        headline: 'Shopify Sales',
                        description: 'Intelligent e-commerce optimization. Convert visitors into loyal customers.',
                        ctaLabel: 'View Agent'
                    },
                    {
                        id: 3,
                        type: 'image',
                        src: '/aftertime-agent-video-editing.png',
                        href: '/agnx-marketing-agents/aftertime-video-editing-agent',
                        alt: 'AfterTime Video Agent',
                        headline: 'AfterTime',
                        description: 'Generative video production. Text-to-scene mastery.',
                        ctaLabel: 'View Agent'
                    },
                    { id: 4, type: 'text', label: 'SEO Agent', headline: 'SEO Logic', description: 'Ranking algorithms decoded.', ctaLabel: 'COMING SOON' },
                    { id: 5, type: 'text', label: 'Ad Tech Agent', headline: 'Ad Tech', description: 'Programmatic advertising flow.', ctaLabel: 'COMING SOON' },
                    { id: 6, type: 'text', label: 'Data Analyst', headline: 'Data Core', description: 'Deep insight analytics.', ctaLabel: 'COMING SOON' },
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
