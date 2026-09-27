"use client";

import { useState } from "react";
import { BSCSCAN_ADDRESS_URL } from "@/lib/config";
import { duration, shortAddr } from "@/lib/format";
import type { GameState } from "@/lib/types";
import { PixelAvatar, PixelCrown } from "./pixel";

const PAGE = 6;

export function Hall({ state }: { state: GameState }) {
  const [shown, setShown] = useState(PAGE);
  const winners = state.winners.slice(0, shown);
  const minutes = Math.round(state.roundSeconds / 60);

  return (
    <section id="hall" aria-labelledby="hall-title" className="stone relative scroll-mt-20 pt-16 pb-24 text-cloud">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <header className="on-dark-tile max-w-[640px]">
          <p className="font-display text-sm font-bold tracking-[0.2em] text-gold uppercase">Layer 2 · hall of kings</p>
          <h2 id="hall-title" className="mt-3 font-display text-4xl leading-none font-bold sm:text-5xl">
            Carved in stone.
          </h2>
          <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-cloud/85">
            Every caller who held the hill for {minutes} minutes with nobody calling out after them. Newest king first.
          </p>
        </header>

        {winners.length === 0 ? (
          <div className="px-box mt-10 max-w-[560px] bg-stone-deep p-8">
            <PixelCrown className="w-12 opacity-60" />
            <p className="mt-4 font-display text-xl font-bold uppercase">No king crowned yet</p>
            <p className="mt-2 text-[15px] text-cloud/80">The first caller to hold the hill until 00:00 gets carved here.</p>
          </div>
        ) : (
          <ol className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3" aria-label="Crowned kings, newest first">
            {winners.map((w, i) => (
              <li key={w.callout.id} className={`px-box relative p-5 pt-7 ${i === 0 ? "bg-[#4a4633]" : "bg-stone-deep"}`}>
                <span className="absolute -top-4 right-4 bg-gold px-2 py-0.5 font-display text-xs font-bold tracking-widest text-ink uppercase">
                  {i === 0 ? `Latest · round ${w.round}` : `Round ${w.round}`}
                </span>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <PixelCrown className="absolute -top-5 left-1/2 w-9 -translate-x-1/2 -rotate-[8deg]" />
                    <PixelAvatar src={w.callout.avatar} seed={w.callout.wallet} size={56} grain={4} />
                  </div>
                  <div className="min-w-0">
                    <p className="line-clamp-1 font-display text-lg font-bold [overflow-wrap:anywhere]">{w.callout.name}</p>
                    <a
                      className="font-display text-sm text-gold underline decoration-2 underline-offset-2 hover:text-cloud"
                      href={BSCSCAN_ADDRESS_URL(w.callout.wallet)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={w.callout.wallet}
                    >
                      {shortAddr(w.callout.wallet)}
                    </a>
                  </div>
                </div>
                <p className="mt-4 line-clamp-2 text-[15px] leading-snug text-cloud/85 [overflow-wrap:anywhere]">“{w.callout.text || "(no text)"}”</p>
                <dl className="mt-5 grid grid-cols-3 gap-2 border-t-4 border-dotted border-stone pt-4 text-center">
                  <div>
                    <dt className="font-display text-[10px] font-bold tracking-widest text-cloud/60 uppercase">Crowned</dt>
                    <dd className="timer-digits mt-1 text-2xl">{new Date(w.wonAt).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })}</dd>
                  </div>
                  <div>
                    <dt className="font-display text-[10px] font-bold tracking-widest text-cloud/60 uppercase">Round</dt>
                    <dd className="timer-digits mt-1 text-2xl">{duration(w.wonAt - w.startedAt).split(" ")[0]}</dd>
                  </div>
                  <div>
                    <dt className="font-display text-[10px] font-bold tracking-widest text-cloud/60 uppercase">Call outs</dt>
                    <dd className="timer-digits mt-1 text-2xl text-gold">{w.callouts}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ol>
        )}

        {state.winners.length > shown ? (
          <div className="mt-10 flex justify-center">
            <button type="button" className="btn-px btn-px--ghost btn-px--sm" onClick={() => setShown((n) => n + PAGE)}>
              Show older kings
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
