"use client";

import type { GameState } from "@/lib/types";
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
      <HowTo />
      <Hall state={state} />
    </>
  );
}
