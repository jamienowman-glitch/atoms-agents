import MicrositeHeader from "@/components/shared/MicrositeHeader";
import AutoCarousel from "@/components/agnx/AutoCarousel";
import InteractivePills from "@/components/agnx/InteractivePills";

export default function Cubed3Marketing() {
    return (
        <main className="bg-white min-h-screen text-black pb-20">
            <MicrositeHeader
                initialTemp={333}
                bgColor="bg-black"
                textColor="text-red-600"
                borderColor="border-red-600"
                menuHoverColor="hover:text-red-400"
                logo={
                    <h1 className="text-4xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-roboto-flex)', fontVariationSettings: '"wght" 700' }}>
                        CUBED<sup className="text-2xl top-[-0.5em]">3</sup>
                    </h1>
                }
                subhead={
                    <h2 className="text-sm md:text-base tracking-[0.2em]" style={{ fontFamily: 'var(--font-roboto-flex)', fontVariationSettings: '"wght" 200, "slnt" -10', fontStyle: 'italic' }}>
                        MARKETING IN THE THIRD
                    </h2>
                }
            />

            {/* Hero Section */}
            <section className="flex flex-col items-center pt-12 pb-12">

                <AutoCarousel />

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
