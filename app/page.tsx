import { Footer } from "@/components/Footer";
import { Game } from "@/components/Game";
import { HowTo } from "@/components/HowTo";
import { Nav } from "@/components/Nav";
import { getGameState } from "@/lib/state";

export const dynamic = "force-dynamic";

export default async function Home() {
  const initial = await getGameState();
  return (
    <>
      <Nav />
      <main id="main">
        <Game initial={initial} />
        <div className="strata-edge relative" style={{ color: "var(--stone-deep)", marginTop: -16 }} aria-hidden />
        <HowTo />
        <div className="strata-edge relative" style={{ color: "#232228", marginTop: -16 }} aria-hidden />
      </main>
      <Footer />
    </>
  );
}
