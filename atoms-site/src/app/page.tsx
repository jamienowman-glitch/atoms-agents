import HeroSplash from "@/components/HeroSplash";
import VisualHook from "@/components/VisualHook";
import PitchButtons from "@/components/PitchButtons";
import MainSiteHeader from "@/components/MainSiteHeader";

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <MainSiteHeader />
      <HeroSplash />
      <VisualHook />
      <PitchButtons />
    </main>
  );
}
