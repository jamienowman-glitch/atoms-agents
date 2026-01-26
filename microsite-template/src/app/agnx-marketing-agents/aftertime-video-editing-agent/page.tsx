import Image from "next/image";
import MicrositeHeader from "@/components/shared/MicrositeHeader";

export default function AfterTimeAgentPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-gray-800">
            <MicrositeHeader
                logo={
                    <div className="flex flex-col items-center">
                        <span className="text-2xl font-light tracking-wider" style={{ fontFamily: 'var(--font-roboto-flex)', fontVariationSettings: '"wght" 300' }}>
                            AGNˣ
                        </span>
                        <div className="h-[1px] w-full bg-white my-1"></div>
                    </div>
                }
                subhead={
                    <span className="text-xs tracking-[0.2em] font-light" style={{ fontFamily: 'var(--font-roboto-flex)', fontVariationSettings: '"wght" 300' }}>
                        MARKETING AGENT FLOWS
                    </span>
                }
                initialTemp={72}
                bgColor="bg-black"
                textColor="text-white"
                borderColor="border-white"
                menuHoverColor="hover:text-gray-300"
            />

            <main className="pt-24 pb-12">
                {/* Full Screen Hero Image Area */}
                <div className="w-full flex items-center justify-center pt-0 pb-12 px-6 md:px-4">
                    <div className="w-full max-w-[80%] md:max-w-xl relative">
                        <Image
                            src="/aftertime-agent-video-editing.png"
                            alt="AfterTime Video Editing Agent"
                            width={0}
                            height={0}
                            sizes="(max-width: 768px) 80vw, 50vw"
                            className="w-full h-auto object-contain"
                            priority
                        />
                    </div>
                </div>

                {/* Content Area */}
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <h1 className="text-3xl md:text-5xl font-light mb-6 tracking-wide" style={{ fontFamily: 'var(--font-outfit)' }}>
                        VISUAL INTELLIGENCE
                    </h1>

                    <div className="w-24 h-[1px] bg-white mx-auto my-8"></div>
                </div>
            </main>
        </div>
    );
}
