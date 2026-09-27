import { DepthMeter } from "@/components/Descent";
import { Footer } from "@/components/Footer";
import { Game } from "@/components/Game";
import { Nav } from "@/components/Nav";
import { ScrollEngine } from "@/components/ScrollEngine";
import { getGameState } from "@/lib/state";

export const dynamic = "force-dynamic";

export default async function Home() {
  const initial = await getGameState();
  return (
    <>
      <ScrollEngine />
      <Nav />
      <DepthMeter />
      <main id="main">
        <Game initial={initial} />
      </main>
      <Footer />
    </>
  );
}
