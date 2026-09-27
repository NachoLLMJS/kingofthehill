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
      <div className="strata-edge relative" style={{ color: "#5f5e5c", marginTop: -16 }} aria-hidden />
      <Hall state={state} />
    </>
  );
}
