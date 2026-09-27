"use client";

import type { GameState } from "@/lib/types";
import { Feed } from "./Feed";
import { Hall } from "./Hall";
import { Hero } from "./Hero";
import { useGame } from "./useGame";

export function Game({ initial }: { initial: GameState }) {
  const { state, now, connection } = useGame(initial);
  return (
    <>
      <Hero state={state} now={now} connection={connection} />
      <Feed state={state} now={now} />
      <Hall state={state} />
    </>
  );
}
