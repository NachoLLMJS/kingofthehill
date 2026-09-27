"use client";

import type { GameState } from "@/lib/types";
import { Stratum } from "./Descent";
import { Feed } from "./Feed";
import { Hall } from "./Hall";
import { Hero } from "./Hero";
import { HowTo } from "./HowTo";
import { useGame } from "./useGame";

export function Game({ initial }: { initial: GameState }) {
  const { state, now, connection } = useGame(initial);
  return (
    <>
      <Hero state={state} now={now} connection={connection} />
      <Feed state={state} now={now} />
      <Stratum kind="ground" overlapTop={0.3} overlapBottom={0.3} />
      <HowTo />
      <Stratum kind="rock" overlapTop={0.24} overlapBottom={0.36} />
      <Hall state={state} />
      <Stratum kind="magma" overlapTop={0.12} overlapBottom={0.2} height="clamp(190px, 17vw, 300px)" fadeFrom="#161a2e" />
    </>
  );
}
