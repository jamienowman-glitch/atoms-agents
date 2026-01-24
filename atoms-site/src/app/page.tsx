import HeroSplash from "@/components/HeroSplash";
import VisualHook from "@/components/VisualHook";
import PitchButtons from "@/components/PitchButtons";

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <HeroSplash />
      <VisualHook />
      <PitchButtons />
    </main>
  );
}
