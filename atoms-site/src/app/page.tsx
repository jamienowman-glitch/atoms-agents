import Image from "next/image";
import Link from "next/link";
import MainSiteHeader from "@/components/MainSiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const worlds = [
    { id: 2, title: "The Dream", slug: "/the-dream", desc: "The Vision", img: "/MANYSOWLRDS.png" },
    { id: 3, title: "The History", slug: "/the-history", desc: "Timeline", img: "/atoms-fam-marketing-agents.JPG" },
    { id: 4, title: "The Story", slug: "/the-story", desc: "Origin", img: "/vo2-agent-endurance-coach.jpeg" },
    { id: 5, title: "The Knowledge", slug: "/the-knowledge", desc: "Documentation", img: "/mynx-cad-pricing-agents.png" },
    { id: 6, title: "The Benefits", slug: "/the-benefits", desc: "Why Us", img: "/atoms-fam-agent-orchestration-system.png" },
    { id: 7, title: "The Proof", slug: "/the-proof", desc: "Testimonials", img: "/caidence-social-media-tile.png" },
    { id: 7, title: "The Offer", slug: "/the-offer", desc: "Pricing", img: "/broker-portfolio-management-agents.png" },
    { id: 8, title: "The Product", slug: "/the-product", desc: "Specs", img: "/atoms-fam-agent-orchestration-system.png" },
    { id: 9, title: "The Feeds", slug: "/the-feeds", desc: "News", img: "/MANYSOWLRDS.png" },
    { id: 10, title: "The Answers", slug: "/the-answers", desc: "FAQ", img: "/atoms-fam-marketing-agents.JPG" },
    { id: 11, title: "The Professor", slug: "/the-professor", desc: "Workshop", img: "/vo2-agent-endurance-coach.jpeg" },
  ];

  return (
    <main className="bg-black min-h-screen text-white">
      <MainSiteHeader />

      {/* Hero Hub Title */}
      <section className="pt-32 pb-12 px-6 text-center">
        <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-4">
          THE HOUSE
        </h1>
        <p className="text-gray-500 uppercase tracking-widest text-sm">
          Central Command. Choose your path.
        </p>
      </section>

      {/* The Grid of Worlds (Small Bits) */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {worlds.map((world) => (
            <Link
              key={world.id}
              href={world.slug}
              className="group relative aspect-square bg-zinc-900 border border-white/10 overflow-hidden hover:border-white transition-colors"
            >
              {/* Background Image */}
              <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500">
                <Image
                  src={world.img}
                  alt={world.title}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                />
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                <div className="text-xs font-mono text-gray-400 group-hover:text-white uppercase tracking-widest">
                  {String(world.id).padStart(2, '0')}
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-black uppercase leading-none mb-1 shadow-black drop-shadow-lg">
                    {world.title}
                  </h3>
                  <p className="text-xs uppercase text-gray-400 group-hover:text-red-500 transition-colors">
                    {world.desc}
                  </p>
                </div>
              </div>

              {/* Hover Arrow */}
              <div className="absolute top-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-0 translate-x-4">
                <ArrowRight size={20} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
