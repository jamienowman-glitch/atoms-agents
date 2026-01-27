import Image from "next/image";
import Link from "next/link";
import MainSiteHeader from "@/components/MainSiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AutoCarousel from "@/components/agnx/AutoCarousel";
import ImageCard from "@/components/ImageCard";

export default function Home() {
  return (
    <main className="bg-black min-h-screen text-white">
      {/* 1-3. Header */}
      <MainSiteHeader />

      {/* 4-6. Hero Section with Carousel & Overlay */}
      <section className="relative w-full border-b border-white/10 pb-8">
        <div className="relative w-full">
          {/* The Carousel */}
          <AutoCarousel tiles={[
            {
              id: 1,
              type: 'image',
              src: '/atoms-fam-marketing-agents.JPG',
              href: '/the-dream',
              headline: 'LIFESTYLE',
              description: 'Living the atomic life.',
              ctaLabel: 'DISCOVER'
            },
            {
              id: 2,
              type: 'image',
              src: '/atoms-fam-agent-orchestration-system.png',
              href: '/the-product',
              headline: 'SYSTEM',
              description: 'Orchestration at scale.',
              ctaLabel: 'VIEW SPECS'
            },
            {
              id: 3,
              type: 'image',
              src: '/MANYSOWLRDS.png',
              href: '/the-feeds',
              headline: 'EVENTS',
              description: 'Join the next gathering.',
              ctaLabel: 'GET TICKETS'
            }
          ]} />

          {/* Overlay */}
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-10">
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white mix-blend-difference opacity-0 animate-fade-in-up"
              style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              THE HOUSE
            </h1>
            <Link href="/the-offer" className="mt-8 pointer-events-auto bg-white text-black px-8 py-3 font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
              Start Here
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Introduction */}
      <section className="py-24 px-6 container mx-auto text-center">
        <h2 className="text-xl md:text-3xl font-light text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Welcome to the orchestration layer. A dynamic ecosystem of autonomous agents designed to amplify human potential.
        </h2>
      </section>

      {/* 8-9. Navigation Grid: The Dream */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-0 border-y border-white/10">
        <div className="p-12 flex items-center justify-center border-b md:border-b-0 md:border-r border-white/10">
          <div className="max-w-md">
            <h3 className="text-4xl font-black mb-4 uppercase">The Dream</h3>
            <p className="text-gray-400 mb-8">
              Imagine a world where your potential is limitless. Where code executes your ambition.
            </p>
            <Link href="/the-dream" className="text-sm font-bold uppercase tracking-[0.2em] hover:text-red-500 transition-colors">
              Explore the Vision →
            </Link>
          </div>
        </div>
        <div className="relative h-[60vh] md:h-auto">
          <Image
            src="/MANYSOWLRDS.png"
            alt="The Dream"
            fill
            className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
          />
        </div>
      </section>

      {/* 10. Featured Content: Video */}
      <section className="py-24 px-6 bg-zinc-900 border-b border-white/10">
        <div className="container mx-auto">
          <div className="aspect-video w-full max-w-5xl mx-auto bg-black rounded-xl overflow-hidden shadow-2xl relative group">
            {/* Visual Hook Placeholder for Embed */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gray-500 font-mono text-sm tracking-widest">[ BRAND OVERVIEW VIDEO EMBED ]</span>
            </div>
            <Image
              src="/atoms-fam-agent-orchestration-system.png"
              alt="Video Cover"
              fill
              className="object-cover opacity-20 group-hover:opacity-10 transition-opacity"
            />
          </div>
        </div>
      </section>

      {/* 11-13. Product Highlight */}
      <section className="py-24 container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-6">
        <div className="relative aspect-square">
          <Image
            src="/caidence-social-media-tile.png"
            alt="Caidence Agent"
            fill
            className="object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.1)]"
          />
        </div>
        <div className="text-left">
          <span className="text-red-500 font-bold tracking-widest text-xs uppercase mb-2 block">Featured Agent</span>
          <h3 className="text-5xl font-bold mb-4">Caidence</h3>
          <p className="text-xl text-gray-400 mb-8">Social Media Mastery. Automated.</p>
          <Link href="/the-product" className="inline-block border border-white px-8 py-3 font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
            Shop Now
          </Link>
        </div>
      </section>

      {/* 14. Feed Teaser (Ticker) */}
      <section className="w-full bg-red-600 text-black overflow-hidden py-3">
        <div className="whitespace-nowrap animate-marquee flex gap-12 font-bold uppercase tracking-wider text-sm">
          <span>Latest News: Version 2.0 Released</span>
          <span>•</span>
          <span>Event: Agent Summit 2026 London</span>
          <span>•</span>
          <span>New Arrival: Mynx CAD Pricing Agent</span>
          <span>•</span>
          <span>Community: 10,000 Users Strong</span>
          <span>•</span>
          <span>Latest News: Version 2.0 Released</span>
          <span>•</span>
          <span>Event: Agent Summit 2026 London</span>
        </div>
      </section>

      {/* 15. Visual Break (Parallax) */}
      <section className="relative h-[50vh] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/vo2-agent-endurance-coach.jpeg"
            alt="Parallax BG"
            fill
            className="object-cover opacity-40 fixed-parallax-hack" // Note: pure CSS parallax tricky in Next.js without libs, simplifying to static cover for now
          />
        </div>
        <h2 className="relative z-10 text-6xl md:text-9xl font-black text-transparent stroke-text opacity-30">
          ATOMIC
        </h2>
      </section>

      {/* 16-17. Navigation Grid: The Professor */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-white/10">
        <div className="relative h-[60vh] md:h-auto order-2 md:order-1">
          <Image
            src="/broker-portfolio-management-agents.png"
            alt="The Professor"
            fill
            className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
          />
        </div>
        <div className="p-12 flex items-center justify-center border-b md:border-b-0 md:border-l border-white/10 order-1 md:order-2">
          <div className="max-w-md text-right md:text-left">
            <h3 className="text-4xl font-black mb-4 uppercase">The Professor</h3>
            <p className="text-gray-400 mb-8">
              Master the skills. Learn the trade. Become an expert in the age of agents.
            </p>
            <Link href="/the-professor" className="text-sm font-bold uppercase tracking-[0.2em] hover:text-blue-500 transition-colors">
              Enter the Workshop →
            </Link>
          </div>
        </div>
      </section>

      {/* 18. Social Proof */}
      <section className="py-16 border-y border-white/10 bg-black">
        <div className="container mx-auto px-6 flex justify-around items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {/* Placeholder Logos */}
          <div className="h-12 w-32 bg-gray-800 flex items-center justify-center rounded">WIRED</div>
          <div className="h-12 w-32 bg-gray-800 flex items-center justify-center rounded">The Verge</div>
          <div className="h-12 w-32 bg-gray-800 flex items-center justify-center rounded">TechCrunch</div>
        </div>
      </section>

      {/* 19. Final Call */}
      <section className="py-32 px-6 text-center">
        <h2 className="text-4xl md:text-7xl font-black mb-8 uppercase tracking-tighter">
          Ready to Ascend?
        </h2>
        <Link href="/the-offer" className="inline-block bg-red-600 text-white px-12 py-4 text-xl font-bold uppercase tracking-widest hover:bg-red-700 hover:scale-105 transition-all shadow-[0_0_30px_rgba(220,38,38,0.5)]">
          Get The Offer
        </Link>
      </section>

      {/* 20-22. Footer */}
      <SiteFooter />
    </main>
  );
}
